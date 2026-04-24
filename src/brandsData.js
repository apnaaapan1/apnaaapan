/**
 * Brand case study content and themes. Add new entries and reuse the same shape
 * for 8–9 case study pages.
 *
 * `logo`: optional image URL (or bundled import path) for the hero collage center badge.
 * Use `null` to show the brand name as text until a real asset is available.
 */

const placeholderBrief = {
  intro:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  bullets: [
    'Placeholder challenge or context point one',
    'Placeholder challenge or context point two',
    'Placeholder challenge or context point three',
  ],
};

const phylaxisBrief = {
  intro:
    'Phylaxis.ai came to us at a critical growth stage. They had a strong product but struggled to communicate their value to everyday users in a language that felt human, not clinical.',
  bullets: [
    'Low brand awareness among their target demographic',
    'Content was too technical and not driving engagement',
    'No consistent social media presence or posting rhythm',
    'Community building was completely untapped',
  ],
};

const placeholderApproachPoints = [
  {
    title: 'Audience & positioning',
    description:
      'Placeholder: how we mapped segments, tone, and channel fit before creative or media spend.',
  },
  {
    title: 'Creative & content systems',
    description:
      'Placeholder: repeatable formats, hooks, and brand guardrails scaled across campaigns.',
  },
  {
    title: 'Distribution & optimization',
    description:
      'Placeholder: test plans, budget pacing, and iteration loops tied to measurable outcomes.',
  },
  {
    title: 'Reporting & learning',
    description:
      'Placeholder: dashboards, retrospectives, and handoff notes for the internal team.',
  },
];

const phylaxisApproach = {
  intro:
    "We shifted Phylaxis's entire content approach from product-first to people-first. Every piece of content was built to educate, reassure, and build trust.",
  points: [
    {
      title: 'Education-First Content',
      description:
        'Created health awareness content that felt human and approachable, not clinical or intimidating.',
    },
    {
      title: 'Campaign-Led Growth',
      description:
        'Ran targeted campaigns around key health awareness dates to spike reach and new followers.',
    },
    {
      title: 'Community Building',
      description:
        'Grew the community through consistent daily engagement, replies, and interactive stories.',
    },
    {
      title: 'Performance Tracking',
      description:
        'Monitored weekly metrics and iterated content based on what was actually working.',
    },
  ],
};

const placeholderApproach = {
  intro:
    'We mapped a clear path from positioning to execution: audience insight, creative systems, and consistent distribution across channels.',
  points: placeholderApproachPoints,
};

const phylaxisResults = [
  {
    value: '2.3x',
    label: 'Follower Growth',
    description: 'In under 6 months',
  },
  {
    value: '40%',
    label: 'Engagement Rate Increase',
    description: 'Above industry average',
  },
  {
    value: '12L+',
    label: 'Organic Reach',
    description: 'Across awareness campaigns',
  },
];

const placeholderResults = [
  {
    value: '—',
    label: 'Placeholder metric one',
    description: 'Short context line for this result',
  },
  {
    value: '—',
    label: 'Placeholder metric two',
    description: 'Short context line for this result',
  },
  {
    value: '—',
    label: 'Placeholder metric three',
    description: 'Short context line for this result',
  },
];

/** Hero collage slots (6). Set `src` per slot when assets are ready. */
const heroImagesFromGallery = (prefix) =>
  [1, 2, 3, 4, 5, 6].map((n) => ({
    src: null,
    alt: `${prefix} hero ${n}`,
  }));

/** Case study videos: max 9, shown 3 per row on md+ (`BrandCaseStudyVideos`). Use YouTube/Vimeo embed URLs or `src` for MP4/WebM. */
const phylaxisVideos = [
  { title: 'Awareness reel — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
  { title: 'Community story — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
  { title: 'Campaign highlight — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
];

/** Two marquee rows (home Client Feedback–style scroll). Same shape as gallery slots: { src, alt }. */
const marqueeSlot = (row, n) => ({
  src: null,
  alt: `${row} image ${n}`,
});

const phylaxisMarqueeGallery = {
  row1: [1, 2, 3, 4, 5].map((n) => marqueeSlot('Top row', n)),
  row2: [1, 2, 3, 4, 5].map((n) => marqueeSlot('Bottom row', n)),
};

/** Performance marketing: max 4 images (`BrandCaseStudyPerformanceMarketing`). */
const performanceSlot = (n) => ({
  src: null,
  alt: `Performance marketing ${n}`,
});

const phylaxisPerformanceMarketing = [1, 2, 3, 4].map((n) => performanceSlot(n));

/** Same layout as Phylaxis; swap embeds/images in CMS data when ready. */
const partywalasVideos = [
  { title: 'Event catering reel — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
  { title: 'Bulk orders spotlight — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
  { title: 'Brand moments — sample', embedUrl: 'https://www.youtube.com/embed/ysz5S6PIMBo' },
];

const partywalasMarqueeGallery = {
  row1: [1, 2, 3, 4, 5].map((n) => ({
    src: null,
    alt: `Partywalas gallery top ${n}`,
  })),
  row2: [1, 2, 3, 4, 5].map((n) => ({
    src: null,
    alt: `Partywalas gallery bottom ${n}`,
  })),
};

const partywalasPerformanceMarketing = [1, 2, 3, 4].map((n) => ({
  src: null,
  alt: `Partywalas performance ${n}`,
}));

export const brands = [
  {
    slug: 'phylaxis-ai',
    name: 'Phylaxis.ai',
    logo: null,
    tags: ['Social Media Marketing', 'Growth'],
    tagline:
      'A healthtech platform driving preventive care through data-led health programs and community-driven wellness initiatives.',
    heroImages: heroImagesFromGallery('Phylaxis'),
    brief: phylaxisBrief,
    approach: phylaxisApproach,
    results: phylaxisResults,
    videos: phylaxisVideos,
    marqueeGallery: phylaxisMarqueeGallery,
    performanceMarketing: phylaxisPerformanceMarketing,
  },
  {
    slug: 'partywalas',
    name: 'Partywalas',
    logo: null,
    tags: ['Social Media Marketing', 'Growth', 'Ads'],
    tagline:
      'A bulk food delivery brand powering large-scale events with reliable, high-quality cloud kitchen solutions.',
    heroImages: heroImagesFromGallery('Partywalas'),
    brief: placeholderBrief,
    approach: placeholderApproach,
    results: placeholderResults,
    videos: partywalasVideos,
    marqueeGallery: partywalasMarqueeGallery,
    performanceMarketing: partywalasPerformanceMarketing,
  },
];

const brandsBySlug = Object.fromEntries(brands.map((b) => [b.slug, b]));

export function getBrandBySlug(slug) {
  if (!slug) return null;
  return brandsBySlug[slug] ?? null;
}
