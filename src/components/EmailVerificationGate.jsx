import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, ShieldAlert, LogOut, RotateCw } from 'lucide-react';

export const EmailVerificationGate = ({ user, token, onLogout }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check query string parameters for immediate verification indicator (?verified=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      // Force checking status
      handleCheckStatus();
      // Remove parameter from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.isVerified) {
          // Success: Refresh the local storage user and reload context state
          const savedUser = JSON.parse(localStorage.getItem('mern_user') || '{}');
          savedUser.isVerified = true;
          localStorage.setItem('mern_user', JSON.stringify(savedUser));
          window.location.reload();
        } else {
          setErrorMsg('We checked, but your email is still unverified. Please check your inbox and click the link.');
        }
      } else {
        setErrorMsg('Error checking status. Make sure the server is online.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error checking verification status.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendLink = async () => {
    setResendStatus('sending');
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setResendStatus('sent');
        setTimeout(() => setResendStatus(''), 4000);
      } else {
        setErrorMsg(data.message || 'Error resending verification email.');
        setResendStatus('');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to dispatch verification request.');
      setResendStatus('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '3rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FFF8F6, #FFFFFF 70%)',
        boxShadow: '0 20px 40px rgba(217, 107, 67, 0.08)',
        border: '1.5px solid var(--border-color)'
      }}>
        
        {/* Email Icon Envelope */}
        <div style={{
          width: '78px',
          height: '78px',
          borderRadius: '50%',
          background: 'var(--accent-terracotta-bg)',
          color: 'var(--accent-terracotta)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 20px rgba(217, 107, 67, 0.1)'
        }}>
          <Mail size={36} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Verify Your Email Address
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', margin: '1rem 0 1.5rem', lineHeight: 1.55 }}>
          A secure verification link has been sent to:<br />
          <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>{user.email}</strong>
        </p>

        <div className="teacher-insight-box" style={{ background: '#FFFDF9', borderColor: '#F59E0B', textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontWeight: 800, fontSize: '0.85rem' }}>
            <ShieldAlert size={16} /> 🎓 Scholar Notice
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5, marginTop: '0.25rem' }}>
            To protect your certifications and coursework data, access to the 100-Year Academy is gated until your email signature is validated.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            fontSize: '0.85rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <button 
            className="btn-primary"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {isChecking ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <RotateCw className="spin" size={16} /> Verifying Status...
              </span>
            ) : (
              'I Have Verified My Email'
            )}
          </button>

          <button 
            className="btn-secondary"
            onClick={handleResendLink}
            disabled={resendStatus === 'sending'}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {resendStatus === 'sending' ? 'Sending Link...' : 
             resendStatus === 'sent' ? '✓ New Link Sent to Inbox!' : 
             'Resend Verification Email'}
          </button>
        </div>

        {/* Footer Logout Switch Account Option */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)'
            }}
            title="Log Out Scholar"
          >
            <LogOut size={15} /> Switch Scholar Account
          </button>
        </div>

      </div>
    </div>
  );
};
