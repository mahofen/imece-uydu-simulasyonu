import { SubsystemData, InternalComponent } from '../types/simulation';

export const SUBSYSTEMS_DATA: Record<string, SubsystemData> = {
  SOLAR_ARRAYS: {
    id: 'SOLAR_ARRAYS',
    title: 'Açılabilir Güneş Panelleri',
    category: 'Güç Alt Sistemi (EPS)',
    shortDesc: 'Güneş ışığını doğrudan elektrik enerjisine dönüştürerek uydunun tüm sistemlerini çalıştırır.',
    fullDesc: 'İMECE uydusunun her iki yanında açılabilen kanat şeklindeki güneş panelleri bulunur. Bu paneller üzerinde binlerce küçük güneş hücresi yer alır. Güneş takip motorları (SADM) sayesinde paneller yörünge boyunca sürekli Güneş\'e dönük kalır.',
    scientificConcept: 'Fotovoltaik Etki: Güneş ışığındaki fotonlar yarı iletken hücrelere çarptığında elektronları harekete geçirerek elektrik akımı üretir.',
    kidsExplanation: 'Tıpkı bir bitkinin yapraklarıyla güneş ışığını toplayıp besin üretmesi gibi, İMECE de güneş panelleriyle uzaydaki güneş ışığını toplayıp elektriğe dönüştürür!',
    specs: [
      'Hücre Tipi: Üç Eklemeli (GaAs / InGaP / Ge) Uzay Hücreleri',
      'Verimlilik: %30\'un üzerinde yüksek dönüşüm verimi',
      'Üretim Kapasitesi: Yaklaşık 1200 Watt elektrik gücü',
      'Yönlendirme: SADM motoru ile 360° Güneş takibi'
    ],
    icon: 'Sun',
    color: '#38bdf8'
  },

  ELECTRO_OPTICAL_CAMERA: {
    id: 'ELECTRO_OPTICAL_CAMERA',
    title: 'Metre-Altı Optik Görüntüleme Sistemi (Kamera)',
    category: 'Görev Yükü (Faydalı Yük / Payload)',
    shortDesc: '680 km irtifadan yeryüzünü 1 metrenin altında (0,99 metre) ayrıntıyla fotoğraflayan dev uzay kamerası.',
    fullDesc: 'İMECE\'nin birincil görevi yer gözlemidir. TÜBİTAK UZAY tarafından tamamen yerli olarak tasarlanan elektro-optik kamera, büyük aynaları ve hassas optik dedektörleriyle yeryüzündeki nesneleri süpürge tarama (pushbroom) tekniğiyle kaydeder.',
    scientificConcept: 'Yer Örnekleme Mesafesi (GSD): Bir pikselin yeryüzünde karşılık geldiği gerçek alan büyüklüğüdür. İMECE\'nin 0,99 metre çözünürlüğü, yeryüzünde 1 metrelik bir nesnenin tek bir pikselde ayırt edilebilmesi anlamına gelir.',
    kidsExplanation: 'Düşünün ki 680 kilometre yukarıda, uzaydasınız ve Dünya\'ya baktığınızda yoldaki bir arabayı, binaları ve tarlaların sınırlarını görebiliyorsunuz! İşte İMECE\'nin kamerası bu kadar keskin görür.',
    specs: [
      'Pankromatik (Siyah-Beyaz) Çözünürlük: ~0,99 metre GSD',
      'Çok Bantlı (Renkli) Çözünürlük: ~4,0 metre GSD (Mavi, Yeşil, Kırmızı, Yakın Kızılötesi)',
      'Tarama Şerit Genişliği (Swath): 13,9 kilometre',
      'Ayna Malzemesi: Sıfır genleşmeli Zerodur cam seramik ve altın kaplama aynalar'
    ],
    icon: 'Camera',
    color: '#10b981'
  },

  COMMUNICATION_SYSTEM: {
    id: 'COMMUNICATION_SYSTEM',
    title: 'Haberleşme ve Veri İndirme Antenleri',
    category: 'Haberleşme Alt Sistemi (RF & TT&C)',
    shortDesc: 'Yeryüzündeki istasyonlarla radyo dalgaları ile haberleşir; komut alır ve çekilen görüntüleri yere indirir.',
    fullDesc: 'İMECE uydusunun çektiği devasa boyutlu görüntüleri yeryüzüne aktarması için çok güçlü bir haberleşme sistemi gerekir. 2 eksenli hareketli X-Bant çanak anteni doğrudan yer istasyonuna odaklanarak saniyede 320 megabit hızla veri aktarımı yapar.',
    scientificConcept: 'Elektromanyetik Dalgalar: Bilgiler (fotoğraflar ve telemetri) uzay boşluğunda ışık hızında hareket eden mikrodalga radyo dalgalarına dönüştürülerek yeryüzüne ulaştırılır.',
    kidsExplanation: 'Uydu uzayda cep telefonu çekmeyen bir yerdedir ama kendi özel devasa çanak anteni sayesinde Ankara\'daki yer istasyonuyla uzay telsizi gibi konuşur ve fotoğrafları Dünya\'ya yollar!',
    specs: [
      'X-Bant Görüntü İndirme Hızı: 320 Mbps yüksek aktarım',
      'Yönlendirme: 2 Eksenli Gimbal (Yer istasyonunu otomatik takip eder)',
      'S-Bant TT&C Antenleri: Uydu sağlık durumu (telemetri) ve komuta alma',
      'GPS Alıcısı: Uydunun yörüngedeki anlık konumunu santimetre hassasiyetinde belirleme'
    ],
    icon: 'Radio',
    color: '#f59e0b'
  },

  BUS_SYSTEM: {
    id: 'BUS_SYSTEM',
    title: 'Uydu Gövdesi ve İç Sistemler',
    category: 'Platform / Taşıyıcı Gövde',
    shortDesc: 'Uydunun tüm elektronik beyinlerini, pillerini ve sistemlerini koruyan zırhlı gövde.',
    fullDesc: 'Uydu gövdesi, uzaydaki şiddetli radyasyona, mikrogöktaşlarına ve -150°C ile +120°C arasındaki aşırı sıcaklık değişimlerine karşı altın renkli Çok Katmanlı Yalıtım (MLI) battaniyeleriyle kaplıdır. İçerisinde uydunun uçuş bilgisayarı, bataryaları ve güç dağıtım üniteleri bulunur.',
    scientificConcept: 'Isıl Yalıtım ve Yapısal Bütünlük: Uzay havasız olduğu için ısı yalnızca ışıma (radyasyon) ile yayılır. Altın Kapton yalıtım katmanları güneşin kavurucu ısısını yansıtır.',
    kidsExplanation: 'Gövde, uydunun evi gibidir. İçindeki bilgisayarlar ve bataryalar sıcacık ve güvenle çalışsın diye dışına altın renginde parlak bir uzay montu giydirilmiştir!',
    specs: [
      'Gövde Boyutları: Yaklaşık 1,6 m × 1,6 m × 2,4 m prizmatik yapı',
      'Toplam Fırlatma Kütlesi: Yaklaşık 800 kilogram',
      'Yalıtım: 20 katmanlı aluminize poliimid (Kapton MLI) battaniye',
      'Yapı: Havacılık sınıfı alüminyum petek sandviç paneller ve titanyum bağlantılar'
    ],
    icon: 'Box',
    color: '#eab308'
  },

  ADCS_SYSTEM: {
    id: 'ADCS_SYSTEM',
    title: 'Yönelim Belirleme ve Kontrol Sistemi (AOKS)',
    category: 'Yönelim ve Kontrol (ADCS / AOKS)',
    shortDesc: 'Uydunun uzayda istediğimiz yöne doğru dönmesini ve hedefe kilitlenmesini sağlayan hassas yön kontrol sistemi.',
    fullDesc: 'Uydunun uzayda nereye baktığını bilmesi için gökyüzündeki takımyıldızlarını tanıyan Yıldız İzler (Star Tracker) kameraları ve Güneş sensörleri kullanılır. Uydunun yönünü çevirmek içinse uydunun içinde yüksek hızla dönen tepki tekerlekleri (reaksiyon çarkları) kullanılır.',
    scientificConcept: 'Açısal Momentumun Korunumu: Uydunun içindeki bir tekerlek bir yöne doğru hızla döndürüldüğünde, etki-tepki prensibi gereği uydu ters yönde yavaşça döner. Böylece roket yakıtı harcamadan uydunun yönü değiştirilir!',
    kidsExplanation: 'Dönen bir ofis koltuğunda otururken elinizdeki ağır bir tekerleği çevirdiğinizde koltuğunuzun da döndüğünü fark ettiniz mi? İMECE de uzayda yönünü tam olarak bu şekilde değiştirir!',
    specs: [
      'Yıldız İzler (Star Tracker): 2 adet ark-saniye hassasiyetli otonom yıldız kamerası',
      'Tepki Tekerlekleri: 4 adet yüksek hızlı reaksiyon tekeri (açısal momentum eyleyicisi)',
      'Güneş Algılayıcıları: Uydunun Güneş\'e göre açısını tespit eden duyargalar',
      'Manyetik Tork Çubukları: Dünya\'nın manyetik alanını kullanarak uydunun dönüşünü dengeleme'
    ],
    icon: 'Compass',
    color: '#8b5cf6'
  },

  PROPULSION_SYSTEM: {
    id: 'PROPULSION_SYSTEM',
    title: 'Yerli Elektrikli ve Manevra İtki Sistemi',
    category: 'İtki Alt Sistemi (Propulsion)',
    shortDesc: 'Uydunun 680 km irtifada kalmasını ve yörüngesini düzeltmesini sağlayan roket motorları.',
    fullDesc: 'Atmosferin üst katmanlarındaki çok az gaz molekülü zamanla uyduyu yavaşlatabilir. İMECE\'nin yerli itki motoru (HALE elektrikli itki ve soğuk gaz manevra memeleri), küçük itki darbeleri vererek uydunun irtifasını sabit tutar ve olası uzay çöpleriyle çarpışmasını engeller.',
    scientificConcept: 'Newton\'un 3. Hareket Yasası (Etki-Tepki): Arkadan yüksek hızla gaz veya plazma iyonları fırlatıldığında, uydu ileriye doğru itilir.',
    kidsExplanation: 'Şişirilmiş bir balonun ağzını açtığınızda hava dışarı kaçarken balon ters yöne uçar ya; uydumuz da yörüngede rotasını korumak için küçük gaz fıskiyeleri kullanır!',
    specs: [
      'İtki Tipi: Yerli HALE Hall Etkili İyon/Elektrikli İtki Motoru + Soğuk Gaz',
      'Kullanım Amacı: Yörünge irtifasını koruma, çarpışma önleme manevrası',
      'Nozul Malzemesi: Yüksek sıcaklığa dayanıklı nikel-titanyum alaşımları',
      'Ömür Katkısı: 5 yıldan fazla planlanan görev süresini güvenle sağlama'
    ],
    icon: 'Flame',
    color: '#ef4444'
  }
};

