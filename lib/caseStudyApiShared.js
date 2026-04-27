/**
 * Shared case study API logic for Vercel serverless (api/case-studies.js).
 * Mirrors server.js behavior; local dev still uses Express in server.js.
 */
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

let cachedClient = null;

async function getCaseStudiesCollection() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await cachedClient.connect();
  }
  const db = cachedClient.db(DATABASE_NAME);
  return db.collection('case_studies');
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret =
    req.headers['x-admin-token'] ||
    req.headers['X-Admin-Token'] ||
    req.headers['x-admin-secret'] ||
    req.headers['X-Admin-Secret'];
  return headerSecret === ADMIN_SECRET;
}

function normalizeCaseStudyImageSlot(item) {
  if (!item || typeof item !== 'object') return { src: null, alt: '' };
  const raw = item.src;
  const s = typeof raw === 'string' && raw.trim() ? raw.trim() : null;
  const alt = typeof item.alt === 'string' ? item.alt.trim() : '';
  return { src: s, alt: alt || '' };
}

function sanitizeCaseStudyInput(body) {
  const b = body || {};
  const slugRaw = typeof b.slug === 'string' ? b.slug.trim().toLowerCase() : '';
  const slug = slugRaw
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const tagline = typeof b.tagline === 'string' ? b.tagline.trim() : '';
  const logoRaw = typeof b.logo === 'string' ? b.logo.trim() : '';
  const logo = logoRaw || null;

  const tags = Array.isArray(b.tags)
    ? b.tags.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean)
    : [];

  const brief =
    b.brief && typeof b.brief === 'object'
      ? {
          intro: typeof b.brief.intro === 'string' ? b.brief.intro.trim() : '',
          bullets: Array.isArray(b.brief.bullets)
            ? b.brief.bullets.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean)
            : [],
        }
      : { intro: '', bullets: [] };

  const approach =
    b.approach && typeof b.approach === 'object'
      ? {
          intro: typeof b.approach.intro === 'string' ? b.approach.intro.trim() : '',
          points: Array.isArray(b.approach.points)
            ? b.approach.points
                .filter((p) => p && typeof p === 'object')
                .map((p) => ({
                  title: typeof p.title === 'string' ? p.title.trim() : '',
                  description: typeof p.description === 'string' ? p.description.trim() : '',
                }))
                .filter((p) => p.title || p.description)
            : [],
        }
      : { intro: '', points: [] };

  const results = Array.isArray(b.results)
    ? b.results
        .filter((r) => r && typeof r === 'object')
        .slice(0, 12)
        .map((r) => ({
          value: typeof r.value === 'string' ? r.value.trim() : '',
          label: typeof r.label === 'string' ? r.label.trim() : '',
          description: typeof r.description === 'string' ? r.description.trim() : '',
        }))
    : [];

  const videos = Array.isArray(b.videos)
    ? b.videos
        .filter((v) => v && typeof v === 'object')
        .slice(0, 9)
        .map((v) => ({
          title: typeof v.title === 'string' ? v.title.trim() : '',
          embedUrl: typeof v.embedUrl === 'string' ? v.embedUrl.trim() : '',
          src: typeof v.src === 'string' ? v.src.trim() : '',
        }))
        .filter((v) => v.embedUrl || v.src)
    : [];

  const mg = b.marqueeGallery && typeof b.marqueeGallery === 'object' ? b.marqueeGallery : {};
  const row1 = Array.isArray(mg.row1) ? mg.row1.map(normalizeCaseStudyImageSlot) : [];
  const row2 = Array.isArray(mg.row2) ? mg.row2.map(normalizeCaseStudyImageSlot) : [];

  const performanceMarketing = Array.isArray(b.performanceMarketing)
    ? b.performanceMarketing.map(normalizeCaseStudyImageSlot).slice(0, 4)
    : [];

  let heroImages = Array.isArray(b.heroImages)
    ? b.heroImages.map(normalizeCaseStudyImageSlot).slice(0, 12)
    : [];
  while (heroImages.length < 6) {
    heroImages.push({ src: null, alt: '' });
  }

  const status = b.status === 'draft' ? 'draft' : 'published';

  return {
    slug,
    name,
    tagline,
    logo,
    tags,
    heroImages,
    brief,
    approach,
    results,
    videos,
    marqueeGallery: { row1, row2 },
    performanceMarketing,
    status,
  };
}

function serializeCaseStudyDoc(doc) {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    logo: doc.logo ?? null,
    tags: doc.tags || [],
    tagline: doc.tagline || '',
    heroImages: doc.heroImages || [],
    brief: doc.brief || { intro: '', bullets: [] },
    approach: doc.approach || { intro: '', points: [] },
    results: doc.results || [],
    videos: doc.videos || [],
    marqueeGallery: doc.marqueeGallery || { row1: [], row2: [] },
    performanceMarketing: doc.performanceMarketing || [],
    status: doc.status || 'published',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function normalizePathSlug(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = {
  getCaseStudiesCollection,
  isAdmin,
  sanitizeCaseStudyInput,
  serializeCaseStudyDoc,
  normalizePathSlug,
  ObjectId,
};
