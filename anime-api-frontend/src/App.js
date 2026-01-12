import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoute, UserRoute } from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeSearch from './pages/AnimeSearch';
import MangaSearch from './pages/MangaSearch';
import AnimeDetail from './pages/AnimeDetail';
import MangaDetail from './pages/MangaDetail';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { isAuthenticated, getCurrentUser } from './auth/auth';
import './App.css';

function App() {
    const getHomeRedirect = () => {
        if (!isAuthenticated()) return '/login';
        const user = getCurrentUser();
        return user?.role === 'admin' ? '/admin' : '/dashboard/anime';
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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

                <Route
                    path="/anime/:id"
                    element={
                        <UserRoute>
                            <AnimeDetail />
                        </UserRoute>
                    }
                />

                <Route
                    path="/manga/:id"
                    element={
                        <UserRoute>
                            <MangaDetail />
                        </UserRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
