require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET');

// Test connection
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ SUCCESS! Cloudinary credentials are correct!');
    console.log('Status:', result.status);
  })
  .catch(error => {
    console.log('\n❌ ERROR! Cloudinary credentials are invalid!');
    console.log('Error:', error.message);
    console.log('\nPlease check your .env file and verify:');
    console.log('1. Cloud Name is correct');
    console.log('2. API Key is correct');
    console.log('3. API Secret is correct (case-sensitive!)');
  });