// Uydu Gövdesi kesit görünümünde ortaya çıkan basitleştirilmiş temsili iç parçalar
export const INTERNAL_COMPONENTS: InternalComponent[] = [
  {
    id: 'OBC',
    name: 'Uçuş Bilgisayarı (OBC)',
    function: 'Uydunun beynidir.',
    details: 'Uydunun tüm sistemlerini yönetir, yer istasyonundan gelen komutları işler ve uydunun sağlığını 7/24 denetler.',
    position: [0, 0.4, 0],
    size: [0.55, 0.35, 0.45],
    color: '#3b82f6'
  },
  {
    id: 'BATTERY',
    name: 'Lityum-İyon Batarya Paketi',
    function: 'Enerji depolama ünitesidir.',
    details: 'Güneş panellerinin ürettiği elektriği depolar. Uydu Dünya\'nın gölgesine girdiğinde tüm uydunun elektrik ihtiyacını kesintisiz karşılar.',
    position: [0, -0.2, -0.2],
    size: [0.75, 0.3, 0.5],
    color: '#10b981'
  },
  {
    id: 'PDU',
    name: 'Güç Dağıtım ve Düzenleme Birimi (PDU)',
    function: 'Elektrik dağıtım merkezidir.',
    details: 'Güneş panellerinden ve bataryalardan gelen elektriği düzenler; kameraya, bilgisayara ve antenlere gereken voltajda (örneğin 28V) dağıtır.',
    position: [-0.3, 0.05, 0.25],
    size: [0.35, 0.3, 0.35],
    color: '#f59e0b'
  },
  {
    id: 'SSMM',
    name: 'Katı Hal Veri Kayıt Birimi (SSMM - Hafıza)',
    function: 'Uydunun dev sabit diskidir.',
    details: 'Kameranın çektiği yüksek çözünürlüklü fotoğrafları yer istasyonunun üzerine gelene kadar hafızasında güvenle saklar.',
    position: [0.3, 0.05, 0.25],
    size: [0.35, 0.3, 0.35],
    color: '#a855f7'
  },
  {
    id: 'REACTION_WHEEL_INTERNAL',
    name: 'Tepki Tekerlekleri Ünitesi',
    function: 'Uydunun yönünü çeviren jiroskopik çarklardır.',
    details: 'Gövdenin merkezine monte edilmiş 4 adet yüksek hızlı metal tekerlek. Açısal momentum transferiyle uydunun yönünü hassasça çevirir.',
    position: [0, -0.65, 0],
    size: [0.65, 0.25, 0.65],
    color: '#ec4899'
  }
];

