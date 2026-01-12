import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoute, UserRoute } from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeSearch from './pages/AnimeSearch';
import MangaSearch from './pages/MangaSearch';
import AnimeDetail from './pages/AnimeDetail';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { isAuthenticated, getCurrentUser } from './auth/auth';
import './App.css';

/**
 * App Component - Role-Based Router
 * 
 * Routes:
 * - /login, /register - Public
 * - /dashboard/* - User only
 * - /anime/:id - User only (anime detail)
 * - /admin - Admin only
 */
function App() {
    const getHomeRedirect = () => {
        if (!isAuthenticated()) return '/login';
        const user = getCurrentUser();
        return user?.role === 'admin' ? '/admin' : '/dashboard/anime';
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Root redirect */}
                <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User routes */}
                <Route
                    path="/dashboard"
                    element={
                        <UserRoute>
                            <UserLayout />
                        </UserRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard/anime" replace />} />
                    <Route path="anime" element={<AnimeSearch />} />
                    <Route path="manga" element={<MangaSearch />} />
                    <Route path="api" element={<UserDashboard />} />
                </Route>

                {/* Anime Detail (User only) */}
                <Route
                    path="/anime/:id"
                    element={
                        <UserRoute>
                            <AnimeDetail />
                        </UserRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
