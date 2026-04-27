const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

// Shared env
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const DEFAULT_VIDEO_FOLDER = process.env.CLOUDINARY_VIDEO_FOLDER || 'apnaaapan_videos';
const DEFAULT_GRAPHICS_FOLDER = process.env.CLOUDINARY_GRAPHICS_FOLDER || 'apnaaapan_graphics';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'apnaaapan_user';

let cachedClient = null;

async function getDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await cachedClient.connect();
  }
  const db = cachedClient.db(DATABASE_NAME);
  return db;
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

function sanitizePublicId(input) {
  return String(input || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getPublicIdFromFilename(filename) {
  const base =
    String(filename || '').split('.').slice(0, -1).join('.') ||
    String(filename || '').replace(/\.[^/.]+$/, '');
  const safeBase = sanitizePublicId(base) || 'asset';
  const random = Math.random().toString(36).slice(2, 9);
  return `${safeBase}_${Date.now()}_${random}`;
}

function sendCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');
}

const uploadImageMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'));
  },
});

function resolveRoute(req) {
  // For Vercel rewrites we pass ?route=...
  const queryRoute = req.query?.route;
  if (queryRoute) return String(queryRoute);

  // For local Express mounts we infer from the path.
  const p = String(req.path || '');
  if (p.endsWith('/api/videos') || p === '/api/videos') return 'videos';
  if (p.endsWith('/api/cloudinary-video-signature') || p === '/api/cloudinary-video-signature') {
    return 'cloudinary-video-signature';
  }
  if (p.endsWith('/api/graphics') || p === '/api/graphics') return 'graphics';
  if (p.endsWith('/api/cloudinary-graphic-signature') || p === '/api/cloudinary-graphic-signature') {
    return 'cloudinary-graphic-signature';
  }
  if (p.endsWith('/api/upload-image') || p === '/api/upload-image') return 'upload-image';
  return '';
}

function normalizeMethod(req) {
  return String(req?.method || '').toUpperCase();
}

async function handleVideoSignature(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (normalizeMethod(req) !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      message: 'Cloudinary is not configured. Please add CLOUDINARY_* variables to .env.',
      error: 'CLOUDINARY_NOT_CONFIGURED',
    });
  }

  const { filename, folder, public_id } = req.body || {};
  const uploadFolder = folder && String(folder).trim() ? String(folder).trim() : DEFAULT_VIDEO_FOLDER;
  const finalPublicId =
    public_id && String(public_id).trim() ? sanitizePublicId(public_id) : getPublicIdFromFilename(filename);

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    timeout: 120000,
  });

  const timestamp = Math.floor(Date.now() / 1000);

  // IMPORTANT: exclude resource_type when signing.
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: uploadFolder,
      public_id: finalPublicId,
    },
    CLOUDINARY_API_SECRET
  );

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

  return res.status(200).json({
    upload_url: uploadUrl,
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: uploadFolder,
    public_id: finalPublicId,
  });
}

async function handleGraphicSignature(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (normalizeMethod(req) !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      message: 'Cloudinary is not configured. Please add CLOUDINARY_* variables to .env.',
      error: 'CLOUDINARY_NOT_CONFIGURED',
    });
  }

  const { filename, folder, public_id } = req.body || {};
  const uploadFolder =
    folder && String(folder).trim() ? String(folder).trim() : DEFAULT_GRAPHICS_FOLDER;
  const finalPublicId =
    public_id && String(public_id).trim() ? sanitizePublicId(public_id) : getPublicIdFromFilename(filename);

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    timeout: 120000,
  });

  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: uploadFolder,
      public_id: finalPublicId,
    },
    CLOUDINARY_API_SECRET
  );

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  return res.status(200).json({
    upload_url: uploadUrl,
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: uploadFolder,
    public_id: finalPublicId,
  });
}

function sanitizeVideoInput(body) {
  const { title, videoUrl, publicId, status } = body || {};
  return {
    title: typeof title === 'string' ? title.trim() : '',
    videoUrl: typeof videoUrl === 'string' ? videoUrl.trim() : '',
    publicId: typeof publicId === 'string' ? publicId.trim() : '',
    status: status === 'draft' ? 'draft' : 'published',
  };
}

function sanitizeGraphicInput(body) {
  const { title, imageUrl, publicId, status } = body || {};
  return {
    title: typeof title === 'string' ? title.trim() : '',
    imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
    publicId: typeof publicId === 'string' ? publicId.trim() : '',
    status: status === 'draft' ? 'draft' : 'published',
  };
}

