const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnapan_contacts';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  console.error('POSITIONS API: MONGODB_URI is not set. Positions features will not work.');
}

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
    collection: db.collection('open_positions'),
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

function sanitizePositionInput(body) {
  const { title, description, applyUrl, status } = body || {};

  return {
    title: typeof title === 'string' ? title.trim() : '',
    description: typeof description === 'string' ? description.trim() : '',
    applyUrl: typeof applyUrl === 'string' ? applyUrl.trim() : '',
    status: status === 'draft' ? 'draft' : 'published',
  };
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query } = req;

  if (method === 'GET') {
    try {
      const { collection } = await getDb();
      const { includeDrafts } = query || {};
      const isAdminRequest = isAdmin(req);

      const filter = {};
      if (!isAdminRequest || includeDrafts !== 'true') {
        filter.status = 'published';
      }

      const docs = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        positions: docs.map((doc) => ({
          id: doc._id.toString(),
          title: doc.title,
          description: doc.description,
          applyUrl: doc.applyUrl,
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
      });
    } catch (error) {
      console.error('POSITIONS API GET error:', error);
      return res.status(500).json({
        message: 'Failed to fetch positions',
        error: 'POSITIONS_GET_ERROR',
      });
    }
  }

  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  if (method === 'POST') {
    try {
      const { collection } = await getDb();
      const position = sanitizePositionInput(req.body);

      if (!position.title) {
        return res.status(400).json({
          message: 'Title is required',
          error: 'MISSING_FIELDS',
        });
      }

      const now = new Date();
      const doc = {
        ...position,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(doc);

      return res.status(201).json({
        message: 'Position created successfully',
        id: result.insertedId.toString(),
      });
    } catch (error) {
      console.error('POSITIONS API POST error:', error);
      return res.status(500).json({
        message: 'Failed to create position',
        error: 'POSITIONS_CREATE_ERROR',
      });
    }
  }

  if (method === 'PUT') {
    try {
      const { id } = req.body || {};
      if (!id) {
        return res.status(400).json({
          message: 'Position id is required',
          error: 'MISSING_ID',
        });
      }

      const position = sanitizePositionInput(req.body);
      const { collection } = await getDb();

      const update = {
        $set: {
          title: position.title,
          description: position.description,
          applyUrl: position.applyUrl,
          status: position.status,
          updatedAt: new Date(),
        },
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        update
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: 'Position not found',
          error: 'NOT_FOUND',
        });
      }

      return res.status(200).json({
        message: 'Position updated successfully',
      });
    } catch (error) {
      console.error('POSITIONS API PUT error:', error);
      return res.status(500).json({
        message: 'Failed to update position',
        error: 'POSITIONS_UPDATE_ERROR',
      });
    }
  }

  if (method === 'DELETE') {
    try {
      const { id } = req.body || {};

      if (!id) {
        return res.status(400).json({
          message: 'Position id is required',
          error: 'MISSING_ID',
        });
      }

      const { collection } = await getDb();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Position not found',
          error: 'NOT_FOUND',
        });
      }

      return res.status(200).json({
        message: 'Position deleted successfully',
      });
    } catch (error) {
      console.error('POSITIONS API DELETE error:', error);
      return res.status(500).json({
        message: 'Failed to delete position',
        error: 'POSITIONS_DELETE_ERROR',
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
}
