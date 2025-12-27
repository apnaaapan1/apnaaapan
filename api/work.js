const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

let cachedClient = null;

async function getDb() {
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
  return {
    db,
    collection: db.collection('work_posts'),
  };
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];
  return headerSecret === ADMIN_SECRET;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { collection } = await getDb();

    // GET - Fetch work posts
    if (req.method === 'GET') {
      const { includeDrafts } = req.query || {};
      const isAdminRequest = isAdmin(req);

      const filter = {};
      if (!isAdminRequest || includeDrafts !== 'true') {
        filter.status = 'published';
      }

      const docs = await collection.find(filter).sort({ createdAt: -1 }).toArray();

      return res.status(200).json({
        work: docs.map((doc) => ({
          id: doc._id.toString(),
          title: doc.title,
          description: doc.description,
          image: doc.image,
          alt: doc.alt,
          categories: doc.categories || [],
          tags: doc.tags || [],
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
      });
    }

    // Admin-only routes
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
    }

    // POST - Create work post
    if (req.method === 'POST') {
      const { title, description, image, alt, categories, tags, status } = req.body || {};

      if (!title) {
        return res.status(400).json({ message: 'Title is required', error: 'MISSING_TITLE' });
      }

      if (!image) {
        return res.status(400).json({ message: 'Image is required', error: 'MISSING_IMAGE' });
      }

      const newDoc = {
        title: title.trim(),
        description: (description || '').trim(),
        image: image.trim(),
        alt: (alt || '').trim(),
        categories: Array.isArray(categories) ? categories : [],
        tags: Array.isArray(tags) ? tags : [],
        status: status || 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newDoc);
      newDoc.id = result.insertedId.toString();

      return res.status(201).json({ message: 'Work post created successfully', work: newDoc });
    }

    // PUT - Update work post
    if (req.method === 'PUT') {
      const { id, title, description, image, alt, categories, tags, status } = req.body || {};

      if (!id) {
        return res.status(400).json({ message: 'Work post id is required', error: 'MISSING_ID' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid work post ID', error: 'INVALID_ID' });
      }

      const updateData = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (image !== undefined) updateData.image = image.trim();
      if (alt !== undefined) updateData.alt = alt.trim();
      if (categories !== undefined) updateData.categories = Array.isArray(categories) ? categories : [];
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
      if (status !== undefined) updateData.status = status;

      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Work post not found', error: 'NOT_FOUND' });
      }

      return res.status(200).json({ message: 'Work post updated successfully' });
    }

    // DELETE - Delete work post
    if (req.method === 'DELETE') {
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({ message: 'Work post id is required', error: 'MISSING_ID' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid work post ID', error: 'INVALID_ID' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Work post not found', error: 'NOT_FOUND' });
      }

      return res.status(200).json({ message: 'Work post deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('WORK API error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
      details: error.message,
    });
  }
};
