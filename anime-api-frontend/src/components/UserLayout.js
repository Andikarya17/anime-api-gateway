import { NavLink, Outlet } from 'react-router-dom';
import { logout } from '../auth/auth';
import './UserLayout.css';

/**
 * User Layout
 * 
 * MAL-style sidebar navigation for users.
 */
const UserLayout = () => {
    return (
        <div className="user-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon">🎌</span>
                    <span className="brand-text">AnimeGateway</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard/anime" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="nav-icon">🔍</span>
                        Anime Search
                    </NavLink>
                    <NavLink to="/dashboard/manga" className={({ isActive }) => isActive ? 'active' : ''}>
                        <span className="nav-icon">📚</span>
                        Manga Search
                    </NavLink>
                    <NavLink to="/dashboard/api" className={({ isActive }) => isActive ? 'active' : ''}>
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

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
