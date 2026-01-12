import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeSearch from './pages/AnimeSearch';
import MangaSearch from './pages/MangaSearch';
import ApiKeyPage from './pages/ApiKeyPage';
import { isAuthenticated } from './auth/auth';
import './App.css';

/**
 * App Component - Main Router
 * 
 * Routes:
 * - /login - Public
 * - /register - Public
 * - /dashboard/* - Protected (requires login)
 *   - /dashboard/anime - Anime search
 *   - /dashboard/manga - Manga search
 *   - /dashboard/api-key - API key management
 */
function App() {
    const getHomeRedirect = () => {
        return isAuthenticated() ? '/dashboard/anime' : '/login';
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root */}
                <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected dashboard routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Default redirect to anime search */}
                    <Route index element={<Navigate to="/dashboard/anime" replace />} />
                    <Route path="anime" element={<AnimeSearch />} />
                    <Route path="manga" element={<MangaSearch />} />
                    <Route path="api-key" element={<ApiKeyPage />} />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
