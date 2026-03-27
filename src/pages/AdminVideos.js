import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_VIDEOS = getApiUrl('/api/videos');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_CLOUDINARY_SIGNATURE = getApiUrl('/api/cloudinary-video-signature');
const MAX_VIDEO_SIZE_BYTES = 95 * 1024 * 1024;

function fileBaseName(filename) {
  return String(filename || '').split('.').slice(0, -1).join('.') || String(filename || '');
}

export default function AdminVideos() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadItems, setUploadItems] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const derivedTitle = useMemo(() => {
    const trimmed = String(title || '').trim();
    return trimmed || '';
  }, [title]);

  const fetchVideos = useCallback(
    async (tokenForHeader) => {
      const token = tokenForHeader || adminToken;
      try {
        setLoading(true);
        setError('');
        const headers = token ? { 'x-admin-token': token } : undefined;
        const res = await fetch(`${API_VIDEOS}?includeDrafts=true`, { headers });
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(Array.isArray(data.videos) ? data.videos : []);
      } catch (err) {
        setError('Unable to load videos. Please check the server/API.');
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
      fetchVideos(savedToken);
    }
  }, [fetchVideos]);

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
      await fetchVideos(token);
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
    setVideos([]);
    setTitle('');
    setError('');
    setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
  };

  const handleDeleteVideo = async (videoId) => {
    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to delete.');
      return;
    }
    const id = String(videoId || '');
    if (!id) return;

    const confirmed = window.confirm('Delete this video? This cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');
      setDeletingId(id);

      const res = await fetch(`${API_VIDEOS}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': adminToken,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete video');

      setSuccess('Video deleted successfully!');
      await fetchVideos(adminToken);
    } catch (err) {
      setError(err.message || 'Failed to delete video');
    } finally {
      setDeletingId('');
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to upload.');
      return;
    }

    const invalidFile = files.find((f) => !String(f.type || '').startsWith('video/'));
    if (invalidFile) {
      setError(`Invalid file type: ${invalidFile.name}. Please select only video files.`);
      return;
    }

    const oversizedFile = files.find((f) => f.size > MAX_VIDEO_SIZE_BYTES);
    if (oversizedFile) {
      setError(
        `File too large: ${oversizedFile.name}. Keep each video under 95MB for reliable direct upload.`
      );
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);
    setUploadProgress(0);
    setUploadItems(
      files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        progress: 0,
        status: 'queued',
        error: '',
      }))
    );

    let uploadedCount = 0;
    const failed = [];

    const updateUploadItem = (index, patch) => {
      setUploadItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
      );
    };

    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const fallbackTitle = fileBaseName(file.name);
        const finalTitle = files.length === 1 && derivedTitle ? derivedTitle : fallbackTitle || `Untitled Video ${i + 1}`;
        updateUploadItem(i, { status: 'uploading', progress: 0, error: '' });

        try {
          // 1) Ask backend for a signed Cloudinary upload signature.
          const sigRes = await fetch(API_CLOUDINARY_SIGNATURE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': adminToken,
            },
            body: JSON.stringify({
              filename: file.name,
              folder: process.env.REACT_APP_CLOUDINARY_VIDEO_FOLDER || undefined,
            }),
          });

          const sigData = await sigRes.json();
          if (!sigRes.ok) throw new Error(sigData.message || 'Failed to generate signature');

          const { upload_url, api_key, timestamp, signature, folder, public_id } = sigData;

          // 2) Upload video directly to Cloudinary (browser->Cloudinary only).
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', api_key);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);
          if (folder) formData.append('folder', folder);
          if (public_id) formData.append('public_id', public_id);

          const uploadWithXhr = () =>
            new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', upload_url);
              xhr.timeout = 8 * 60 * 1000;

              xhr.upload.onprogress = (progressEvent) => {
                if (!progressEvent.lengthComputable) return;
                const filePercent = progressEvent.loaded / progressEvent.total;
                const fileProgress = Math.round(filePercent * 100);
                const overallPercent = Math.round(((i + filePercent) / files.length) * 100);
                updateUploadItem(i, { progress: fileProgress, status: 'uploading' });
                setUploadProgress(overallPercent);
              };

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    const data = JSON.parse(xhr.responseText || '{}');
                    resolve(data);
                  } catch (err) {
                    reject(new Error('Cloudinary returned an invalid response.'));
                  }
                } else {
                  let parsedMessage = '';
                  try {
                    const body = JSON.parse(xhr.responseText || '{}');
                    parsedMessage = body?.error?.message || '';
                  } catch (_) {
                    parsedMessage = '';
                  }
                  const fallbackBody = (xhr.responseText || '').slice(0, 250);
                  const reason = parsedMessage || fallbackBody || 'Unknown Cloudinary error';
                  reject(new Error(`Cloudinary upload failed (${xhr.status}): ${reason}`));
                }
              };

              xhr.onerror = () => reject(new Error('NETWORK_RETRYABLE: Cloudinary upload failed due to network error.'));
              xhr.ontimeout = () => reject(new Error('NETWORK_RETRYABLE: Upload timed out. Please retry on stable network.'));
              xhr.send(formData);
            });

          let uploadResult;
          let lastRetryError = null;
          for (let attempt = 1; attempt <= 3; attempt += 1) {
            try {
              if (attempt > 1) {
                updateUploadItem(i, {
                  status: 'uploading',
                  error: `Retrying upload (${attempt}/3)...`,
                });
              }
              uploadResult = await uploadWithXhr();
              break;
            } catch (retryErr) {
              lastRetryError = retryErr;
              const message = retryErr?.message || '';
              const retryable = message.startsWith('NETWORK_RETRYABLE:');
              if (!retryable || attempt === 3) {
                throw new Error(message.replace('NETWORK_RETRYABLE: ', ''));
              }
            }
          }

          if (!uploadResult && lastRetryError) {
            throw lastRetryError;
          }

          const secureUrl = uploadResult?.secure_url;
          const cloudinaryPublicId = uploadResult?.public_id || public_id || '';

          if (!secureUrl) {
            throw new Error('Cloudinary did not return a secure_url.');
          }

          // 3) Save the Cloudinary URL into MongoDB via your API.
          const saveRes = await fetch(API_VIDEOS, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': adminToken,
            },
            body: JSON.stringify({
              title: finalTitle,
              videoUrl: secureUrl,
              publicId: cloudinaryPublicId,
              status: 'published',
            }),
          });

          const saveData = await saveRes.json().catch(() => ({}));
          if (!saveRes.ok) throw new Error(saveData.message || 'Failed to save video');

          uploadedCount += 1;
          updateUploadItem(i, { progress: 100, status: 'success', error: '' });
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        } catch (singleErr) {
          updateUploadItem(i, {
            status: 'failed',
            error: singleErr.message || 'Upload failed',
          });
          failed.push(`${file.name}: ${singleErr.message || 'Upload failed'}`);
        }
      }

      setTitle('');
      await fetchVideos(adminToken);

      if (uploadedCount > 0 && failed.length === 0) {
        setSuccess(uploadedCount === 1 ? 'Video uploaded successfully!' : `${uploadedCount} videos uploaded successfully!`);
      } else if (uploadedCount > 0 && failed.length > 0) {
        setSuccess(`${uploadedCount} videos uploaded successfully.`);
        setError(`${failed.length} failed. ${failed[0]}`);
      } else if (failed.length > 0) {
        setError(`All uploads failed. ${failed[0]}`);
      }
    } catch (err) {
      setError(err.message || 'Video upload failed.');
    } finally {
      setUploading(false);
      if (e?.target) e.target.value = '';
    }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A]">Manage Portfolio</h1>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
        <p className="text-sm text-gray-700 mb-6">
          Upload videos directly to Cloudinary (bypasses Vercel function size limits).
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
              <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">Upload a Portfolio Video</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Title (optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: Apnaaapan Reel #1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Video File(s)</label>
                  <label className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? 'Uploading...' : 'Choose Video(s)'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploads directly to Cloudinary. You can select multiple videos at once (recommended under 95MB each).
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

                {uploadItems.length > 0 && (
                  <div className="w-full space-y-3">
                    <h3 className="text-sm font-semibold text-[#0D1B2A]">Per-video upload status</h3>
                    {uploadItems.map((item) => (
                      <div key={item.id} className="rounded-lg border border-gray-200 p-3 bg-gray-50/70">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="text-xs sm:text-sm text-gray-700 truncate" title={item.name}>{item.name}</p>
                          <span
                            className={`text-xs font-medium whitespace-nowrap ${
                              item.status === 'success'
                                ? 'text-green-700'
                                : item.status === 'failed'
                                ? 'text-red-700'
                                : item.status === 'uploading'
                                ? 'text-[#F26B2A]'
                                : 'text-gray-600'
                            }`}
                          >
                            {item.status === 'success'
                              ? 'Uploaded'
                              : item.status === 'failed'
                              ? 'Failed'
                              : item.status === 'uploading'
                              ? 'Uploading'
                              : 'Queued'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-[width] duration-150 ${
                              item.status === 'failed' ? 'bg-red-500' : item.status === 'success' ? 'bg-green-500' : 'bg-[#F26B2A]'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        {item.error && <p className="mt-1 text-xs text-red-700">{item.error}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0D1B2A]">Existing Portfolio Videos</h2>
                <button
                  type="button"
                  onClick={() => fetchVideos(adminToken)}
                  className="text-sm text-[#4A70B0] hover:underline"
                  disabled={loading}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-gray-600">Loading videos...</p>
              ) : videos.length === 0 ? (
                <p className="text-sm text-gray-600">No videos found yet.</p>
              ) : (
                <div className="space-y-4">
                  {videos.map((v) => (
                    <div
                      key={v.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-[#0D1B2A] mb-1">
                            {v.title}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              v.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(v.id)}
                          disabled={deletingId === v.id}
                          className="px-3 py-1 rounded-lg border border-red-200 text-red-700 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deletingId === v.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      <div className="rounded-md overflow-hidden bg-gray-100">
                        <video
                          controls
                          src={v.videoUrl}
                          className="w-full h-auto max-h-64"
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

