import React, { useEffect, useState } from 'react';

// Use localhost:5000 in development (Express server), relative path in production (Vercel)
const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  // In development, use Express server on port 5000
  return `http://localhost:5000${endpoint}`;
};

const API_BASE = getApiUrl('/api/blogs');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_UPLOAD_IMAGE = getApiUrl('/api/upload-image');
const API_POSITIONS = getApiUrl('/api/positions');
const API_WORK = getApiUrl('/api/work');

const initialFormState = {
  id: '',
  title: '',
  slug: '',
  readTime: '10 Min',
  heroImage: '',
  contentText: '',
  status: 'published',
};

const initialPositionForm = {
  id: '',
  title: '',
  description: '',
  applyUrl: '',
  status: 'published',
};

const initialWorkForm = {
  id: '',
  title: '',
  description: '',
  image: '',
  alt: '',
  categoriesText: '', // comma-separated for input
  tagsText: '', // comma-separated for input
  status: 'published',
};

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [positions, setPositions] = useState([]);
  const [workPosts, setWorkPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [workLoading, setWorkLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [positionSaving, setPositionSaving] = useState(false);
  const [workSaving, setWorkSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [positionForm, setPositionForm] = useState(initialPositionForm);
  const [workForm, setWorkForm] = useState(initialWorkForm);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [workUploading, setWorkUploading] = useState(false);

  useEffect(() => {
    // Load token/email from sessionStorage so auth persists only for this tab
    const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
    const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
    if (savedToken) {
      setAdminToken(savedToken);
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
      fetchBlogs(savedToken);
      fetchPositions(savedToken);
      fetchWork(savedToken);
    }
  }, []);

  const fetchBlogs = async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setLoading(true);
      setError('');
      const headers = token ? { 'x-admin-token': token } : undefined;
      const res = await fetch(`${API_BASE}?includeDrafts=true`, { headers });
      if (!res.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load blogs. Please check the server/API.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWork = async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setWorkLoading(true);
      setError('');
      const headers = token ? { 'x-admin-token': token } : undefined;
      const res = await fetch(`${API_WORK}?includeDrafts=true`, { headers });
      if (!res.ok) {
        throw new Error('Failed to fetch work posts');
      }
      const data = await res.json();
      setWorkPosts(data.work || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load work posts. Please check the server/API.');
    } finally {
      setWorkLoading(false);
    }
  };

  const fetchPositions = async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setPositionsLoading(true);
      setError('');
      const headers = token ? { 'x-admin-token': token } : undefined;
      const res = await fetch(`${API_POSITIONS}?includeDrafts=true`, { headers });
      if (!res.ok) {
        throw new Error('Failed to fetch positions');
      }
      const data = await res.json();
      setPositions(data.positions || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load open positions. Please check the server/API.');
    } finally {
      setPositionsLoading(false);
    }
  };

  const handleLogin = async (silent = false) => {
    if (!email || !password) {
      if (!silent) {
        setError('Please enter admin email and password.');
      }
      return;
    }

    try {
      setAuthChecking(true);
      if (!silent) {
        setError('');
        setSuccess('');
      }
      const res = await fetch(API_ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const token = data.token || '';
      setAdminToken(token);
      window.sessionStorage.setItem('apnaaapan_admin_token', token);
      window.sessionStorage.setItem('apnaaapan_admin_email', email);

      setIsAuthenticated(true);
      await Promise.all([fetchBlogs(token), fetchPositions(token), fetchWork(token)]);

      if (!silent) {
        setSuccess('Logged in successfully.');
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        setError(err.message || 'Invalid admin credentials or server error.');
      }
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setPassword('');
    setBlogs([]);
    setPositions([]);
    setWorkPosts([]);
    setForm(initialFormState);
    setPositionForm(initialPositionForm);
    setWorkForm(initialWorkForm);
    setError('');
    setSuccess('Logged out.');
    // Clear session storage (and localStorage for backward compatibility)
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
  };

  const handleWorkImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    try {
      setWorkUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(API_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setWorkForm((prev) => ({
        ...prev,
        image: data.url,
      }));

      setSuccess('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setWorkUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(API_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Update the heroImage field with the uploaded image URL
      setForm((prev) => ({
        ...prev,
        heroImage: data.url,
      }));

      setSuccess('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositionInputChange = (e) => {
    const { name, value } = e.target;
    setPositionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setWorkForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (blog) => {
    setForm({
      id: blog.id,
      title: blog.title || '',
      slug: blog.slug || '',
      readTime: blog.readTime || '10 Min',
      heroImage: blog.heroImage || '',
      contentText: Array.isArray(blog.content)
        ? blog.content.join('\n\n')
        : '',
      status: blog.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePositionEdit = (position) => {
    setPositionForm({
      id: position.id,
      title: position.title || '',
      description: position.description || '',
      applyUrl: position.applyUrl || '',
      status: position.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkEdit = (work) => {
    setWorkForm({
      id: work.id,
      title: work.title || '',
      description: work.description || '',
      image: work.image || '',
      alt: work.alt || '',
      categoriesText: Array.isArray(work.categories) ? work.categories.join(', ') : '',
      tagsText: Array.isArray(work.tags) ? work.tags.join(', ') : '',
      status: work.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setForm(initialFormState);
    setError('');
    setSuccess('');
  };

  const handlePositionNew = () => {
    setPositionForm(initialPositionForm);
    setError('');
    setSuccess('');
  };

  const handleWorkNew = () => {
    setWorkForm(initialWorkForm);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    if (!form.title) {
      setError('Title is required.');
      return;
    }

    if (!form.heroImage) {
      setError('Hero Image is required. Please upload or paste an image URL.');
      return;
    }

    const contentArray = form.contentText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    // Auto-generate slug from title if not provided
    const finalSlug = form.slug.trim() || generateSlug(form.title);

    const payload = {
      id: form.id || undefined,
      title: form.title,
      slug: finalSlug,
      readTime: form.readTime,
      heroImage: form.heroImage,
      content: contentArray,
      status: form.status,
    };

    const isUpdate = Boolean(form.id);

    try {
      setSaving(true);
      const res = await fetch(API_BASE, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setSuccess(isUpdate ? 'Blog updated successfully.' : 'Blog created successfully.');
      setForm(isUpdate ? form : initialFormState);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save blog.');
    } finally {
      setSaving(false);
    }
  };

  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    if (!positionForm.title) {
      setError('Position title is required.');
      return;
    }

    const payload = {
      id: positionForm.id || undefined,
      title: positionForm.title,
      description: positionForm.description,
      applyUrl: positionForm.applyUrl,
      status: positionForm.status,
    };

    const isUpdate = Boolean(positionForm.id);

    try {
      setPositionSaving(true);
      const res = await fetch(API_POSITIONS, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setSuccess(isUpdate ? 'Position updated successfully.' : 'Position created successfully.');
      setPositionForm(isUpdate ? positionForm : initialPositionForm);
      await fetchPositions();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save position.');
    } finally {
      setPositionSaving(false);
    }
  };

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    if (!workForm.title) {
      setError('Title is required.');
      return;
    }
    if (!workForm.image) {
      setError('Image is required. Please upload or paste an image URL.');
      return;
    }

    const categories = workForm.categoriesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const tags = workForm.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: workForm.id || undefined,
      title: workForm.title,
      description: workForm.description,
      image: workForm.image,
      alt: workForm.alt,
      categories,
      tags,
      status: workForm.status,
    };

    const isUpdate = Boolean(workForm.id);

    try {
      setWorkSaving(true);
      const res = await fetch(API_WORK, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setSuccess(isUpdate ? 'Work post updated successfully.' : 'Work post created successfully.');
      setWorkForm(isUpdate ? workForm : initialWorkForm);
      await fetchWork();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save work post.');
    } finally {
      setWorkSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const res = await fetch(API_BASE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete blog.');
      }
      setSuccess('Blog deleted successfully.');
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete blog.');
    } finally {
      setSaving(false);
    }
  };

  const handlePositionDelete = async (id) => {
    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this position?');
    if (!confirmDelete) return;

    try {
      setPositionSaving(true);
      setError('');
      setSuccess('');
      const res = await fetch(API_POSITIONS, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete position.');
      }
      setSuccess('Position deleted successfully.');
      await fetchPositions();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete position.');
    } finally {
      setPositionSaving(false);
    }
  };

  const handleWorkDelete = async (id) => {
    if (!adminToken || !isAuthenticated) {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this work post?');
    if (!confirmDelete) return;

    try {
      setWorkSaving(true);
      setError('');
      setSuccess('');
      const res = await fetch(API_WORK, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete work post.');
      }
      setSuccess('Work post deleted successfully.');
      await fetchWork();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete work post.');
    } finally {
      setWorkSaving(false);
    }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-6">
          Admin Panel – Blog Management
        </h1>

        <p className="text-sm text-gray-700 mb-6">
          Enter the admin email and password to manage blogs. Only this configured admin account can
          log in. Only published blogs are visible on the public site.
        </p>

        {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">
              {workForm.id ? 'Edit Work Post' : 'Create New Work Post'}
            </h2>
            <button
              type="button"
              onClick={handleWorkNew}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              + New
            </button>
          </div>

          <form onSubmit={handleWorkSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={workForm.title}
                  onChange={handleWorkInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={workForm.status}
                  onChange={handleWorkInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={workForm.description}
                onChange={handleWorkInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                placeholder="Short description for the project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Image <span className="text-red-500">*</span>
              </label>

              {workForm.image && (
                <div className="mb-3 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-2">
                  <img
                    src={workForm.image}
                    alt={workForm.alt || 'Project image'}
                    className="max-w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <label className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleWorkImageUpload}
                    disabled={workUploading}
                    className="hidden"
                  />
                  {workUploading ? 'Uploading...' : 'Upload Image'}
                </label>
                <span className="text-xs text-gray-500">JPG, PNG, GIF, WebP (Max 5MB)</span>
              </div>

              <input
                type="text"
                name="image"
                value={workForm.image}
                onChange={handleWorkInputChange}
                placeholder="Or paste image URL here"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image or paste a URL from Cloudinary/CDN (Required)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  value={workForm.alt}
                  onChange={handleWorkInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <input
                  type="text"
                  name="categoriesText"
                  value={workForm.categoriesText}
                  onChange={handleWorkInputChange}
                  placeholder="e.g. Brand identity, UI/UX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list. Used for filtering on Work page.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                name="tagsText"
                value={workForm.tagsText}
                onChange={handleWorkInputChange}
                placeholder="e.g. Branding, UI, UX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated list. Displayed as badges under each project.</p>
            </div>

            <button
              type="submit"
              disabled={workSaving}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold hover:bg-[#d85c22] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {workSaving ? 'Saving...' : workForm.id ? 'Update Work Post' : 'Create Work Post'}
            </button>
          </form>
        </div>
        )}

        {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">Existing Work Posts</h2>
            <button
              type="button"
              onClick={() => fetchWork()}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              Refresh
            </button>
          </div>

          {workLoading ? (
            <p className="text-sm text-gray-600">Loading work posts...</p>
          ) : workPosts.length === 0 ? (
            <p className="text-sm text-gray-600">No work posts found yet.</p>
          ) : (
            <div className="space-y-3">
              {workPosts.map((wp) => (
                <div
                  key={wp.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg px-3 py-3 gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0D1B2A]">{wp.title}</h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          wp.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {wp.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{(wp.categories || []).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleWorkEdit(wp)}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-[#0D1B2A] hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWorkDelete(wp.id)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              onClick={() => handleLogin()}
              className="px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-start"
              disabled={authChecking}
            >
              {authChecking ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
        )}

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
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">
              {form.id ? 'Edit Blog' : 'Create New Blog'}
            </h2>
            <button
              type="button"
              onClick={handleNew}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              + New
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder="e.g. the-power-of-social-media-for-your-brand"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={form.readTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image <span className="text-red-500">*</span>
              </label>
              
              {/* Image Preview */}
              {form.heroImage && (
                <div className="mb-3 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-2">
                  <img 
                    src={form.heroImage} 
                    alt="Hero preview" 
                    className="max-w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-3 mb-2">
                <label className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4A70B0] text-white text-sm font-medium hover:bg-[#3b5d92] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
                <span className="text-xs text-gray-500">
                  JPG, PNG, GIF, WebP (Max 5MB)
                </span>
              </div>

              {/* Manual URL Input */}
              <input
                type="text"
                name="heroImage"
                value={form.heroImage}
                onChange={handleInputChange}
                placeholder="Or paste image URL here"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload an image or paste a URL from Cloudinary/CDN (Required)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (paragraphs)
              </label>
              <textarea
                name="contentText"
                value={form.contentText}
                onChange={handleInputChange}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                placeholder="Write each paragraph separated by a blank line."
              />
              <p className="text-xs text-gray-500 mt-1">
                Paragraphs are split by line breaks. On the site they will render as separate
                paragraphs.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold hover:bg-[#d85c22] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : form.id ? 'Update Blog' : 'Create Blog'}
            </button>
          </form>
        </div>
        )}

        {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">Existing Blogs</h2>
            <button
              type="button"
              onClick={() => fetchBlogs()}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-600">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-sm text-gray-600">No blogs found yet.</p>
          ) : (
            <div className="space-y-3">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg px-3 py-3 gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0D1B2A]">
                        {blog.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      /blog/{blog.slug} · {blog.readTime || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-[#0D1B2A] hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">
              {positionForm.id ? 'Edit Position' : 'Create New Position'}
            </h2>
            <button
              type="button"
              onClick={handlePositionNew}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              + New
            </button>
          </div>

          <form onSubmit={handlePositionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={positionForm.title}
                  onChange={handlePositionInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={positionForm.status}
                  onChange={handlePositionInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={positionForm.description}
                onChange={handlePositionInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                placeholder="Brief summary for this role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply URL
              </label>
              <input
                type="text"
                name="applyUrl"
                value={positionForm.applyUrl}
                onChange={handlePositionInputChange}
                placeholder="https:// or mailto: link"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a direct apply link (ATS, form, or mailto). Left empty will default to mailto:hr@apnaaapan.com.
              </p>
            </div>

            <button
              type="submit"
              disabled={positionSaving}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold hover:bg-[#d85c22] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {positionSaving ? 'Saving...' : positionForm.id ? 'Update Position' : 'Create Position'}
            </button>
          </form>
        </div>
        )}

        {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">Existing Positions</h2>
            <button
              type="button"
              onClick={() => fetchPositions()}
              className="text-sm text-[#4A70B0] hover:underline"
            >
              Refresh
            </button>
          </div>

          {positionsLoading ? (
            <p className="text-sm text-gray-600">Loading positions...</p>
          ) : positions.length === 0 ? (
            <p className="text-sm text-gray-600">No positions found yet.</p>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg px-3 py-3 gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0D1B2A]">
                        {position.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          position.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {position.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {position.applyUrl || 'mailto:hr@apnaaapan.com'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePositionEdit(position)}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-[#0D1B2A] hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePositionDelete(position.id)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </section>
    </main>
  );
};

export default AdminPanel;


