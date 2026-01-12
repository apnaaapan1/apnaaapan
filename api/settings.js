// Settings API for site-wide settings like "Suggest Event Link"
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  console.error('SETTINGS API: MONGODB_URI is not set');
}

let cachedClient = null;

async function getDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryWrites: true,
    });
    await cachedClient.connect();
  }

  const db = cachedClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('settings'),
  };
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret = req.headers['x-admin-token'] || req.query?.token;
  return headerSecret === ADMIN_SECRET;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db, collection } = await getDb();

    // GET - Fetch setting by key
    if (req.method === 'GET') {
      const { key } = req.query;
      if (key) {
        const setting = await collection.findOne({ key });
        return res.status(200).json({ 
          setting: setting || { key, value: '' } 
        });
      } else {
        const settings = await collection.find({}).toArray();
        return res.status(200).json({ settings });
      }
    }

    // POST/PUT - Create or update setting (admin only)
    if (req.method === 'POST' || req.method === 'PUT') {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { key, value } = req.body;

      if (!key || !value) {
        return res.status(400).json({ message: 'Key and value are required' });
      }

      const result = await collection.updateOne(
        { key },
        { 
          $set: { 
            key, 
            value, 
            updatedAt: new Date() 
          } 
        },
        { upsert: true }
      );

      return res.status(200).json({ message: 'Setting saved successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Settings API error:', err);
    return res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      hint: 'Check if MONGODB_URI is set in environment variables'
    });
  }

  // GET - Fetch setting by key
  if (req.method === 'GET') {
    try {
      const { key } = req.query;
      if (key) {
        const setting = await Settings.findOne({ key });
        return res.status(200).json({ setting });
      }
      // Return all settings
      const settings = await Settings.find();
      return res.status(200).json({ settings });
    } catch (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ message: 'Failed to fetch settings', error: err.message });
    }
  }

  // POST/PUT - Update or create setting
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { key, value } = req.body;
      if (!key || !value) {
        return res.status(400).json({ message: 'Key and value are required' });
      }

      const setting = await Settings.findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      return res.status(200).json({ message: 'Setting updated successfully', setting });
    } catch (err) {
      console.error('Error updating setting:', err);
      return res.status(500).json({ message: 'Failed to update setting', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
