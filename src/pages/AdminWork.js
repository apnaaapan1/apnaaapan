import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_WORK = getApiUrl('/api/work');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_UPLOAD_IMAGE = getApiUrl('/api/upload-image');

const initialFormState = {
  id: '',
  title: '',
  description: '',
  image: '',
  alt: '',
  categoriesText: '',
  tagsText: '',
  status: 'published',
};

export default function AdminWork() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [workPosts, setWorkPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchWork = useCallback(async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setLoading(true);
      setError('');
      const headers = token ? { 'x-admin-token': token } : undefined;
      const res = await fetch(`${API_WORK}?includeDrafts=true`, { headers });
      if (!res.ok) throw new Error('Failed to fetch work posts');
      const data = await res.json();
      setWorkPosts(data.work || []);
    } catch (err) {
      setError('Unable to load work posts. Please check the server/API.');
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
      fetchWork(savedToken);
    }
  }, [fetchWork]);

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
      await fetchWork(token);
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
    setWorkPosts([]);
    setForm(initialFormState);
    setError('');
    setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setError('Image is too large. For website performance and server limits, please use images smaller than 4MB.'); return; }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) { setError('Only JPG, PNG, GIF, and WebP images are allowed'); return; }
    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(API_UPLOAD_IMAGE, {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
        body: formData,
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error(res.status === 413 ? 'The image file is too large for the server. Try a smaller image (under 4MB).' : `Server error: ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((prev) => ({ ...prev, image: data.url }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again or paste a URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (wp) => {
    setForm({
      id: wp.id,
      title: wp.title || '',
      description: wp.description || '',
      image: wp.image || '',
      alt: wp.alt || '',
      categoriesText: Array.isArray(wp.categories) ? wp.categories.join(', ') : '',
      tagsText: Array.isArray(wp.tags) ? wp.tags.join(', ') : '',
      status: wp.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setForm(initialFormState);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!adminToken || !isAuthenticated) { setError('You must be logged in as admin to perform this action.'); return; }
    if (!form.title) { setError('Title is required.'); return; }
    if (!form.image) { setError('Image is required. Please upload or paste an image URL.'); return; }

    const categories = form.categoriesText.split(',').map((c) => c.trim()).filter(Boolean);
    const tags = form.tagsText.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      id: form.id || undefined,
      title: form.title,
      description: form.description,
      image: form.image,
      alt: form.alt,
      categories,
      tags,
      status: form.status,
    };
    const isUpdate = Boolean(form.id);
    try {
      setSaving(true);
      const res = await fetch(API_WORK, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error(`Server error: ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || 'Request failed');
      setSuccess(isUpdate ? 'Work post updated successfully.' : 'Work post created successfully.');
      setForm(initialFormState); // Always reset form after success
      await fetchWork();
    } catch (err) { setError(err.message || 'Failed to save work post.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!adminToken || !isAuthenticated) { setError('You must be logged in as admin to perform this action.'); return; }
    const confirmDelete = window.confirm('Are you sure you want to delete this work post?');
    if (!confirmDelete) return;
    try {
      setSaving(true);
      setError(''); setSuccess('');
      const res = await fetch(API_WORK, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete work post.');
      setSuccess('Work post deleted successfully.');
      await fetchWork();
    } catch (err) { setError(err.message || 'Failed to delete work post.'); }
    finally { setSaving(false); }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-[#EFE7D5] text-[#0D1B2A] text-sm font-medium hover:bg-[#e0d8c5] transition-colors border border-[#d4c9b0]"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-6">Admin – Work Posts</h1>
        {!isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#0D1B2A] mb-3">Admin Login</h2>
            <div className="flex flex-col gap-3 w-full md:w-2/3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
              <button type="button" onClick={handleLogin} className="px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-start" disabled={authChecking}>{authChecking ? 'Logging in...' : 'Login'}</button>
            </div>
          </div>
        )}

        {error && (<div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>)}
        {success && (<div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>)}

        {isAuthenticated && (
          <>
            <div className="flex justify-end mb-4">
              <button type="button" onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors">Logout</button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">{form.id ? 'Edit Work Post' : 'Create New Work Post'}</h2>
                <button type="button" onClick={handleNew} className="text-sm text-[#4A70B0] hover:underline">+ New</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70B0]">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleInputChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" placeholder="Short description for the project" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Image <span className="text-red-500">*</span></label>
                  {form.image && (
                    <div className="mb-3 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-2">
                      <img src={form.image} alt={form.alt || 'Project image'} className="max-w-full max-h-64 object-contain rounded-lg" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <label className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    <span className="text-xs text-gray-500">JPG, PNG, GIF, WebP (Max 4MB. Use <a href="https://tinypng.com" target="_blank" rel="noreferrer" className="text-[#4A70B0] hover:underline">TinyPNG</a> to compress)</span>
                  </div>
                  <input type="text" name="image" value={form.image} onChange={handleInputChange} placeholder="Or paste image URL here" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" required />
                  <p className="text-xs text-gray-500 mt-1">Upload an image or paste a URL from Cloudinary/CDN (Required)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <input type="text" name="alt" value={form.alt} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                    <input type="text" name="categoriesText" value={form.categoriesText} onChange={handleInputChange} placeholder="e.g. Brand identity, UI/UX" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list. Used for filtering on Work page.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input type="text" name="tagsText" value={form.tagsText} onChange={handleInputChange} placeholder="e.g. Branding, UI, UX" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated list. Displayed as badges under each project.</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold hover:bg-[#d85c22] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                    {saving ? 'Saving...' : form.id ? 'Update Work Post' : 'Create Work Post'}
                  </button>
                  {form.id && (
                    <button
                      type="button"
                      onClick={handleNew}
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Existing Work Posts</h2>
                <button type="button" onClick={() => fetchWork()} className="text-sm text-[#4A70B0] hover:underline">Refresh</button>
              </div>
              {loading ? (
                <p className="text-sm text-gray-600">Loading work posts...</p>
              ) : workPosts.length === 0 ? (
                <p className="text-sm text-gray-600">No work posts found yet.</p>
              ) : (
                <div className="space-y-3">
                  {workPosts.map((wp) => (
                    <div key={wp.id} className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg px-3 py-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#0D1B2A]">{wp.title}</h3>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${wp.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{wp.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">{(wp.categories || []).join(', ')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleEdit(wp)} className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-[#0D1B2A] hover:bg-gray-50">Edit</button>
                        <button type="button" onClick={() => handleDelete(wp.id)} className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
