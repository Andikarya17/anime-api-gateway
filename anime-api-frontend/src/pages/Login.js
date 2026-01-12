import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, userAPI } from '../api/api';
import { decodeToken } from '../auth/auth';
import './Login.css';

/**
 * Login Page
 * 
 * Redirects based on user role:
 * - Admin → /admin
 * - User → /dashboard/anime
 */
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Login and get token
            const response = await authAPI.login(formData.username, formData.password);

            if (response.data.success && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                // Decode token to get role
                const decoded = decodeToken(token);

                // Fetch and store API key for users (needed for search)
                if (decoded?.role !== 'admin') {
                    try {
                        const apiKeyResponse = await userAPI.getApiKey();
                        if (apiKeyResponse.data?.data?.api_key) {
                            localStorage.setItem('apiKey', apiKeyResponse.data.data.api_key);
                        }
                    } catch (err) {
                        console.warn('Could not fetch API key:', err);
                    }
                }

                // Redirect based on role
                if (decoded?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard/anime');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>🎌 Anime Gateway</h1>
                <p className="subtitle">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
