require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

console.log('Testing Blog MongoDB Connection...');
console.log('MONGODB_URI:', MONGODB_URI ? '✓ Set' : '✗ NOT SET');
console.log('DATABASE_NAME:', DATABASE_NAME);
console.log('---');

async function testConnection() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected to MongoDB!');

    const db = client.db(DATABASE_NAME);
    console.log('✓ Database:', DATABASE_NAME);

    const blogsCollection = db.collection('blogs');
    const count = await blogsCollection.countDocuments();
    console.log('✓ Blogs collection exists with', count, 'documents');

    await client.close();
    console.log('✓ Connection closed successfully');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
