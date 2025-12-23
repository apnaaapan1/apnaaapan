require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

async function viewBlogs() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB\n');

    const db = client.db(DATABASE_NAME);
    const blogsCollection = db.collection('blogs');
    
    const blogs = await blogsCollection.find({}).toArray();
    
    console.log(`Found ${blogs.length} blog(s) in database:\n`);
    console.log('================================================');
    
    blogs.forEach((blog, index) => {
      console.log(`\n${index + 1}. Title: ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Status: ${blog.status}`);
      console.log(`   Read Time: ${blog.readTime}`);
      console.log(`   Created: ${blog.createdAt}`);
      console.log(`   Content: ${blog.content?.length || 0} paragraphs`);
    });
    
    console.log('\n================================================');
    
    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

viewBlogs();
