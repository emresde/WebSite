---
title: "Ceph'te failure domain'i host'tan rack'e taşımak: Lab'da öğrendiklerim"
description: "Kuralı değiştirmek tek satır; ama kaç terabaytın taşınacağını, kullanıcıların ne hissedeceğini ve neyin ters gidebileceğini ölçmek için bir lab kurdum."
date: 2026-11-04
lang: tr
tags: [ceph, crush, depolama]
draft: true
---

> Bu yazı taslak. `draft: true` olduğu sürece sitede görünmez.

## Problem

Host-aware bir kuralda iki kopya aynı rack'teki iki farklı sunucuya düşebilir...

## Lab

- OpenStack üzerinde 18 VM: MON, MGR, RGW ve OSD'ler ayrı makinelerde
- 9 OSD, 3 rack × 3 host

## Bulgular

1. Taşınacak veriyi önceden tahmin etmek
2. Taze veri vs. yaşlı veri: degraded mı, misplaced mı?
3. Upmap kurala aykırı yerleşimi kabul etmiyor
4. Rack seviyesini eklemek taşımayı 2.3 katına çıkarıyor
5. mClock ile taşıma hızı: ne kontrol edilebiliyor, ne edilemiyor?

## Sonuç
