const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
// Note: If your MongoDB URI already includes the database name, DATABASE_NAME will override it
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// Admin Panel Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000 // 60 seconds timeout
});

// Multer configuration for handling file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // Increase limit to 10MB to allow larger photos; front-end will also validate
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Blog API - MongoDB connection caching
let blogsDbClient = null;

async function getBlogsDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!blogsDbClient) {
    blogsDbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await blogsDbClient.connect();
  }

  const db = blogsDbClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('blogs'),
  };
}

// Share the same Mongo client for managing open positions
async function getPositionsDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!blogsDbClient) {
    blogsDbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await blogsDbClient.connect();
  }

  const db = blogsDbClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('open_positions'),
  };
}

// Work posts API - share same Mongo client
async function getWorkDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!blogsDbClient) {
    blogsDbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await blogsDbClient.connect();
  }

  const db = blogsDbClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('work_posts'),
  };
}

// Reviews API - share same Mongo client
async function getReviewsDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!blogsDbClient) {
    blogsDbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await blogsDbClient.connect();
  }

  const db = blogsDbClient.db(DATABASE_NAME);
  return {
    db,
    collection: db.collection('reviews'),
  };
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret =
    req.headers['x-admin-token'] ||
    req.headers['X-Admin-Token'] ||
    req.headers['x-admin-secret'] ||
    req.headers['X-Admin-Secret'];
  return headerSecret === ADMIN_SECRET;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function sanitizeBlogInput(body) {
  const {
    title,
    slug,
    readTime,
    heroImage,
    content,
    status,
  } = body || {};

  // Auto-generate slug from title if not provided
  const finalSlug = slug && typeof slug === 'string' && slug.trim() 
    ? slug.trim().toLowerCase() 
    : generateSlug(title || '');

  return {
    title: typeof title === 'string' ? title.trim() : '',
    slug: finalSlug,
    readTime: typeof readTime === 'string' ? readTime.trim() : '',
    heroImage: typeof heroImage === 'string' ? heroImage.trim() : '',
    content: Array.isArray(content)
      ? content.map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean)
      : [],
    status: status === 'draft' ? 'draft' : 'published',
  };
}

function sanitizePositionInput(body) {
  const { title, description, applyUrl, status } = body || {};

  return {
    title: typeof title === 'string' ? title.trim() : '',
    description: typeof description === 'string' ? description.trim() : '',
    applyUrl: typeof applyUrl === 'string' ? applyUrl.trim() : '',
    status: status === 'draft' ? 'draft' : 'published',
  };
}

function sanitizeWorkInput(body) {
  const { title, description, image, alt, categories, tags, status } = body || {};
  const safeCategories = Array.isArray(categories)
    ? categories.map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean)
    : [];
  const safeTags = Array.isArray(tags)
    ? tags.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean)
    : [];

  return {
    title: typeof title === 'string' ? title.trim() : '',
    description: typeof description === 'string' ? description.trim() : '',
    image: typeof image === 'string' ? image.trim() : '',
    alt: typeof alt === 'string' ? alt.trim() : '',
    categories: safeCategories,
    tags: safeTags,
    status: status === 'draft' ? 'draft' : 'published',
  };
}

// Contact form API endpoint
app.post('/api/contact', async (req, res) => {
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
      console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
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
      if (connectionError.message.includes('authentication failed')) {
        errorMessage = 'Database authentication failed. Please check your MongoDB username and password.';
      } else if (connectionError.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to reach MongoDB server. Please check your connection string.';
      } else if (connectionError.message.includes('timeout')) {
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
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
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
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails - data is already saved to DB
      }
    } else {
      console.warn('Email configuration missing. Email notification skipped.');
    }

    // Close MongoDB connection
    await client.close();

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
    console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
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
});

// Admin Login API endpoint
app.post('/api/admin-login', async (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_SECRET) {
    console.error('ADMIN_LOGIN: Admin credentials or secret are not configured in environment.');
    return res.status(500).json({
      message: 'Admin authentication is not configured on the server.',
      error: 'ADMIN_CONFIG_MISSING',
    });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
      error: 'MISSING_CREDENTIALS',
    });
  }

  const isValid =
    email === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD;

  if (!isValid) {
    return res.status(401).json({
      message: 'Invalid admin credentials.',
      error: 'INVALID_CREDENTIALS',
    });
  }

  // Return a static token derived from ADMIN_SECRET; client will send it with blog admin requests.
  return res.status(200).json({
    message: 'Login successful.',
    token: ADMIN_SECRET,
  });
});

