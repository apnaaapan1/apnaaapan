import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
    const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
    if (savedToken) {
      setAdminToken(savedToken);
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
    }
  }, []);

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
      setSuccess('Logged in successfully. Choose what to manage.');
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
    setError('');
    setSuccess('Logged out.');
    window.sessionStorage.removeItem('apnaaapan_admin_token');
    window.sessionStorage.removeItem('apnaaapan_admin_email');
    window.localStorage.removeItem('apnaaapan_admin_token');
    window.localStorage.removeItem('apnaaapan_admin_email');
    navigate('/admin');
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-6">Admin Panel</h1>
        <p className="text-sm text-gray-700 mb-6">Login, then choose what to manage.</p>

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

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
        )}

        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/blogs"
              className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-[#0D1B2A]">Manage Blogs</h3>
                <span className="text-[#4A70B0] group-hover:underline">Open</span>
              </div>
              <p className="text-sm text-gray-600">Create, edit, and delete blog posts.</p>
            </Link>

            <Link
              to="/admin/positions"
              className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-[#0D1B2A]">Manage Open Positions</h3>
                <span className="text-[#4A70B0] group-hover:underline">Open</span>
              </div>
              <p className="text-sm text-gray-600">Create, edit, and delete hiring roles.</p>
            </Link>

            <Link
              to="/admin/work"
              className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-[#0D1B2A]">Manage Work Posts</h3>
                <span className="text-[#4A70B0] group-hover:underline">Open</span>
              </div>
              <p className="text-sm text-gray-600">Create, edit, and delete portfolio projects shown on Work page.</p>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
