const { MongoClient } = require('mongodb');
require('dotenv').config();

// Test MongoDB connection and contact form setup
async function testContactFormSetup() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Testing Contact Form Setup');
  console.log('='.repeat(60) + '\n');

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const DATABASE_NAME = process.env.DATABASE_NAME || 'apnapan_contacts';
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('   MONGODB_URI:', MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('   DATABASE_NAME:', DATABASE_NAME);
  console.log('   EMAIL_USER:', EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('   EMAIL_PASS:', EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('   RECIPIENT_EMAIL:', RECIPIENT_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('');

  // Test MongoDB connection
  console.log('🔌 Testing MongoDB Connection...');
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('   ✅ MongoDB connection successful!');
    
    // Test database access
    const db = client.db(DATABASE_NAME);
    console.log(`   ✅ Database "${DATABASE_NAME}" accessible`);
    
    // Test collection
    const collection = db.collection('contact_submissions');
    const count = await collection.countDocuments();
    console.log(`   ✅ Collection "contact_submissions" accessible`);
    console.log(`   📊 Current submissions in database: ${count}`);
    
    // Test write operation
    const testDoc = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      question: 'This is a test submission',
      submittedAt: new Date(),
      test: true
    };
    
    const result = await collection.insertOne(testDoc);
    console.log(`   ✅ Write test successful! ID: ${result.insertedId}`);
    
    // Clean up test document
    await collection.deleteOne({ _id: result.insertedId });
    console.log('   🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('   ❌ MongoDB connection failed!');
    console.error('   Error:', error.message);
    console.error('   Error Code:', error.code);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n   💡 Solution: Check your MongoDB username and password in MONGODB_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n   💡 Solution: Check your MongoDB cluster URL');
    } else if (error.message.includes('timeout')) {
      console.error('\n   💡 Solution: Check your network connection and MongoDB IP whitelist');
    }
    
    if (client) {
      await client.close();
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('   🔌 MongoDB connection closed\n');
    }
  }

  // Email configuration check
  console.log('📧 Email Configuration Check:');
  if (EMAIL_USER && EMAIL_PASS && RECIPIENT_EMAIL) {
    console.log('   ✅ Email configuration complete');
    console.log('   📤 From:', EMAIL_USER);
    console.log('   📥 To:', RECIPIENT_EMAIL);
  } else {
    console.log('   ⚠️  Email configuration incomplete');
    console.log('   📝 Note: Form will work but emails won\'t be sent');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests passed! Contact form should work correctly.');
  console.log('='.repeat(60) + '\n');
  
  console.log('📝 Next Steps:');
  console.log('   1. Make sure server.js is running: npm run server');
  console.log('   2. Make sure React app is running: npm start');
  console.log('   3. Test the contact form at http://localhost:3000/contact');
  console.log('');
}

// Run the test
testContactFormSetup().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


