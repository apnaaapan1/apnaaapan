// Simple hardcoded-style admin authentication using environment variables.
// Only the configured email and password can log in. No "forgot password" flow.

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}




