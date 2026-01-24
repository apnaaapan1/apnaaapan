import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_EVENTS = getApiUrl('/api/events');
const API_SETTINGS = getApiUrl('/api/settings');

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestEventLink, setSuggestEventLink] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    emoji: '✨',
    author: 'Apnaaapan Team',
    content: [''],
    order: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem('apnaaapan_admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchEvents();
    fetchSuggestLink();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_EVENTS);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch events: ${res.status} - ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch events error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestLink = async () => {
    try {
      const res = await fetch(`${API_SETTINGS}?key=suggest_event_link`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSuggestEventLink(data.setting?.value || '');
    } catch (err) {
      console.error('Error fetching suggest link:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      const adminToken = window.sessionStorage.getItem('apnaaapan_admin_token');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(API_EVENTS, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Events API error:', res.status, errorData);
        throw new Error(errorData.message || `Failed to ${editingId ? 'update' : 'add'} event (${res.status})`);
      }

      setSuccess(`Event ${editingId ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      date: event.date,
      emoji: event.emoji,
      author: event.author,
      content: event.content,
      order: event.order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setError('');
      setSuccess('');

      const adminToken = window.sessionStorage.getItem('apnaaapan_admin_token');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const res = await fetch(API_EVENTS, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Events DELETE error:', res.status, errorData);
        throw new Error(errorData.message || `Failed to delete event (${res.status})`);
      }

      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuggestLinkSave = async () => {
    try {
      setError('');
      setSuccess('');

      const adminToken = window.sessionStorage.getItem('apnaaapan_admin_token');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const res = await fetch(API_SETTINGS, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          key: 'suggest_event_link',
          value: suggestEventLink
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Settings API error:', res.status, errorData);
        throw new Error(errorData.message || `Failed to save link (${res.status})`);
      }

      setSuccess('Suggest Event link saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      emoji: '✨',
      author: 'Apnaaapan Team',
      content: [''],
      order: 0
    });
  };

  const updateContent = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData({ ...formData, content: newContent });
  };

  const addContentParagraph = () => {
    setFormData({ ...formData, content: [...formData.content, ''] });
  };

  const removeContentParagraph = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A]">Manage Events</h1>
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

        {/* Suggest Event Link Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">Suggest Event Button Link</h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={suggestEventLink}
              onChange={(e) => setSuggestEventLink(e.target.value)}
              placeholder="Enter Google Form or other link"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
            />
            <button
              onClick={handleSuggestLinkSave}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white font-semibold hover:shadow-lg transition-all"
            >
              Save Link
            </button>
          </div>
        </div>

        {/* Event Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                  placeholder="Curiosity Meetup at HQ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                  placeholder="Mar 12, 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                  placeholder="✨"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                  placeholder="Apnaaapan Team"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (Paragraphs)</label>
              {formData.content.map((paragraph, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateContent(index, e.target.value)}
                    required
                    rows={2}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-[#E86C21] focus:outline-none focus:ring-2 focus:ring-[#E86C21]/20"
                    placeholder={`Paragraph ${index + 1}`}
                  />
                  {formData.content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContentParagraph(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addContentParagraph}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                + Add Paragraph
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#E86C21] to-[#F6BE18] text-white font-semibold hover:shadow-lg transition-all"
              >
                {editingId ? 'Update Event' : 'Add Event'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading events...</div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{event.emoji}</span>
                      <h3 className="text-xl font-bold text-[#0D1B2A]">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.date} • By {event.author}</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      {event.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No events yet. Add your first event above!
          </div>
        )}
      </section>
    </main>
  );
}
