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
      hint: 'Check if MONGODB_URI is set in environment variables'
    });
  }

  // GET - Fetch all events
  if (req.method === 'GET') {
    try {
      const events = await Event.find().sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ events });
    } catch (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Failed to fetch events', error: err.message });
    }
  }

  // POST - Create new event
  if (req.method === 'POST') {
    try {
      const { title, date, emoji, author, content, order } = req.body;
      if (!title || !date || !content) {
        return res.status(400).json({ message: 'Title, date, and content are required' });
      }

      const newEvent = new Event({
        title,
        date,
        emoji: emoji || '✨',
        author: author || 'Apnaaapan Team',
        content: Array.isArray(content) ? content : [content],
        order: order || 0
      });

      await newEvent.save();
      return res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (err) {
      console.error('Error creating event:', err);
      return res.status(500).json({ message: 'Failed to add event', error: err.message });
    }
  }

  // PUT - Update event
  if (req.method === 'PUT') {
    try {
      const { id, title, date, emoji, author, content, order } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Event ID is required' });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (date) updateData.date = date;
      if (emoji) updateData.emoji = emoji;
      if (author) updateData.author = author;
      if (content) updateData.content = Array.isArray(content) ? content : [content];
      if (order !== undefined) updateData.order = order;

      const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ message: 'Failed to update event', error: err.message });
    }
  }

  // DELETE - Delete event
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Event ID is required' });
      }

      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ message: 'Failed to delete event', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