// Image Upload API endpoint (Admin only)
app.post('/api/upload-image', (req, res) => {
  // Admin-only endpoint
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  // Run multer and capture errors to always return JSON (avoid HTML error pages)
  upload.single('image')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'File too large. Max 10MB allowed.',
          error: 'FILE_TOO_LARGE',
          maxBytes: 10 * 1024 * 1024,
        });
      }
      return res.status(400).json({
        message: err.message || 'Upload error',
        error: 'UPLOAD_MULTER_ERROR',
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No image file provided',
          error: 'NO_FILE',
        });
      }

      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({
          message: 'Cloudinary is not configured. Please add credentials to .env file.',
          error: 'CLOUDINARY_NOT_CONFIGURED',
        });
      }

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'apnaaapan_work',
            resource_type: 'auto',
            timeout: 300000, // 5 minutes timeout
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.on('error', (e) => reject(e));
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;

      return res.status(200).json({
        message: 'Image uploaded successfully',
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      let errorMsg = 'Failed to upload image';
      if (error.message && error.message.includes('Timeout')) {
        errorMsg = 'Upload timeout - please try again or use a smaller image.';
      }
      return res.status(500).json({
        message: errorMsg,
        error: 'UPLOAD_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  });
});

// Blogs API endpoint
app.get('/api/blogs', async (req, res) => {
  try {
    const { db, collection } = await getBlogsDb();

    const { slug, includeDrafts } = req.query || {};
    const isAdminRequest = isAdmin(req);

    const filter = {};

    if (slug) {
      filter.slug = slug;
    }

    if (!isAdminRequest || includeDrafts !== 'true') {
      // Public: only published
      filter.status = 'published';
    }

    if (slug) {
      const doc = await collection.findOne(filter);
      if (!doc) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      return res.status(200).json({
        blog: {
          id: doc._id.toString(),
          title: doc.title,
          slug: doc.slug,
          readTime: doc.readTime,
          heroImage: doc.heroImage,
          content: doc.content,
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      });
    }

    const docs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      blogs: docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        readTime: doc.readTime,
        heroImage: doc.heroImage,
        content: doc.content,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error) {
    console.error('BLOGS API GET error:', error);
    return res.status(500).json({
      message: 'Failed to fetch blogs',
      error: 'BLOGS_GET_ERROR',
    });
  }
});

app.post('/api/blogs', async (req, res) => {
  // Admin-only endpoint
  if (!isAdmin(req)) {
    console.log('BLOGS API: Admin check failed. Headers:', req.headers);
    console.log('BLOGS API: ADMIN_SECRET exists?', !!ADMIN_SECRET);
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    console.log('BLOGS API: Creating blog...');
    const { db, collection } = await getBlogsDb();
    const blog = sanitizeBlogInput(req.body);

    console.log('BLOGS API: Blog data:', blog);

    if (!blog.title) {
      return res.status(400).json({
        message: 'Title is required',
        error: 'MISSING_FIELDS',
      });
    }

    // Ensure unique slug
    const existing = await collection.findOne({ slug: blog.slug });
    if (existing) {
      return res.status(409).json({
        message: 'Slug already exists. Please choose another.',
        error: 'DUPLICATE_SLUG',
      });
    }

    const now = new Date();
    const doc = {
      ...blog,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);
    console.log('BLOGS API: Blog created successfully with ID:', result.insertedId);

    return res.status(201).json({
      message: 'Blog created successfully',
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('BLOGS API POST error:', error.message);
    console.error('BLOGS API POST error stack:', error.stack);
    return res.status(500).json({
      message: 'Failed to create blog',
      error: 'BLOGS_CREATE_ERROR',
      details: error.message,
    });
  }
});

app.put('/api/blogs', async (req, res) => {
  // Admin-only endpoint
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { db, collection } = await getBlogsDb();
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({
        message: 'Blog id is required',
        error: 'MISSING_ID',
      });
    }

    const blog = sanitizeBlogInput(req.body);

    const update = {
      $set: {
        title: blog.title,
        slug: blog.slug,
        readTime: blog.readTime,
        heroImage: blog.heroImage,
        content: blog.content,
        status: blog.status,
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Blog not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Blog updated successfully',
    });
  } catch (error) {
    console.error('BLOGS API PUT error:', error);
    return res.status(500).json({
      message: 'Failed to update blog',
      error: 'BLOGS_UPDATE_ERROR',
    });
  }
});

app.delete('/api/blogs', async (req, res) => {
  // Admin-only endpoint
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { db, collection } = await getBlogsDb();
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({
        message: 'Blog id is required',
        error: 'MISSING_ID',
      });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Blog not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('BLOGS API DELETE error:', error);
    return res.status(500).json({
      message: 'Failed to delete blog',
      error: 'BLOGS_DELETE_ERROR',
    });
  }
});

// Open Positions API endpoint (for "Work With Us" page)
app.get('/api/positions', async (req, res) => {
  try {
    const { collection } = await getPositionsDb();

    const { includeDrafts } = req.query || {};
    const isAdminRequest = isAdmin(req);

    const filter = {};

    if (!isAdminRequest || includeDrafts !== 'true') {
      filter.status = 'published';
    }

    const docs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      positions: docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        applyUrl: doc.applyUrl,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error) {
    console.error('POSITIONS API GET error:', error);
    return res.status(500).json({
      message: 'Failed to fetch positions',
      error: 'POSITIONS_GET_ERROR',
    });
  }
});

// Work Posts API endpoint (for Work page)
app.get('/api/work', async (req, res) => {
  try {
    const { collection } = await getWorkDb();

    const { includeDrafts } = req.query || {};
    const isAdminRequest = isAdmin(req);

    const filter = {};

    if (!isAdminRequest || includeDrafts !== 'true') {
      filter.status = 'published';
    }

    const docs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      work: docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        image: doc.image,
        alt: doc.alt,
        categories: doc.categories || [],
        tags: doc.tags || [],
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error) {
    console.error('WORK API GET error:', error);
    return res.status(500).json({
      message: 'Failed to fetch work posts',
      error: 'WORK_GET_ERROR',
    });
  }
});

app.post('/api/work', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { collection } = await getWorkDb();
    const work = sanitizeWorkInput(req.body);

    if (!work.title || !work.image) {
      return res.status(400).json({
        message: 'Title and image are required',
        error: 'MISSING_FIELDS',
      });
    }

    const now = new Date();
    const doc = {
      ...work,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);
    return res.status(201).json({
      message: 'Work post created successfully',
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('WORK API POST error:', error);
    return res.status(500).json({
      message: 'Failed to create work post',
      error: 'WORK_CREATE_ERROR',
    });
  }
});

app.put('/api/work', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({
        message: 'Work post id is required',
        error: 'MISSING_ID',
      });
    }

    const work = sanitizeWorkInput(req.body);
    const { collection } = await getWorkDb();

    const update = {
      $set: {
        title: work.title,
        description: work.description,
        image: work.image,
        alt: work.alt,
        categories: work.categories,
        tags: work.tags,
        status: work.status,
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Work post not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Work post updated successfully',
    });
  } catch (error) {
    console.error('WORK API PUT error:', error);
    return res.status(500).json({
      message: 'Failed to update work post',
      error: 'WORK_UPDATE_ERROR',
    });
  }
});

