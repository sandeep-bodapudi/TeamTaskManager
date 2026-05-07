import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import {
  Sun, Moon, Monitor, Download, Smartphone, Share2,
  CheckCircle2, Settings as SettingsIcon, Palette, Info
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the browser's install prompt (Chrome/Edge/Android)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '1.5rem',
    marginBottom: '1.25rem',
    boxShadow: 'var(--shadow-sm)'
  };

  const sectionTitle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '1rem'
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 0',
    borderBottom: '1px solid var(--border)'
  };

  const rowStyleLast = {
    ...rowStyle,
    borderBottom: 'none',
    paddingBottom: 0
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <SettingsIcon size={22} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 style={{ marginBottom: 0 }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Customize your workspace experience
          </p>
        </div>
      </div>

      {/* ── APPEARANCE ─────────────────────────────── */}
      <div style={cardStyle}>
        <p style={sectionTitle}><Palette size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />Appearance</p>

        <div style={rowStyle}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
              Theme
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Switch between light and dark mode
            </p>
          </div>

          {/* Theme Toggle Pill */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            border: '1.5px solid var(--border)',
            borderRadius: '10px',
            padding: '4px',
            gap: '2px'
          }}>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              title="Light Mode"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.75rem', borderRadius: '7px', border: 'none',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                transition: 'all 0.2s',
                background: theme === 'light' ? 'var(--bg-card)' : 'transparent',
                color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Sun size={15} /> Light
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              title="Dark Mode"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.75rem', borderRadius: '7px', border: 'none',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                transition: 'all 0.2s',
                background: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
                color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Moon size={15} /> Dark
            </button>
          </div>
        </div>

        <div style={rowStyleLast}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
              Current Theme
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Your active display preference
            </p>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--accent-light)', color: 'var(--accent-text)',
            border: '1px solid var(--progress-border)',
            borderRadius: '999px', padding: '0.25rem 0.875rem',
            fontSize: '0.8rem', fontWeight: 700
          }}>
            {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>

      {/* ── INSTALL APP ─────────────────────────────── */}
      <div style={cardStyle}>
        <p style={sectionTitle}><Download size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />Install App</p>

        {isInstalled ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem', background: 'var(--done-bg)',
            border: '1px solid var(--done-border)', borderRadius: '10px'
          }}>
            <CheckCircle2 size={28} style={{ color: 'var(--done-text)', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, color: 'var(--done-text)', marginBottom: '0.125rem' }}>
                App is installed! ✅
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--done-text)', opacity: 0.8 }}>
                Team Task Manager is running as a standalone app on your device.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Android / Desktop */}
            {!isIOS && (
              <div style={rowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'var(--progress-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Smartphone size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                      Install on Android / Desktop
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {installPrompt
                        ? 'Click to add this app to your home screen or taskbar.'
                        : 'Use your browser\'s "Install App" or "Add to Home Screen" option.'}
                    </p>
                  </div>
                </div>
                {installPrompt ? (
                  <button className="btn btn-primary" onClick={handleInstall} style={{ flexShrink: 0 }}>
                    <Download size={16} /> Install
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0, fontStyle: 'italic' }}>
                    See browser menu
                  </span>
                )}
              </div>
            )}

            {/* iOS Instructions */}
            {isIOS && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'var(--pending-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Share2 size={20} style={{ color: 'var(--pending-text)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                        Install on iPhone / iPad
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Follow the steps below to install on iOS.
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowIOSInstructions(v => !v)}
                    style={{ flexShrink: 0 }}
                  >
                    {showIOSInstructions ? 'Hide' : 'Show steps'}
                  </button>
                </div>

                {showIOSInstructions && (
                  <div style={{
                    background: 'var(--bg-subtle)', borderRadius: '10px',
                    border: '1px solid var(--border)', padding: '1rem'
                  }}>
                    {[
                      { step: '1', text: 'Tap the Share button (⬆) at the bottom of Safari.' },
                      { step: '2', text: 'Scroll down and tap "Add to Home Screen".' },
                      { step: '3', text: 'Tap "Add" in the top-right corner.' },
                      { step: '4', text: 'The app will appear on your home screen!' }
                    ].map(item => (
                      <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: 'var(--accent)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                        }}>
                          {item.step}
                        </span>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingTop: '0.125rem' }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* General info banner */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              background: 'var(--bg-subtle)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.875rem'
            }}>
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.125rem' }} />
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Installing the app gives you a native-like experience — full screen, fast load, and it works like a real mobile/desktop app without needing an app store.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── ACCOUNT INFO ─────────────────────────────── */}
      <div style={cardStyle}>
        <p style={sectionTitle}><Info size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />Account</p>

        <div style={rowStyle}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Name</p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name}</p>
        </div>
        <div style={rowStyle}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Email</p>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{user?.email}</p>
        </div>
        <div style={rowStyleLast}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Role</p>
          <span className={`status-badge ${user?.role === 'Admin' ? 'status-progress' : 'status-pending'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* ── APP INFO ─────────────────────────────── */}
      <div style={{ ...cardStyle, marginBottom: 0, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Team Task Manager · v1.0.0</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Built as a Progressive Web App (PWA) · IST timezone
        </p>
      </div>

    </div>
  );
}
