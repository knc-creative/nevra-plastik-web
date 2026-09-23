# Nevra Plastik Çok Sayfalı (Multi-Page) Geliştirme Tamamlama Özeti (Walkthrough)

Nevra Plastik firması için talep edilen tüm tasarımsal düzeltmeler, **çok sayfalı (multi-page) statik HTML yapısına geçiş** ve hamburger menü iyileştirmeleri başarıyla tamamlanmıştır. Web sitesi, localde hiçbir PHP yorumlayıcısına ihtiyaç duymadan (Python veya basit statik sunucularla) sorunsuz çalışabilmesi için `.html` sayfaları olarak yapılandırılmıştır. B2B teklif formu ise sunucuda çalışmaya hazır **PHP API/Backend** (`api/contact.php`) desteğine sahiptir.

---

## 1. Sayfa ve Kod Yapısı

Local sunucu uyumluluğu ve hızlı yüklenme (Core Web Vitals) performansını artırmak amacıyla tüm sayfalar bağımsız statik HTML5 standartlarında oluşturulmuştur.

### Çok Sayfalı (Multi-Page) Dosya Listesi
1. [index.html](file:///Users/erenkonca/Desktop/nevra%20website/index.html) - Anasayfa. Hero alanı, Hakkımızda özeti, 3 Ürün Kategorisinin özet kartları, Üretim Süreci teaser alanı, Döngüsel Ekonomi sayaçları ve yönlendirme alanları. (Eski trust-section kaldırılmıştır).
2. [hakkimizda.html](file:///Users/erenkonca/Desktop/nevra%20website/hakkimizda.html) - Kurumsal Hakkımızda sayfası. Detaylı kuruluş hikayesi, kurumsal ilkeler ve sayaçlı tecrübe/kapasite istatistikleri.
3. [urunler.html](file:///Users/erenkonca/Desktop/nevra%20website/urunler.html) - Ürün Kataloğu. Üç ana ürün kategorisini (`PP MOBLEN GRANÜL`, `ELTEKS`, `DİĞER`) tanıtan ve teknik sayfalara yönlendiren premium grid alan.
4. [urun-pp-moblen.html](file:///Users/erenkonca/Desktop/nevra%20website/urun-pp-moblen.html) - Polipropilen granül teknik detayları, MFI/Yoğunluk parametre tabloları ve doğrudan teklif al butonu.
5. [urun-elteks.html](file:///Users/erenkonca/Desktop/nevra%20website/urun-elteks.html) - Alçak/Yüksek Yoğunluklu Polietilen (HDPE/LDPE) teknik özellikleri, MFI aralıkları ve teklif isteme butonu.
6. [urun-diger.html](file:///Users/erenkonca/Desktop/nevra%20website/urun-diger.html) - Dolgulu kompaundlar, kalsitli polimerler ve müşteriye özel butik formülasyonların teknik sayfası.
7. [uretim-sureci.html](file:///Users/erenkonca/Desktop/nevra%20website/uretim-sureci.html) - 6 aşamalı (Atık Toplama, Ayrıştırma, Yıkama, Kırma, Ekstrüzyon, Granül) modern geri dönüşüm zaman çizelgesi.
8. [kalite.html](file:///Users/erenkonca/Desktop/nevra%20website/kalite.html) - Kalite kontrol test prosedürleri (MFI, yoğunluk, nem analizi) ve ISO/Bakanlık sertifikaları alanı.
9. [surdurulebilirlik.html](file:///Users/erenkonca/Desktop/nevra%20website/surdurulebilirlik.html) - Döngüsel ekonomi sayaçları, karbon tasarrufu ve yeşil sanayi vizyonumuz.
10. [iletisim.html](file:///Users/erenkonca/Desktop/nevra%20website/iletisim.html) - Yenilenmiş iletişim kanalları, nokta atışı harita pini ve B2B form alanı.

---

## 2. Gerçekleştirilen Tasarım ve Arayüz Güncellemeleri

### A. Hamburger Hizalaması & Buton Yerleşimi
* Hamburger butonu (`.mobile-nav-toggle`) için sabit `40px` genişlik/yükseklik verilerek ve içindeki `.hamburger::before` / `.hamburger::after` pseudo-elementlerine `left: 0` tanımlanarak kayma ve patlama sorunu tamamen çözülmüştür.
* **"Teklif Talep Et"** ve **"EN/TR Dil Butonu"**, hamburger menünün soluna gelecek şekilde mükemmel bir flexbox hizalamasıyla yerleştirilmiştir.

### B. Yeşil Butonlar & Gölge Efektleri
* Butonlardaki turuncu tonları tamamen kaldırılmış; kurumsal yeşil (`#2fb14d`) ve koyu yeşil (`#1b8532`) tonlarına geçilmiştir.
* Butonların normal durumuna hafif bir gölge, üzerine gelindiğinde (hover) ise yeşil tonlu derinlik katan bir kutu gölgesi (`box-shadow: 0 10px 25px rgba(47, 177, 77, 0.25);`) ve yumuşak bir yükselme efekti (`transform: translateY(-2px);`) eklenmiştir.

### C. Glassmorphism Kart Yapısı
* **Adım Adım Geri Kazanım** (Üretim Süreci) kartları ile **Döngüsel Ekonomi** (Sürdürülebilirlik) istatistik kartları yarı şeffaf, buzlu cam efektli (`backdrop-filter: blur(12px)`) glassmorphic yapıyla yeniden tasarlanmıştır.
* Süreç kartlarının hover durumunda yuvarlak içindeki sayının arka plan rengi kurumsal koyu yeşile (`#1b8532`) dönecek şekilde güncellenmiştir.
* Döngüsel Ekonomi alanındaki sayılar ve grafik sınırları daha canlı ve doygun renklerle belirginleştirilmiştir.

### D. Çift Dil ve Sayaç Entegrasyonu
* Hakkımızda sayfasındaki istatistikler (`19+ Yıllık Tecrübe`, `15K+ Kapasite`, `%100 İzlenebilirlik`) ile Sürdürülebilirlik sayfasındaki veriler, sayfa kaydırılıp görünür alana girdiğinde dinamik olarak hedef sayıya kadar artan sayaç animasyonuyla güçlendirilmiştir.
* Dil tercihi (TR/EN) tarayıcının `localStorage` alanına kaydedilmektedir. Böylece kullanıcı bir sayfada dili İngilizce yaptığında, diğer sayfaları gezerken site otomatik olarak İngilizce açılmaya devam etmektedir.

### E. İletişim & Harita Pini Düzeltmesi
* İletişim grid yerleşimi baştan tasarlanarak form ve kartlar mükemmel bir şekilde hizalanmıştır.
* Google Haritalar alanı, ilettiğiniz resmi adrese nokta atışı pinlenecek şekilde dinamik embed koduyla güncellenmiştir:
  * *Tatlıcak Mah. Vatan Sanayi Sitesi, Işıldak Sk. No:30/32, Karatay / KONYA*
* Form alanı, URL parametrelerini okuyacak şekilde tasarlanmıştır. Örneğin, bir ürün sayfasından "Teklif Talebi" butonuna tıklandığında, iletişim formundaki ürün seçeneği otomatik olarak seçili gelmektedir.

---

## 3. Hamburger Menü & Header Animasyon Revizyonları (Sürüm 1.6)

Kullanıcının son talepleri doğrultusunda hamburger menü çekmecesinin genişliği ve açılma anındaki buton davranışları yeniden yapılandırılmıştır:

### A. X Butonunu İçine Alan Dinamik Genişlik
* Menü çekmecesi (`.nav-menu`) açıldığında X kapatma butonunun (`.mobile-nav-toggle`) da çekmecenin buzlu cam alanı içinde kalması sağlanmıştır.
* Çekmecenin genişliği, X butonu ile solundaki "Teklif Talep Et" butonu arasındaki tam **orta noktaya (midpoint)** kadar genişletilmiştir. Bu sayede X butonu görsel olarak tamamen menünün içinde yer almaktadır.
* Bu genişlik `js/app.js` dosyasında, her iki elementin koordinatları ve ekran genişliği baz alınarak dinamik ve pixel-perfect olarak hesaplanır ve CSS değişkeni `--drawer-width` olarak uygulanır:
  ```javascript
  const midpointX = actionsRightShifted + (toggleLeft - actionsRightShifted) / 2;
  let drawerWidth = window.innerWidth - midpointX;
  ```

### B. Butonlar İçin Sola Kayma Animasyonu
* Hamburger menü açıldığında, "Teklif Talep Et" ve "EN/TR Dil Butonu" (`.header-actions` grubu), menü alanına yer açmak ve görsel dengeyi korumak amacıyla **soft bir animasyonla sola kaymaktadır**.
* Menü kapandığında ise butonlar eski konumlarına yumuşak bir şekilde geri döner.
* Bu animasyon için CSS'te `transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)` kuralı kullanılmış ve kayma miktarı ekran boyutuna göre dinamik olarak ayarlanmıştır (Masaüstü için 100px, tablet için 70px, mobil için 40px).

### C. Sayfa Başlıklarının Milimetrik Hizalanması
* Genişleyen çekmece yapısıyla uyumlu olarak, masaüstü ekranlarda sayfa başlıklarının (menü linklerinin) başlangıç noktası, X kapatma butonunun dikey çizgileriyle tam dikey eksende milimetrik olarak hizalanmaya devam etmektedir.

### D. Önbellek Kırma (v7.4)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.4`** değerine yükseltilmiştir:
  - `css/style.css?v=7.4`
  - `js/app.js?v=7.4`

---

## 4. Ürünler ve Makineler İçin Aktif/Pasif Yayın Durumu Kontrolü (Sürüm 7.4)

Yönetim panelinden ürün ve makinelerin sitede yayınlanıp yayınlanmayacağını belirleyen Aktif/Pasif durum alanı entegre edilmiştir.

### Yapılan Değişiklikler ve Eklemeler:
1. **Yayın Durumu Arayüz Girdisi (`admin.html`)**:
   - Ürün ekleme/düzenleme (`product-modal`) ve makine ekleme/düzenleme (`machine-modal`) formlarına "Yayın Durumu (Aktif/Pasif)" seçim kutusu eklendi.
2. **Listeleme ve Durum Göstergesi (`admin.html`)**:
   - Yönetim panelindeki listelerde her ürünün ve makinenin adının yanında yayında olup olmadığını gösteren yeşil renkli "Aktif" veya kırmızı renkli "Pasif" durum etiketleri (badges) gösterilmesi sağlandı.
3. **Merkezi Dinamik Gizleme Filtresi (`js/app.js`)**:
   - `js/app.js` içerisindeki `initSiteData()` veri yükleme modülü, CMS'ten gelen verileri alırken pasif olan (`status === 'passive'`) ürün ve makineleri süzgeçten geçirecek şekilde güncellendi.
   - Bu sayede, herhangi bir HTML dosyasında değişiklik yapmaya gerek kalmaksızın tüm ziyaretçi arayüzlerinde pasife çekilen içerikler dinamik olarak görünmez hale gelmektedir.

---

## 5. Dinamik Kategori Sayfaları, Dinamik Dropdown ve Yönetim Paneli Koyu Tema Desteği (Sürüm 5.0)

Kullanıcının son talepleri doğrultusunda yönetim paneli ve ön yüz entegrasyonu tamamen dinamik hale getirilmiş ve panele koyu tema desteği eklenmiştir:

### A. Dinamik Ön Yüz Kategori Sayfaları
* `urun-pp-moblen.html`, `urun-elteks.html` ve `urun-diger.html` sayfaları statik yapıdan arındırılarak dinamik ürün listeleme altyapısına kavuşturulmuştur.
* Artık bu sayfalar, sunucudaki güncel `products.json` ve `categories.json` veritabanlarından kendi kategorilerine ait ürünleri canlı olarak çeker. Yönetim panelinden yeni bir ürün eklendiğinde anında bu sayfalara yansır.
* `urun-pprc.html` dahil tüm kategori detay sayfalarında, ürünler için özel bir `detail_url` (statik detay sayfası) tanımlıysa ona yönlendirme yapılır; tanımlı değilse genel dinamik detay sayfası olan `urun-detay.html?id=[id]` adresine otomatik olarak yönlendirilir.

### B. Dinamik Ürün Kategori Seçim Dropdown'u
* Yönetim panelindeki "Yeni Ürün Ekle" veya "Ürün Düzenle" modalında bulunan Kategori seçim kutusu (`#prod-category`) artık statik seçenekler yerine `categories.json` veritabanındaki güncel kategorileri dinamik olarak çeker.
* Bu sayede panelden yeni bir kategori eklendiğinde veya güncellendiğinde, bu durum ürün ekleme ekranındaki kategori seçeneklerine anında yansır.

### C. Yönetim Paneli Koyu Tema (Dark Mode) Desteği
* Yönetim panelinin sol alt köşesindeki "Çıkış Yap" butonunun hemen yanına, premium tasarımlı bir tema değiştirici buton eklenmiştir.
* Karanlık tema etkinken ay (moon) ikonu, açık tema etkinken güneş (sun) ikonu dinamik olarak gösterilir.
* CSS değişkenleri (CSS Custom Properties) kullanılarak tüm panelin renk paleti Slate tonlarında (Slate 900 / Slate 800) premium bir koyu temayla uyumlu hale getirilmiştir. Tablolar, form elemanları, modallar, giriş kartı ve bildirim alanları koyu temada kusursuz bir okunabilirlik sunar.
* Tema tercihi kullanıcının tarayıcısına (`localStorage`) kaydedilir ve sayfa yenilendiğinde ya da tekrar giriş yapıldığında otomatik olarak hatırlanır. Sayfa yüklenirken oluşabilecek ışık patlaması (flash effect) engellenmiştir.

---

## 6. Preloader (Açılış Ekranı), Yönetim Paneli İkon Düzeltmesi ve SEO Optimizasyonları (Sürüm 5.1)

Sitenin görsel açılış deneyimini zenginleştirmek, yönetim panelindeki küçük bir görüntüleme hatasını gidermek ve arama motoru optimizasyonlarını en üst düzeye çıkarmak amacıyla yapılan güncellemeler:

### A. Premium Preloader (Açılış Ekranı)
* Tüm tüketici odaklı 22 HTML sayfasının `<body>` etiketinin hemen altına, Nevra Plastik kurumsal renkleriyle uyumlu, premium tasarımlı bir preloader enjekte edilmiştir.
* Preloader, karanlık bir arka plan üzerinde dönen yeşil halka animasyonu ve merkezde yavaşça nabız gibi büyüyüp küçülen (pulsing) beyaz Nevra Plastik logosundan oluşmaktadır.
* `js/app.js` içerisine eklenen zamanlayıcı mantığı sayesinde, preloader açılışta en az **2 saniye** ekranda kalarak kullanıcılara pürüzsüz bir animasyon sunar. Sayfa tamamen yüklendiğinde ve 2 saniyelik minimum süre dolduğunda preloader yumuşak bir karararak kaybolma (fade-out) efektiyle kapatılır ve DOM'dan temizlenir.

### B. Yönetim Paneli Tema Butonu İkon Düzeltmesi
* Yönetim panelinin sol altındaki koyu tema değiştirme butonunda Ay/Güneş SVG ikonunun bazı tarayıcılarda görünmeme hatası giderilmiştir.
* İkon güncellemeleri, doğrudan SVG alt bileşeni yerine tüm butonun `innerHTML` içeriği (tam `<svg>...</svg>` etiketi) değiştirilerek yapılmış, böylece tarayıcının SVG motorunu her seferinde doğru namespace ile yeniden tetiklemesi sağlanmıştır. Ay ve güneş ikonları artık sorunsuz ve net bir şekilde görüntülenmektedir.

### C. Sayfa SEO Değerlerinin Optimize Edilmesi
* `hakkimizda.html` ve `uretim-sureci.html` gibi ana kurumsal sayfaların meta açıklamalarında Türkçe karakter ve tek tırnak işaretlerinden (`'`) kaynaklanan kesilmeler taranmış, her iki sayfa için de B2B standartlarında zenginleştirilmiş meta açıklamaları doğrulanmıştır.
* `urun-detay.html` (dinamik detay şablonu) için arama motoru botlarının (Googlebot vb.) JS çalışmadan önce sayfayı okuyabilmesi adına varsayılan `<title>` ve `<meta name="description">` etiketleri optimize edilmiştir.
* Sitedeki tüm görsellerin `alt` etiketleri kontrol edilerek eksiksiz olduğu doğrulanmıştır.

---

## 7. İletişim Bilgileri Kartı ve Google Harita Hizalama İyileştirmeleri (Sürüm 5.2)

Arayüzün görsel bütünlüğünü artırmak ve mobil/masaüstü okuma kalitesini yükseltmek amacıyla yapılan yerleşim iyileştirmeleri:

### A. Adres Satırı Wrap (Satır Bölme) Düzenlemesi
* `index.html` ve `iletisim.html` sayfalarında bulunan "Nevra Plastik İletişim Bilgileri" kartındaki uzun adres satırı, görsel taşmaları ve sıkışmaları önlemek adına `<br>` etiketiyle iki satıra bölünmüştür:
  * Birinci Satır: `Tatlıcak Mah. Vatan Sanayi Sitesi, Işıldak Sk.`
  * İkinci Satır: `No:30/32, Karatay / KONYA`
  * Bu sayede adres bilgisi çok daha okunaklı ve dengeli bir yerleşim düzenine kavuşturulmuştur.

### B. Google Harita Yükseklik Eşitlemesi
* Anasayfadaki (`index.html`) iletişim alanında yer alan Google Harita (`iframe`) konteynerinin yüksekliği, yanındaki İletişim Bilgileri kartının yüksekliğine dinamik olarak eşitlenmiştir.
* `grid-2` yerleşimi `align-items: stretch` olarak güncellenmiş ve harita wrapper'ına `height: 100%` verilmiştir. Böylece harita, yan taraftaki iletişim kartı ne kadar uzarsa uzasın onunla her zaman milimetrik olarak **aynı yükseklikte (equal height)** hizalanarak şık ve simetrik bir B2B görünümü sunmaktadır.

---

## 8. Ürünler ve Makineler İçin Aktif/Pasif Yayın Durumu Kontrolü (Sürüm 7.4)

Yönetim panelinden ürün ve makinelerin sitede yayınlanıp yayınlanmayacağını belirleyen Aktif/Pasif durum alanı entegre edilmiştir.

### Yapılan Değişiklikler ve Eklemeler:
1. **Yayın Durumu Arayüz Girdisi (`admin.html`)**:
   - Ürün ekleme/düzenleme (`product-modal`) ve makine ekleme/düzenleme (`machine-modal`) formlarına "Yayın Durumu (Aktif/Pasif)" seçim kutusu eklendi.
2. **Listeleme ve Durum Göstergesi (`admin.html`)**:
   - Yönetim panelindeki listelerde her ürünün ve makinenin adının yanında yayında olup olmadığını gösteren yeşil renkli "Aktif" veya kırmızı renkli "Pasif" durum etiketleri (badges) gösterilmesi sağlandı.
3. **Merkezi Dinamik Gizleme Filtresi (`js/app.js`)**:
   - `js/app.js` içerisindeki `initSiteData()` veri yükleme modülü, CMS'ten gelen verileri alırken pasif olan (`status === 'passive'`) ürün ve makineleri süzgeçten geçirecek şekilde güncellendi.
   - Bu sayede, herhangi bir HTML dosyasında değişiklik yapmaya gerek kalmaksızın tüm ziyaretçi arayüzlerinde pasife çekilen içerikler dinamik olarak görünmez hale gelmektedir.

---

## 9. Yönetim Paneli Hata Düzeltmesi (Sürüm 7.5)

Aktif/Pasif durum entegrasyonu esnasında `admin.html` dosyasında `renderMachinesTable` fonksiyonundaki döngü başlangıç kodlarının silinmesinden ötürü oluşan ve tüm yönetim panelini siyah ekran olarak kilitleyen sözdizimi hatası çözülmüştür.

### Yapılan Değişiklikler ve Eklemeler:
1. **Döngü Yapısı ve Değişken Tanımlarının Geri Eklenmesi (`admin.html`)**:
   - `machinesList.forEach(mach => { const tr = document.createElement("tr");` satırı yerine konularak `mach` ve `tr` değişkenlerinin tanımsız kalması ve tarayıcıda ReferenceError fırlatarak tüm Javascript motorunu kilitlemesi engellendi.
2. **Sözdizimi Doğrulama**:
   - Geliştirilen python kontrol scriptleri ile parantez ve süslü parantezlerin tamamen kapandığı ve Javascript parser'ın sorunsuz çalıştığı doğrulandı.

### C. Önbellek Kırma (v7.5)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.5`** değerine yükseltilmiştir:
  - `css/style.css?v=7.5`
  - `js/app.js?v=7.5`

---

## 10. İşlem Satırlarında Anlık Aktif/Pasif Toggle Switch Desteği (Sürüm 7.6)

Yöneticinin düzenleme modalını açmadan, doğrudan liste satırları üzerinden ürünlerin veya makinelerin yayın durumunu (Aktif/Pasif) değiştirebilmesini sağlayan switch butonları eklenmiştir.

### Yapılan Değişiklikler ve Eklemeler:
1. **iOS Tarzı Premium Switch Tasarımı (`admin.html`)**:
   - Tablo hücreleriyle uyumlu, koyu tema uyumluluğuna sahip modern switch arayüzü eklendi. Aktif durumda yeşil, pasif durumda gri renk geçişi sağlandı.
2. **Tablo Genişlik ve Hücre Güncellemeleri (`admin.html`)**:
   - Ürünler ve Makineler yönetim tablolarının "İşlemler" kolon genişliği switch butonlarının sığması için 240px değerine çıkartıldı.
   - Her satırın işlem hücresine toggle switch inputu yerleştirildi.
3. **Arka Plan AJAX Güncelleme Tetikleyicileri (`admin.html`)**:
   - Yazılan `toggleProductStatus()` ve `toggleMachineStatus()` fonksiyonları sayesinde, switch kaydırıldığında ekranda hiçbir donma veya yenileme hissi oluşturmadan, arka planda veri tabanı güncellenir ve satır başındaki durum etiketi (badge) sessizce yenilenir.

### C. Önbellek Kırma (v7.6)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.6`** değerine yükseltilmiştir:
  - `css/style.css?v=7.6`
  - `js/app.js?v=7.6`

---

## 11. Ayrı Görünürlük Sütunu ve Soft Easing Geçiş Animasyonları (Sürüm 7.7)

Tablo başlıklarının "Görsel / Makine Adı / Kısa Açıklama / Görünürlük / İşlemler" biçiminde düzenlenmesi ve durum değişikliklerinin yumuşak bir görsel geçişle yapılması sağlanmıştır.

### Yapılan Değişiklikler ve Eklemeler:
1. **Görünürlük (Visibility) Kolonu Tanımlanması (`admin.html`)**:
   - Tabloların başlık satırlarına (thead) `Görünürlük` sütunu eklenmiş, toggle switchler bu sütun altına taşınmıştır.
   - Düzenle ve Sil butonlarının yer aldığı `İşlemler` sütununun genişliği 180px değerine geri çekilmiştir.
2. **Soft Easing Animasyon Efektleri (`admin.html`)**:
   - Durum etiketleri ("Aktif" / "Pasif") güncellendiğinde devreye giren `@keyframes badge-fade-in` fade-in ve scale-up animasyonu eklendi.
   - Switch butonu ve durum etiket geçişlerinde yumuşaklığı artırmak için `cubic-bezier(0.25, 1, 0.5, 1)` ve `0.4s` geçiş süreleri tanımlandı.

### C. Önbellek Kırma (v7.7)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.7`** değerine yükseltilmiştir:
  - `css/style.css?v=7.7`
  - `js/app.js?v=7.7`

---

## 12. Switch Kesintisiz Geçiş Animasyonu ve Aktif/Pasif Renk İyileştirmesi (Sürüm 7.8)

Switch butonu tıklandığında gerçekleşen donma/atlama giderilmiş, switch renkleri aktifken yeşil, pasifken kırmızı olacak şekilde güncellenmiştir.

### Yapılan Değişiklikler ve Eklemeler:
1. **Dinamik Switch Renkleri (`admin.html`)**:
   - `.status-slider` sınıfının varsayılan arka plan rengi gri yerine `#ef4444` (Kırmızı) olarak değiştirildi. checked durumundayken ise `#22c55e` (Yeşil) yanması sağlandı. Koyu tema altındaki gri renk ezme kuralları silindi.
2. **Tabloyu Yenilemeden (Re-render Olmadan) DOM Güncelleme Mantığı (`admin.html`)**:
   - `toggleProductStatus` ve `toggleMachineStatus` fonksiyonlarında API isteği sonrasında tabloların sıfırdan çizilmesine yol açan `loadCMSData()` devre dışı bırakıldı.
   - Bunun yerine ilgili satırın `tr` elemanı seçilerek durum etiketi (`.status-badge-animate`) anlık olarak güncellendi.
   - Bu sayede switch butonu kesintiye uğramadan kendi soft kayma animasyonunu tamamlar hale geldi.

### C. Önbellek Kırma (v7.8)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.8`** değerine yükseltilmiştir:
  - `css/style.css?v=7.8`
  - `js/app.js?v=7.8`

---

## 13. B2B İletişim Formu Gönderiminde Ham JSON Yönlendirme Hatasının Çözülmesi (Sürüm 7.9)

B2B iletişim veya teklif formu gönderildiğinde, sayfanın doğrudan `api/contact.php` backend dosyasına yönlenerek ham JSON çıktısının ekranda görüntülenmesi hatası giderilmiştir.

### Yapılan Değişiklikler ve Eklemeler:
1. **Dil Değişkeninin (currentLang) Üst Kapsama Taşınması (`js/app.js`)**:
   - Sayfa ilk yüklendiğinde, URL parametresine göre form modunu ayarlayan `setFormMode()` fonksiyonu tetiklendiğinde henüz tanımlanmamış olan `currentLang` dil değişkenine erişmeye çalışıyor ve tarayıcıda ReferenceError fırlatıyordu.
   - Bu durum `js/app.js` dosyasının geri kalanındaki tüm form dinleyicilerinin (`form.addEventListener('submit', ...)`) yüklenmesini engelliyordu.
   - `currentLang` değişkeni `DOMContentLoaded` bloğunun en tepesine taşınarak kilitlenme kalıcı olarak önlendi.
2. **Sorunsuz AJAX Form Gönderimi**:
   - Hata giderildikten sonra, form gönderildiğinde `e.preventDefault()` sorunsuzca çalışmakta; arka planda AJAX isteği iletilip sayfa üzerinde yeşil renkli başarı bildirimi gösterilmektedir.

### C. Önbellek Kırma (v7.9)
* Değişikliklerin tarayıcılarda hemen görünmesi için sürüm numaraları tüm sayfalarda **`v=7.9`** değerine yükseltilmiştir:
  - `css/style.css?v=7.9`
  - `js/app.js?v=7.9`

---

## 14. Güvenlik, Şifre Değiştirme, Form Kaydı ve Görsel Sorunlarının Çözülmesi (Sürüm 8.0)

Projenin Hostinger sunucusuna yüklenmesinden sonra tespit edilen admin güvenlik zafiyetleri, şifre değiştirme yeteneği, iletişim formlarının veritabanına düşmemesi, görsellerin kırılması sorunları ve kaydırma deneyimi iyileştirilmiştir.

### Yapılan Değişiklikler ve Eklemeler:

1. **Yönetici Kaydet Butonunun Kaldırılması (`nevracms.html`)**:
   - Giriş ekranındaki "Yönetici Kaydet" butonu, tıklayan kişilere sistemin varsayılan şifre bilgilerini (`admin` / `admin123`) göstererek güvenlik açığı oluşturuyordu. Bu buton ve butonun Javascript dinleyici kodları tamamen silinmiştir.

2. **Dinamik Şifre Yönetimi ve Şifre Değiştirme Sekmesi (`api/cms.php` & `nevracms.html`)**:
   - Yönetim paneli giriş bilgileri artık `api/data/credentials.json` dosyasında dinamik olarak tutulmaktadır.
   - Yönetim paneline yeni bir **"Güvenlik Ayarları"** (Şifre Değiştirme) sekmesi eklenmiş olup, panel içinden mevcut şifre doğrulanarak yeni şifre atanabilmesi sağlanmıştır.

3. **PHP Backend Fonksiyonlarının Tamamlanması (`api/cms.php`)**:
   - Yerel test aşamasında mock sunucu (`server.py`) üzerinde çalışan fakat PHP backend dosyasında (`api/cms.php`) eksik kalmış olan `save_machine`, `delete_machine`, `delete_contact` aksiyonları eklenmiş ve `load` aksiyonunun makineler ile iletişim formlarını da döndürmesi sağlanmıştır.

4. **İletişim Formlarının Panelde Görünmeme Sorununun Çözülmesi (`api/contact.php`)**:
   - `api/contact.php` dosyası, form gönderildiğinde veriyi sadece yedek log dosyasına yazıyor fakat veritabanına (`api/data/contacts.json`) eklemiyordu. Gönderilen verilerin paneldeki "İletişim Formları" tablosunda görüntülenebilmesi için JSON kaydetme bloğu eklenmiştir.

5. **Görsellerin Kırılma Sorunu (Localhost URL Kaydı Çözümü)**:
   - Panelden ürün kaydedildiğinde, tarayıcının `.src` özelliğini okuması sebebiyle resim yolları `http://localhost:8080/uploads/...` şeklinde mutlak (absolute) olarak kaydediliyordu. Bu durum yayına alınınca görsellerin kırılmasına sebep oluyordu.
   - Kod, `.getAttribute('src')` kullanacak şekilde güncellenerek resimlerin göreceli (relative) yol olan `uploads/...` ile kaydedilmesi sağlandı.
   - Mevcut veritabanındaki kırık `http://localhost:8080/` resim referansları temizlendi.

6. **Pürüzsüz Sayfa Kaydırma (`css/style.css`)**:
   - Ziyaretçilerin sitede gezinirken daha yumuşak ve premium bir deneyim yaşaması amacıyla global CSS sayfasına `scroll-behavior: smooth;` kuralı uygulanmıştır.

### C. Önbellek Kırma (v8.0)
* Tüm tarayıcıların güncel stil ve betik dosyalarını çekebilmesi için sürüm numaraları **`v=8.0`** olarak güncellenmiştir:
  - `css/style.css?v=8.0`
  - `js/app.js?v=8.0`
