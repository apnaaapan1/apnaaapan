const cloudinary = require('cloudinary').v2;

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const DEFAULT_VIDEO_FOLDER = process.env.CLOUDINARY_VIDEO_FOLDER || 'apnaaapan_videos';

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
  const base = String(filename || '').split('.').slice(0, -1).join('.') || String(filename || '').replace(/\.[^/.]+$/, '');
  const safeBase = sanitizePublicId(base) || 'video';
  const random = Math.random().toString(36).slice(2, 9);
  return `${safeBase}_${Date.now()}_${random}`;
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, x-admin-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'METHOD_NOT_ALLOWED' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized', error: 'UNAUTHORIZED' });
  }

  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        message: 'Cloudinary is not configured. Please add CLOUDINARY_* variables to .env.',
        error: 'CLOUDINARY_NOT_CONFIGURED',
      });
    }

    const { filename, folder, public_id } = req.body || {};
    const uploadFolder = folder && String(folder).trim() ? String(folder).trim() : DEFAULT_VIDEO_FOLDER;

    const finalPublicId = public_id && String(public_id).trim()
      ? sanitizePublicId(public_id)
      : getPublicIdFromFilename(filename);

    // Configure Cloudinary for signature generation helpers
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      timeout: 120000,
    });

    const resourceType = 'video';
    const timestamp = Math.floor(Date.now() / 1000);

    // IMPORTANT:
    // Cloudinary signed upload signature should exclude:
    // - file
    // - cloud_name
    // - api_key
    // - resource_type
    // (but resource_type can still be sent in the actual upload request).
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: uploadFolder,
        public_id: finalPublicId,
      },
      CLOUDINARY_API_SECRET
    );

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

    return res.status(200).json({
      upload_url: uploadUrl,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: uploadFolder,
      resource_type: resourceType,
      public_id: finalPublicId,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to generate Cloudinary signature',
      error: 'SIGNATURE_GENERATION_ERROR',
      details: err?.message,
    });
  }
};

