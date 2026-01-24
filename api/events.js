// Events API Endpoint for managing "What Happened" section events
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  console.error('EVENTS API: MONGODB_URI is not set');
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
    collection: db.collection('events'),
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

    // GET - Fetch all events
    if (req.method === 'GET') {
      const events = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ events });
    }

    // POST - Create new event (admin only)
    if (req.method === 'POST') {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { title, date, emoji, author, content } = req.body;

      if (!title || !date || !Array.isArray(content) || content.length === 0) {
        return res.status(400).json({ message: 'Invalid event data' });
      }

      const newEvent = {
        title,
        date,
        emoji: emoji || '✨',
        author: author || 'Apnaaapan Team',
        content,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newEvent);
      return res.status(201).json({ event: { ...newEvent, _id: result.insertedId } });
    }

    // PUT - Update event (admin only)
    if (req.method === 'PUT') {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { id, title, date, emoji, author, content } = req.body;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (date) updateData.date = date;
      if (emoji) updateData.emoji = emoji;
      if (author) updateData.author = author;
      if (content) updateData.content = content;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event updated successfully' });
    }

    // DELETE - Remove event (admin only)
    if (req.method === 'DELETE') {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { id } = req.body;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Events API error:', err);
    return res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      hint: 'Check MONGODB_URI and ADMIN_SECRET environment variables'
    });
  }
};
