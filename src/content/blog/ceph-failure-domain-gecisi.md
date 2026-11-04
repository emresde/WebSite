---
title: "Ceph'te failure domain'i host'tan rack'e taşımak: Lab'da öğrendiklerim"
description: "Kuralı değiştirmek tek satır. Ama kaç terabaytın taşınacağını, kullanıcıların ne hissedeceğini ve neyin ters gidebileceğini görmek için bir lab kurdum. Ölçtüklerim ve yanıldığım yerler."
date: 2026-11-04
lang: tr
tags: [ceph, crush, storage, mclock]
---

Ceph'te bir kümeyi host-aware'den rack-aware'e çevirmek kâğıt üzerinde tek komut:

```bash
ceph osd pool set <pool> crush_rule rack_rule
```

Ama bu komutun arkasında şu sorular var: Ne kadar veri taşınacak? Taşıma sırasında kopya sayısı düşecek mi? Kullanıcılar bunu hissedecek mi, hissedecekse kısabilir miyiz? Bir şey ters giderse geri dönebilir miyiz?

Son birkaç haftadır bu soruların cevabını aradım. Dokümantasyon ve mailing list'ler iyi bir başlangıç ama çoğu sorunun cevabı "duruma göre değişir". Ben de OpenStack üzerinde lab'lar kurup ölçmeye karar verdim. Bu yazı o deneylerden çıkan notlar. Bazı tahminlerim tuttu, bazıları hiç tutmadı; ikisini de yazdım.

## Problem: host-aware neden yetmiyor?

Varsayılan replicated kuralı her kopyayı farklı bir **host**'a koyar:

```
step chooseleaf firstn 0 type host
```

Bu, tek bir sunucu gittiğinde veriyi korur. Ama aynı objenin iki kopyası aynı rack'teki iki farklı sunucuya düşebilir. O rack'in gücü ya da ToR switch'i giderse iki kopya birden erişilemez olur. `min_size = 2` ise o PG'lerde IO durur. Hedef, her kopyanın farklı bir **rack**'te olması.

## Önce birkaç kavram

Sonuçları okurken bunlar lazım olacak:

- **Misplaced:** Kopya var ve sağlam ama yeni kurala göre yanlış yerde. Kopya sayısı düşmez.
- **Degraded / undersized:** Olması gereken bir kopya eksik ya da güncel değil. PG hedeflenenden az OSD ile çalışıyor.
- **Backfill:** Yeni OSD'ye objeler tek tek kopyalanır. Eski kopya, yenisi bitene kadar silinmez. Kopyalar *misplaced* sayılır.
- **Log tabanlı recovery:** PG log'u PG'nin bütün geçmişini kapsıyorsa log yeni OSD'ye "oynatılır". Bu yolda eksik kopya *degraded* sayılır.
- **`norebalance`:** Misplaced PG'lerin backfill'ini durdurur, degraded PG'lerin recovery'sini durdurmaz.

## Lab

İki farklı lab kurdum:

| | Lab 1 | Lab 2 |
|---|---|---|
| VM | 6 | 18 (MON, MGR, RGW, OSD ve istemci ayrı makinelerde) |
| Ceph | 18.2 (Reef) | 17.2 (Quincy) |
| OSD | 6 × 200 GiB | 9 × 500 GiB |
| Topoloji | 3 rack × 2 host | 3 rack × 3 host |
| Veri | ~280 GiB logical (%70 dolu) | 710 GiB logical (%47 dolu) |
| İstemci yükü | `rados bench` okuma | `fio` RBD, 1050 okuma + 450 yazma/sn (4 KiB) |

Ölçüm için iki küçük Python script'i yazdım: biri `ceph pg dump` ve `ceph osd tree` çıktısından hangi PG'lerin rack kuralını ihlal ettiğini ve en az ne kadar verinin taşınması gerektiğini hesaplıyor; diğeri 10 saniyede bir küme durumunu (remapped, misplaced, degraded, recovery hızı, mClock profili) CSV'ye yazıyor. İstemci tarafında `fio`'nun her IO için gecikme log'unu saniyelik p50/p95/p99'a çeviren bir script daha var.

## 1. Taşınacak veri önceden tahmin edilebiliyor

Geçişten önce script'e mevcut yerleşimi verip "rack kuralına göre kaç kopya yanlış yerde?" diye sordum.

