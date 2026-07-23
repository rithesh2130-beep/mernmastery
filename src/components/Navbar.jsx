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
  const { theme, toggleTheme, streak, getTotalCompletedLevels, logout } = useProgress();
  const completedCount = getTotalCompletedLevels();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={15} /> },
    { id: 'quiz', label: '100 MCQs Quiz', icon: <BookOpen size={15} /> },
    { id: 'interview', label: 'Interview Q&A', icon: <HelpCircle size={15} /> },
    { id: 'architecture', label: 'MERN Flow', icon: <Cpu size={15} /> },
    { id: 'sandbox', label: 'Code Sandbox', icon: <Code2 size={15} /> },
    { id: 'profile', label: 'Profile', icon: <User size={15} /> }
  ];

  return (
    <nav className="navbar">
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

      {/* View Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.3rem',
        background: 'var(--bg-tertiary)',
        padding: '0.25rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-color)',
        overflowX: 'auto',
        maxWidth: '100%'
      }}>
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: isActive ? 'var(--accent-terracotta)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              }}
            >
              {item.icon} {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Streak, Certificate, Theme, Logout */}
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

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          title="Log Out Scholar"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};
