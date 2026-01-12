// Events API Endpoint for managing "What Happened" section events
const mongoose = require('mongoose');

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  emoji: { type: String, default: '✨' },
  author: { type: String, default: 'Apnaaapan Team' },
  content: { type: [String], required: true }, // Array of paragraphs
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apnaaapan';
  
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
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
