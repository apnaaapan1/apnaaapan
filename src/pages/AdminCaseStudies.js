import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_CASE_STUDIES = getApiUrl('/api/case-studies');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_CLOUDINARY_VIDEO_SIGNATURE = getApiUrl('/api/cloudinary-video-signature');
const API_CLOUDINARY_GRAPHIC_SIGNATURE = getApiUrl('/api/cloudinary-graphic-signature');
const MAX_CASE_STUDY_VIDEO_BYTES = 95 * 1024 * 1024;
/** Direct browser → Cloudinary (same as graphic portfolio); avoids Vercel body/size limits. */
const MAX_CASE_STUDY_IMAGE_BYTES = 12 * 1024 * 1024;
const CASE_STUDY_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

function fileBaseName(filename) {
  return String(filename || '').split('.').slice(0, -1).join('.') || String(filename || '');
}

/**
 * Same direct browser → Cloudinary flow as Manage Portfolio (`AdminVideos`); no entry in portfolio collection.
 */
async function uploadCaseStudyVideoToCloudinary(file, adminToken) {
  if (!String(file.type || '').startsWith('video/')) {
    throw new Error('Please choose a video file.');
  }
  if (file.size > MAX_CASE_STUDY_VIDEO_BYTES) {
    throw new Error('Video must be under 95MB (same limit as portfolio uploads).');
  }

  const sigRes = await fetch(API_CLOUDINARY_VIDEO_SIGNATURE, {
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
  const sigData = await sigRes.json().catch(() => ({}));
  if (!sigRes.ok) throw new Error(sigData.message || 'Could not start upload (signature).');

  const { upload_url, api_key, timestamp, signature, folder, public_id } = sigData;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  if (folder) formData.append('folder', folder);
  if (public_id) formData.append('public_id', public_id);

  const uploadResult = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', upload_url);
    xhr.timeout = 8 * 60 * 1000;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText || '{}'));
        } catch {
          reject(new Error('Cloudinary returned an invalid response.'));
        }
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed (network).'));
    xhr.ontimeout = () => reject(new Error('Upload timed out.'));
    xhr.send(formData);
  });

  const secureUrl = uploadResult?.secure_url;
  if (!secureUrl) throw new Error('Cloudinary did not return a video URL.');
  return secureUrl;
}

/**
 * Same signed upload as Manage Graphic Portfolio: image goes straight to Cloudinary (not through Vercel).
 */
async function uploadCaseStudyImageToCloudinary(file, adminToken) {
  const mime = String(file.type || '').toLowerCase();
  if (!CASE_STUDY_IMAGE_TYPES.includes(mime)) {
    throw new Error('Only JPG, PNG, WebP, and GIF images are allowed.');
  }
  if (file.size > MAX_CASE_STUDY_IMAGE_BYTES) {
    throw new Error(`Image must be under ${Math.round(MAX_CASE_STUDY_IMAGE_BYTES / (1024 * 1024))}MB.`);
  }

  const folderRaw = process.env.REACT_APP_CLOUDINARY_CASE_STUDY_IMAGE_FOLDER;
  const folder = folderRaw && String(folderRaw).trim() ? String(folderRaw).trim() : undefined;

  const sigRes = await fetch(API_CLOUDINARY_GRAPHIC_SIGNATURE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify({
      filename: file.name,
      ...(folder ? { folder } : {}),
    }),
  });
  const sigData = await sigRes.json().catch(() => ({}));
  if (!sigRes.ok) throw new Error(sigData.message || 'Could not start image upload (signature).');

  const { upload_url, api_key, timestamp, signature, folder: sigFolder, public_id } = sigData;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  if (sigFolder) formData.append('folder', sigFolder);
  if (public_id) formData.append('public_id', public_id);

  const uploadResult = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', upload_url);
    xhr.timeout = 3 * 60 * 1000;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText || '{}'));
        } catch {
          reject(new Error('Cloudinary returned an invalid response.'));
        }
      } else {
        const body = (xhr.responseText || '').slice(0, 500);
        reject(new Error(`Cloudinary upload failed (${xhr.status})${body ? `: ${body}` : ''}`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed (network).'));
    xhr.ontimeout = () => reject(new Error('Upload timed out.'));
    xhr.send(formData);
  });

  const secureUrl = uploadResult?.secure_url;
  if (!secureUrl) throw new Error('Cloudinary did not return an image URL.');
  return secureUrl;
}

