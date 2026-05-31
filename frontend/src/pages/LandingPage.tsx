import { motion, useTransform, useScroll } from 'framer-motion';
import { ContactButton, FadeIn, LiveProjectButton, Magnet, AnimatedText } from '../components/ui';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Price', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
];

const loginPageUrl = '/login';

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
];

const services = [
  {
    number: '01',
    title: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'
  },
  {
    number: '02',
    title: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'
  },
  {
    number: '03',
    title: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'
  },
  {
    number: '04',
    title: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.'
  },
  {
    number: '05',
    title: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'
  }
];

const projects = [
  {
    number: '01',
    title: 'Nextlevel Studio',
    type: 'Client',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
    ]
  },
  {
    number: '02',
    title: 'Aura Brand Identity',
    type: 'Personal',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85'
    ]
  },
  {
    number: '03',
    title: 'Solaris Digital',
    type: 'Client',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
    ]
  }
];

const marqueeClients = [
  'Healthcare',
  'Education',
  'Finance',
  'Enterprise',
  'Retail',
  'Government',
  'Technology',
  'AI & Automation',
  'Marketing',
  'E-Commerce',
  'Logistics',
  'Media',
  'Real Estate',
  'Banking',
  'Startups',
  'SaaS',
  'Cybersecurity',
  'Data Analytics',
  'Cloud Computing',
  'Manufacturing',
  'Hospitality',
  'Travel',
  'Human Resources',
  'Insurance',
  'Telecommunications',
  'Consulting',
  'Legal Services',
  'Entertainment',
  'Gaming',
  'Biotechnology',
  'Consumer Brands'
];

const MarqueeVideoBar = ({ reverse = false, className = '' }: { reverse?: boolean; className?: string }) => {
  const items = Array.from({ length: 4 }).flatMap(() => marqueeClients);

  return (
    <div className={`pointer-events-none w-full overflow-hidden bg-black ${className}`}>
      <div className={`codexa-marquee-track flex h-full w-max items-center ${reverse ? 'codexa-marquee-reverse' : ''}`}>
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="shrink-0 px-9 text-sm font-black uppercase tracking-wide text-[#D8E300] sm:px-12 sm:text-base"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const aboutDecor = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    className: 'absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]'
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    className: 'absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]'
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    className: 'absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]'
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    className: 'absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]'
  }
];

type Project = {
  number: string;
  title: string;
  type: string;
  images: string[];
};

