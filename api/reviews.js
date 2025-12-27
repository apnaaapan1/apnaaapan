const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'apnaaapan_user';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const reviewsCollection = db.collection('reviews');

    // GET - Fetch all reviews (public, only active reviews)
    if (req.method === 'GET') {
      const { all } = req.query;
      const adminToken = req.headers['x-admin-token'];
      
      // If admin token provided and 'all' query param, return all reviews
      if (all && adminToken === ADMIN_SECRET) {
        const reviews = await reviewsCollection
          .find({})
          .sort({ order: 1, createdAt: -1 })
          .toArray();
        return res.status(200).json({ success: true, reviews });
      }
      
      // Public endpoint - only active reviews
      const reviews = await reviewsCollection
        .find({ status: 'active' })
        .sort({ order: 1, createdAt: -1 })
        .toArray();
      return res.status(200).json({ success: true, reviews });
    }

    // Admin routes - require authentication
    const adminToken = req.headers['x-admin-token'];
    if (adminToken !== ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // POST - Create new review
    if (req.method === 'POST') {
      const { name, role, feedback, avatar, imageUrl, rating, order, status } = req.body;

      if (!name || !feedback) {
        return res.status(400).json({ success: false, message: 'Name and feedback are required' });
      }

      const newReview = {
        name: name.trim(),
        role: (role || '').trim(),
        feedback: feedback.trim(),
        avatar: avatar || '👤',
        imageUrl: imageUrl || '',
        rating: rating || 5,
        order: order || 0,
        status: status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await reviewsCollection.insertOne(newReview);
      newReview._id = result.insertedId;

      return res.status(201).json({ 
        success: true, 
        message: 'Review created successfully', 
        review: newReview 
      });
    }

    // PUT - Update existing review
    if (req.method === 'PUT') {
      const { id, name, role, feedback, avatar, imageUrl, rating, order, status } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Review ID is required' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID' });
      }

      const updateData = {
        updatedAt: new Date()
      };

      if (name !== undefined) updateData.name = name.trim();
      if (role !== undefined) updateData.role = role.trim();
      if (feedback !== undefined) updateData.feedback = feedback.trim();
      if (avatar !== undefined) updateData.avatar = avatar;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (rating !== undefined) updateData.rating = rating;
      if (order !== undefined) updateData.order = order;
      if (status !== undefined) updateData.status = status;

      const result = await reviewsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Review updated successfully' 
      });
    }

    // DELETE - Delete review
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Review ID is required' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID' });
      }

      const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Review deleted successfully' 
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};
