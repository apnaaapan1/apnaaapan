const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

// MongoDB Atlas connection string - you'll need to replace this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority';
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnapan_contacts';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER; // Your email
const EMAIL_PASS = process.env.EMAIL_PASS; // Your email password or app password
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL; // Email where you want to receive contact form submissions

export default async function handler(req, res) {
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
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
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
      const transporter = nodemailer.createTransporter({
        service: 'gmail', // You can change this to your email provider
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
      console.log('Email notification sent successfully');
    }

    // Close MongoDB connection
    await client.close();

    // Send success response
    res.status(200).json({ 
      message: 'Contact form submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Close MongoDB connection in case of error
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }

    res.status(500).json({ 
      message: 'Internal server error. Please try again later.',
      error: 'SERVER_ERROR'
    });
  }
}
