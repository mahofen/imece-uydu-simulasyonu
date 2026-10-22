import { OrbitPresetData, OrbitPresetId, GlossaryTerm } from '../types/simulation';

export const ORBIT_PRESETS: Record<OrbitPresetId, OrbitPresetData> = {
  LEO_ISS: {
    id: 'LEO_ISS',
    name: 'Alçak Yörünge (LEO - ISS)',
    subtitle: 'Uluslararası Uzay İstasyonu & Hubble',
    altitudeKm: 400,
    radiusUnits: 14.88,
    velocityKmh: 27600,
    periodMinutes: 92.5,
    inclinationDeg: 51.6,
    speedMultiplier: 1.08,
    description: 'Atmosferin hemen üzerindeki en alçak kararlı yörünge. Dünya etrafında günde ~16 tur atar.',
    keplerNote: 'Dünya merkezine yakın olduğu için yerçekimi kuvveti çok yüksektir. Uydunun düşmemesi için saniyede 7.67 km hızla yol alması gerekir.'
  },
  IMECE_SSO: {
    id: 'IMECE_SSO',
    name: 'Güneş Eşzamanlı Yörünge (SSO - İMECE)',
    subtitle: 'Türkiye’nin Metre-Altı Gözlem Yörüngesi',
    altitudeKm: 680,
    radiusUnits: 15.5,
    velocityKmh: 26900,
    periodMinutes: 98.4,
    inclinationDeg: 98.2,
    speedMultiplier: 1.0,
    description: 'Kutba yakın Güneş eşzamanlı yörünge. Hedef bölgelerden her gün aynı güneş açısında geçer, böylece gölgeler değişmez.',
    keplerNote: 'İMECE 680 km irtifada saniyede 7.47 km hızla ilerler. 98.4 dakikada bir kutuptan kutba Dünya turu tamamlar.'
  },
  MEO_GPS: {
    id: 'MEO_GPS',
    name: 'Orta Dünya Yörüngesi (MEO - GPS)',
    subtitle: 'Küresel Konumlandırma & Navigasyon',
    altitudeKm: 20200,
    radiusUnits: 20.2,
    velocityKmh: 13900,
    periodMinutes: 720,
    inclinationDeg: 55.0,
    speedMultiplier: 0.52,
    description: 'Dünya ile uzayın derinlikleri arasında yer alır. Telefonlarımızın konum bulduğu navigasyon uyduları bu kuşaktadır.',
    keplerNote: 'İrtifa arttıkça yerçekimi ivmesi zayıflar. Uydu daha düşük hızla (3.87 km/s) düşmeden yörüngesini koruyabilir.'
  },
  GEO_TURKSAT: {
    id: 'GEO_TURKSAT',
    name: 'Jeosenkron Yörünge (GEO - TÜRKSAT 6A)',
    subtitle: 'Haberleşme, TV Yayını ve İnternet',
    altitudeKm: 35786,
    radiusUnits: 26.5,
    velocityKmh: 11050,
    periodMinutes: 1436,
    inclinationDeg: 0.0,
    speedMultiplier: 0.25,
    description: 'Ekvator üzerinde yer alır. Uydunun dönüş periyodu Dünya’nın dönüşüyle (24 saat) birebir aynıdır; gökyüzünde sabit asılı görünür.',
    keplerNote: 'Kepler 3. Yasası gereği 35.786 km yükseklikte uydunun periyodu tam 23 saat 56 dakikaya eşitlenir. Çanak antenlerimiz hep sabit yöne bakar.'
  }
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Nadir (Yere Bakış)',
    pronunciation: 'na-dir',
    category: 'Yörünge',
    definition: 'Uydunun bulunduğu noktadan Dünya’nın merkezine doğru doğrudan aşağıya bakan doğrultudur. Gözlem uydularının kameraları normalde nadir yönüne kilitlidir.',
    kidsAnalog: 'Uçaktan tam olarak ayaklarınızın altına, yere doğru dik bakmak gibidir.'
  },
  {
    term: 'GSD (Yer Örnekleme Mesafesi)',
    pronunciation: 'Ground Sample Distance',
    category: 'Optik',
    definition: 'Uydunun çektiği fotoğraftaki 1 pikselin yeryüzünde karşılık geldiği gerçek alanın kenar uzunluğudur. İMECE için GSD 0,99 metredir.',
    kidsAnalog: '0,99 metre GSD demek; uydunun uzaydan yerdeki bir otomobili, bahçe çitini veya yol çizgisini ayrıntısıyla ayırt edebilmesi demektir.'
  },
  {
    term: 'Güneş Eşzamanlı Yörünge (SSO)',
    pronunciation: 'Sun-Synchronous Orbit',
    category: 'Yörünge',
    definition: 'Uydunun Dünya çevresindeki yörünge düzleminin, Dünya’nın Güneş etrafındaki hareketiyle aynı hızda (günde ~0.9856°) dönerek güneş ışığı açısını yıl boyunca sabit tuttuğu kutupsal yörüngedir.',
    kidsAnalog: 'Fotoğraf çekerken güneşin hep aynı açıdan aydınlatması gibidir; dün ve bugün çekilen fotoğraflarda gölgeler birebir örtüşür.'
  },
  {
    term: 'Tepki Tekerleği (Reaction Wheel)',
    pronunciation: 'AOKS Bileşeni',
    category: 'Aviyonik',
    definition: 'Uydunun içinde yüksek devirde dönen elektrikli volan tekerlekleridir. Açısal momentumun korunumu ilkesiyle uydunun gövdesini istenen yöne roket yakıtı harcamadan çevirir.',
    kidsAnalog: 'Dönen bir ofis koltuğunda otururken elinizdeki ağır bir tekerleği yana çevirdiğinizde vücudunuzun aksi yöne dönmesi prensibidir.'
  },
  {
    term: 'Aviyonik (Uçuş Elektroniği)',
    pronunciation: 'Aviation Electronics',
    category: 'Aviyonik',
    definition: 'Uydunun uçuş bilgisayarı (OBC), güç dağıtım birimi (PDU), yönelim sensörleri ve veri depolama birimlerini içeren beynidir.',
    kidsAnalog: 'İnsan vücudunun beyin ve sinir sistemine benzer; tüm kararları alır ve organları yönetir.'
  },
  {
    term: 'MLI (Çok Katmanlı Yalıtım)',
    pronunciation: 'Multi-Layer Insulation',
    category: 'Güç',
    definition: 'Uydunun dışındaki sarı/altın renkli vakumlu uzay örtüsüdür. Güneş ışığında +120°C’ye çıkan, gölgede -80°C’ye düşen uzay boşluğundaki aşırı radyasyon ısısını yansıtır.',
    kidsAnalog: 'Dağcıların ve astronotların giydiği acil durum parlak termal kurtarma battaniyesinin uzay sınıfı hâlidir.'
  },
  {
    term: 'Telemetri (TM / TC)',
    pronunciation: 'Uzaktan Ölçüm ve Komuta',
    category: 'Haberleşme',
    definition: 'Uydunun batarya voltajı, sıcaklık ve hız gibi sağlık verilerini Dünya’ya bildirmesi (Telemetri) ve yer istasyonundan uyduya görev talimatları gönderilmesidir (Telekomut).',
    kidsAnalog: 'Uydunun yerdeki mühendislerle mesajlaşması ve durum raporu vermesidir.'
  },
  {
    term: 'Elektrikli İtki (Hall İticisi)',
    pronunciation: 'İyon Motoru',
    category: 'Güç',
    definition: 'Ksenon gazı iyonlarını elektrik alanı ile saniyede onlarca kilometre hızla dışarı püskürterek çok yüksek verimli itme sağlayan yerli itki sistemidir.',
    kidsAnalog: 'Normal kimyasal havai fişek roketi yerine, çok az gazı elektrikle hızlandırıp aylarca tasarruflu çalışan yüksek teknolojili fütüristik motor.'
  }
];
