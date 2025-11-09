import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// MongoDB Atlas connection string - you'll need to replace this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI = 'mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER = 'r66408650@gmail.com'; // Your email
const EMAIL_PASS = process.env.EMAIL_PASS = 'stcv jhty rvtv otxx'; // Your email password or app password
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL = 'r66408650@gmail.com'; // Email where you want to receive contact form submissions

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate environment variables
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    return res.status(500).json({ 
      message: 'Server configuration error. Please contact the administrator.',
      error: 'MISSING_ENV_VAR'
    });
  }

  let client = null;

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

    // Connect to MongoDB Atlas with proper error handling
    try {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        connectTimeoutMS: 10000,
      });
      
      await client.connect();
      console.log('✅ Connected to MongoDB successfully');
    } catch (connectionError) {
      console.error('❌ MongoDB connection error:', connectionError);
      return res.status(500).json({ 
        message: 'Database connection failed. Please try again later.',
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
    const result = await collection.insertOne(contactData);
    console.log('Contact form submission saved:', result.insertedId);

    // Send email notification
    if (EMAIL_USER && EMAIL_PASS && RECIPIENT_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // You can change this to your email provider
          auth: {
            user: 'r66408650@gmail.com',
            pass: 'stcv jhty rvtv otxx'
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
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails - data is already saved to DB
      }
    } else {
      console.warn('Email configuration missing. Email notification skipped.');
    }

    // Close MongoDB connection
    if (client) {
      await client.close();
    }

    // Send success response
    res.status(200).json({ 
      message: 'Contact form submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('❌ Error processing contact form:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    // Close MongoDB connection in case of error (if client exists)
    if (client) {
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
        errorMessage = 'Unable to reach database server. Please check your connection string.';
        errorCode = 'DB_NETWORK_ERROR';
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Database connection timeout. Please try again.';
        errorCode = 'DB_TIMEOUT_ERROR';
      } else if (error.message.includes('MongoServerError') || error.message.includes('MongoError')) {
        errorMessage = 'Database error occurred. Please try again later.';
        errorCode = 'DB_ERROR';
      }
    }

    res.status(500).json({ 
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
