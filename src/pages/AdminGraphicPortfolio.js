import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  // Always hit the Express API on localhost (even if NODE_ENV is 'production')
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (isLocalhost) return `http://localhost:5000${endpoint}`;
  return endpoint;
};

const API_GRAPHICS = getApiUrl('/api/graphics');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_CLOUDINARY_SIGNATURE = getApiUrl('/api/cloudinary-graphic-signature');

function fileBaseName(filename) {
  return String(filename || '').split('.').slice(0, -1).join('.') || String(filename || '');
}

export default function AdminGraphicPortfolio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);

  const [graphics, setGraphics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const derivedTitle = useMemo(() => {
    const trimmed = String(title || '').trim();
    return trimmed || '';
  }, [title]);

  const fetchGraphics = useCallback(
    async (tokenForHeader) => {
      const token = tokenForHeader || adminToken;
      try {
        setLoading(true);
        setError('');
        const headers = token ? { 'x-admin-token': token } : undefined;
        const res = await fetch(`${API_GRAPHICS}?includeDrafts=true`, { headers });
        if (!res.ok) throw new Error('Failed to fetch graphics');
        const data = await res.json();
        setGraphics(Array.isArray(data.graphics) ? data.graphics : []);
      } catch (err) {
        setError('Unable to load graphics. Please check the server/API.');
      } finally {
        setLoading(false);
      }
    },
    [adminToken]
  );

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
    const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
    if (savedToken) {
      setAdminToken(savedToken);
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
      fetchGraphics(savedToken);
    }
  }, [fetchGraphics]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter admin email and password.');
      return;
    }
    try {
      setAuthChecking(true);
      setError('');
      setSuccess('');
      const res = await fetch(API_ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      const token = data.token || '';
      setAdminToken(token);
      window.sessionStorage.setItem('apnaaapan_admin_token', token);
      window.sessionStorage.setItem('apnaaapan_admin_email', email);
      setIsAuthenticated(true);
      await fetchGraphics(token);
      setSuccess('Logged in successfully.');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials or server error.');
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setPassword('');
    setGraphics([]);
    setTitle('');
    setError('');
    setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
  };

  const handleDeleteGraphic = async (graphicId) => {
    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to delete.');
      return;
    }
    const id = String(graphicId || '');
    if (!id) return;
    const confirmed = window.confirm('Delete this graphic? This cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');
      setDeletingId(id);

      const res = await fetch(`${API_GRAPHICS}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete graphic');

      setSuccess('Graphic deleted successfully!');
      await fetchGraphics(adminToken);
    } catch (err) {
      setError(err.message || 'Failed to delete graphic');
    } finally {
      setDeletingId('');
    }
  };

  const handleGraphicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to upload.');
      return;
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(String(file.type || '').toLowerCase())) {
      setError('Only JPG, PNG, WebP, and GIF images are allowed.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);
    setUploadProgress(0);

    const fallbackTitle = fileBaseName(file.name);
    const finalTitle = derivedTitle || fallbackTitle || 'Graphic';

    try {
      // 1) Get signed signature
      const sigRes = await fetch(API_CLOUDINARY_SIGNATURE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ filename: file.name }),
      });

      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.message || 'Failed to generate signature');

      const { upload_url, api_key, timestamp, signature, folder, public_id } = sigData;

      // 2) Upload direct to Cloudinary with progress
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      if (folder) formData.append('folder', folder);
      if (public_id) formData.append('public_id', public_id);

      const uploadResult = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url);

        xhr.upload.onprogress = (evt) => {
          if (!evt.lengthComputable) return;
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText || '{}'));
            } catch {
              reject(new Error('Cloudinary returned an invalid response.'));
            }
          } else {
            const body = (xhr.responseText || '').slice(0, 1000);
            reject(new Error(`Cloudinary upload failed (${xhr.status})${body ? ` - ${body}` : ''}`));
          }
        };

        xhr.onerror = () => reject(new Error('Cloudinary upload failed.'));
        xhr.send(formData);
      });

      const secureUrl = uploadResult?.secure_url;
      const cloudinaryPublicId = uploadResult?.public_id || public_id || '';
      if (!secureUrl) throw new Error('Cloudinary did not return a secure_url.');

      // 3) Save in DB
      const saveRes = await fetch(API_GRAPHICS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          title: finalTitle,
          imageUrl: secureUrl,
          publicId: cloudinaryPublicId,
          status: 'published',
        }),
      });

      const saveData = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) throw new Error(saveData.message || 'Failed to save graphic');

      setSuccess('Graphic uploaded successfully!');
      setUploadProgress(100);
      setTitle('');
      await fetchGraphics(adminToken);
    } catch (err) {
      setError(err.message || 'Graphic upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A]">Manage Graphic Portfolio</h1>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <p className="text-sm text-gray-700 mb-6">
          Upload graphics directly to Cloudinary (bypasses Vercel function size limits).
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {isAuthenticated && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#0D1B2A] mb-3">Admin Login</h2>
            <div className="flex flex-col gap-3 w-full md:w-2/3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
              />
              <button
                type="button"
                onClick={handleLogin}
                className="px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-start"
                disabled={authChecking}
              >
                {authChecking ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">Upload a Graphic</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: Brand Post Design"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Image File</label>
                  <label className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleGraphicUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploads directly to Cloudinary. Large images are supported.
                  </p>
                </div>

                {uploading && (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                      <span className="text-sm text-[#F26B2A] font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-[#F26B2A] transition-[width] duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0D1B2A]">Existing Graphics</h2>
                <button
                  type="button"
                  onClick={() => fetchGraphics(adminToken)}
                  className="text-sm text-[#4A70B0] hover:underline"
                  disabled={loading}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-gray-600">Loading graphics...</p>
              ) : graphics.length === 0 ? (
                <p className="text-sm text-gray-600">No graphics found yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {graphics.map((g) => (
                    <div key={g.id} className="border border-gray-200 rounded-lg p-2">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#0D1B2A] truncate">{g.title}</div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              g.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {g.status}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGraphic(g.id)}
                          disabled={deletingId === g.id}
                          className="px-2 py-1 rounded-lg border border-red-200 text-red-700 text-[11px] font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deletingId === g.id ? '...' : 'Delete'}
                        </button>
                      </div>

                      <div className="rounded-md overflow-hidden bg-white border border-black/10">
                        <img
                          src={g.imageUrl}
                          alt={g.title || 'Graphic'}
                          className="w-full h-28 object-contain bg-white"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

