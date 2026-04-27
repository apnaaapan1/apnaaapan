const {
  getCaseStudiesCollection,
  isAdmin,
  sanitizeCaseStudyInput,
  serializeCaseStudyDoc,
  ObjectId,
} = require('../../lib/caseStudyApiShared');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCaseStudiesCollection();

    if (req.method === 'GET') {
      const { includeDrafts } = req.query || {};
      const adminList = isAdmin(req) && includeDrafts === 'true';
      const filter = adminList ? {} : { status: 'published' };
      const docs = await collection.find(filter).sort({ updatedAt: -1 }).toArray();
      return res.status(200).json({
        caseStudies: docs.map(serializeCaseStudyDoc),
      });
    }

    if (req.method === 'POST') {
      if (!isAdmin(req)) {
        return res.status(401).json({
          message: 'Unauthorized: missing or invalid admin secret',
          error: 'UNAUTHORIZED',
        });
      }
      const data = sanitizeCaseStudyInput(req.body);
      if (!data.slug || !data.name) {
        return res.status(400).json({
          message: 'Slug and name are required',
          error: 'MISSING_FIELDS',
        });
      }
      const existing = await collection.findOne({ slug: data.slug });
      if (existing) {
        return res.status(400).json({
          message: 'A case study with this slug already exists',
          error: 'DUPLICATE_SLUG',
        });
      }
      const now = new Date();
      const result = await collection.insertOne({ ...data, createdAt: now, updatedAt: now });
      return res.status(201).json({
        message: 'Case study created successfully',
        id: result.insertedId.toString(),
      });
    }

    if (req.method === 'PUT') {
      if (!isAdmin(req)) {
        return res.status(401).json({
          message: 'Unauthorized: missing or invalid admin secret',
          error: 'UNAUTHORIZED',
        });
      }
      const { id } = req.body || {};
      if (!id) {
        return res.status(400).json({
          message: 'Case study id is required',
          error: 'MISSING_ID',
        });
      }
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid case study id', error: 'INVALID_ID' });
      }
      const data = sanitizeCaseStudyInput(req.body);
      if (!data.slug || !data.name) {
        return res.status(400).json({
          message: 'Slug and name are required',
          error: 'MISSING_FIELDS',
        });
      }
      const oid = new ObjectId(id);
      const slugTaken = await collection.findOne({ slug: data.slug, _id: { $ne: oid } });
      if (slugTaken) {
        return res.status(400).json({
          message: 'Another case study already uses this slug',
          error: 'DUPLICATE_SLUG',
        });
      }
      const result = await collection.updateOne(
        { _id: oid },
        { $set: { ...data, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Case study not found', error: 'NOT_FOUND' });
      }
      return res.status(200).json({ message: 'Case study updated successfully' });
    }

    if (req.method === 'DELETE') {
      if (!isAdmin(req)) {
        return res.status(401).json({
          message: 'Unauthorized: missing or invalid admin secret',
          error: 'UNAUTHORIZED',
        });
      }
      const { id } = req.body || {};
      if (!id) {
        return res.status(400).json({
          message: 'Case study id is required',
          error: 'MISSING_ID',
        });
      }
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid case study id', error: 'INVALID_ID' });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Case study not found', error: 'NOT_FOUND' });
      }
      return res.status(200).json({ message: 'Case study deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('CASE STUDIES API error:', error);
    return res.status(500).json({
      message: 'Failed to process case studies request',
      error: 'CASE_STUDIES_API_ERROR',
    });
  }
};
