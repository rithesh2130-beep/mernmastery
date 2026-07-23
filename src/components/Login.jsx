import React, { useState } from 'react';
import { LogIn, UserPlus, ArrowRight, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Required fields are missing. Please enter email and password.');
      return;
    }

    if (isRegister && !fullName) {
      setError('Please provide your full name for the certification.');
      return;
    }

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const body = isRegister 
        ? { name: fullName, email, password } 
        : { email, password };

      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed. Please verify credentials.');
        return;
      }

      // Call context login with token and user profile
      onLogin(data.token, data.user);

    } catch (err) {
      console.error(err);
      setError('Cannot connect to authorization server. Make sure the backend is active.');
    }
  };

  const handleGuestMode = () => {
    onLogin('', {
      email: 'guest@example.com',
      name: 'Guest Scholar',
      isGuest: true
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #FFFFFF 100%)'
    }}>
      
      {/* Visual / Motto Sidebar Panel (Hidden on small mobile) */}
      <div style={{
        background: 'linear-gradient(135deg, #D96B43 0%, #B45309 100%)',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.08)'
      }} className="login-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🎓
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            MERN Academy
          </span>
        </div>

        <div style={{ maxWidth: '480px' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            100-Year Wisdom
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginTop: '1.25rem', color: '#FFFFFF' }}>
            "Knowledge is the ultimate architect of your career."
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '1rem', lineHeight: 1.6 }}>
            Master the MERN full-stack codebase. Practice progressive level-locked tiers, analyze compiler mechanics, and secure your senior engineering certification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          <div>🔒 Secure Sessions</div>
          <div>🏆 Certificate Authority</div>
          <div>⚡ Rapid Feedback</div>
        </div>
      </div>

      {/* Forms Content Panel */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem'
      }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          
          {/* Header Greeting */}
          <div style={{ marginBottom: '2.2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {isRegister ? 'Begin Your Journey' : 'Welcome Back, Scholar!'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              {isRegister 
                ? 'Register to track domain levels and secure your master seal.' 
                : 'Sign in to access your personal study progression files.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                background: 'var(--accent-rose-bg)',
                color: 'var(--accent-rose)',
                border: '1.5px solid rgba(220, 38, 38, 0.2)',
                padding: '0.8rem 1.1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 700
              }}>
                ⚠️ {error}
              </div>
            )}

            {isRegister && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  Full Name (printed on certificate)
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input
                    type="text"
                    placeholder="Senior Developer Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-tertiary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.8rem 1rem 0.8rem 2.6rem',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'var(--transition)'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 2.8rem 0.8rem 2.6rem',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
              {isRegister ? (
                <>Register & Begin <UserPlus size={18} /></>
              ) : (
                <>Sign In Securely <LogIn size={18} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.8rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Guest Mode & Toggle Link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'center' }}>
            <button 
              className="btn-secondary" 
              onClick={handleGuestMode}
              style={{ width: '100%', justifyContent: 'center', background: '#FFFFFF', padding: '0.8rem' }}
            >
              Continue as Guest <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-terracotta)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isRegister 
                ? 'Already have an account? Sign In' 
                : "New scholar? Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
