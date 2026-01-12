import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../auth/auth';
import './DashboardLayout.css';

/**
 * Dashboard Layout Component
 * 
 * Provides navigation sidebar and content area for all dashboard pages.
 */
const DashboardLayout = () => {
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>🎌 Anime Gateway</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard/anime"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <span className="nav-icon">🎬</span>
                        Search Anime
                    </NavLink>

                    <NavLink
                        to="/dashboard/manga"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <span className="nav-icon">📚</span>
                        Search Manga
                    </NavLink>

                    <NavLink
                        to="/dashboard/api-key"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <span className="nav-icon">🔑</span>
                        API Key
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
