import { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import './ApiKeyPage.css';

/**
 * API Key Management Page
 * 
 * Shows API key with copy/regenerate functionality and usage example.
 */
const ApiKeyPage = () => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [regenerating, setRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);

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
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch API key');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!window.confirm('Regenerate API key?\n\nThe old key will stop working immediately. Any applications using it will need to be updated.')) {
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
        return key.substring(0, 8) + '••••••••' + key.substring(key.length - 8);
    };

    return (
        <div className="apikey-page">
            <div className="apikey-header">
                <h1>🔑 Your API Key</h1>
                <p>Use this key to access the Anime API Gateway from external applications</p>
            </div>

            {loading ? (
                <div className="apikey-loading">Loading API key...</div>
            ) : error ? (
                <div className="apikey-error">{error}</div>
            ) : (
                <div className="apikey-content">
                    <div className="apikey-card">
                        <div className="apikey-display">
                            <code>{showKey ? apiKey : maskKey(apiKey)}</code>
                        </div>
                        <div className="apikey-actions">
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
                    </div>

                    <div className="usage-section">
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
                            <ul>
                                <li><code>GET /api/anime?q=query</code> - Search anime</li>
                                <li><code>GET /api/manga?q=query</code> - Search manga</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeyPage;
