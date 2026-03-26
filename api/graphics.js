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
    collection: db.collection('graphics_portfolio'),
  };
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

function sanitizeGraphicInput(body) {
  const { title, imageUrl, publicId, status } = body || {};
  return {
    title: typeof title === 'string' ? title.trim() : '',
    imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
    publicId: typeof publicId === 'string' ? publicId.trim() : '',
    status: status === 'draft' ? 'draft' : 'published',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

  const method = String(req?.method || '').toUpperCase();

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { collection } = await getDb();
    const isAdminRequest = isAdmin(req);
    const { includeDrafts } = req.query || {};

    if (method === 'GET') {
      const filter = {};
      if (!isAdminRequest || includeDrafts !== 'true') {
        filter.status = 'published';
      }

      const docs = await collection
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .toArray();

      return res.status(200).json({
        graphics: docs.map((doc) => ({
          id: doc._id.toString(),
          title: doc.title,
          imageUrl: doc.imageUrl,
          publicId: doc.publicId || '',
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
      });
    }

    if (method === 'POST') {
      if (!isAdminRequest) {
        return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
      }

      const graphic = sanitizeGraphicInput(req.body);

      if (!graphic.imageUrl) {
        return res.status(400).json({ message: 'imageUrl is required', error: 'MISSING_IMAGE_URL' });
      }

      const now = new Date();
      const doc = {
        title: graphic.title || 'Graphic',
        imageUrl: graphic.imageUrl,
        publicId: graphic.publicId || '',
        status: graphic.status,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(doc);

      return res.status(201).json({
        message: 'Graphic saved successfully',
        id: result.insertedId.toString(),
      });
    }

    if (method === 'DELETE') {
      if (!isAdminRequest) {
        return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
      }

      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ message: 'Graphic id is required', error: 'MISSING_ID' });
      }
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid graphic id', error: 'INVALID_ID' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Graphic not found', error: 'NOT_FOUND' });
      }

      return res.status(200).json({ message: 'Graphic deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
      details: err?.message,
    });
  }
};

