// Gallery API Endpoint for managing gallery images
const mongoose = require('mongoose');

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
