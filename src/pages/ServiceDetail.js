import React from 'react';
import ClientFeedback from '../components/ClientFeedback';

const SERVICE_CONTENT = {
  'branding': {
    title: 'Branding & Identity',
    heroTag: 'Services',
    subTitle: 'Build a brand that people remember',
    description: 'From strategy to visual systems, we craft distinctive identities that communicate who you are and why you matter.',
    heroImage: '/images/services/branding-hero.png',
    highlights: [
      'Brand strategy and positioning',
      'Logo and visual identity systems',
      'Messaging and tone of voice',
      'Brand guidelines and assets',
    ],
    faqs: [
      { q: 'What is included in a brand identity?', a: 'Strategy, logo, color, typography, imagery, and usage rules tailored to your goals.' },
      { q: 'How long does branding take?', a: 'Typically 3–6 weeks depending on scope and feedback cadence.' },
    ],
  },
  'design': {
    title: 'Design & Creative',
    heroTag: 'Services',
    subTitle: 'High-impact design for every touchpoint',
    description: 'Beautiful, purposeful design across print and digital that elevates your brand and drives results.',
    heroImage: '/images/services/design-hero.png',
    highlights: [
      'Marketing and campaign creatives',
      'Pitch decks and presentations',
      'Illustrations and iconography',
      'Print and packaging design',
    ],
    faqs: [
      { q: 'Do you handle ongoing creative requests?', a: 'Yes, we offer monthly creative retainers for continuous support.' },
      { q: 'Can you work with our existing brand?', a: 'Absolutely. We extend and respect your current guidelines.' },
    ],
  },
  'social-media': {
    title: 'Social Media',
    heroTag: 'Services',
    subTitle: 'Create, engage, and grow your community',
    description: 'Strategy, content, and performance for social channels that actually build relationships and drive business.',
    heroImage: '/images/services/social-hero.png',
    highlights: [
      'Channel and content strategy',
      'Content calendars and production',
      'UGC and influencer collaboration',
      'Analytics and reporting',
    ],
    faqs: [
      { q: 'Which platforms do you support?', a: 'Instagram, LinkedIn, YouTube, X, Facebook, and more as needed.' },
      { q: 'Can you create reels and shorts?', a: 'Yes, we plan, script, produce, and edit short-form video content.' },
    ],
  },
  'web-development': {
    title: 'Web Development',
    heroTag: 'Services',
    subTitle: 'Fast, scalable, and beautiful websites',
    description: 'From landing pages to robust sites, we design and build experiences optimized for conversion and performance.',
    heroImage: '/images/services/web-hero.png',
    highlights: [
      'UI/UX and responsive design',
      'SEO and performance optimization',
      'CMS and integrations',
      'Analytics and tracking setup',
    ],
    faqs: [
      { q: 'Do you support CMS?', a: 'Yes—Headless, WordPress, Webflow, and custom setups depending on requirements.' },
      { q: 'Will you handle deployment?', a: 'We can deploy and configure hosting, SSL, domains, and CDNs.' },
    ],
  },
  'marketing': {
    title: 'Marketing Strategy',
    heroTag: 'Services',
    subTitle: 'Plan for sustained, measurable growth',
    description: 'Channel mix, GTM, campaigns, and measurement to help you invest where it matters most.',
    heroImage: '/images/services/marketing-hero.png',
    highlights: [
      'GTM and channel strategy',
      'Campaign planning and ops',
      'Funnel and attribution',
      'KPI framework and dashboards',
    ],
    faqs: [
      { q: 'Can you audit our current marketing?', a: 'Yes, we can audit channels, spend, creatives, and operations.' },
      { q: 'Do you run campaigns?', a: 'We can plan and run campaigns or partner with your team/agency.' },
    ],
  },
};

const ServiceDetail = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const slug = path.startsWith('/services/') ? path.replace('/services/', '') : '';
  const data = SERVICE_CONTENT[slug];

  if (!data) {
    return (
      <main className="bg-[#EFE7D5] min-h-screen">
        <section className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10 py-24 md:py-32 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">Service not found</h1>
          <p className="text-gray-700 mb-8">This service doesn’t exist or may have moved.</p>
          <a href="/services" className="text-[#0D1B2A] underline">Back to Services</a>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-10 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="text-[#E2552A] text-sm md:text-base font-semibold tracking-wide mb-3">{data.heroTag}</div>
            <h1 className="font-serif text-[#0D1B2A] font-bold text-[36px] leading-[1.1] md:text-[56px] md:leading-[1.1] mb-3">{data.title}</h1>
            <h2 className="text-[#EB8F1C] font-serif text-[24px] md:text-[36px] font-bold mb-5">{data.subTitle}</h2>
            <p className="text-[#202124] text-base md:text-lg leading-7 md:leading-8 max-w-xl">{data.description}</p>
            <div className="mt-6">
              <a href="/contact" className="inline-flex items-center gap-2 rounded-full text-white font-semibold px-6 py-3 bg-gradient-to-r from-[#F26B2A] to-[#FFC107] shadow hover:shadow-md transition-transform hover:scale-[1.02]">
                Let’s Talk
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white p-4">
              <img src={data.heroImage} alt={data.title} className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {data.highlights.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-5 border border-[#EEE7D8]">
              <div className="text-[#0D1B2A] font-semibold mb-2">0{i+1}</div>
              <p className="text-[#1f2937]">{h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10 py-10 md:py-14">
        <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#0D1B2A] mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {data.faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow border border-[#EEE7D8] p-5">
              <div className="font-medium text-[#0D1B2A] mb-2">{f.q}</div>
              <div className="text-[#1f2937]">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials reuse */}
      <ClientFeedback />
    </main>
  );
};

export default ServiceDetail;


