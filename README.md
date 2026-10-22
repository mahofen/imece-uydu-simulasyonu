# 🛰️ İMECE – Uzaydaki Gözümüz: Etkileşimli 3D Uydu Keşif Laboratuvarı

Türkiye'nin ilk yerli ve millî metre-altı elektro-optik yer gözlem uydusu **İMECE**'yi öğrencilere ve uzay meraklılarına tanıtan, bilimsel doğruluğu ön planda tutan, fotogerçekçi ve tamamen etkileşimli 3D web simülasyonu.

![İMECE 3D Uydu Laboratuvarı](https://img.shields.io/badge/TÜBİTAK_UZAY-İMECE_Yer_Gözlem_Uydusu-e11d48?style=for-the-badge)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js_/_R3F-black?style=for-the-badge&logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🎯 Projenin Amacı ve Hedef Kitlesi

* **Hedef Kitle:** 10–14 yaş aralığındaki ortaokul öğrencileri, öğretmenler ve uzay teknolojisi meraklıları.
* **Kullanım Alanları:** Ortaokul Fen Bilimleri dersleri (Güneş Sistemi, Kuvvet ve Enerji üniteleri), TÜBİTAK 4007 Bilim Şenlikleri, STEM atölyeleri ve akıllı tahta sınıf sunumları.
* **Tasarım İlkesi:** Ekranın merkezinde Dünya ve uyduyu kapatan hiçbir kutu veya engelleyici etiket bulunmaz; tüm araçlar kenar görev çubuklarına yerleştirilmiştir.

---

## ✨ Temel Yetenekler ve Özellikler

### 1. 🛰️ Ayrıntılı 3D Uydu Modeli ve Alt Sistem Keşfi
* **360° Serbest İnceleme:** Dokunmatik ekran ve fare kontrolleri ile uydunun etrafında serbestçe dönme, yumuşak yakınlaşma ve uzaklaşma.
* **GaAs Güneş Panelleri:** Üç eklemli galyum arsenit güneş hücreleri, foton parçacıkları ve güneş açısına göre dinamik güç üretimi simülasyonu ($1200\text{ W}$ / batarya gece geçişi).
* **Metre-Altı Optik Kamera:** Korsch teleskop optiği, $0,99\text{ m}$ pankromatik yer örnekleme mesafesi (GSD) ve çözünürlük karşılaştırma aracı.
* **Haberleşme Antenleri:** X-Bant ve S-Bant antenleri ile Ankara Ahlatlıbel Yer İstasyonu arasında telemetri komuta (Uplink) ve yüksek hızlı görüntü indirme (Downlink - $320\text{ Mbps}$) sinyal dalgaları.
* **Gövde & İç Kesit (Aviyonik):** Altın çok katmanlı yalıtım (MLI folyo) örtüsünü yarı saydam yaparak millî uçuş bilgisayarı (BİLGE), güç dağıtım birimi ve Li-Ion bataryaları 3D olarak inceleme imkânı.
* **Yönelim Kontrolü (AOKS):** Reaksiyon tekerlekleri ve jiroskoplar ile uydunun Dünya üzerindeki hedeflere yönelme fiziği.
* **Elektrikli İtki Motoru:** Yerli Hall etkili ksenon iyon itki sistemi.

---

### 2. 🌍 Kepler Yörünge & Astrodinamik Laboratuvarı
Kullanıcı tek tıkla 4 farklı uzay kuşağı arasında geçiş yaparak Kepler'in 3. Yasası'nı bizzat test edebilir:
1. **LEO / ISS (400 km):** $27.600\text{ km/s}$ hız, $92,5\text{ dk}$ periyot.
2. **İMECE SSO (680 km):** $26.900\text{ km/s}$ hız, $98,4\text{ dk}$ Güneş Eşzamanlı Kutupsal Yörünge.
3. **MEO / GPS (20.200 km):** $13.900\text{ km/s}$ hız, $12\text{ saat}$ navigasyon periyodu.
4. **GEO / TÜRKSAT 6A (35.786 km):** $11.050\text{ km/s}$ hız, $23\text{ saat } 56\text{ dk}$ jeosenkron periyot (Türkiye üzerinde sabit asılı görünür).

* **Kamera Görüş Konisi (Swath FOV):** Uydunun optik kamerasından Dünya yüzeyine yansıtılan $13.9\text{ km}$ genişliğindeki şerit tarama ayak izi projeksiyonu.

---

### 3. 🌡️ FLIR Termal Analiz Görünümü
* Tek tıkla aktif edilen termal analiz katmanı.
* Uydunun ve Dünya'nın Güneş gören sıcak yüzeylerini **$+120^\circ\text{C}$ (Kırmızı / Sarı)**, derin uzay gölgesinde kalan soğuk yüzeylerini ise **$-80^\circ\text{C}$ (Koyu Mavi / Mor)** sahte renk haritasıyla gösterir.

---

### 4. 🎬 Sinematik Sergi & Kiosk Turu
* TÜBİTAK bilim fuarları ve akıllı tahta sergileri için otomatik tur modu.
* İMECE'nin 5 ana yerli mühendislik başarısını sinematik kamera açıları ve alt yazılar eşliğinde sırayla tanıtır. Ekrana dokunulduğu an kontrol kullanıcıya geçer.

---

### 5. 🎯 İnteraktif STEM Etkinlikleri & Sözlük
* **1. Parçayı Bul:** Yönergelere göre 3D uydu üzerinde doğru alt sistemi bulma oyunu.
* **2. Görev Eşleştir:** Uydunun parçaları ile üstlendikleri görevleri eşleştirme testi.
* **3. Görevi Tamamla:** Güç açma, yönelme, fotoğraf çekme ve Dünya'ya indirme görev simülasyonu.
* **Uzay Terimleri Sözlüğü:** Nadir, Zenith, GSD, SSO, Aviyonik, Tepki Tekerleği vb. terimlerin ortaokul düzeyinde kolay anlatımları.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

```bash
# 1. Projeyi klonlayın
git clone https://github.com/mohafen/imece-uydu-simulasyonu.git
cd imece-uydu-simulasyonu

# 2. Bağımlılıkları kurun
npm install

# 3. Geliştirme sunucusunu başlatın
npm run dev

# 4. Üretim sürümünü derlemek ve önizlemek için
npm run build
npm run preview
```

Tarayıcınızda `http://localhost:4173/` veya `http://localhost:3000/` adresini açarak laboratuvara bağlanabilirsiniz.

---

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React 18, TypeScript, HTML5 Canvas
* **3D & Grafikler:** Three.js, React Three Fiber, React Three Drei
* **Stil & Arayüz:** CSS3 Glassmorphism, Lucide React Icons
* **Ses & Efektler:** Web Audio API (Sentetik telemetri, itki ve deklanşör sesleri)
* **Derleme Aracı:** Vite 8

---

## 📄 Lisans

Bu proje eğitim ve bilimsel farkındalık amacıyla geliştirilmiştir. MIT Lisansı ile lisanslanmıştır.
