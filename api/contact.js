const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'r66408650@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'stcv jhty rvtv otxx';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'r66408650@gmail.com';

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phoneNumber, question } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !question) {
      return res.status(400).json({ 
        message: 'All fields are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      });
    }

    // Connect to MongoDB Atlas
    let client;
    try {
      console.log('Attempting to connect to MongoDB...');
      console.log('Database Name:', DATABASE_NAME);
      
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        connectTimeoutMS: 10000,
      });
      
      await client.connect();
      console.log('✅ Connected to MongoDB successfully');
      
      // Test the connection
      await client.db('admin').command({ ping: 1 });
      console.log('✅ MongoDB ping successful');
    } catch (connectionError) {
      console.error('❌ MongoDB connection error:');
      console.error('Error Name:', connectionError.name);
      console.error('Error Message:', connectionError.message);
      console.error('Error Code:', connectionError.code);
      
      let errorMessage = 'Database connection failed. Please try again later.';
      if (connectionError.message && connectionError.message.includes('authentication failed')) {
        errorMessage = 'Database authentication failed. Please check your MongoDB credentials.';
      } else if (connectionError.message && connectionError.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to reach MongoDB server. Please check your connection string.';
      } else if (connectionError.message && connectionError.message.includes('timeout')) {
        errorMessage = 'Database connection timeout. Please check your network connection.';
      }
      
      return res.status(500).json({ 
        message: errorMessage,
        error: 'DB_CONNECTION_ERROR',
        details: process.env.NODE_ENV === 'development' ? connectionError.message : undefined
      });
    }

    const db = client.db(DATABASE_NAME);
    const collection = db.collection('contact_submissions');

    // Create contact submission document
    const contactData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      question: question.trim(),
      submittedAt: new Date(),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Save to database
    console.log('Saving contact submission to database...');
    const result = await collection.insertOne(contactData);
    console.log('✅ Contact form submission saved successfully!');
    console.log('   Submission ID:', result.insertedId);
    console.log('   Name:', contactData.firstName, contactData.lastName);
    console.log('   Email:', contactData.email);

    // Send email notification
    if (EMAIL_USER && EMAIL_PASS && RECIPIENT_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
          }
        });

      const mailOptions = {
        from: EMAIL_USER,
        to: RECIPIENT_EMAIL,
        subject: `New Contact Form Submission from ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F26B2A;">New Contact Form Submission</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0D1B2A; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> +91 ${phoneNumber}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
              <h3 style="color: #0D1B2A; margin-top: 0;">Question/Message</h3>
              <p style="line-height: 1.6;">${question.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
              <p style="margin: 0; color: #0066cc; font-size: 14px;">
                <strong>Note:</strong> This is an automated email from your website's contact form.
              </p>
            </div>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Phone: +91 ${phoneNumber}
Submitted: ${new Date().toLocaleString()}

Question/Message:
${question}

---
This is an automated email from your website's contact form.
        `
      };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email notification sent successfully');
      } catch (emailError) {
        console.error('❌ Error sending email notification:', emailError);
        // Don't fail the request if email fails - data is already saved to DB
      }
    } else {
      console.warn('⚠️  Email configuration missing. Email notification skipped.');
    }

    // Close MongoDB connection
    await client.close();
    console.log('🔌 MongoDB connection closed');

    // Send success response
    res.status(200).json({ 
      message: 'Contact form submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    // Log full error details for debugging
    console.error('❌ Error processing contact form:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    // Close MongoDB connection in case of error (if client exists)
    if (typeof client !== 'undefined' && client) {
      try {
        await client.close();
        console.log('MongoDB connection closed after error');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }

    // Provide more specific error messages based on error type
    let errorMessage = 'Internal server error. Please try again later.';
    let errorCode = 'SERVER_ERROR';
    
    if (error.message) {
      if (error.message.includes('authentication failed') || error.message.includes('Authentication failed')) {
        errorMessage = 'Database authentication failed. Please check your MongoDB credentials.';
        errorCode = 'DB_AUTH_ERROR';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        errorMessage = 'Unable to reach database server. Please check your internet connection.';
        errorCode = 'DB_NETWORK_ERROR';
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Database connection timeout. Please try again.';
        errorCode = 'DB_TIMEOUT_ERROR';
      } else if (error.message.includes('MongoServerError') || error.message.includes('MongoError')) {
        errorMessage = 'Database error occurred. Please try again later.';
        errorCode = 'DB_ERROR';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Database connection refused. Please check if MongoDB server is running.';
        errorCode = 'DB_CONNECTION_REFUSED';
      }
    }

    res.status(500).json({ 
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
