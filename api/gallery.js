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
  if (!ADMIN_SECRET) return false;
  const headerSecret = req.headers['x-admin-token'] || req.query?.token;
  return headerSecret === ADMIN_SECRET;
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
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const newImage = {
        imageUrl,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newImage);
      return res.status(201).json({ image: { ...newImage, _id: result.insertedId } });
    }

    // DELETE - Remove image (admin only)
    if (req.method === 'DELETE') {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { id } = req.body;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid image ID' });
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
      hint: 'Check if MONGODB_URI is set in environment variables'
    });
  }

  // GET - Fetch gallery images (8 by default, all when ?all=true)
  if (req.method === 'GET') {
    try {
      const showAll = req.query?.all === 'true';
      const query = Gallery.find().sort({ createdAt: -1, _id: -1 });
      if (!showAll) {
        query.limit(8);
      }

      const images = await query;
      return res.status(200).json({ images });
    } catch (err) {
      console.error('Error fetching gallery:', err);
      return res.status(500).json({ message: 'Failed to fetch gallery images', error: err.message });
    }
  }

  // POST - Create new gallery image
  if (req.method === 'POST') {
    try {
      const { imageUrl, order } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const newImage = new Gallery({
        imageUrl,
        order: order || 0
      });

      await newImage.save();
      return res.status(201).json({ message: 'Gallery image added successfully', image: newImage });
    } catch (err) {
      console.error('Error creating gallery image:', err);
      return res.status(500).json({ message: 'Failed to add gallery image', error: err.message });
    }
  }

  // PUT - Update gallery image
  if (req.method === 'PUT') {
    try {
      const { id, imageUrl, order } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Image ID is required' });
      }

      const updateData = {};
      if (imageUrl) updateData.imageUrl = imageUrl;
      if (order !== undefined) updateData.order = order;

      const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedImage) {
        return res.status(404).json({ message: 'Gallery image not found' });
      }

      return res.status(200).json({ message: 'Gallery image updated successfully', image: updatedImage });
    } catch (err) {
      console.error('Error updating gallery image:', err);
      return res.status(500).json({ message: 'Failed to update gallery image', error: err.message });
    }
  }

  // DELETE - Delete gallery image
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Image ID is required' });
      }

      const deletedImage = await Gallery.findByIdAndDelete(id);
      if (!deletedImage) {
        return res.status(404).json({ message: 'Gallery image not found' });
      }

      return res.status(200).json({ message: 'Gallery image deleted successfully' });
    } catch (err) {
      console.error('Error deleting gallery image:', err);
      return res.status(500).json({ message: 'Failed to delete gallery image', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
