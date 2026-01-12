import { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import { logout } from '../auth/auth';
import './AdminDashboard.css';

/**
 * Admin Dashboard
 * 
 * Admin-only page for monitoring:
 * - Registered users
 * - API keys per user
 * - Registration/login times
 */
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminAPI.getUsers();
            setUsers(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const maskKey = (key) => {
        if (!key) return '—';
        return key.substring(0, 8) + '...' + key.substring(key.length - 8);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="header-left">
                    <span className="admin-badge">ADMIN</span>
                    <h1>User Management</h1>
                </div>
                <button onClick={logout} className="logout-btn">Logout</button>
            </header>

            <main className="admin-main">
                {loading && <div className="loading">Loading users...</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && (
                    <div className="users-section">
                        <div className="section-header">
                            <h2>Registered Users</h2>
                            <span className="user-count">{users.length} users total</span>
                        </div>

                        <div className="table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>API Key</th>
                                        <th>Status</th>
                                        <th>Registered</th>
                                        <th>Last Login</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="id-cell">{user.id}</td>
                                            <td className="username-cell">{user.username}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="apikey-cell">
                                                <code>{maskKey(user.api_key)}</code>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.api_key ? 'active' : 'inactive'}`}>
                                                    {user.api_key ? 'Active' : 'No Key'}
                                                </span>
                                            </td>
                                            <td className="date-cell">{formatDate(user.createdAt)}</td>
                                            <td className="date-cell">{formatDate(user.last_login_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {users.length === 0 && (
                            <div className="empty-state">No users found</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
