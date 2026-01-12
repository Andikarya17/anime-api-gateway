import { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import { logout, getCurrentUser } from '../auth/auth';
import './UserDashboard.css';

/**
 * User Dashboard
 * 
 * API key management for users to consume the API.
 */
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
                    <h1>🔑 API Key Management</h1>
                </div>
                <div className="header-right">
                    <span className="user-info">Welcome, {user?.userId}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                {loading ? (
                    <div className="loading-state">Loading API key...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : (
                    <>
                        {/* API Key Card */}
                        <section className="api-key-card">
                            <h2>Your API Key</h2>
                            <p className="description">
                                Use this key to access the Anime API Gateway from your applications.
                            </p>

                            <div className="key-display">
                                <code className="key-value">
                                    {showKey ? apiKey : maskKey(apiKey)}
                                </code>
                            </div>

                            <div className="key-actions">
                                <button onClick={() => setShowKey(!showKey)} className="btn btn-secondary">
                                    {showKey ? '👁️ Hide' : '👁️ Show'}
                                </button>
                                <button onClick={handleCopy} className="btn btn-primary">
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                                <button onClick={handleRegenerate} disabled={regenerating} className="btn btn-danger">
                                    {regenerating ? '⟳ Regenerating...' : '🔄 Regenerate'}
                                </button>
                            </div>

                            {keyCreatedAt && (
                                <p className="key-created">Last updated: {keyCreatedAt}</p>
                            )}
                        </section>

                        {/* Usage Examples */}
                        <section className="usage-section">
                            <h2>Usage Examples</h2>

                            <div className="usage-block">
                                <h3>cURL</h3>
                                <pre>{`curl -X GET "http://localhost:3000/api/anime?q=naruto" \\
  -H "X-API-Key: ${showKey ? apiKey : '<your-api-key>'}"`}</pre>
                            </div>

                            <div className="usage-block">
                                <h3>JavaScript (fetch)</h3>
                                <pre>{`fetch('http://localhost:3000/api/anime?q=naruto', {
  headers: {
    'X-API-Key': '${showKey ? apiKey : '<your-api-key>'}'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}</pre>
                            </div>

                            <div className="usage-block">
                                <h3>Available Endpoints</h3>
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
                                            <td>GET</td>
                                            <td><code>/api/anime?q=query</code></td>
                                            <td>Search anime</td>
                                        </tr>
                                        <tr>
                                            <td>GET</td>
                                            <td><code>/api/anime/:id</code></td>
                                            <td>Get anime details</td>
                                        </tr>
                                        <tr>
                                            <td>GET</td>
                                            <td><code>/api/manga?q=query</code></td>
                                            <td>Search manga</td>
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