app.delete('/api/work', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({
        message: 'Work post id is required',
        error: 'MISSING_ID',
      });
    }

    const { collection } = await getWorkDb();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Work post not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Work post deleted successfully',
    });
  } catch (error) {
    console.error('WORK API DELETE error:', error);
    return res.status(500).json({
      message: 'Failed to delete work post',
      error: 'WORK_DELETE_ERROR',
    });
  }
});

app.post('/api/positions', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { collection } = await getPositionsDb();
    const position = sanitizePositionInput(req.body);

    if (!position.title) {
      return res.status(400).json({
        message: 'Title is required',
        error: 'MISSING_FIELDS',
      });
    }

    const now = new Date();
    const doc = {
      ...position,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);

    return res.status(201).json({
      message: 'Position created successfully',
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('POSITIONS API POST error:', error);
    return res.status(500).json({
      message: 'Failed to create position',
      error: 'POSITIONS_CREATE_ERROR',
    });
  }
});

app.put('/api/positions', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({
        message: 'Position id is required',
        error: 'MISSING_ID',
      });
    }

    const position = sanitizePositionInput(req.body);
    const { collection } = await getPositionsDb();

    const update = {
      $set: {
        title: position.title,
        description: position.description,
        applyUrl: position.applyUrl,
        status: position.status,
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Position not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Position updated successfully',
    });
  } catch (error) {
    console.error('POSITIONS API PUT error:', error);
    return res.status(500).json({
      message: 'Failed to update position',
      error: 'POSITIONS_UPDATE_ERROR',
    });
  }
});

