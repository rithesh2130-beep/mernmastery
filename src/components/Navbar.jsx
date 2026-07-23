import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { 
  Home,
  BookOpen, 
  HelpCircle, 
  Cpu, 
  Code2, 
  Flame, 
  Award, 
  Moon, 
  Sun,
  LogOut,
  User
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onOpenCertificate }) => {
  const { theme, toggleTheme, streak, getTotalCompletedLevels, logout, user } = useProgress();
  const completedCount = getTotalCompletedLevels();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={15} /> },
    { id: 'quiz', label: '100 MCQs Quiz', icon: <BookOpen size={15} /> },
    { id: 'interview', label: 'Interview Q&A', icon: <HelpCircle size={15} /> },
    { id: 'architecture', label: 'MERN Flow', icon: <Cpu size={15} /> },
    { id: 'sandbox', label: 'Code Sandbox', icon: <Code2 size={15} /> }
  ];

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'S';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Top Navbar Row */}
      <nav className="navbar" style={{ padding: '0.75rem 2rem' }}>
        {/* Brand Logo & Persona */}
        <a href="#home" className="brand-title" onClick={() => setCurrentView('home')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            🎓
          </div>
          <div>
            <span>MERN Academy</span>
            <span className="brand-badge" style={{ marginLeft: '0.5rem' }}>100-Yr Master</span>
          </div>
        </a>

        {/* Right Controls: Streak, Certificate, Theme, Profile Avatar */}
        <div className="navbar-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Streak Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--accent-amber-bg)',
            color: 'var(--accent-amber)',
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: '1px solid rgba(217, 119, 6, 0.2)'
          }}>
            <Flame size={15} fill="var(--accent-amber)" />
            <span>{streak} Day Streak</span>
          </div>

          {/* Certificate Trigger */}
          <button 
            className="btn-secondary"
            onClick={onOpenCertificate}
            style={{
              borderColor: 'var(--accent-amber)',
              color: 'var(--accent-amber)',
              fontSize: '0.82rem',
              padding: '0.4rem 0.8rem'
            }}
          >
            <Award size={15} /> Certificate ({completedCount}/70)
          </button>

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Profile Quick Trigger (Avatar) */}
          <button 
            onClick={() => setCurrentView('profile')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: currentView === 'profile' ? 'var(--accent-terracotta)' : 'var(--accent-terracotta-bg)',
              color: currentView === 'profile' ? '#FFFFFF' : 'var(--accent-terracotta)',
              border: '1.5px solid var(--accent-terracotta)',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: currentView === 'profile' ? '0 4px 12px rgba(217, 107, 67, 0.25)' : 'none',
              transition: 'var(--transition)',
              overflow: 'hidden'
            }}
            title="Open Student Profile"
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </button>
        </div>
      </nav>

      {/* Sub-Navbar View Switcher Row */}
      <div className="sub-navbar" style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.6rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: '0.75rem',
        boxShadow: 'inset 0 -1px 0 var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          background: 'var(--bg-tertiary)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1.1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isActive ? 'var(--accent-terracotta)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
