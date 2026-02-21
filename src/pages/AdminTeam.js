import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const getApiUrl = (endpoint) => {
    if (process.env.NODE_ENV === 'production') {
        return endpoint;
    }
    return `http://localhost:5000${endpoint}`;
};

const API_BASE = getApiUrl('/api/team');
const API_ADMIN_LOGIN = getApiUrl('/api/admin-login');
const API_UPLOAD_IMAGE = getApiUrl('/api/upload-image');

const initialFormState = {
    id: '',
    name: '',
    role: '',
    linkedin: '',
    image: '',
    status: 'published',
};

export default function AdminTeam() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminToken, setAdminToken] = useState('');
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState(initialFormState);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecking, setAuthChecking] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const savedToken = window.sessionStorage.getItem('apnaaapan_admin_token');
        const savedEmail = window.sessionStorage.getItem('apnaaapan_admin_email');
        if (savedToken) {
            setAdminToken(savedToken);
            setEmail(savedEmail || '');
            setIsAuthenticated(true);
            fetchTeam(savedToken);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTeam = async (tokenForHeader) => {
        const token = tokenForHeader || adminToken;
        try {
            setLoading(true);
            setError('');
            const headers = token ? { 'x-admin-token': token } : undefined;
            const res = await fetch(`${API_BASE}?includeDrafts=true`, { headers });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                throw new Error(`Server error: ${res.status}`);
            }

            if (!res.ok) throw new Error(data.message || 'Failed to fetch team members');
            setTeam(data.team || []);
        } catch (err) {
            setError(err.message || 'Unable to load team members.');
        } finally {
            setLoading(false);
        }
    };

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

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                throw new Error(`Server error: ${res.status}`);
            }

            if (!res.ok) throw new Error(data.message || 'Login failed');
            const token = data.token || '';
            setAdminToken(token);
            window.sessionStorage.setItem('apnaaapan_admin_token', token);
            window.sessionStorage.setItem('apnaaapan_admin_email', email);
            setIsAuthenticated(true);
            await fetchTeam(token);
            setSuccess('Logged in successfully.');
        } catch (err) {
            setError(err.message || 'Invalid admin credentials.');
        } finally {
            setAuthChecking(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAdminToken('');
        setTeam([]);
        setForm(initialFormState);
        window.sessionStorage.removeItem('apnaaapan_admin_token');
        window.sessionStorage.removeItem('apnaaapan_admin_email');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation: Max 4MB (Vercel limit is 4.5MB)
        if (file.size > 4 * 1024 * 1024) {
            setError('Image is too large. For website performance and server limits, please use images smaller than 4MB.');
            return;
        }

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
                // If not JSON, it might be a 413 or other HTML error
                throw new Error(res.status === 413 ? 'The image file is too large for the server. Try a smaller image.' : `Server error: ${res.status}`);
            }

            if (!res.ok) throw new Error(data.message || 'Upload failed');
            setForm((prev) => ({ ...prev, image: data.url }));
            setSuccess('Image uploaded successfully!');
        } catch (err) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (member) => {
        setForm({
            id: member.id,
            name: member.name || '',
            role: member.role || '',
            linkedin: member.linkedin || '',
            image: member.image || '',
            status: member.status || 'published',
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
        if (!form.name || !form.role) {
            setError('Name and Role are required.');
            return;
        }
        const isUpdate = Boolean(form.id);
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const res = await fetch(API_BASE, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify(form),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                throw new Error(`Server error: ${res.status}`);
            }

            if (!res.ok) throw new Error(data.message || 'Failed to save team member');
            setSuccess(isUpdate ? 'Updated successfully.' : 'Created successfully.');
            setForm(initialFormState);
            await fetchTeam();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            setError('');
            const res = await fetch(API_BASE, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error('Failed to delete');
            setSuccess('Deleted successfully.');
            await fetchTeam();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="bg-[#EFE7D5] min-h-screen">
            <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-24">
                <Link to="/admin" className="text-[#4A70B0] hover:underline block mb-6">← Back to Dashboard</Link>
                <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-8">Manage Team</h1>

                {!isAuthenticated ? (
                    <div className="bg-white rounded-2xl shadow-md p-6 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                        <div className="space-y-4">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded" />
                            <button onClick={handleLogin} disabled={authChecking} className="bg-[#4A70B0] text-white px-4 py-2 rounded w-full">
                                {authChecking ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button onClick={handleLogout} className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">Logout</button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                            <h2 className="text-xl font-bold mb-6">{form.id ? 'Edit Member' : 'Add New Member'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded w-full" required />
                                    <input type="text" name="role" value={form.role} onChange={handleInputChange} placeholder="Role" className="border p-2 rounded w-full" required />
                                </div>
                                <input type="text" name="linkedin" value={form.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="border p-2 rounded w-full" />

                                <div>
                                    <label className="block text-sm font-medium mb-1">Photo</label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        <strong>Max Size: 4MB.</strong> Large images slow down your website.
                                        If your image is too large, use a tool like <a href="https://tinypng.com" target="_blank" rel="noreferrer" className="text-[#4A70B0] hover:underline">TinyPNG</a> to compress it.
                                    </p>
                                    {form.image && (
                                        <div className="mb-2">
                                            <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                        </div>
                                    )}
                                    <input type="file" onChange={handleImageUpload} className="mb-2 block w-full text-sm" />
                                    <input type="text" name="image" value={form.image} onChange={handleInputChange} placeholder="Or paste image URL" className="border p-2 rounded w-full" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <select name="status" value={form.status} onChange={handleInputChange} className="border p-2 rounded">
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                    <button type="submit" disabled={saving} className="bg-[#F26B2A] text-white px-6 py-2 rounded hover:bg-[#d85c22] disabled:opacity-50">
                                        {saving ? 'Saving...' : form.id ? 'Update Member' : 'Add Member'}
                                    </button>
                                    {form.id && <button type="button" onClick={handleNew} className="text-gray-500 hover:underline">Cancel Edit</button>}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-6">Current Team</h2>
                            {loading ? <p>Loading...</p> : team.length === 0 ? <p>No team members found.</p> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {team.map((member) => (
                                        <div key={member.id} className="border rounded-xl p-4 flex flex-col items-center text-center">
                                            <img src={member.image || '/images/file 1.png'} alt={member.name} className="w-24 h-24 object-cover rounded-full mb-3" />
                                            <h3 className="font-bold">{member.name}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(member)} className="text-xs border px-3 py-1 rounded hover:bg-gray-50">Edit</button>
                                                <button onClick={() => handleDelete(member.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                {success && <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}
            </section>
        </main>
    );
}
