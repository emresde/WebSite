// Ozgecmis sayfasinin icerigi (TR + EN). PDF'leri guncellediginde burayi da guncelle.
import type { Lang } from './i18n';

export interface CvJob {
  org: string;
  role: string;
  team: string;
  when: string;
  where: string;
  link?: { label: string; href: string };
  bullets: string[];
}
export interface CvData {
  subtitle: string;
  location: string;
  headings: {
    summary: string; experience: string; projects: string; skills: string;
    education: string; awards: string; languages: string;
  };
  summary: string[];
  experience: CvJob[];
  projects: { name: string; tech: string; text: string }[];
  skills: { group: string; items: string }[];
  education: { school: string; degree: string; when: string }[];
  awards: { title: string; when: string; text: string }[];
  languages: string;
}

const uba = { label: 'uba.ulakbim.gov.tr', href: 'https://uba.ulakbim.gov.tr' };

export const cv: Record<Lang, CvData> = {
  tr: {
    subtitle: 'Computer Engineering | Software & Cloud Infrastructure',
    location: 'Ankara, Türkiye',
    headings: {
      summary: 'Profesyonel Özet', experience: 'İş Deneyimi', projects: 'Teknik Projeler',
      skills: 'Teknik Yetkinlikler', education: 'Eğitim', awards: 'Ödüller ve Başarılar', languages: 'Diller',
    },
    summary: [
      'Orta Doğu Teknik Üniversitesi Bilgisayar Mühendisliği öğrencisiyim. Software Development, Cloud Infrastructure ve Distributed Storage alanlarında uygulamalı deneyime sahibim.',
      'TÜBİTAK ULAKBİM bünyesinde Cloud servislerinin deployment süreçleri, altyapı operasyonları ve monitoring çalışmalarında görev alıyorum. Linux, OpenStack, Ceph, Python, Java ve C++ teknolojileriyle çalışma deneyimine sahibim.',
    ],
    experience: [
      {
        org: 'TÜBİTAK ULAKBİM', role: 'Aday Araştırmacı',
        team: 'Üniversite Bilişim Altyapıları (UBA) – Cloud Ekibi',
        when: 'Ocak 2026 – Hâlen', where: 'Ankara', link: uba,
        bullets: [
          'UBA kapsamında açık kaynak Cloud servislerinin deployment, yapılandırma ve operasyon süreçlerinde görev alıyor; fiziksel sunucu altyapısının yönetimi, bakımı ve troubleshooting çalışmalarına katkı sağlıyorum.',
          'OpenStack tabanlı IaaS altyapısı ve Ceph Distributed Storage sistemleriyle çalışıyor; RADOSGW üzerinden sunulan S3-compatible Object Storage servislerinin operasyonel süreçlerinde yer alıyorum.',
          'Grafana ve Prometheus kullanarak storage kapasitesini, tenant bazlı kullanımı ve backup aktivitelerini izleyen monitoring dashboard’ları geliştiriyorum.',
          'Üniversitelerin Veeam Full ve Incremental Backup davranışlarını analiz ederek gereksiz veri transferlerini, storage I/O yükünü ve kapasite tüketimini inceliyorum.',
          'Python ve OpenSearch sorgularıyla operasyonel verileri analiz ederek storage kullanım davranışlarını değerlendiriyorum.',
        ],
      },
      {
        org: 'TÜBİTAK ULAKBİM', role: 'Yazılım Geliştirme Stajyeri',
        team: 'Veritabanı ve Yazılım Geliştirme',
        when: 'Eylül 2025', where: 'Ankara',
        bullets: [
          'Java ve Spring Boot kullanarak akademik yayın verilerinin sorgulanması, işlenmesi ve filtrelenmesi için RESTful API geliştirme çalışmalarında görev aldım.',
          'Veritabanı sorguları, veri işleme ve backend geliştirme süreçlerinde çalıştım.',
        ],
      },
      {
        org: 'Bites Defence', role: 'Yazılım Geliştirme ve Test Stajyeri',
        team: 'Altay Tankı Veri Yönetim Sistemi',
        when: 'Temmuz 2025 – Ağustos 2025', where: 'Ankara',
        bullets: [
          'C++ ve Qt Test kullanarak automated unit test geliştirdim, test senaryoları hazırladım ve yazılım doğrulama ile debugging süreçlerine katkı sağladım.',
        ],
      },
    ],
    projects: [
      { name: 'Ceph Distributed Storage Cluster', tech: 'Ceph, RADOSGW, S3, Linux',
        text: 'Bağımsız olarak kendi Ceph cluster’ımı kurdum. RADOSGW üzerinden S3-compatible Object Storage yapılandırarak bucket ve object işlemlerini test ettim.' },
      { name: 'OpenStack Infrastructure & Automation', tech: 'OpenStack, OpenTofu, Linux',
        text: 'OpenStack üzerinde VM, Network, Subnet, Router, Security Group ve Floating IP yapılandırmaları gerçekleştirdim. OpenTofu kullanarak Infrastructure as Code (IaC) yaklaşımıyla cloud kaynaklarını yönettim.' },
      { name: 'Backend & iOS Application Development', tech: 'Spring Boot, MariaDB, SwiftUI',
        text: 'Java/Spring Boot kullanarak RESTful Task Management API, SwiftUI kullanarak gelir-gider ve bütçe takibi sağlayan bir iOS uygulaması geliştirdim.' },
    ],
    skills: [
      { group: 'Programlama', items: 'Python, Java, C/C++, SQL, JavaScript, Swift' },
      { group: 'Cloud & Infrastructure', items: 'OpenStack, Ceph, RADOSGW, S3, Linux, Docker, OpenTofu' },
      { group: 'Monitoring & Backup', items: 'Grafana, Prometheus, OpenSearch, Veeam' },
      { group: 'Development', items: 'Spring Boot, REST APIs, Qt, Git, MariaDB, MongoDB' },
    ],
    education: [
      { school: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', degree: 'Bilgisayar Mühendisliği, Lisans', when: '2021 – Hâlen' },
    ],
    awards: [
      { title: 'Akbank Case Marathon – Birincilik', when: 'Mart 2025',
        text: 'Finansal okuryazarlığı geliştirmeyi amaçlayan oyunlaştırılmış sanal borsa platformunun tasarımında farklı disiplinlerden oluşan bir ekibe liderlik ettim.' },
    ],
    languages: 'Türkçe (Ana Dil), İngilizce (Profesyonel Çalışma Yetkinliği), Mandarin Çincesi (Temel)',
  },

  en: {
    subtitle: 'Computer Engineering | Software & Cloud Infrastructure',
    location: 'Ankara, Türkiye',
    headings: {
      summary: 'Professional Summary', experience: 'Professional Experience', projects: 'Selected Technical Projects',
      skills: 'Technical Skills', education: 'Education', awards: 'Awards & Achievements', languages: 'Languages',
    },
    summary: [
      'Computer Engineering student at Middle East Technical University with practical experience in software development, cloud infrastructure, and distributed storage systems. Currently contributing to cloud service deployments, infrastructure operations, and monitoring at TÜBİTAK ULAKBİM. Experienced with Linux, OpenStack, Ceph, Python, Java, and C++.',
    ],
    experience: [
      {
        org: 'TÜBİTAK ULAKBİM', role: 'Candidate Researcher',
        team: 'University IT Infrastructures (UBA) – Cloud Team',
        when: 'Jan 2026 – Present', where: 'Ankara', link: uba,
        bullets: [
          'Contribute to the deployment, configuration, and operation of open-source cloud services, including physical server infrastructure, virtualization, and troubleshooting.',
          'Work with OpenStack-based IaaS infrastructure and Ceph distributed storage systems, including RADOSGW and S3-compatible object storage services.',
          'Develop Grafana dashboards using Prometheus metrics to monitor storage capacity, tenant-level utilization, and backup activity.',
          'Analyze Veeam backup patterns to identify inefficient full backup operations, investigate storage I/O load, and evaluate capacity consumption.',
          'Use Python and OpenSearch queries to analyze operational data and storage usage patterns.',
        ],
      },
      {
        org: 'TÜBİTAK ULAKBİM', role: 'Software Development Intern',
        team: 'Database & Software Development',
        when: 'Sep 2025', where: 'Ankara',
        bullets: [
          'Developed RESTful API functionality using Java and Spring Boot for querying, processing, and filtering academic publication datasets.',
          'Worked with database queries and backend application development.',
        ],
      },
      {
        org: 'Bites Defence', role: 'Software Development & Test Intern',
        team: 'Altay Tank Data Management System',
        when: 'Jul 2025 – Aug 2025', where: 'Ankara',
        bullets: [
          'Implemented automated unit tests using C++ and Qt Test, developed test scenarios, and contributed to software verification and debugging processes.',
        ],
      },
    ],
    projects: [
      { name: 'Ceph Distributed Storage Cluster', tech: 'Ceph, RADOSGW, S3, Linux',
        text: 'Independently deployed a Ceph cluster and configured S3-compatible object storage through RADOSGW, testing bucket and object operations.' },
      { name: 'OpenStack Infrastructure & Automation', tech: 'OpenStack, OpenTofu, Linux',
        text: 'Configured virtual machines, networks, routers, security groups, and floating IPs; practiced Infrastructure as Code (IaC) with OpenTofu.' },
      { name: 'Backend & iOS Application Development', tech: 'Spring Boot, MariaDB, SwiftUI',
        text: 'Built a RESTful task management API with Java/Spring Boot and developed an iOS budget tracking application using SwiftUI.' },
    ],
    skills: [
      { group: 'Programming', items: 'Python, Java, C/C++, SQL, JavaScript, Swift' },
      { group: 'Cloud & Infrastructure', items: 'OpenStack, Ceph, RADOSGW, S3, Linux, Docker, OpenTofu' },
      { group: 'Monitoring & Backup', items: 'Grafana, Prometheus, OpenSearch, Veeam' },
      { group: 'Development', items: 'Spring Boot, REST APIs, Qt, Git, MariaDB, MongoDB' },
    ],
    education: [
      { school: 'Middle East Technical University (METU)', degree: 'B.Sc. in Computer Engineering', when: '2021 – Present' },
    ],
    awards: [
      { title: '1st Place – Akbank Case Marathon', when: 'March 2025',
        text: 'Led a multidisciplinary team in designing a gamified virtual stock market platform focused on financial literacy.' },
    ],
    languages: 'Turkish (Native), English (Professional Working Proficiency), Mandarin Chinese (Basic)',
  },
};