// Görev Eşleştirme Etkinliği için Kart Verileri
export interface MatchingPair {
  id: string;
  subsystemName: string;
  subsystemId: string;
  icon: string;
  taskDescription: string;
  explanation: string;
}

export const MATCHING_PAIRS: MatchingPair[] = [
  {
    id: 'pair-1',
    subsystemName: 'Güneş Panelleri',
    subsystemId: 'SOLAR_ARRAYS',
    icon: 'Sun',
    taskDescription: 'Uzayda güneş ışığını toplayarak uydunun çalışması için gereken elektrik enerjisini üretir.',
    explanation: 'Doğru! Üç eklemeli güneş hücreleri uzaydaki güneş ışığını doğrudan elektrik enerjisine çevirir.'
  },
  {
    id: 'pair-2',
    subsystemName: 'Optik Kamera (OPMER)',
    subsystemId: 'ELECTRO_OPTICAL_CAMERA',
    icon: 'Camera',
    taskDescription: '680 km yukarıdan yeryüzünün 0,99 metre detayında yüksek çözünürlüklü fotoğraflarını çeker.',
    explanation: 'Harika! İMECE\'nin yerli kamerası Türkiye\'nin ve dünyanın her yerinden metre-altı ayrıntılı görüntüler alır.'
  },
  {
    id: 'pair-3',
    subsystemName: 'X-Bant Çanak Anten',
    subsystemId: 'COMMUNICATION_SYSTEM',
    icon: 'Radio',
    taskDescription: 'Çekilen devasa boyutlu uydu görüntülerini 320 Mbps hızla yeryüzündeki yer istasyonuna indirir.',
    explanation: 'Tebrikler! 2 eksenli yönlendirilebilir X-Bant çanak anten görüntü verisini yer istasyonuna ışık hızında telsiz sinyalleriyle yollar.'
  },
  {
    id: 'pair-4',
    subsystemName: 'Tepki Tekerlekleri (AOKS)',
    subsystemId: 'ADCS_SYSTEM',
    icon: 'Compass',
    taskDescription: 'İçindeki tekerlekleri döndürerek uydunun burnunu Dünya üzerindeki hedef şehre doğru çevirir.',
    explanation: 'Çok iyi! Açısal momentumun korunumu yasası sayesinde uydu, yakıt harcamadan hedefe kilitlenir.'
  },
  {
    id: 'pair-5',
    subsystemName: 'Lityum-İyon Bataryalar',
    subsystemId: 'BUS_SYSTEM',
    icon: 'Battery',
    taskDescription: 'Uydu Dünya\'nın gölgesine (gece tarafına) geçtiğinde uydunun enerjisiz kalmasını önler.',
    explanation: 'Süper! Güneş ışığı kesildiğinde bataryalar devreye girerek uydunun bilgisayarlarını ve kameralarını besler.'
  },
  {
    id: 'pair-6',
    subsystemName: 'Yerli İtki Motoru',
    subsystemId: 'PROPULSION_SYSTEM',
    icon: 'Flame',
    taskDescription: 'Küçük gaz itişleri yaparak uydunun 680 km irtifadaki yörüngesinde kalmasını sağlar.',
    explanation: 'Kusursuz! İtki sistemi uydunun irtifasını korur ve olası uzay çöpleriyle çarpışmasını önler.'
  }
];

