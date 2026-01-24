// Gallery API Endpoint for managing gallery images
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  console.error('GALLERY API: MONGODB_URI is not set');
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
    collection: db.collection('gallery'),
  };
}

function isAdmin(req) {
  if (!ADMIN_SECRET) {
    console.warn('ADMIN_SECRET is not set in environment variables');
    return false;
  }
  
  const headerSecret = req.headers['x-admin-token'] || req.query?.token;
  
  if (!headerSecret) {
    console.warn('No admin token provided in request');
    return false;
  }

  const isValid = headerSecret === ADMIN_SECRET;
  if (!isValid) {
    console.warn('Invalid admin token provided');
  }
  return isValid;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db, collection } = await getDb();

    // GET - Fetch gallery images (8 by default, all when ?all=true)
    if (req.method === 'GET') {
      const showAll = req.query?.all === 'true';
      const query = collection.find({}).sort({ createdAt: -1, _id: -1 });
      
      const images = showAll 
        ? await query.toArray()
        : await query.limit(8).toArray();
      
      return res.status(200).json({ images });
    }

    // POST - Add new image (admin only)
    if (req.method === 'POST') {
      if (!isAdmin(req)) {
        console.log('Unauthorized POST request to gallery');
        return res.status(403).json({ message: 'Unauthorized - invalid admin token' });
      }

      const { imageUrl } = req.body;

      if (!imageUrl || !imageUrl.trim()) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const newImage = {
        imageUrl: imageUrl.trim(),
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newImage);
      return res.status(201).json({ image: { ...newImage, _id: result.insertedId } });
    }

    // DELETE - Remove image (admin only)
    if (req.method === 'DELETE') {
      if (!isAdmin(req)) {
        console.log('Unauthorized DELETE request to gallery');
        return res.status(403).json({ message: 'Unauthorized - invalid admin token' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Image ID is required' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid image ID format' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }

      return res.status(200).json({ message: 'Image deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Gallery API error:', err);
    return res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      hint: 'Check MONGODB_URI and ADMIN_SECRET environment variables'
    });
  }
};