async function handleVideosDb(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const method = normalizeMethod(req);
  const db = await getDb();
  const collection = db.collection('videos');
  const isAdminRequest = isAdmin(req);
  const { includeDrafts } = req.query || {};

  if (method === 'GET') {
    const filter = {};
    if (!isAdminRequest || includeDrafts !== 'true') filter.status = 'published';

    const docs = await collection.find(filter).sort({ createdAt: -1, _id: -1 }).toArray();
    return res.status(200).json({
      videos: docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        videoUrl: doc.videoUrl,
        publicId: doc.publicId || '',
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  }

  if (method === 'POST') {
    if (!isAdminRequest) return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });

    const video = sanitizeVideoInput(req.body);
    if (!video.title) return res.status(400).json({ message: 'Title is required', error: 'MISSING_TITLE' });
    if (!video.videoUrl) {
      return res.status(400).json({ message: 'videoUrl is required', error: 'MISSING_VIDEO_URL' });
    }

    const now = new Date();
    const doc = {
      title: video.title,
      videoUrl: video.videoUrl,
      publicId: video.publicId || '',
      status: video.status,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);
    return res.status(201).json({ message: 'Video saved successfully', id: result.insertedId.toString() });
  }

  if (method === 'DELETE') {
    if (!isAdminRequest) return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });

    const id = req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ message: 'Video id is required', error: 'MISSING_ID' });
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid video id', error: 'INVALID_ID' });

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Video not found', error: 'NOT_FOUND' });
    }

    return res.status(200).json({ message: 'Video deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
}

async function handleGraphicsDb(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const method = normalizeMethod(req);
  const db = await getDb();
  const collection = db.collection('graphics_portfolio');
  const isAdminRequest = isAdmin(req);
  const { includeDrafts } = req.query || {};

  if (method === 'GET') {
    const filter = {};
    if (!isAdminRequest || includeDrafts !== 'true') filter.status = 'published';

    const docs = await collection.find(filter).sort({ createdAt: -1, _id: -1 }).toArray();
    return res.status(200).json({
      graphics: docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        imageUrl: doc.imageUrl,
        publicId: doc.publicId || '',
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  }

  if (method === 'POST') {
    if (!isAdminRequest) return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });

    const graphic = sanitizeGraphicInput(req.body);
    if (!graphic.imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required', error: 'MISSING_IMAGE_URL' });
    }

    const now = new Date();
    const doc = {
      title: graphic.title || 'Graphic',
      imageUrl: graphic.imageUrl,
      publicId: graphic.publicId || '',
      status: graphic.status,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);
    return res.status(201).json({ message: 'Graphic saved successfully', id: result.insertedId.toString() });
  }

  if (method === 'DELETE') {
    if (!isAdminRequest) return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });

    const id = req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ message: 'Graphic id is required', error: 'MISSING_ID' });
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid graphic id', error: 'INVALID_ID' });

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Graphic not found', error: 'NOT_FOUND' });
    }

    return res.status(200).json({ message: 'Graphic deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
}

/** Was api/upload-image.js; folded into this router to stay under Vercel Hobby 12 functions. */
function handleUploadImage(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  }
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 120000,
  });

  return uploadImageMulter.single('image')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'File too large. Max 10MB allowed.',
          error: 'FILE_TOO_LARGE',
        });
      }
      return res.status(400).json({
        message: err.message || 'Upload error',
        error: 'UPLOAD_MULTER_ERROR',
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided', error: 'NO_FILE' });
      }
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return res.status(500).json({ message: 'Cloudinary is not configured', error: 'CLOUDINARY_NOT_CONFIGURED' });
      }

      const result = await new Promise((resolve, reject) => {
        let timeoutId;
        try {
          timeoutId = setTimeout(() => {
            reject(new Error('Upload timeout - image took too long to upload'));
          }, 280000);

          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'apnaaapan_work', resource_type: 'auto', timeout: 300000 },
            (error, uploadResult) => {
              clearTimeout(timeoutId);
              if (error) reject(error);
              else resolve(uploadResult);
            }
          );
          uploadStream.on('error', (e) => {
            clearTimeout(timeoutId);
            reject(e);
          });
          uploadStream.end(req.file.buffer);
        } catch (e) {
          clearTimeout(timeoutId);
          reject(e);
        }
      });

      return res.status(200).json({
        message: 'Image uploaded successfully',
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        message: error?.message || 'Failed to upload image',
        error: 'UPLOAD_ERROR',
        details: error?.http_code ? `Cloudinary error ${error.http_code}` : undefined,
      });
    }
  });
}

module.exports = async function handler(req, res) {
  sendCors(res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const route = resolveRoute(req);
    if (!route) {
      return res.status(404).json({ message: 'Unknown route', error: 'UNKNOWN_ROUTE' });
    }

    if (route === 'cloudinary-video-signature') return handleVideoSignature(req, res);
    if (route === 'cloudinary-graphic-signature') return handleGraphicSignature(req, res);
    if (route === 'videos') return handleVideosDb(req, res);
    if (route === 'graphics') return handleGraphicsDb(req, res);
    if (route === 'upload-image') return handleUploadImage(req, res);

    return res.status(404).json({ message: 'Unknown route', error: 'UNKNOWN_ROUTE' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: 'SERVER_ERROR',
      details: err?.message,
    });
  }
};

