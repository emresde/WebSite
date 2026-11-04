# emre döşlü — kişisel site

Astro ile yapılmış statik site. GitHub Pages'te GitHub Actions ile yayınlanır.

## Yerelde çalıştırma

```bash
npm install
npm run dev        # http://localhost:4321 (taslak yazılar da görünür)
npm run build      # dist/ klasörüne üretir
```

## Nereyi düzenlerim?

| Ne | Dosya |
|---|---|
| Tanıtım, deneyim, projeler, beceriler, sosyal linkler (TR + EN) | `src/i18n.ts` |
| Renkler, yazı tipleri | `src/styles/global.css` |
| Özgeçmiş PDF'leri | `public/cv.pdf`, `public/cv_en.pdf` |
| CebimCepte gizlilik politikası (adresi değişmemeli) | `public/cebimcepte-privacy.html` |

## Yeni blog yazısı

`src/content/blog/` altına bir `.md` dosyası ekle. Dosya adı adres olur
(`ceph-notlari.md` → `/blog/ceph-notlari/`).

```markdown
---
title: "Yazının başlığı"
description: "Listede görünecek bir-iki cümlelik özet"
date: 2026-11-10
lang: tr            # tr veya en
tags: [ceph, linux]
draft: false        # true iken yayınlanmaz, sadece npm run dev'de görünür
translation: dosya-adi-en   # (isteğe bağlı) diğer dildeki versiyonun dosya adı
---

Yazı burada, Markdown ile.
```

`main` dalına push edince site birkaç dakikada güncellenir.

## İletişim formu

Form, `backend/` içindeki Node.js servisine (Render) istek atar. Backend değişmedi.

## Eski adresler

`ozgecmis.html`, `iletisim.html`, `sosyal.html`, `emredoslu.html` yeni sayfalara yönlendirir
