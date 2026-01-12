import { useState, useEffect } from 'react';
import { userAPI, testGateway } from '../api/api';
import { getCurrentUser, logout } from '../auth/auth';
import './Dashboard.css';

/**
 * Dashboard Page
 * 
 * Shows user info, API key management, and API tester.
 */
const Dashboard = () => {
    const user = getCurrentUser();

    // API Key state
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [keyLoading, setKeyLoading] = useState(true);
    const [keyError, setKeyError] = useState('');
    const [regenerating, setRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // API Tester state
    const [endpoint, setEndpoint] = useState('/api/anime?q=naruto');
    const [testResult, setTestResult] = useState(null);
    const [testLoading, setTestLoading] = useState(false);
    const [testError, setTestError] = useState('');

    // Fetch API key on mount
    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        setKeyLoading(true);
        setKeyError('');
        try {
            const response = await userAPI.getApiKey();
            const key = response.data.data.api_key;
            setApiKey(key);
            localStorage.setItem('apiKey', key);
        } catch (err) {
            setKeyError(err.response?.data?.message || 'Failed to fetch API key');
        } finally {
            setKeyLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!window.confirm('Regenerate API key? The old key will stop working immediately.')) {
            return;
        }
        setRegenerating(true);
        setKeyError('');
        try {
            const response = await userAPI.regenerateApiKey();
            const newKey = response.data.data.api_key;
            setApiKey(newKey);
            localStorage.setItem('apiKey', newKey);
            setShowKey(true);
        } catch (err) {
            setKeyError(err.response?.data?.message || 'Failed to regenerate');
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
        return key.substring(0, 8) + '...' + key.substring(key.length - 8);
    };

    const handleTestApi = async (e) => {
        e.preventDefault();
        setTestLoading(true);
        setTestError('');
        setTestResult(null);

        try {
            const response = await testGateway(endpoint);
            setTestResult(response.data);
        } catch (err) {
            setTestError(err.response?.data?.message || err.message || 'Request failed');
            if (err.response?.data) {
                setTestResult(err.response.data);
            }
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <h1>Developer Portal</h1>
                <div className="header-right">
                    <span>User ID: {user?.userId}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                {/* API Key Section */}
                <section className="card api-key-card">
                    <h2>🔑 Your API Key</h2>
                    <p>Use this key to access the API Gateway from external applications.</p>

                    {keyLoading ? (
                        <div className="loading">Loading API key...</div>
                    ) : keyError ? (
                        <div className="error">{keyError}</div>
                    ) : (
                        <>
                            <div className="key-display">
                                <code>{showKey ? apiKey : maskKey(apiKey)}</code>
                                <div className="key-actions">
                                    <button onClick={() => setShowKey(!showKey)}>
                                        {showKey ? 'Hide' : 'Show'}
                                    </button>
                                    <button onClick={handleCopy}>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button onClick={handleRegenerate} disabled={regenerating} className="danger">
                                        {regenerating ? 'Regenerating...' : 'Regenerate'}
                                    </button>
                                </div>
                            </div>

                            <div className="usage-example">
                                <h3>Usage Example</h3>
                                <pre>
                                    {`curl -X GET "${process.env.REACT_APP_API_BASE_URL}/api/anime?q=naruto" \\
  -H "X-API-Key: ${showKey ? apiKey : '<your-api-key>'}"`}
                                </pre>
                            </div>
                        </>
                    )}
                </section>

                {/* API Tester Section */}
                <section className="card api-tester-card">
                    <h2>🧪 API Tester</h2>
                    <p>Test API endpoints using your API key.</p>

                    <form onSubmit={handleTestApi} className="tester-form">
                        <div className="input-row">
                            <input
                                type="text"
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                                placeholder="/api/anime?q=naruto"
                            />
                            <button type="submit" disabled={testLoading}>
                                {testLoading ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </form>

                    {testError && <div className="error">{testError}</div>}

                    {testResult && (
                        <div className="result">
                            <h3>Response:</h3>
                            <pre>{JSON.stringify(testResult, null, 2)}</pre>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
