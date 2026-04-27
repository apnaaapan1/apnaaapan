const { getCaseStudiesCollection, serializeCaseStudyDoc, normalizePathSlug } = require('../../../lib/caseStudyApiShared');

/**
 * Public GET /api/case-studies/by-slug/:slug (Vercel: dynamic route param in req.query.slug)
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const raw = req.query?.slug != null ? req.query.slug : '';
    const slug = normalizePathSlug(raw);
    if (!slug) {
      return res.status(400).json({ message: 'Invalid slug', error: 'INVALID_SLUG' });
    }

    const collection = await getCaseStudiesCollection();
    const doc = await collection.findOne({ slug, status: 'published' });
    if (!doc) {
      return res.status(404).json({ message: 'Case study not found', error: 'NOT_FOUND' });
    }
    return res.status(200).json({ caseStudy: serializeCaseStudyDoc(doc) });
  } catch (error) {
    console.error('CASE STUDIES by-slug error:', error);
    return res.status(500).json({
      message: 'Failed to fetch case study',
      error: 'CASE_STUDY_GET_ERROR',
    });
  }
};
