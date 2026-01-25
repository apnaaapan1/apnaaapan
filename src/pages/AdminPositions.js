import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_POSITIONS = getApiUrl('/api/positions');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');

const initialPositionForm = {
  id: '',
  title: '',
  description: '',
  applyUrl: '',
  status: 'published',
};

export default function AdminPositions() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [positions, setPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionSaving, setPositionSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [positionForm, setPositionForm] = useState(initialPositionForm);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
    const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
    if (savedToken) {
      setAdminToken(savedToken);
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
      fetchPositions(savedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPositions = async (tokenForHeader) => {
    const token = tokenForHeader || adminToken;
    try {
      setPositionsLoading(true);
      setError('');
      const headers = token ? { 'x-admin-token': token } : undefined;
      const res = await fetch(`${API_POSITIONS}?includeDrafts=true`, { headers });
      if (!res.ok) throw new Error('Failed to fetch positions');
      const data = await res.json();
      setPositions(data.positions || []);
    } catch (err) {
      setError('Unable to load open positions. Please check the server/API.');
    } finally {
      setPositionsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter admin email and password.'); return; }
    try {
      setAuthChecking(true);
      setError(''); setSuccess('');
      const res = await fetch(API_ADMIN_LOGIN, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      const token = data.token || '';
      setAdminToken(token);
      window.sessionStorage.setItem('apnaaapan_admin_token', token);
      window.sessionStorage.setItem('apnaaapan_admin_email', email);
      setIsAuthenticated(true);
      await fetchPositions(token);
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
    setPositions([]);
    setPositionForm(initialPositionForm);
    setError(''); setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
  };

  const handlePositionInputChange = (e) => {
    const { name, value } = e.target;
    setPositionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionNew = () => {
    setPositionForm(initialPositionForm);
    setError(''); setSuccess('');
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

  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!adminToken || !isAuthenticated) { setError('You must be logged in as admin to perform this action.'); return; }
    if (!positionForm.title) { setError('Position title is required.'); return; }

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
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setSuccess(isUpdate ? 'Position updated successfully.' : 'Position created successfully.');
      setPositionForm(initialPositionForm);
      await fetchPositions();
    } catch (err) { setError(err.message || 'Failed to save position.'); }
    finally { setPositionSaving(false); }
  };

  const handlePositionDelete = async (id) => {
    if (!adminToken || !isAuthenticated) { setError('You must be logged in as admin to perform this action.'); return; }
    const confirmDelete = window.confirm('Are you sure you want to delete this position?');
    if (!confirmDelete) return;
    try {
      setPositionSaving(true);
      setError(''); setSuccess('');
      const res = await fetch(API_POSITIONS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete position.');
      setSuccess('Position deleted successfully.');
      await fetchPositions();
    } catch (err) { setError(err.message || 'Failed to delete position.'); }
    finally { setPositionSaving(false); }
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
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-6">Admin – Open Positions</h1>
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
                <h2 className="text-lg font-semibold text-[#0D1B2A]">{positionForm.id ? 'Edit Position' : 'Create New Position'}</h2>
                <button type="button" onClick={handlePositionNew} className="text-sm text-[#4A70B0] hover:underline">+ New</button>
              </div>
              <form onSubmit={handlePositionSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={positionForm.title} onChange={handlePositionInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={positionForm.status} onChange={handlePositionInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70B0]">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={positionForm.description} onChange={handlePositionInputChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" placeholder="Brief summary for this role" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apply URL</label>
                  <input type="text" name="applyUrl" value={positionForm.applyUrl} onChange={handlePositionInputChange} placeholder="https:// or mailto: link" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A70B0]" />
                  <p className="text-xs text-gray-500 mt-1">Add a direct apply link (ATS, form, or mailto). Left empty will default to mailto:hr@apnaaapan.com.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit" disabled={positionSaving} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F26B2A] text-white text-sm font-semibold hover:bg-[#d85c22] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                    {positionSaving ? 'Saving...' : positionForm.id ? 'Update Position' : 'Create Position'}
                  </button>
                  {positionForm.id && (
                    <button 
                      type="button" 
                      onClick={handlePositionNew} 
                      className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-200 text-[#0D1B2A] text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Existing Positions</h2>
                <button type="button" onClick={() => fetchPositions()} className="text-sm text-[#4A70B0] hover:underline">Refresh</button>
              </div>
              {positionsLoading ? (
                <p className="text-sm text-gray-600">Loading positions...</p>
              ) : positions.length === 0 ? (
                <p className="text-sm text-gray-600">No positions found yet.</p>
              ) : (
                <div className="space-y-3">
                  {positions.map((position) => (
                    <div key={position.id} className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg px-3 py-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#0D1B2A]">{position.title}</h3>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${position.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{position.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">{position.applyUrl || 'mailto:hr@apnaaapan.com'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handlePositionEdit(position)} className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-[#0D1B2A] hover:bg-gray-50">Edit</button>
                        <button type="button" onClick={() => handlePositionDelete(position.id)} className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50">Delete</button>
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
