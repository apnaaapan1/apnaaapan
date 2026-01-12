// Settings API for site-wide settings like "Suggest Event Link"
const mongoose = require('mongoose');

// Settings Schema
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
  }
};

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
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
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
