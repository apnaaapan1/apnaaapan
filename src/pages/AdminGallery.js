import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_GALLERY = getApiUrl('/api/gallery');
const API_UPLOAD_IMAGE = getApiUrl('/api/upload-image');

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [useUrl, setUseUrl] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem('apnaaapan_admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchGallery();
  }, [navigate]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_GALLERY}?all=true`);
      if (!res.ok) throw new Error('Failed to fetch gallery');
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      // Get admin token from sessionStorage
      const adminToken = window.sessionStorage.getItem('apnaaapan_admin_token');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const uploadRes = await fetch(API_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      const uploadData = await uploadRes.json();

      // Add image to gallery (newest first handled by API sort)
      const addRes = await fetch(API_GALLERY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.url || uploadData.imageUrl
        }),
      });

      if (!addRes.ok) throw new Error('Failed to add image to gallery');

      setSuccess('Image added successfully!');
      fetchGallery();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const addRes = await fetch(API_GALLERY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl.trim()
        }),
      });

      if (!addRes.ok) throw new Error('Failed to add image to gallery');

      setSuccess('Image added successfully!');
      setImageUrl('');
      fetchGallery();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setError('');
      setSuccess('');
      const res = await fetch(`${API_GALLERY}?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image');

      setSuccess('Image deleted successfully!');
      fetchGallery();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A]">Manage Gallery</h1>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

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

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">Add New Image</h2>
          
          {/* Toggle between Upload and URL */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseUrl(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !useUrl
                  ? 'bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setUseUrl(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                useUrl
                  ? 'bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Enter URL
            </button>
          </div>

          {!useUrl ? (
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white font-semibold hover:shadow-lg transition-all ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  {uploading ? 'Uploading...' : 'Choose Image'}
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {images.length} images
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                  disabled={uploading}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={uploading || !imageUrl.trim()}
                  className={`px-6 py-3 rounded-lg bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white font-semibold hover:shadow-lg transition-all ${
                    uploading || !imageUrl.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Adding...' : 'Add Image'}
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {images.length} images
              </span>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading gallery...</div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div
                key={img._id}
                className="group relative rounded-xl border border-black/30 bg-white shadow-sm overflow-hidden aspect-square"
              >
                <img
                  src={img.imageUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No images yet. Add your first image above!
          </div>
        )}
      </section>
    </main>
  );
}
