const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  const headerSecret = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];
  return headerSecret === ADMIN_SECRET;
}

// Multer config for Vercel (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  }

  // Check admin auth
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: 'Unauthorized: missing or invalid admin secret',
      error: 'UNAUTHORIZED',
    });
  }

  // Handle file upload with multer
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

      // Check Cloudinary config
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({
          message: 'Cloudinary is not configured. Please add credentials to environment variables.',
          error: 'CLOUDINARY_NOT_CONFIGURED',
        });
      }

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'apnaaapan_work',
            resource_type: 'auto',
            timeout: 300000,
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
        details: error.message,
      });
    }
  });
};

// Disable body parser for multer
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
