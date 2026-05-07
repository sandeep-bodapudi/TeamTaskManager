import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { LogOut, LayoutDashboard, FolderKanban, Moon, Sun, Users, Settings } from 'lucide-react';
import api from './api/axios';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Team from './pages/Team';
import SettingsPage from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!user) return null;

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const desktopLinkClass = (path) =>
    `btn border-none transition-colors flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      isActive(path)
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  const mobileNavItem = (path, icon, label) => (
    <Link to={path} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', flex: 1, padding: '0.5rem 0.25rem',
      color: isActive(path) ? 'var(--accent)' : 'var(--text-muted)',
      textDecoration: 'none', transition: 'color 0.15s', fontSize: '10px',
      fontWeight: isActive(path) ? 700 : 500, gap: '2px'
    }}>
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Top Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Team Task Manager
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={desktopLinkClass('/')}><LayoutDashboard size={16} /> Dashboard</Link>
          <Link to="/projects" className={desktopLinkClass('/projects')}><FolderKanban size={16} /> Projects</Link>
          {user.role === 'Admin' && (
            <Link to="/team" className={desktopLinkClass('/team')}><Users size={16} /> Team</Link>
          )}
          <Link to="/settings" className={desktopLinkClass('/settings')}><Settings size={16} /> Settings</Link>

          <span style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {user.name}
            <span style={{
              display: 'inline-block', marginLeft: '0.5rem',
              fontSize: '0.7rem', background: 'var(--accent-light)',
              color: 'var(--accent-text)', padding: '0.1rem 0.5rem',
              borderRadius: '999px', fontWeight: 700
            }}>
              {user.role}
            </span>
          </span>

          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '8px',
              padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', marginLeft: '0.25rem', transition: 'all 0.15s'
            }}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: '1.5px solid var(--danger-border)', borderRadius: '8px',
              padding: '0.4rem', cursor: 'pointer', color: 'var(--danger-text)',
              display: 'flex', alignItems: 'center', marginLeft: '0.25rem', transition: 'all 0.15s'
            }}
          >
            <LogOut size={17} />
          </button>
        </div>

        {/* Mobile Top: just theme + logout */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '8px',
              padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: '1.5px solid var(--danger-border)', borderRadius: '8px',
              padding: '0.4rem', cursor: 'pointer', color: 'var(--danger-text)',
              display: 'flex', alignItems: 'center'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation — hidden on desktop via md:hidden */}
      <div className="flex md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        zIndex: 50, alignItems: 'stretch',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        {mobileNavItem('/', <LayoutDashboard size={21} />, 'Dashboard')}
        {mobileNavItem('/projects', <FolderKanban size={21} />, 'Projects')}
        {user.role === 'Admin' && mobileNavItem('/team', <Users size={21} />, 'Team')}
        {mobileNavItem('/settings', <Settings size={21} />, 'Settings')}
      </div>
    </>
  );
};

const MemberGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [hasTeam, setHasTeam] = useState(null);

  useEffect(() => {
    if (user?.role === 'Member') {
      api.get('/teams').then(res => setHasTeam(!!res.data)).catch(() => setHasTeam(false));
    } else {
      setHasTeam(true);
    }
  }, [user]);

  if (hasTeam === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading workspace…</div>
      </div>
    );
  }

  if (user?.role === 'Member' && !hasTeam) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '420px', padding: '2.5rem' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.4 }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Looking for an Admin to connect</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Please ask your lead to add your exact email address{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>({user.email})</strong> to their group.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><MemberGuard><Dashboard /></MemberGuard></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><MemberGuard><Projects /></MemberGuard></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><MemberGuard><ProjectDetails /></MemberGuard></PrivateRoute>} />
            <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
