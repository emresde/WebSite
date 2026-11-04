// Sitedeki butun metinler ve kisisel bilgiler burada.
// Bir seyi degistirmek icin sadece bu dosyayi duzenlemek yeterli.

export type Lang = 'tr' | 'en';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Base path'i (ör. /WebSite) ekleyerek site ici link uretir. */
export function url(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}

/** Her dilde ayni sayfanin adresi. Dil degistirme dugmesi bunu kullanir. */
export const routes = {
  home: { tr: '/', en: '/en/' },
  blog: { tr: '/blog/', en: '/en/blog/' },
  cv: { tr: '/ozgecmis/', en: '/en/cv/' },
  contact: { tr: '/iletisim/', en: '/en/contact/' },
} as const;
export type RouteKey = keyof typeof routes;

export const profile = {
  name: 'Emre Döşlü',
  email: 'emre.doslu@metu.edu.tr',
  social: [
    { key: 'github', label: 'GitHub', href: 'https://github.com/emresde' },
    { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/emre-d%C3%B6%C5%9Fl%C3%BC-6240a2221/' },
    { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/emresdee/' },
    { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@emresdee' },
  ],
  contactApi: {
    local: 'http://127.0.0.1:3000',
    prod: 'https://website-22dl.onrender.com',
  },
};

export const t = {
  tr: {
    nav: { blog: 'Blog', projects: 'Projeler', cv: 'Özgeçmiş', contact: 'İletişim' },
    langSwitch: 'English',
    themeToggle: 'Temayı değiştir',
    skip: 'İçeriğe geç',
    hero: {
      greeting: 'Merhaba, ben',
      role: 'Software & Cloud Infrastructure',
      bio: 'ODTÜ Bilgisayar Mühendisliği öğrencisiyim. TÜBİTAK ULAKBİM\'de Cloud ekibinde aday araştırmacı olarak UBA projesi kapsamında çalışıyorum. OpenStack, Ceph ve S3 object storage gibi açık kaynak teknolojilerle cloud hizmeti veriyoruz; bu süreçte sistem yöneticiliği tarafında tecrübe kazanırken yazılım geliştirme süreçlerinde de yer alıyorum. Burada denediklerimi, öğrendiklerimi ve projelerimi paylaşıyorum.',
      ctaBlog: 'Yazıları oku',
      ctaCv: 'Özgeçmiş',
    },
    sections: {
      now: 'Şu an',
      experience: 'Deneyim',
      projects: 'Projeler',
      awards: 'Ödüller',
      skills: 'Beceriler',
      latest: 'Son yazılar',
      allPosts: 'Tüm yazılar',
    },
    experience: [
      {
        when: 'Oca 2026 – Günümüz',
        title: 'Aday Araştırmacı, Cloud Ekibi',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Cloud ekibi olarak açık kaynak yazılımlarla üniversitelere cloud hizmetleri sunuyoruz; security tarafı da işimizin bir parçası. Ekip olarak uba.ulakbim.gov.tr altındaki projelerin yürütücülüğünü yapıyoruz; ben de UBA projesi kapsamında geliştirme ve operasyon süreçlerini yönetiyorum. Günlük işim OpenStack (IaaS), Ceph ve RADOSGW üzerinden sunulan S3 object storage servislerinin takibi, monitoring\'i (Grafana, Prometheus) ve kullanıcılara teknik destek. Bunun yanında devam eden yazılım projelerine junior olarak küçük katkılar veriyor, karşılaştığımız sorunlar üzerine araştırma yapıp çözüm önerileri sunuyorum.',
        link: { label: 'uba.ulakbim.gov.tr', href: 'https://uba.ulakbim.gov.tr' },
      },
      {
        when: 'Eyl 2025',
        title: 'Yazılım Geliştirme Stajyeri',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Java ve Spring Boot ile akademik yayın verilerini sorgulayan, işleyen ve filtreleyen bir REST API geliştirdim.',
      },
      {
        when: 'Tem – Ağu 2025',
        title: 'Yazılım Geliştirme ve Test Stajyeri',
        org: 'Bites Savunma',
        text: 'Altay tankı data management sistemi için C++ ve Qt Test ile otomatik unit test\'ler yazdım; test senaryoları hazırlayıp verification ve debugging süreçlerine katkı sağladım.',
      },
      {
        when: '2021 – Günümüz',
        title: 'Bilgisayar Mühendisliği (Lisans)',
        org: 'Orta Doğu Teknik Üniversitesi',
        text: 'Systems programming, operating systems, computer networks ve deep learning ağırlıklı.',
      },
    ],
    projects: [
      {
        name: 'CebimCepte',
        tag: 'iOS · SwiftUI',
        text: 'SwiftUI ile geliştirdiğim kişisel bütçe uygulaması: gelir, gider, birikim ve abonelik takibi. Veriler cihazda kalır; hesap gerektirmez.',
        link: { label: 'Gizlilik politikası', href: '/cebimcepte-privacy.html' },
      },
      {
        name: 'Ceph failure domain deneyleri',
        tag: 'Ceph · OpenStack',
        text: '18 VM\'lik bir Ceph lab\'ında host → rack failure domain geçişinde data movement\'ı, client IO\'ya etkisini ve mClock ile backfill/recovery hızının nasıl sınırlanabildiğini ölçtüm.',
        link: { label: 'Blog yazısını oku', href: '/blog/ceph-failure-domain-gecisi/' },
      },
      {
        name: 'OpenStack altyapı otomasyonu',
        tag: 'OpenStack · OpenTofu',
        text: 'OpenStack üzerinde VM, network, router, security group ve floating IP yapılandırmalarını OpenTofu ile IaC olarak yönettim.',
        link: null,
      },
    ],
    awards: [
      { when: 'Mart 2025', text: 'Birincilik — Akbank Case Marathon. Finansal okuryazarlığa odaklanan oyunlaştırılmış bir sanal borsa platformunun tasarımında çok disiplinli ekibe liderlik ettim.' },
    ],
    skills: ['Linux', 'OpenStack', 'Ceph / RADOSGW', 'S3', 'Docker', 'OpenTofu', 'Grafana', 'Prometheus', 'OpenSearch', 'Python', 'Java / Spring Boot', 'C / C++', 'Swift / SwiftUI', 'SQL', 'Git'],
    blog: {
      title: 'Blog',
      intro: 'Cloud altyapısı, storage ve yazılım üzerine notlar ve deneyler.',
      empty: 'Henüz yayınlanmış yazı yok. Yakında!',
      readMore: 'Devamını oku',
      back: '← Tüm yazılar',
      minRead: 'dk okuma',
    },
    cv: {
      title: 'Özgeçmiş',
      intro: 'Güncel özgeçmişimi buradan görüntüleyebilir ya da indirebilirsin.',
      viewTr: 'Türkçe',
      viewEn: 'English',
      download: 'PDF indir',
    },
    contact: {
      title: 'İletişim',
      intro: 'Bir sorun, iş birliği fikrin ya da sadece merhaba demek istersen formu kullanabilir veya e-posta atabilirsin.',
      emailLabel: 'E-posta',
      name: 'Ad Soyad',
      email: 'E-posta (isteğe bağlı)',
      subject: 'Konu',
      message: 'Mesaj',
      send: 'Gönder',
      sending: 'Gönderiliyor…',
      errName: 'Ad Soyad zorunludur.',
      errEmail: 'Geçerli bir e-posta adresi girin.',
      errSubject: 'Konu zorunludur.',
      errMessage: 'Mesaj zorunludur.',
      fillRequired: 'Lütfen zorunlu alanları doldurun.',
      fixFields: 'Lütfen hatalı alanları düzeltin.',
      ok: 'Teşekkürler, mesajın alındı.',
      fail: 'Gönderilemedi. Lütfen daha sonra tekrar deneyin.',
      unreachable: 'Sunucuya ulaşılamadı. Biraz sonra tekrar dene ya da e-posta gönder.',
    },
    notFound: { title: 'Sayfa bulunamadı', text: 'Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.', home: 'Ana sayfaya dön' },
    footer: { privacy: 'CebimCepte Gizlilik Politikası', built: 'Astro ile yapıldı' },
    dateLocale: 'tr-TR',
  },
  en: {
    nav: { blog: 'Blog', projects: 'Projects', cv: 'CV', contact: 'Contact' },
    langSwitch: 'Türkçe',
    themeToggle: 'Toggle theme',
    skip: 'Skip to content',
    hero: {
      greeting: "Hi, I'm",
      role: 'Software & Cloud Infrastructure',
      bio: "I'm a Computer Engineering student at METU (Middle East Technical University) and a candidate researcher on the Cloud team at TÜBİTAK ULAKBİM, working on the UBA project. We provide cloud services with open-source technologies like OpenStack, Ceph and S3 object storage; along the way I'm gaining system administration experience and taking part in software development work too. Here I share my experiments, what I learn and my projects.",
      ctaBlog: 'Read the blog',
      ctaCv: 'View CV',
    },
    sections: {
      now: 'Now',
      experience: 'Experience',
      projects: 'Projects',
      awards: 'Awards',
      skills: 'Skills',
      latest: 'Latest posts',
      allPosts: 'All posts',
    },
    experience: [
      {
        when: 'Jan 2026 – Present',
        title: 'Candidate Researcher, Cloud Team',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Our Cloud team provides cloud services to universities using open-source software, with security as part of the job. The team runs the projects under uba.ulakbim.gov.tr, and I manage development and operations for the UBA project. Day to day I monitor and look after OpenStack (IaaS), Ceph and S3 object storage via RADOSGW (Grafana, Prometheus) and provide technical support to users. I also make small contributions to ongoing software projects as a junior and research the problems we run into to propose solutions.',
        link: { label: 'uba.ulakbim.gov.tr', href: 'https://uba.ulakbim.gov.tr' },
      },
      {
        when: 'Sep 2025',
        title: 'Software Development Intern',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Developed RESTful API functionality with Java and Spring Boot for querying, processing and filtering academic publication datasets.',
      },
      {
        when: 'Jul – Aug 2025',
        title: 'Software Development & Test Intern',
        org: 'Bites Defence',
        text: 'Implemented automated unit tests with C++ and Qt Test for the Altay tank data management system; developed test scenarios and contributed to verification and debugging.',
      },
      {
        when: '2021 – Present',
        title: 'B.Sc. in Computer Engineering',
        org: 'Middle East Technical University',
        text: 'Focus on systems programming, operating systems, computer networks and deep learning.',
      },
    ],
    projects: [
      {
        name: 'CebimCepte',
        tag: 'iOS · SwiftUI',
        text: 'A personal budgeting app built with SwiftUI: income, expenses, savings and subscriptions. Data stays on the device; no account required.',
        link: { label: 'Privacy policy', href: '/cebimcepte-privacy.html' },
      },
      {
        name: 'Ceph failure-domain experiments',
        tag: 'Ceph · OpenStack',
        text: 'In an 18-VM Ceph lab, I measured data movement, client IO impact and how mClock can throttle backfill/recovery when switching the failure domain from host to rack.',
        link: { label: 'Read the post (Turkish)', href: '/blog/ceph-failure-domain-gecisi/' },
      },
      {
        name: 'OpenStack infrastructure automation',
        tag: 'OpenStack · OpenTofu',
        text: 'Configured VMs, networks, routers, security groups and floating IPs on OpenStack and managed them as code (IaC) with OpenTofu.',
        link: null,
      },
    ],
    awards: [
      { when: 'March 2025', text: 'First Place — Akbank Case Marathon. Led a multidisciplinary team designing a gamified virtual stock market platform focused on financial literacy.' },
    ],
    skills: ['Linux', 'OpenStack', 'Ceph / RADOSGW', 'S3', 'Docker', 'OpenTofu', 'Grafana', 'Prometheus', 'OpenSearch', 'Python', 'Java / Spring Boot', 'C / C++', 'Swift / SwiftUI', 'SQL', 'Git'],
    blog: {
      title: 'Blog',
      intro: 'Notes and experiments on cloud infrastructure, storage and software.',
      empty: 'No posts yet. Coming soon!',
      readMore: 'Read more',
      back: '← All posts',
      minRead: 'min read',
    },
    cv: {
      title: 'CV',
      intro: 'View or download my latest CV.',
      viewTr: 'Türkçe',
      viewEn: 'English',
      download: 'Download PDF',
    },
    contact: {
      title: 'Contact',
      intro: 'Have a question, an idea to collaborate on, or just want to say hi? Use the form or send me an email.',
      emailLabel: 'Email',
      name: 'Full name',
      email: 'Email (optional)',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending…',
      errName: 'Full name is required.',
      errEmail: 'Please enter a valid email address.',
      errSubject: 'Subject is required.',
      errMessage: 'Message is required.',
      fillRequired: 'Please fill in the required fields.',
      fixFields: 'Please fix the highlighted fields.',
      ok: 'Thanks, your message has been received.',
      fail: 'Could not send. Please try again later.',
      unreachable: 'Could not reach the server. Try again shortly or send an email.',
    },
    notFound: { title: 'Page not found', text: 'The page you are looking for may have moved or never existed.', home: 'Back to home' },
    footer: { privacy: 'CebimCepte Privacy Policy', built: 'Built with Astro' },
    dateLocale: 'en-GB',
  },
} as const;

export function formatDate(d: Date, lang: Lang): string {
  return d.toLocaleDateString(t[lang].dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