| | Tahmin | Gerçekleşen |
|---|---|---|
| Rack kuralını ihlal eden PG | 81 / 128 | 82 remapped |
| Taşınacak veri | 174.1 GiB | ~178.7 GiB |
| Yanlış konumdaki kopya oranı | %21.1 | %20.9 |

Fark %3 civarında. Teorik olarak da beklenen buydu: 3 rack × 2 host yapısında rastgele seçilen 3 host'un üç farklı rack'e denk gelme olasılığı `(6·4·2)/(6·5·4) = 0.40`. Yani PG'lerin ~%60'ı kuralı ihlal eder ve her birinde bir kopya taşınır, bu da ~%20 misplaced demek.

Ama bu güzel tablo **rack'ler CRUSH haritasında zaten varsa** geçerli. Lab 2'de rack'leri de geçişle birlikte ekledim ve sonuç çok farklı çıktı (aşağıda, 4. madde).

## 2. Taze veri ve yaşlı veri bambaşka davranıyor

İlk deneyde veriyi yazar yazmaz kuralı değiştirdim. Sürpriz şuydu: kopyalar *misplaced* değil **degraded** sayıldı, 80 PG bir süre **2 kopyayla** çalıştı ve `norebalance` taşımayı durdurmadı.

Sebebi PG log'u: veri yeni yazıldığı için log PG'nin bütün geçmişini kapsıyordu (ör. bir PG'de 549 obje, 549 log girdisi). Ceph backfill yerine log tabanlı recovery seçti ve yeni OSD'yi acting set dışında tutarak asenkron doldurdu (`async_recovery_targets`). Recovery, `norebalance`'ın kapsamında olmadığı için de durmadı.

Uzun süredir çalışan kümelerde durum farklı: PG log'u objelerin yalnızca küçük bir kısmını kapsar. Bunu taklit etmek için log limitlerini düşürüp küçük objelerle kısa bir yazma yaptım:

```bash
ceph config set osd osd_min_pg_log_entries 50
ceph config set osd osd_max_pg_log_entries 100
rados bench -p crush-test 60 write -b 4096 -t 16 --no-cleanup
```

Bu "yaşlandırılmış" veriyle tekrar denediğimde tablo tersine döndü:

| | Taze veri | Yaşlı veri |
|---|---|---|
| Doldurma yöntemi | Log tabanlı recovery | Backfill |
| Kopyaların durumu | Degraded (%20.9) | Misplaced (%13.6) |
| Undersized PG | 80 | 0 |
| `norebalance` durdurdu mu? | Hayır | Evet (6 gün boyunca hiç veri taşınmadı) |

Gerçek bir kümede beklenen ikinci tablo. Yani geçiş kopya sayısı düşmeden yapılıyor ve `norebalance` gerçekten bir fren gibi çalışıyor. Yine de geçiş anında yoğun yazma alan PG'ler log tabanlı recovery'ye girip kısa süre undersized kalabilir, bunu akılda tutmak lazım.

## 3. CRUSH hangi kopyayı taşıyor? (Ve rollback neden bedava değil)

Kural değişikliğinden önceki ve sonraki hedef yerleşimleri PG bazında karşılaştırdım:

| | PG | Taşınan kopya |
|---|---|---|
| Hiç değişmeyen | 49 | 0 |
| Tek kopyası taşınan | 77 | 77 |
| İki kopyası taşınan | 2 | 4 |

Kurala zaten uyan hiçbir PG'ye dokunulmadı ve taşınan kopya sayısı teorik minimumun sadece %2.5 üzerinde. Değişikliklerin %69'u **3. kopyada** oldu.

Sebebi `chooseleaf firstn`'in çalışma şekli: kopyaları sırayla seçiyor, kurala uymayan seçimi reddedip tekrar deniyor. İlk seçimler kural değişse de çoğunlukla aynı kalıyor, çakışma genelde son seçimde yakalanıyor.

Buradan çıkan ve beni şaşırtan sonuç: **geri dönüş de kabaca geçiş kadar veri taşıyor.** Rack kuralının yerleşimi host kuralına da uyuyor ama CRUSH mevcut yerleşime bakmıyor, hesabı her seferinde baştan yapıyor. Rack kuralında reddedilip yeniden seçilen kopya host kuralında reddedilmiyor ve CRUSH ilk seçimine dönüyor. "Olmazsa geri alırız" diye düşünüyorsanız, geri almanın da saatler süren bir taşıma olduğunu bilmek lazım.

## 4. Rack seviyesini eklemek taşımayı ikiye katlıyor

Lab 2'de CRUSH haritasında rack yoktu. Rack bucket'larını ekleyip host'ları altına taşıdım ve kuralı değiştirdim:

```bash
ceph osd set norebalance
ceph osd crush add-bucket rack1 rack
ceph osd crush move rack1 root=default
ceph osd crush move host-a rack=rack1
# ... diğer rack ve host'lar
ceph osd pool set <pool> crush_rule rack_rule
```

| | |
|---|---|
| Zorunlu minimum (sadece kuralı ihlal eden kopyalar) | 540 GiB |
| Gerçekte taşınan | ~1.24 TiB |
| **Oran** | **2.29×** |

Taşınan verinin yarısından fazlası gereksizdi. CRUSH'ın straw2 algoritması seçimleri bucket ID'lerine göre hash'liyor. Ağaca yeni bir seviye eklemek bu hesabı değiştiriyor ve kurala zaten uyan kopyalar da yer değiştiriyor. 1. maddedeki %3'lük tahmin ancak rack'ler önceden varsa geçerli.

Bu gereksiz hareketi azaltmanın yolu upmap. Kurala uyan ama CRUSH'ın sırf hash değiştiği için taşımak istediği kopyalar `pg-upmap-items` ile mevcut yerlerinde "dondurulabilir". Teoride taşıma 1.24 TiB'tan 540 GiB'a iner; bunu henüz lab'da test etmedim.

## 5. Upmap kurala aykırı yerleşimi kabul etmiyor

Büyük kümelerde kontrollü taşıma için sık önerilen bir yöntem var (CERN'in `upmap-remapped.py`'si, DigitalOcean'ın `pgremapper`'ı): `norebalance` altında değişikliği yap, her remapped PG'yi upmap ile eski yerinde dondur, küme `HEALTH_OK` olsun, sonra upmap kayıtlarını parça parça silerek taşımayı kendi hızında yap.

Ben de bu yöntemin host → rack geçişinde de işe yarayacağını düşünüyordum. Yanılmışım. Bekleyen bir PG üzerinde denedim (`up [5,2,1]`, `acting [5,2,4]`, rack'ler sırasıyla c, b, c):

| Komut | Sonuç yerleşim | Rack kuralına uygun mu? | Ne oldu? |
|---|---|---|---|
| `pg-upmap-items 4.3 1 4` | [5,2,4] → c, b, c | Hayır | Komut kabul edildi, kayıt saniyeler içinde osdmap'ten silindi |
| `pg-upmap-items 4.3 1 0` | [5,2,0] → c, b, a | Evet | Kayıt kaldı, up set [5,2,0] oldu |

MON, kurala aykırı yerleşim yaratan upmap kayıtlarını temizliyor. Yani failure domain'i **sıkılaştırırken** asıl taşınması gereken PG'ler upmap ile eski yerinde tutulamıyor. Upmap yalnızca kurala uygun yerleşimleri dondurabiliyor: 4. maddedeki gereksiz hareket ve rack → host yönündeki geri dönüş bu kapsamda.

## 6. mClock: taşıma hızını kısabiliyor muyuz?

Quincy'den beri varsayılan IO zamanlayıcısı mClock. İstemci IO'su ile recovery/backfill arasında disk kapasitesini paylaştırıyor. Hazır profiller `high_client_ops`, `balanced` ve `high_recovery_ops`; bir de limitleri elle verdiğiniz `custom` var.

### Önce bir tuzak: IOPS kapasitesi

mClock her OSD'nin IOPS kapasitesini (`osd_mclock_max_capacity_iops_hdd/ssd`) referans alıyor. VM diskleri HDD olarak algılandığı için OSD'ler varsayılan **315 IOPS** ile çalışıyordu; `ceph tell osd.N bench` ise 15–21 bin IOPS ölçtü. Bu değer yanlışsa profillerin verdiği oranların hiçbir anlamı yok. Önce ölçüp elle verdim:

```bash
ceph tell osd.0 bench
ceph config set osd.0 osd_mclock_max_capacity_iops_hdd 18000
```

### Ölçüm yöntemi

İlk denemede profilleri tek bir geçiş içinde sırayla değiştirdim ve sonuç anlamsız çıktı: geçişin başında çok PG paralel taşınırken sonda az iş kalıyor, yani profil etkisi geçişin aşamasıyla karışıyor. İkinci denemede beş ayarı 3'er dakikalık bloklar halinde, taşıma bitene kadar döngüyle uyguladım (6 tur) ve her bloğun hızını aynı turdaki ortalamaya oranladım.

İstemci yükü sabitti: RBD üzerinde 1050 okuma + 450 yazma/sn (4 KiB), kapasitenin ~%30'u.

| Ayar | Göreli taşıma hızı | Yazma p95 | Okuma p99 |
|---|---|---|---|
| Taşıma yokken (referans) | – | 8.9 ms | 1.8 ms |
| `balanced` | 0.81 | 19.5 ms | 2.6 ms |
| `high_client_ops` | 0.65 | 18.9 ms | 2.3 ms |
| `high_recovery_ops` | **1.95** | 25.2 ms | 8.4 ms |
| `custom`, taşımaya %20 tavan | 0.71 | 19.4 ms | 2.5 ms |
| `balanced` + `osd_max_backfills 4` | 0.80 | 19.8 ms | 2.7 ms |

Çıkardıklarım:

- **Taşıma, hangi ayarla olursa olsun kullanıcıya yansıyor.** Yazma p95 gecikmesi her ayarda referansın ~2 katı.
- **Profiller istemci gecikmesinden çok taşıma hızını değiştiriyor.** `high_recovery_ops` 6 turun 6'sında en hızlısı, diğerlerinin ~2.4 katı. Bedeli yazma p95'te %30, okuma p99'da ~3 kat artış.
- **`high_client_ops`'un istemciye katkısı küçük:** `balanced`'a göre %3–5 daha iyi gecikme, ~%20 daha yavaş taşıma.
- **%20 tavan ve `osd_max_backfills 4` fark yaratmadı.** Taşıma bu tavana hiç ulaşmadı, eşzamanlılık da darboğaz değildi.

Not: mClock altında `osd_max_backfills` gibi ayarlar ancak override açılınca etkili oluyor:

```bash
ceph config set osd osd_mclock_override_recovery_settings true
ceph config set osd osd_max_backfills 1
```

## 7. Peering anı

Kuralın değiştiği saniye her şey birkaç saniyeliğine duruyor. İlk lab'da istemci hızı bir saniyeliğine 4 MiB/s'e düştü, tek bir istek 2.35 sn bekledi. İkinci lab'da bazı istekler 5–7 sn bekledi; taşıma boyunca da PG'ler yeni yerine geçerken ~1 sn'lik takılmalar oldu.

İkincisinin bir kısmı benim hatam: rack ekleme ve host taşımayı 21 ayrı komutla yaptım, her biri yeni bir osdmap epoch'u ve yeni bir peering turu demek. Bunu tek bir CRUSH haritası güncellemesiyle yapmak daha doğru:

```bash
ceph osd getcrushmap -o crush.bin
crushtool -d crush.bin -o crush.txt
# crush.txt'yi düzenle: rack'leri ekle, host'ları taşı, kuralı yaz
crushtool -c crush.txt -o crush.new
crushtool -i crush.new --test --show-statistics --rule 1 --num-rep 3   # önce test
ceph osd setcrushmap -i crush.new
```

Peering süresi taşınan terabayta değil, OSD başına düşen PG sayısına ve kaç kere harita değiştirdiğinize bağlı. Yani büyük bir kümede de kısa tutulabilir, ama sıfır olmuyor; en düşük trafik saatinde yapmak lazım.

## Lab'da başıma gelenler

Ölçümler kadar öğretici olan kısım bu oldu.

**Bellek tükenmesi.** 3.8 GiB RAM'li, swap'sız bir node'da MON, aktif MGR, bir OSD (varsayılan `osd_memory_target` = 4 GiB), Grafana/Prometheus, önceki denemeden kalan 8 `cephadm shell` container'ı ve istemci yükü aynı anda çalışıyordu. Kural değişikliği anındaki peering ek bellek istedi, node uzun süre thrashing'de kaldı ve sonunda OOM killer OSD sürecini öldürdü. Küme ayakta kaldı (diğer iki MON quorum'u korudu, MGR başka node'a geçti, veri kaybı olmadı) ama o denemenin istemci ölçümü çöpe gitti. Ders: geçiş anı bellek isteyen bir an; node başına RAM hesabını önceden yapın ve o anda ağır araç çalıştırmayın.

**Yer yokluğu.** Backfill sırasında kopya geçici olarak iki yerde durduğu için kullanım 857 GiB'tan 884 GiB'a çıktı. Bir OSD %86.5'e (nearfull) ulaştı ve 14 PG `backfill_toofull`'da takıldı. %70'in üzerindeki doluluklarda geçiş yarıda kalabiliyor.

**Yanlış hesap.** Lab 2'yi doldururken yazma hızını 190 MB/s varsaydım, gerçekte ~600 MB/s'ti. Küme %95'e dayandı, bir OSD `full` oldu ve küme `HEALTH_ERR`'e düştü. Pool'u silip süreyi hesaplayarak yeniden yazdım. Ders: veri yüklerken bile doluluğu izleyin.

## Pratik kontrol listesi

Bu deneylerden sonra böyle bir geçişten önce bakacağım şeyler:

1. Küme `HEALTH_OK`, degraded/misplaced yok, CRUSH haritasının yedeği alınmış.
2. Taşınacak veri hem script'le hem `crushtool --test` / `osdmaptool` simülasyonuyla hesaplanmış. Rack'ler yeni ekleniyorsa ekstra hareket hesaba katılmış.
3. Tüm OSD'lerde geçici doluluk artışını kaldıracak yer var. Rack kapasiteleri dengeli (rack-aware kuralda her rack verinin tam 1/3'ünü tutar; küçük rack önce dolar).
4. Node başına RAM: OSD sayısı × `osd_memory_target` + recovery payı + diğer servisler.
5. mClock IOPS kapasitesi ölçülmüş ve doğru.
6. Autoscaler ve balancer kapalı.
7. Değişiklik `norebalance` altında, tek bir `setcrushmap` ile ve düşük trafik saatinde yapılıyor.
8. Profil saate göre değişiyor: gündüz `balanced`/`high_client_ops`, gece `high_recovery_ops`. Acil durumda `norebalance`.
9. Durdurma kriterleri yazılı: p95 gecikme eşiği, OSD doluluk eşiği (ör. %80), herhangi bir PG'nin degraded olması, donanım arızası.
10. Geri dönüşün de veri taşıyacağı biliniyor ve planı var.

## Sonuç

Kuralı değiştirmenin kendisi korkulacak bir şey değil: yaşlı veride taşıma backfill ile, kopya sayısı düşmeden yapılıyor ve `norebalance` gerçekten fren gibi çalışıyor. Taşınacak veri önceden hesaplanabiliyor.

Zor kısım ölçek. Büyük bir kümede bu taşıma günler, belki haftalar sürüyor; bu sürede kullanıcılar daha yüksek gecikme görüyor ve küme `HEALTH_OK` olmuyor. mClock taşımanın hızını iyi kontrol ediyor ama kullanıcının hissettiği gecikmeyi sanıldığı kadar azaltmıyor. Upmap ile "dondur, kademeli çöz" yöntemi de kurala aykırı yerleşimleri tutamadığı için bu senaryoda doğrudan çalışmıyor.

Bu yüzden mevcut pool'u yerinde çevirmek tek seçenek değil. Rack-aware kurallı yeni bir pool açıp yeni veriyi oraya yönlendirmek ve eski veriyi kendi takviminizle taşımak (S3 tarafında storage class ve lifecycle kurallarıyla, RBD tarafında `rbd migration` ile) daha yavaş ama çok daha kontrollü bir yol. Hangisinin doğru olduğu kümenin büyüklüğüne, boş kapasiteye ve kullanıcıların ne kadar gecikmeyi tolere edebileceğine bağlı.

Lab'ın sınırlarını da yazmadan geçmeyeyim: diskler VM üzerinde, istemci yükü RBD, sayılar gürültülü. Yönler aktarılabilir; oranlar her kümede yeniden ölçülmeli.

## Kaynaklar

- [Ceph Documentation: CRUSH Maps](https://docs.ceph.com/en/latest/rados/operations/crush-map/)
- [Ceph Documentation: mClock Config Reference](https://docs.ceph.com/en/latest/rados/configuration/mclock-config-ref/)
- [Ceph Documentation: Balancer / upmap](https://docs.ceph.com/en/latest/rados/operations/upmap/)
- [ceph-users: "Best way to change bucket hierarchy"](https://lists.ceph.io/hyperkitty/list/ceph-users@ceph.io/thread/UUXT4EBPZVO5T6WY3OS6NAKHRXDGQBSD/)
- [CERN ceph-scripts (`upmap-remapped.py`)](https://github.com/cernceph/ceph-scripts)
- [DigitalOcean pgremapper](https://github.com/digitalocean/pgremapper)