const emptySlot = () => ({ src: '', alt: '' });
const emptyMetric = () => ({ value: '', label: '', description: '' });
const emptyVideo = () => ({ title: '', embedUrl: '', src: '' });
const emptyPoint = () => ({ title: '', description: '' });

const padImageSlots = (arr, n) => {
  const a = (arr || []).slice(0, n).map((x) => ({
    src: x?.src ? String(x.src) : '',
    alt: x?.alt ? String(x.alt) : '',
  }));
  while (a.length < n) a.push(emptySlot());
  return a;
};

const initialFormState = () => ({
  id: '',
  slug: '',
  name: '',
  tagline: '',
  logo: '',
  tagsText: '',
  status: 'published',
  heroImages: Array.from({ length: 6 }, () => emptySlot()),
  briefIntro: '',
  briefBulletsText: '',
  approachIntro: '',
  approachPoints: Array.from({ length: 4 }, () => emptyPoint()),
  results: Array.from({ length: 3 }, () => emptyMetric()),
  videos: Array.from({ length: 3 }, () => emptyVideo()),
  marqueeRow1: padImageSlots([], 5),
  marqueeRow2: padImageSlots([], 5),
  performance: padImageSlots([], 4),
});

function docToForm(cs) {
  const base = initialFormState();
  const vids = (cs.videos || []).map((x) => ({
    title: x.title || '',
    embedUrl: x.embedUrl || '',
    src: x.src || '',
  }));
  return {
    ...base,
    id: cs.id || '',
    slug: cs.slug || '',
    name: cs.name || '',
    tagline: cs.tagline || '',
    logo: cs.logo ? String(cs.logo) : '',
    tagsText: (cs.tags || []).join(', '),
    status: cs.status || 'published',
    heroImages: padImageSlots(cs.heroImages, 6),
    briefIntro: cs.brief?.intro || '',
    briefBulletsText: (cs.brief?.bullets || []).join('\n'),
    approachIntro: cs.approach?.intro || '',
    approachPoints: (() => {
      const pts = (cs.approach?.points || []).map((p) => ({
        title: p.title || '',
        description: p.description || '',
      }));
      const out = pts.slice(0, 8);
      while (out.length < 4) out.push(emptyPoint());
      return out;
    })(),
    results: (() => {
      const r = (cs.results || []).map((x) => ({
        value: x.value || '',
        label: x.label || '',
        description: x.description || '',
      }));
      const out = r.slice(0, 3);
      while (out.length < 3) out.push(emptyMetric());
      return out;
    })(),
    videos: vids.length > 0 ? vids : base.videos,
    marqueeRow1: padImageSlots(cs.marqueeGallery?.row1, 5),
    marqueeRow2: padImageSlots(cs.marqueeGallery?.row2, 5),
    performance: padImageSlots(cs.performanceMarketing, 4),
  };
}

function formToPayload(form) {
  return {
    id: form.id || undefined,
    slug: form.slug.trim(),
    name: form.name.trim(),
    tagline: form.tagline.trim(),
    logo: form.logo.trim() || null,
    tags: form.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    status: form.status,
    heroImages: form.heroImages.map((h) => ({
      src: h.src.trim() || null,
      alt: h.alt.trim(),
    })),
    brief: {
      intro: form.briefIntro.trim(),
      bullets: form.briefBulletsText.split('\n').map((l) => l.trim()).filter(Boolean),
    },
    approach: {
      intro: form.approachIntro.trim(),
      points: form.approachPoints
        .filter((p) => p.title.trim() || p.description.trim())
        .map((p) => ({ title: p.title.trim(), description: p.description.trim() })),
    },
    results: form.results.map((r) => ({
      value: r.value.trim(),
      label: r.label.trim(),
      description: r.description.trim(),
    })),
    videos: form.videos
      .filter((v) => v.embedUrl.trim() || v.src.trim())
      .map((v) => ({
        title: v.title.trim(),
        embedUrl: v.embedUrl.trim(),
        src: v.src.trim(),
      })),
    marqueeGallery: {
      row1: form.marqueeRow1.map((h) => ({ src: h.src.trim() || null, alt: h.alt.trim() })),
      row2: form.marqueeRow2.map((h) => ({ src: h.src.trim() || null, alt: h.alt.trim() })),
    },
    performanceMarketing: form.performance.map((h) => ({
      src: h.src.trim() || null,
      alt: h.alt.trim(),
    })),
  };
}