// Uydu Görevini Tamamla Adımları
export const SATELLITE_MISSION_STEPS = [
  {
    id: 1,
    title: '1. Aşama: Enerji Sistemini Etkinleştir',
    instruction: 'Güneş panellerinin Güneş ışığına dik açıyla baktığını ve elektrik üretiminin yeterli olduğunu doğrula.',
    concept: 'Uydu göreve başlamadan önce bataryalarının dolu olduğundan ve panellerin en az 1000 Watt enerji ürettiğinden emin olunmalıdır.',
    actionLabel: 'Güneş Takip Motorunu (SADM) Güneş\'e Kilitle ☀️',
    successMsg: 'Harika! Güneş panelleri Güneş\'e hizalandı ve 1200 W tam güç üretimi başladı!'
  },
  {
    id: 2,
    title: '2. Aşama: Yönelim Manevrası Yap (Hedefe Yönel)',
    instruction: 'Tepki tekerleklerini çalıştırarak optik kameranın burnunu Türkiye (Van Gölü / Ankara) hedef bölgesine çevir.',
    concept: 'AOKS sistemi, yıldız izlerlerden gelen koordinatlarla tepki tekerleklerine hız vererek uydunun yönünü 0.05 derece hassasiyetle çevirir.',
    actionLabel: 'Tepki Tekerleklerini Çalıştır ve Hedefe Kilitlen 🎯',
    successMsg: 'Manevra tamamlandı! İMECE elektro-optik kamerası tam olarak hedef bölgeye kilitlendi!'
  },
  {
    id: 3,
    title: '3. Aşama: Metre-Altı Görüntüyü Yakala',
    instruction: 'Deklanşöre basarak 680 km irtifadan 0,99 metre pankromatik yüksek çözünürlüklü uydu görüntüsünü çek.',
    concept: 'Kamera süpürge tarama (pushbroom) yöntemiyle yeryüzünden yansıyan güneş ışıklarını Zerodur aynalarla optik sensör dizinine odaklar.',
    actionLabel: 'Kamera Deklanşörüne Bas (Fotoğrafı Çek) 📸',
    successMsg: 'Görüntü başarıyla yakalandı! 0,99 metre çözünürlüklü ham görüntü Katı Hal Kayıt Birimine (SSMM) kaydedildi.'
  },
  {
    id: 4,
    title: '4. Aşama: Görüntüyü Yer İstasyonuna İndir',
    instruction: 'X-Bant antenini Ankara TÜBİTAK UZAY Yer İstasyonu\'na yönlendir ve yüksek hızlı veri aktarımını (downlink) başlat.',
    concept: 'Görüntü verisi mikrodalga radyo dalgalarına dönüştürülür ve 320 Mbps bant genişliği ile yer istasyonuna indirilir.',
    actionLabel: 'X-Bant Anteni ile İndirmeyi Başlat (Downlink) 📡',
    successMsg: 'Tebrikler! 320 Mbps hızla veri aktarımı tamamlandı. Görüntü yer istasyonunda işlendi!'
  }
];