app.delete('/api/positions', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  try {
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({
        message: 'Position id is required',
        error: 'MISSING_ID',
      });
    }

    const { collection } = await getPositionsDb();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Position not found',
        error: 'NOT_FOUND',
      });
    }

    return res.status(200).json({
      message: 'Position deleted successfully',
    });
  } catch (error) {
    console.error('POSITIONS API DELETE error:', error);
    return res.status(500).json({
      message: 'Failed to delete position',
      error: 'POSITIONS_DELETE_ERROR',
    });
  }
});

// ============================================
// REVIEWS API ENDPOINTS
// ============================================

// GET - Fetch all reviews (public: only active, admin: all if query param 'all=true')
app.get('/api/reviews', async (req, res) => {
  try {
    const { collection } = await getReviewsDb();
    const { all } = req.query;
    const isAdminRequest = isAdmin(req);

    const filter = {};
    
    // If admin token provided and 'all' query param, return all reviews
    if (!(all && isAdminRequest)) {
      filter.status = 'active';
    }

    const reviews = await collection
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      reviews: reviews.map((doc) => ({
        _id: doc._id.toString(),
        name: doc.name,
        role: doc.role || '',
        feedback: doc.feedback,
        avatar: doc.avatar || '👤',
        imageUrl: doc.imageUrl || '',
        rating: doc.rating || 5,
        order: doc.order || 0,
        status: doc.status || 'active',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    });
  } catch (error) {
    console.error('REVIEWS API GET error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// POST - Create new review (admin only)
app.post('/api/reviews', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    const { name, role, feedback, avatar, imageUrl, rating, order, status } = req.body;

    if (!name || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Name and feedback are required'
      });
    }

    const { collection } = await getReviewsDb();

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

    const result = await collection.insertOne(newReview);
    newReview._id = result.insertedId.toString();

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: newReview
    });
  } catch (error) {
    console.error('REVIEWS API POST error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// PUT - Update existing review (admin only)
app.put('/api/reviews', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    const { id, name, role, feedback, avatar, imageUrl, rating, order, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Review ID is required'
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const { collection } = await getReviewsDb();

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

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('REVIEWS API PUT error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// DELETE - Delete review (admin only)
app.delete('/api/reviews', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Review ID is required'
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const { collection } = await getReviewsDb();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('REVIEWS API DELETE error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    port: PORT,
    mongodb: MONGODB_URI ? 'Configured' : 'Not configured',
    database: DATABASE_NAME,
    email: EMAIL_USER && EMAIL_PASS && RECIPIENT_EMAIL ? 'Configured' : 'Not configured'
  });
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email notifications: ${EMAIL_USER && EMAIL_PASS && RECIPIENT_EMAIL ? '✅ Enabled' : '❌ Disabled (check .env file)'}`);
  console.log(`🗄️  MongoDB URI: ${MONGODB_URI ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`📊 Database Name: ${DATABASE_NAME}`);
  if (!EMAIL_USER || !EMAIL_PASS || !RECIPIENT_EMAIL) {
    console.log('\n⚠️  Warning: Email configuration incomplete. Form will work but emails won\'t be sent.');
  }
  console.log('='.repeat(50) + '\n');
});
