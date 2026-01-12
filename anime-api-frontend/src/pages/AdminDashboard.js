import { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import { logout } from '../auth/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchLogs();
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

    const fetchLogs = async () => {
        setLogsLoading(true);
        try {
            const response = await adminAPI.getLogs();
            const logsData = response.data.data || [];
            const sortedLogs = logsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLogs(sortedLogs.slice(0, 50));
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLogsLoading(false);
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

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalUsers: users.length,
        activeKeys: users.filter(u => u.api_key).length,
        admins: users.filter(u => u.role === 'admin').length,
        regularUsers: users.filter(u => u.role === 'user').length
    };

    const getStatusColor = (code) => {
        if (code >= 200 && code < 300) return 'status-success';
        if (code >= 400 && code < 500) return 'status-warning';
        if (code >= 500) return 'status-error';
        return '';
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="header-left">
                    <div className="admin-badge">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8V12L15 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        ADMIN
                    </div>
                    <div className="header-text">
                        <h1>User Management</h1>
                        <p>Monitor registered users and API keys</p>
                    </div>
                </div>
                <button onClick={logout} className="logout-btn">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                </button>
            </header>

            <main className="admin-main">
                {!loading && !error && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon users">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalUsers}</span>
                                <span className="stat-label">Total Users</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon keys">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 2L19 4M11.3891 11.6109C12.3844 12.6062 13 13.9812 13 15.5C13 18.5376 10.5376 21 7.5 21C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C9.01878 10 10.3938 10.6156 11.3891 11.6109ZM11.3891 11.6109L15.5 7.5M15.5 7.5L18 10L22 6L19 3L15.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.activeKeys}</span>
                                <span className="stat-label">Active API Keys</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon admins">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8V12L15 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.admins}</span>
                                <span className="stat-label">Admins</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon regular">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.regularUsers}</span>
                                <span className="stat-label">Regular Users</span>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="users-section">
                        <div className="section-header">
                            <div className="section-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h2>Registered Users</h2>
                                <span className="user-count">{filteredUsers.length} users</span>
                            </div>
                            <div className="search-box">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
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
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="id-cell">#{user.id}</td>
                                            <td className="username-cell">
                                                <div className="user-avatar">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                {user.username}
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role === 'admin' && (
                                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                                            <path d="M12 8V12L15 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="apikey-cell">
                                                <code>{maskKey(user.api_key)}</code>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.api_key ? 'active' : 'inactive'}`}>
                                                    <span className="status-dot"></span>
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

                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <p>No users found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* API Usage Logs Section */}
                <div className="users-section logs-section">
                    <div className="section-header">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h2>API Usage Logs</h2>
                            <span className="user-count">{logs.length} recent requests</span>
                        </div>
                    </div>

                    {logsLoading ? (
                        <div className="loading-state" style={{ padding: '40px' }}>
                            <div className="loading-spinner"></div>
                            <p>Loading logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <p>No API activity yet.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="users-table logs-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Endpoint</th>
                                        <th>Query Params</th>
                                        <th>Status</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => (
                                        <tr key={log.id || index}>
                                            <td className="username-cell">
                                                <div className="user-avatar">
                                                    {log.User?.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                {log.User?.username || 'Unknown'}
                                            </td>
                                            <td className="apikey-cell">
                                                <code>{log.endpoint}</code>
                                            </td>
                                            <td className="query-cell">
                                                {log.query_params ? (
                                                    <code>{log.query_params}</code>
                                                ) : (
                                                    <span className="no-params">—</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-code-badge ${getStatusColor(log.statusCode)}`}>
                                                    {log.statusCode}
                                                </span>
                                            </td>
                                            <td className="date-cell">{formatDate(log.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