const ProjectCard = ({ project, index, total }: { project: Project; index: number; total: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });
  const scaleTarget = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleTarget]);

  return (
    <motion.div ref={cardRef} style={{ scale }} className="sticky top-24 md:top-32">
      <div
        className="relative rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#0C0C0C]/10 bg-white p-4 sm:p-6 md:p-8"
        style={{ top: `${index * 28}px` }}
      >
        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)]">{project.number}</div>
            <div className="uppercase tracking-widest text-sm text-[#0C0C0C]/70">{project.type}</div>
            <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] text-[#0C0C0C]">{project.title}</h3>
          </div>
          <LiveProjectButton />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-[40%_60%]">
          <div className="space-y-4">
            <img
              src={project.images[0]}
              alt={`${project.title} preview`}
              className="w-full h-[clamp(130px,16vw,230px)] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
              loading="lazy"
            />
            <img
              src={project.images[1]}
              alt={`${project.title} preview`}
              className="w-full h-[clamp(160px,22vw,340px)] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
              loading="lazy"
            />
          </div>
          <img
            src={project.images[2]}
            alt={`${project.title} preview`}
            className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover min-h-[340px]"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    const section = marqueeRef.current;
    if (!section) return;

    const updateTop = () => setSectionTop(section.getBoundingClientRect().top + window.scrollY);
    updateTop();
    window.addEventListener('resize', updateTop, { passive: true });
    return () => window.removeEventListener('resize', updateTop);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setOffset((y - sectionTop + window.innerHeight) * 0.3);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionTop]);

  return (
    <div className="min-h-screen bg-white overflow-x-clip text-[#0C0C0C]">
      <main className="overflow-x-clip">
        <section className="min-h-screen overflow-x-clip relative">
          <FadeIn className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 pb-4 text-sm md:text-lg lg:text-[1.4rem] text-[#151515]/80 uppercase tracking-wider font-medium bg-white/90 backdrop-blur-sm">
            <img src="/codexa-logo.png" alt="CODEXA Logo" className="h-8 md:h-10 lg:h-12 w-auto" />
            <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="transition-opacity duration-200 hover:opacity-70">
                  {link.name}
                </a>
              ))}
              <ContactButton href={loginPageUrl} className="!px-5 !py-2 !text-xs md:!px-6 md:!py-2.5 md:!text-sm" />
            </div>
          </FadeIn>

          <div className="absolute inset-x-0 bottom-0 top-0 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_38%,rgba(125,207,255,0.36),transparent_30%),radial-gradient(circle_at_88%_40%,rgba(91,231,178,0.3),transparent_32%),linear-gradient(180deg,#fff_0%,#f9fdff_45%,#fff_100%)]" />
          </div>

          <div className="absolute inset-x-0 top-16 z-20 sm:top-20 md:top-24">
            <MarqueeVideoBar className="codexa-marquee-slow h-9 sm:h-10 md:h-11" />
          </div>

          <div className="absolute inset-x-0 top-24 sm:top-28 md:top-32 z-10">
            <FadeIn
              delay={0.05}
              className="relative min-h-[320px] w-full overflow-hidden px-6 py-10 text-center text-[#151515] sm:min-h-[360px] sm:px-10 sm:py-12 md:min-h-[400px] md:px-16"
            >
              <div className="relative z-10 mx-auto mt-14 max-w-[680px] sm:mt-16 md:mt-20">
                <h2 className="text-[clamp(1.9rem,4vw,3.8rem)] font-black leading-[1.05] tracking-normal">
                  Where your <span className="text-[#3157FF]">data</span> turns into{' '}
                  <span className="text-[#3157FF]">software</span> with a click
                </h2>
                <p className="mx-auto mt-4 max-w-[420px] text-sm font-medium leading-relaxed text-black/45 sm:text-base">
                  Build custom portals, CRMs, and tools effortlessly. From concept to launch in minutes, not months.
                </p>
                <a
                  href={loginPageUrl}
                  className="mt-6 inline-flex h-11 items-center gap-3 rounded-full bg-[#111] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-black"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <span className="ml-0.5 h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-black" />
                  </span>
                  Login
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center items-center">
            <div className="mt-[30rem] w-full sm:mt-[32rem] md:mt-[38rem] lg:mt-[42rem]">
              <FadeIn delay={0.15} className="overflow-hidden w-full px-6 md:px-10">
                <h1 className="hero-heading mx-auto text-center font-black uppercase tracking-tight leading-none whitespace-nowrap text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
                  CODEXA
                </h1>
              </FadeIn>
            </div>
          </div>
        </section>

        <section ref={marqueeRef} className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden bg-white">
          <div className="space-y-3">
            <div className="flex gap-3 will-change-transform" style={{ transform: `translateX(${offset - 200}px)` }}>
              {Array.from({ length: 3 })
                .flatMap(() => marqueeImages.slice(0, 11))
                .map((src, idx) => (
                  <img
                    key={`row1-${idx}-${src}`}
                    src={src}
                    width={420}
                    height={270}
                    alt="Marquee preview"
                    className="w-[420px] h-[270px] rounded-2xl object-cover"
                    loading="lazy"
                  />
                ))}
            </div>
            <div className="flex gap-3 will-change-transform" style={{ transform: `translateX(-${offset - 200}px)` }}>
              {Array.from({ length: 3 })
                .flatMap(() => marqueeImages.slice(11))
                .map((src, idx) => (
                  <img
                    key={`row2-${idx}-${src}`}
                    src={src}
                    width={420}
                    height={270}
                    alt="Marquee preview"
                    className="w-[420px] h-[270px] rounded-2xl object-cover"
                    loading="lazy"
                  />
                ))}
            </div>
          </div>
        </section>

        <section id="about" className="relative min-h-screen bg-white px-5 sm:px-8 md:px-10 py-20">
          {aboutDecor.map((item, index) => (
            <FadeIn
              key={item.src}
              delay={0.1 + index * 0.05}
              x={index % 2 === 0 ? -80 : 80}
              y={0}
              duration={0.9}
              className={item.className}
            >
              <img src={item.src} alt="Decorative 3D" className="w-full h-auto object-contain" loading="lazy" />
            </FadeIn>
          ))}

          <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center relative z-10">
            <FadeIn delay={0} y={40} className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)]">
              About me
            </FadeIn>
            <div className="max-w-[560px]">
              <AnimatedText
                text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
                className="block font-medium leading-relaxed text-[#0C0C0C]/80 text-[clamp(1rem,2vw,1.35rem)] max-w-[560px] mx-auto"
              />
            </div>
            <div className="pt-6">
              <ContactButton />
            </div>
          </div>
        </section>

        <section
          id="services"
          className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 text-[#0C0C0C]"
        >
          <div className="flex flex-col items-center">
            <h2 className="font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28">
              Services
            </h2>
            <div className="w-full max-w-5xl space-y-0">
              {services.map((service, index) => (
                <FadeIn
                  key={service.number}
                  delay={index * 0.1}
                  className="border-t border-[rgba(12,12,12,0.15)] first:border-t-0 py-8 sm:py-10 md:py-12"
                >
                  <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                    <div className="flex-shrink-0 font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)]">
                      {service.number}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)]">
                        {service.title}
                      </h3>
                      <p className="font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28"
        >
          <div className="flex flex-col items-center gap-14">
            <h2 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)] text-center">
              Project
            </h2>
            <div className="w-full max-w-6xl space-y-16">
              {projects.map((project, index) => (
                <ProjectCard key={project.number} project={project} index={index} total={projects.length} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white px-5 sm:px-8 md:px-10 pb-20 pt-16 text-center">
          <div className="mx-auto max-w-2xl text-[#0C0C0C]">
            <h3 className="font-black uppercase text-[clamp(2rem,8vw,4rem)] mb-6">Let's create something together</h3>
            <p className="font-light text-[clamp(0.95rem,1.5vw,1.2rem)] leading-relaxed opacity-70">
              If you're ready to make a memorable 3D experience, reach out and let's talk about your next project.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <ContactButton />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
