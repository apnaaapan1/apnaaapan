const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection test
async function testMongoDBConnection() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const DATABASE_NAME = process.env.DATABASE_NAME || 'apnapan_contacts';
  
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log(`📋 Database Name: ${DATABASE_NAME}`);
  console.log(`🔗 Connection URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`); // Hide credentials in output
  
  let client;
  
  try {
    // Create MongoDB client
    client = new MongoClient(MONGODB_URI);
    
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!\n');
    
    // Test database access
    const db = client.db(DATABASE_NAME);
    console.log(`📊 Accessing database: ${DATABASE_NAME}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }
    
    // Test write operation
    const testCollection = db.collection('connection_test');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test'
    };
    
    console.log('\n🧪 Testing write operation...');
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`✅ Write test successful! Document ID: ${insertResult.insertedId}`);
    
    // Test read operation
    console.log('🧪 Testing read operation...');
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    if (readResult) {
      console.log('✅ Read test successful!');
    }
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up\n');
    
    // Test contact_submissions collection (if exists)
    const contactCollection = db.collection('contact_submissions');
    const contactCount = await contactCollection.countDocuments();
    console.log(`📝 Contact submissions in database: ${contactCount}`);
    
    console.log('\n✅ All MongoDB tests passed!');
    console.log('🎉 MongoDB connection is working correctly!\n');
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!\n');
    console.error('Error Details:');
    console.error('─'.repeat(50));
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication Error:');
      console.error('   - Check your MongoDB username and password');
      console.error('   - Verify credentials in MONGODB_URI');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 Network Error:');
      console.error('   - Check your internet connection');
      console.error('   - Verify MongoDB cluster URL is correct');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️  Timeout Error:');
      console.error('   - MongoDB server may be slow to respond');
      console.error('   - Check your network connection');
    } else {
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
    }
    
    console.error('\n💡 Troubleshooting Tips:');
    console.error('   1. Verify MONGODB_URI in .env file');
    console.error('   2. Check MongoDB Atlas IP whitelist settings');
    console.error('   3. Ensure database user has proper permissions');
    console.error('   4. Verify network connectivity to MongoDB Atlas\n');
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Run the test
testMongoDBConnection();

