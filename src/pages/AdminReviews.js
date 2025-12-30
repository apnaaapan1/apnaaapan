import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_REVIEWS = getApiUrl('/api/reviews');
const API_UPLOAD_IMAGE = getApiUrl('/api/upload-image');
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const avatarOptions = ['👨‍💼', '👩‍💼', '👤', '👨', '👩', '🧑‍💼', '🙋‍♂️', '🙋‍♀️'];

export default function AdminReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    feedback: '',
    avatar: '👤',
    imageUrl: '',
    rating: 5,
    order: 0,
    status: 'active'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = window.sessionStorage.getItem('apnaaapan_admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    setAdminToken(token);
    fetchReviews();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_REVIEWS);
      const data = await res.json();
      if (data.success) {
        // Fetch all reviews including inactive ones for admin
        const token = window.sessionStorage.getItem('apnaaapan_admin_token');
        const adminRes = await fetch(API_REVIEWS + '?all=true', {
          headers: { 'x-admin-token': token }
        });
        const adminData = await adminRes.json();
        setReviews(adminData.reviews || data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      feedback: '',
      avatar: '👤',
      imageUrl: '',
      rating: 5,
      order: 0,
      status: 'active'
    });
    setEditingId(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.feedback.trim()) {
      setError('Name and feedback are required');
      return;
    }

    try {
      setLoading(true);
      
      // Upload image if selected
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        setUploading(true);
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);

        const uploadRes = await fetch(API_UPLOAD_IMAGE, {
          method: 'POST',
          headers: { 'x-admin-token': adminToken },
          body: imageFormData
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed');
        
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const url = API_REVIEWS;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { ...formData, imageUrl, id: editingId }
        : { ...formData, imageUrl };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setSuccess(data.message || (editingId ? 'Review updated' : 'Review created'));
      resetForm();
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleEdit = (review) => {
    setFormData({
      name: review.name,
      role: review.role || '',
      feedback: review.feedback,
      avatar: review.avatar || '👤',
      imageUrl: review.imageUrl || '',
      rating: review.rating || 5,
      order: review.order || 0,
      status: review.status || 'active'
    });
    setEditingId(review._id);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch(`${API_REVIEWS}?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      setSuccess('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    navigate('/admin');
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-[#EFE7D5] text-[#0D1B2A] text-sm font-medium hover:bg-[#e0d8c5] transition-colors border border-[#d4c9b0]"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-2">Manage Client Reviews</h1>
            <p className="text-sm text-gray-700">Add, edit, or delete client testimonials</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Logout
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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">
            {editingId ? 'Edit Review' : 'Add New Review'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Company
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  placeholder="CEO, Company Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback *
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0] min-h-[100px]"
                placeholder="Enter client feedback..."
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Client Photo (Choose One Option)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 1: Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (file.size > MAX_IMAGE_SIZE_BYTES) {
                        setError('Image too large. Max 10MB allowed.');
                        e.target.value = '';
                        setSelectedFile(null);
                        return;
                      }
                      setSelectedFile(file);
                      setFormData({ ...formData, avatar: '', imageUrl: '' });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0] text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max size: 10MB. Allowed types: JPG, PNG, GIF, WebP.</p>
                  {selectedFile && (
                    <p className="text-xs text-green-600 mt-1">✓ {selectedFile.name}</p>
                  )}
                  {formData.imageUrl && !selectedFile && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Current" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="text-xs text-red-600 hover:text-red-700 mt-1"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option 2: Select Avatar
                  </label>
                  <select
                    value={formData.avatar}
                    onChange={(e) => {
                      setFormData({ ...formData, avatar: e.target.value, imageUrl: '' });
                      setSelectedFile(null);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                    disabled={!!selectedFile || !!formData.imageUrl}
                  >
                    {avatarOptions.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                  {(selectedFile || formData.imageUrl) && (
                    <p className="text-xs text-gray-500 mt-1">Avatar disabled (image selected)</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2 rounded-lg bg-[#4A70B0] text-white font-medium hover:bg-[#3b5d92] transition-colors disabled:opacity-60"
              >
                {uploading ? 'Uploading Image...' : loading ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-lg bg-gray-200 text-[#0D1B2A] font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">
            Existing Reviews ({reviews.length})
          </h2>
          {loading && <p className="text-gray-600">Loading...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-gray-600">No reviews yet. Add your first review above.</p>
          )}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`border rounded-lg p-4 ${
                  review.status === 'inactive' ? 'bg-gray-50 opacity-75' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {review.imageUrl ? (
                      <img 
                        src={review.imageUrl} 
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-300"
                      />
                    ) : (
                      <span className="text-2xl mr-3">{review.avatar}</span>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800">{review.name}</h3>
                      <p className="text-sm text-gray-600">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">
                      {'★'.repeat(review.rating || 5)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      review.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{review.feedback}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="px-4 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-4 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
