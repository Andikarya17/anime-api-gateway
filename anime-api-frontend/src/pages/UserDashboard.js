import { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import { logout, getCurrentUser } from '../auth/auth';
import './UserDashboard.css';

const UserDashboard = () => {
    const user = getCurrentUser();
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [regenerating, setRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [keyCreatedAt, setKeyCreatedAt] = useState(null);

    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await userAPI.getApiKey();
            const key = response.data.data.api_key;
            setApiKey(key);
            localStorage.setItem('apiKey', key);
            setKeyCreatedAt(new Date().toLocaleString());
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch API key');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!window.confirm('Regenerate API key? The old key will stop working immediately.')) {
            return;
        }
        setRegenerating(true);
        setError('');
        try {
            const response = await userAPI.regenerateApiKey();
            const newKey = response.data.data.api_key;
            setApiKey(newKey);
            localStorage.setItem('apiKey', newKey);
            setShowKey(true);
            setKeyCreatedAt(new Date().toLocaleString());
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to regenerate');
        } finally {
            setRegenerating(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const maskKey = (key) => {
        if (!key) return '';
        return key.substring(0, 12) + '••••••••••••' + key.substring(key.length - 12);
    };

    return (
        <div className="user-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="header-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 2L19 4M11.3891 11.6109C12.3844 12.6062 13 13.9812 13 15.5C13 18.5376 10.5376 21 7.5 21C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C9.01878 10 10.3938 10.6156 11.3891 11.6109ZM11.3891 11.6109L15.5 7.5M15.5 7.5L18 10L22 6L19 3L15.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="header-text">
                        <h1>API Key Management</h1>
                        <p>Manage your API credentials for the Anime Gateway</p>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-badge">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>{user?.userId}</span>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading API key...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <section className="api-key-card">
                            <div className="card-header">
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 2L19 4M11.3891 11.6109C12.3844 12.6062 13 13.9812 13 15.5C13 18.5376 10.5376 21 7.5 21C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C9.01878 10 10.3938 10.6156 11.3891 11.6109ZM11.3891 11.6109L15.5 7.5M15.5 7.5L18 10L22 6L19 3L15.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="card-title">
                                    <h2>Your API Key</h2>
                                    <p>Use this key to authenticate your API requests</p>
                                </div>
                            </div>

                            <div className="key-display">
                                <code className="key-value">
                                    {showKey ? apiKey : maskKey(apiKey)}
                                </code>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="key-toggle"
                                    title={showKey ? 'Hide key' : 'Show key'}
                                >
                                    {showKey ? (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="key-actions">
                                <button onClick={handleCopy} className={`btn btn-primary ${copied ? 'copied' : ''}`}>
                                    {copied ? (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Copy Key
                                        </>
                                    )}
                                </button>
                                <button onClick={handleRegenerate} disabled={regenerating} className="btn btn-danger">
                                    {regenerating ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Regenerating...
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20.49 15C19.84 16.81 18.61 18.35 16.98 19.38C15.35 20.42 13.41 20.88 11.47 20.69C9.53 20.51 7.72 19.69 6.29 18.36C4.87 17.03 3.92 15.28 3.56 13.37C3.2 11.46 3.46 9.48 4.3 7.73C5.14 5.98 6.52 4.54 8.24 3.63C9.95 2.72 11.91 2.37 13.82 2.66C15.74 2.94 17.51 3.82 18.89 5.17L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Regenerate Key
                                        </>
                                    )}
                                </button>
                            </div>

                            {keyCreatedAt && (
                                <p className="key-meta">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Last updated: {keyCreatedAt}
                                </p>
                            )}
                        </section>

                        <section className="usage-section">
                            <div className="section-header">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="16,18 22,12 16,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="8,6 2,12 8,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h2>Quick Start</h2>
                            </div>

                            <div className="usage-grid">
                                <div className="usage-block">
                                    <div className="usage-header">
                                        <span className="usage-label">cURL</span>
                                    </div>
                                    <pre className="code-block">{`curl -X GET "http://localhost:3000/api/anime?q=naruto" \\
  -H "X-API-Key: ${showKey ? apiKey : '<your-api-key>'}"`}</pre>
                                </div>

                                <div className="usage-block">
                                    <div className="usage-header">
                                        <span className="usage-label">JavaScript</span>
                                    </div>
                                    <pre className="code-block">{`fetch('http://localhost:3000/api/anime?q=naruto', {
  headers: {
    'X-API-Key': '${showKey ? apiKey : '<your-api-key>'}'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}</pre>
                                </div>
                            </div>
                        </section>

                        <section className="endpoints-section">
                            <div className="section-header">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69752 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h2>Available Endpoints</h2>
                            </div>

                            <div className="endpoints-table-wrapper">
                                <table className="endpoints-table">
                                    <thead>
                                        <tr>
                                            <th>Method</th>
                                            <th>Endpoint</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span className="method-badge get">GET</span></td>
                                            <td><code>/api/anime?q=query</code></td>
                                            <td>Search anime by title</td>
                                        </tr>
                                        <tr>
                                            <td><span className="method-badge get">GET</span></td>
                                            <td><code>/api/anime/:id</code></td>
                                            <td>Get anime details by ID</td>
                                        </tr>
                                        <tr>
                                            <td><span className="method-badge get">GET</span></td>
                                            <td><code>/api/manga?q=query</code></td>
                                            <td>Search manga by title</td>
                                        </tr>
                                        <tr>
                                            <td><span className="method-badge get">GET</span></td>
                                            <td><code>/api/manga/:id</code></td>
                                            <td>Get manga details by ID</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