export default function AdminCaseStudies() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => initialFormState());
  const [uploading, setUploading] = useState(false);
  const [videoUploadSlot, setVideoUploadSlot] = useState(null);

  const fetchList = useCallback(async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_CASE_STUDIES}?includeDrafts=true`, {
        headers: token ? { 'x-admin-token': token } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch case studies');
      const data = await res.json();
      setItems(Array.isArray(data.caseStudies) ? data.caseStudies : []);
    } catch (err) {
      setError('Unable to load case studies. Check server and admin login.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
    const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
    if (savedToken) {
      setAdminToken(savedToken);
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
      fetchList(savedToken);
    }
  }, [fetchList]);

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
      await fetchList(token);
      setSuccess('Logged in successfully.');
    } catch (err) {
      setError(err.message || 'Login failed.');
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setPassword('');
    setItems([]);
    setForm(initialFormState());
    setError('');
    setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
  };

  const makeImageUploadHandler = (applyUrl) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!adminToken || !isAuthenticated) {
      setError('Login required to upload images.');
      e.target.value = '';
      return;
    }
    try {
      setUploading(true);
      setError('');
      const url = await uploadCaseStudyImageToCloudinary(file, adminToken);
      applyUrl(url);
      setSuccess('Image uploaded to Cloudinary. Save the case study to persist.');
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCaseStudyVideoUpload = (slotIndex) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!adminToken || !isAuthenticated) {
      setError('Login required to upload video.');
      e.target.value = '';
      return;
    }
    try {
      setVideoUploadSlot(slotIndex);
      setError('');
      setSuccess('');
      const url = await uploadCaseStudyVideoToCloudinary(file, adminToken);
      const defaultTitle = fileBaseName(file.name);
      setForm((p) => {
        const videos = p.videos.map((x, j) => {
          if (j !== slotIndex) return x;
          const nextTitle = String(x.title || '').trim() ? x.title : defaultTitle;
          return { ...x, src: url, embedUrl: '', title: nextTitle };
        });
        return { ...p, videos };
      });
      setSuccess('Video uploaded to Cloudinary. Save the case study to persist.');
    } catch (err) {
      setError(err.message || 'Video upload failed.');
    } finally {
      setVideoUploadSlot(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminToken) {
      setError('Login required.');
      return;
    }
    if (!form.slug.trim() || !form.name.trim()) {
      setError('Slug and brand name are required.');
      return;
    }
    setError('');
    setSuccess('');
    const payload = formToPayload(form);
    const isUpdate = Boolean(form.id);
    try {
      setSaving(true);
      const res = await fetch(API_CASE_STUDIES, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      setSuccess(isUpdate ? 'Case study updated.' : 'Case study created.');
      setForm(initialFormState());
      await fetchList();
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cs) => {
    setForm(docToForm(cs));
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setForm(initialFormState());
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case study from the database?')) return;
    try {
      setSaving(true);
      const res = await fetch(API_CASE_STUDIES, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setSuccess('Deleted.');
      if (form.id === id) setForm(initialFormState());
      await fetchList();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (i, field, value) => {
    setForm((prev) => {
      const heroImages = prev.heroImages.map((h, idx) =>
        idx === i ? { ...h, [field]: value } : h
      );
      return { ...prev, heroImages };
    });
  };

  const section = (title, children) => (
    <details className="border border-gray-200 rounded-lg mb-4 open:bg-gray-50/50" open>
      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-[#0D1B2A]">{title}</summary>
      <div className="px-3 pb-3 pt-1 space-y-3">{children}</div>
    </details>
  );

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-[#EFE7D5] text-[#0D1B2A] text-sm font-medium hover:bg-[#e0d8c5] transition-colors border border-[#d4c9b0]"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-2">Admin – Case studies</h1>
        <p className="text-sm text-gray-600 mb-6">
          Create and edit full case study pages (hero, brief, approach, results, videos, gallery, performance). Live URL:{' '}
          <code className="text-xs bg-white/80 px-1 rounded">/work/your-slug</code>
          . Entries here override the same slug in static code when published. Image and video uploads use signed URLs so
          files go directly to Cloudinary (same as graphic portfolio and portfolio videos), not through Vercel.
        </p>

        {!isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#0D1B2A] mb-3">Admin Login</h2>
            <div className="flex flex-col gap-3 w-full md:w-2/3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={handleLogin}
                disabled={authChecking}
                className="px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium self-start disabled:opacity-60"
              >
                {authChecking ? 'Logging in…' : 'Login'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
        )}

        {isAuthenticated && (
          <>
            <div className="flex justify-end mb-4">
              <button type="button" onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-200 text-sm">
                Logout
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">{form.id ? 'Edit case study' : 'New case study'}</h2>
                <button type="button" onClick={handleNew} className="text-sm text-[#4A70B0] hover:underline">
                  + New
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {section(
                  'Basics',
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">URL slug *</label>
                        <input
                          value={form.slug}
                          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="e.g. my-brand-slug"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Lowercase, hyphens. Becomes /work/slug</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Brand name *</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tagline</label>
                      <textarea
                        value={form.tagline}
                        onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                        rows={2}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
                      <input
                        value={form.tagsText}
                        onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Social Media, Growth"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Logo URL</label>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <label className="text-xs px-3 py-1.5 rounded-lg bg-[#4A70B0] text-white cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            disabled={uploading}
                            onChange={makeImageUploadHandler((url) =>
                              setForm((p) => ({ ...p, logo: url }))
                            )}
                          />
                          Upload
                        </label>
                        {uploading ? <span className="text-xs text-gray-500">Uploading…</span> : null}
                      </div>
                      <input
                        value={form.logo}
                        onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="https://… or Cloudinary URL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </>
                )}

                {section(
                  'Hero collage (6 slots)',
                  form.heroImages.map((h, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                      <span className="text-xs font-medium text-gray-500">Image {i + 1}</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <label className="text-xs px-2 py-1 rounded bg-[#4A70B0] text-white cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            disabled={uploading}
                            onChange={makeImageUploadHandler((url) => updateHero(i, 'src', url))}
                          />
                          Upload
                        </label>
                        <input
                          value={h.src}
                          onChange={(e) => updateHero(i, 'src', e.target.value)}
                          className="flex-1 min-w-[8rem] border rounded px-2 py-1 text-xs"
                          placeholder="Image URL"
                        />
                      </div>
                      <input
                        value={h.alt}
                        onChange={(e) => updateHero(i, 'alt', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                        placeholder="Alt text"
                      />
                    </div>
                  ))
                )}

                {section(
                  'The Brief',
                  <>
                    <textarea
                      value={form.briefIntro}
                      onChange={(e) => setForm((p) => ({ ...p, briefIntro: e.target.value }))}
                      rows={4}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Intro paragraph"
                    />
                    <div>
                      <label className="text-xs text-gray-600">Bullet points (one per line)</label>
                      <textarea
                        value={form.briefBulletsText}
                        onChange={(e) => setForm((p) => ({ ...p, briefBulletsText: e.target.value }))}
                        rows={5}
                        className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                      />
                    </div>
                  </>
                )}

                {section(
                  'Our Approach',
                  <>
                    <textarea
                      value={form.approachIntro}
                      onChange={(e) => setForm((p) => ({ ...p, approachIntro: e.target.value }))}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                    {form.approachPoints.map((pt, i) => (
                      <div key={i} className="border rounded-lg p-2 space-y-1">
                        <input
                          value={pt.title}
                          onChange={(e) => {
                            const approachPoints = form.approachPoints.map((p, j) =>
                              j === i ? { ...p, title: e.target.value } : p
                            );
                            setForm((p) => ({ ...p, approachPoints }));
                          }}
                          className="w-full border rounded px-2 py-1 text-sm font-medium"
                          placeholder={`Point ${i + 1} title`}
                        />
                        <textarea
                          value={pt.description}
                          onChange={(e) => {
                            const approachPoints = form.approachPoints.map((p, j) =>
                              j === i ? { ...p, description: e.target.value } : p
                            );
                            setForm((p) => ({ ...p, approachPoints }));
                          }}
                          rows={2}
                          className="w-full border rounded px-2 py-1 text-xs"
                          placeholder="Description"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-xs text-[#4A70B0]"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          approachPoints: [...p.approachPoints, emptyPoint()],
                        }))
                      }
                    >
                      + Add approach point
                    </button>
                  </>
                )}

                {section(
                  'The Results (3 metrics)',
                  form.results.map((r, i) => (
                    <div key={i} className="grid md:grid-cols-3 gap-2">
                      <input
                        value={r.value}
                        onChange={(e) => {
                          const results = form.results.map((x, j) =>
                            j === i ? { ...x, value: e.target.value } : x
                          );
                          setForm((p) => ({ ...p, results }));
                        }}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="e.g. 2.3x"
                      />
                      <input
                        value={r.label}
                        onChange={(e) => {
                          const results = form.results.map((x, j) =>
                            j === i ? { ...x, label: e.target.value } : x
                          );
                          setForm((p) => ({ ...p, results }));
                        }}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Label"
                      />
                      <input
                        value={r.description}
                        onChange={(e) => {
                          const results = form.results.map((x, j) =>
                            j === i ? { ...x, description: e.target.value } : x
                          );
                          setForm((p) => ({ ...p, results }));
                        }}
                        className="border rounded px-2 py-1 text-sm md:col-span-1"
                        placeholder="Short description"
                      />
                    </div>
                  ))
                )}

                {section(
                  'Videos (max 9 — upload to Cloudinary, same as Portfolio)',
                  <>
                    <p className="text-xs text-gray-600">
                      Upload stores the file in Cloudinary and fills the video URL for this slot. You can also paste a direct
                      .mp4 URL if needed. Save the case study after uploading.
                    </p>
                    {form.videos.map((v, i) => (
                      <div key={i} className="border rounded-lg p-2 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-500">Video {i + 1}</span>
                          <label
                            className={`text-xs px-2 py-1 rounded bg-[#4A70B0] text-white cursor-pointer ${
                              videoUploadSlot === i || !adminToken ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              disabled={videoUploadSlot !== null || !adminToken}
                              onChange={handleCaseStudyVideoUpload(i)}
                            />
                            {videoUploadSlot === i ? 'Uploading…' : 'Upload video'}
                          </label>
                          {v.src ? (
                            <button
                              type="button"
                              className="text-xs text-red-600 hover:underline"
                              disabled={videoUploadSlot !== null}
                              onClick={() =>
                                setForm((p) => ({
                                  ...p,
                                  videos: p.videos.map((x, j) =>
                                    j === i ? { ...x, src: '', embedUrl: '' } : x
                                  ),
                                }))
                              }
                            >
                              Clear video
                            </button>
                          ) : null}
                        </div>
                        <input
                          value={v.title}
                          onChange={(e) => {
                            const videos = form.videos.map((x, j) =>
                              j === i ? { ...x, title: e.target.value } : x
                            );
                            setForm((p) => ({ ...p, videos }));
                          }}
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder="Title (optional; defaults from filename on upload)"
                        />
                        <input
                          value={v.src}
                          onChange={(e) => {
                            const videos = form.videos.map((x, j) =>
                              j === i ? { ...x, src: e.target.value, embedUrl: '' } : x
                            );
                            setForm((p) => ({ ...p, videos }));
                          }}
                          className="w-full border rounded px-2 py-1 text-xs font-mono"
                          placeholder="Video URL (filled after upload, or paste Cloudinary / .mp4 link)"
                        />
                        {v.embedUrl ? (
                          <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-2 py-1">
                            Legacy embed URL is set for this slot; it will be saved unless you upload or paste a direct URL
                            above (direct URL is used on the site first).
                          </p>
                        ) : null}
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-xs text-[#4A70B0]"
                        onClick={() =>
                          setForm((p) =>
                            p.videos.length < 9
                              ? { ...p, videos: [...p.videos, emptyVideo()] }
                              : p
                          )
                        }
                      >
                        + Add video slot
                      </button>
                      {form.videos.length > 1 ? (
                        <button
                          type="button"
                          className="text-xs text-red-600"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              videos: p.videos.slice(0, -1),
                            }))
                          }
                        >
                          Remove last
                        </button>
                      ) : null}
                    </div>
                  </>
                )}

                {section(
                  'Gallery marquee — row 1 (5 images)',
                  form.marqueeRow1.map((h, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Slot {i + 1}</span>
                      <div className="flex flex-wrap gap-2">
                        <label className="text-xs px-2 py-1 rounded bg-[#4A70B0] text-white cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={makeImageUploadHandler((url) => {
                              setForm((p) => {
                                const marqueeRow1 = p.marqueeRow1.map((x, j) =>
                                  j === i ? { ...x, src: url } : x
                                );
                                return { ...p, marqueeRow1 };
                              });
                            })}
                          />
                          Up
                        </label>
                        <input
                          value={h.src}
                          onChange={(e) => {
                            setForm((p) => {
                              const marqueeRow1 = p.marqueeRow1.map((x, j) =>
                                j === i ? { ...x, src: e.target.value } : x
                              );
                              return { ...p, marqueeRow1 };
                            });
                          }}
                          className="flex-1 border rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <input
                        value={h.alt}
                        onChange={(e) => {
                          setForm((p) => {
                            const marqueeRow1 = p.marqueeRow1.map((x, j) =>
                              j === i ? { ...x, alt: e.target.value } : x
                            );
                            return { ...p, marqueeRow1 };
                          });
                        }}
                        className="border rounded px-2 py-1 text-xs"
                        placeholder="Alt"
                      />
                    </div>
                  ))
                )}

                {section(
                  'Gallery marquee — row 2 (5 images)',
                  form.marqueeRow2.map((h, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Slot {i + 1}</span>
                      <div className="flex flex-wrap gap-2">
                        <label className="text-xs px-2 py-1 rounded bg-[#4A70B0] text-white cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={makeImageUploadHandler((url) => {
                              setForm((p) => {
                                const marqueeRow2 = p.marqueeRow2.map((x, j) =>
                                  j === i ? { ...x, src: url } : x
                                );
                                return { ...p, marqueeRow2 };
                              });
                            })}
                          />
                          Up
                        </label>
                        <input
                          value={h.src}
                          onChange={(e) => {
                            setForm((p) => {
                              const marqueeRow2 = p.marqueeRow2.map((x, j) =>
                                j === i ? { ...x, src: e.target.value } : x
                              );
                              return { ...p, marqueeRow2 };
                            });
                          }}
                          className="flex-1 border rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <input
                        value={h.alt}
                        onChange={(e) => {
                          setForm((p) => {
                            const marqueeRow2 = p.marqueeRow2.map((x, j) =>
                              j === i ? { ...x, alt: e.target.value } : x
                            );
                            return { ...p, marqueeRow2 };
                          });
                        }}
                        className="border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  ))
                )}

                {section(
                  'Performance marketing (4 images)',
                  form.performance.map((h, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Image {i + 1}</span>
                      <div className="flex flex-wrap gap-2">
                        <label className="text-xs px-2 py-1 rounded bg-[#4A70B0] text-white cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={makeImageUploadHandler((url) => {
                              setForm((p) => {
                                const performance = p.performance.map((x, j) =>
                                  j === i ? { ...x, src: url } : x
                                );
                                return { ...p, performance };
                              });
                            })}
                          />
                          Up
                        </label>
                        <input
                          value={h.src}
                          onChange={(e) => {
                            setForm((p) => {
                              const performance = p.performance.map((x, j) =>
                                j === i ? { ...x, src: e.target.value } : x
                              );
                              return { ...p, performance };
                            });
                          }}
                          className="flex-1 border rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <input
                        value={h.alt}
                        onChange={(e) => {
                          setForm((p) => {
                            const performance = p.performance.map((x, j) =>
                              j === i ? { ...x, alt: e.target.value } : x
                            );
                            return { ...p, performance };
                          });
                        }}
                        className="border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  ))
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : form.id ? 'Update case study' : 'Create case study'}
                  </button>
                  {form.id ? (
                    <button type="button" onClick={handleNew} className="px-5 py-2.5 rounded-lg bg-gray-200 text-sm">
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Saved case studies</h2>
                <button type="button" onClick={() => fetchList()} className="text-sm text-[#4A70B0]">
                  Refresh
                </button>
              </div>
              {loading ? (
                <p className="text-sm text-gray-600">Loading…</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-600">None yet. Publish a case study so it appears on the site.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((cs) => (
                    <li
                      key={cs.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-2 border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#0D1B2A]">{cs.name}</span>
                          <code className="text-xs bg-gray-100 px-1 rounded">{cs.slug}</code>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              cs.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {cs.status}
                          </span>
                        </div>
                        <a
                          href={`/work/${cs.slug}`}
                          className="text-xs text-[#4A70B0] hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open live page →
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(cs)} className="text-xs px-3 py-1 border rounded-lg">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cs.id)}
                          className="text-xs px-3 py-1 border border-red-200 text-red-700 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
