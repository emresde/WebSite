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
      role: 'Bilgisayar mühendisliği öğrencisi · Bulut altyapısı',
      bio: 'ODTÜ Bilgisayar Mühendisliği son sınıf öğrencisiyim. TÜBİTAK ULAKBİM bulut ekibinde aday araştırmacı olarak dağıtık depolama ve bulut altyapısı üzerine çalışıyorum. Burada denediklerimi, öğrendiklerimi ve projelerimi paylaşıyorum.',
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
        when: '2026 – Günümüz',
        title: 'Aday Araştırmacı, Bulut Ekibi',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Ceph tabanlı dağıtık depolama ve OpenStack üzerinde çalışıyorum; test ortamları kurup operasyonel değişiklikleri öncesinde deneylerle ölçüyorum.',
      },
      {
        when: 'Tem – Ağu 2025',
        title: 'Yazılım Geliştirme ve Test Mühendisliği Stajyeri',
        org: 'Bites Savunma',
        text: 'Altay tankının veri yönetim sistemi için Qt ile birim testleri geliştirdim; test senaryoları oluşturup hata ayıklama çalışmalarına katkı sağladım.',
      },
      {
        when: '2021 – Günümüz',
        title: 'Bilgisayar Mühendisliği (Lisans)',
        org: 'Orta Doğu Teknik Üniversitesi',
        text: 'Sistem programlama, işletim sistemleri, bilgisayar ağları ve derin öğrenme ağırlıklı.',
      },
    ],
    projects: [
      {
        name: 'CebimCepte',
        tag: 'iOS · SwiftUI',
        text: 'Gelir, gider, birikim ve abonelikleri takip eden kişisel bütçe uygulaması. Veriler cihazda kalır; hesap gerektirmez.',
        link: { label: 'Gizlilik politikası', href: '/cebimcepte-privacy.html' },
      },
      {
        name: 'Ceph failure domain deneyleri',
        tag: 'Ceph · OpenStack',
        text: '18 VM\'lik bir Ceph lab\'ında host → rack geçişinin veri hareketini, istemci etkisini ve mClock ile taşıma hızının kontrolünü ölçtüm.',
        link: { label: 'Blog yazısı yakında', href: '' },
      },
      {
        name: 'Sanal borsa platformu',
        tag: 'Ürün tasarımı · UI',
        text: 'Finansal okuryazarlığı artırmak için oyunlaştırılmış bir sanal borsa. Akbank Case Marathon\'da birincilik aldı.',
        link: null,
      },
    ],
    awards: [
      { when: 'Mart 2025', text: 'Birincilik — Akbank Case Marathon (Akbank & Hacettepe Üniversitesi AI Topluluğu)' },
    ],
    skills: ['Linux', 'Ceph', 'OpenStack', 'Python', 'C / C++', 'Swift / SwiftUI', 'Bash', 'Git', 'LaTeX'],
    blog: {
      title: 'Blog',
      intro: 'Bulut altyapısı, depolama ve yazılım üzerine notlar ve deneyler.',
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
      role: 'Computer engineering student · Cloud infrastructure',
      bio: "I'm a final-year Computer Engineering student at METU (Middle East Technical University). As a candidate researcher on the cloud team at TÜBİTAK ULAKBİM, I work on distributed storage and cloud infrastructure. Here I share my experiments, what I learn and my projects.",
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
        when: '2026 – Present',
        title: 'Candidate Researcher, Cloud Team',
        org: 'TÜBİTAK ULAKBİM',
        text: 'Working on Ceph-based distributed storage and OpenStack; building test environments and measuring operational changes with experiments before they reach production.',
      },
      {
        when: 'Jul – Aug 2025',
        title: 'Software Development & Test Engineering Intern',
        org: 'Bites Defence',
        text: 'Developed unit tests with Qt for the data management system of the Altay tank; created test scenarios and contributed to debugging.',
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
        text: 'A personal budgeting app for income, expenses, savings and subscriptions. Data stays on the device; no account required.',
        link: { label: 'Privacy policy', href: '/cebimcepte-privacy.html' },
      },
      {
        name: 'Ceph failure-domain experiments',
        tag: 'Ceph · OpenStack',
        text: 'In an 18-VM Ceph lab, I measured data movement, client impact and how mClock can throttle rebalancing when switching from host- to rack-level failure domains.',
        link: { label: 'Blog post coming soon', href: '' },
      },
      {
        name: 'Virtual stock exchange',
        tag: 'Product design · UI',
        text: 'A gamified virtual exchange to improve financial literacy. Won first place at the Akbank Case Marathon.',
        link: null,
      },
    ],
    awards: [
      { when: 'March 2025', text: 'First Place — Akbank Case Marathon (Akbank & Hacettepe University AI Society)' },
    ],
    skills: ['Linux', 'Ceph', 'OpenStack', 'Python', 'C / C++', 'Swift / SwiftUI', 'Bash', 'Git', 'LaTeX'],
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
