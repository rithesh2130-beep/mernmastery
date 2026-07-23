import React, { useState, useEffect } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizEngine } from './components/QuizEngine';
import { InterviewBank } from './components/InterviewBank';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { CodePlayground } from './components/CodePlayground';
import { CertificateModal } from './components/CertificateModal';
import { Login } from './components/Login';
import { DailyChallenge } from './components/DailyChallenge';
import { UserProfile } from './components/UserProfile';
import { EmailVerificationGate } from './components/EmailVerificationGate';
import { DOMAINS } from './data';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [verifiedBanner, setVerifiedBanner] = useState(false);
  const { activeDomain, setActiveDomain, user, login, logout, token, setUser } = useProgress();

  // Handle ?verified=true redirect from email verification link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      // Clear the query param from the URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      // If user is still logged in and unverified, update their status
      if (user && !user.isVerified) {
        setUser(prev => ({ ...prev, isVerified: true }));
      }
      // Always show the verified banner on login/gate screen
      setVerifiedBanner(true);
    }
  }, []);

  if (!user) {
    return (
      <Login 
        onLogin={login} 
        verifiedBanner={verifiedBanner} 
        onClearBanner={() => setVerifiedBanner(false)} 
      />
    );
  }

  // Gate content display if email address remains unverified
  if (user.isVerified === false && !user.isGuest) {
    return (
      <EmailVerificationGate 
        user={user} 
        token={token} 
        onLogout={logout}
        verifiedBanner={verifiedBanner}
        onClearBanner={() => setVerifiedBanner(false)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Secondary Technology Selector Bar (ONLY in Quiz View) */}
      {currentView === 'quiz' && (
        <div style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.65rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {Object.keys(DOMAINS).map(key => {
            const dom = DOMAINS[key];
            const isActive = activeDomain === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDomain(key)}
                className="domain-chip"
                style={{
                  background: isActive ? 'var(--accent-terracotta)' : 'var(--bg-tertiary)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  borderColor: isActive ? 'transparent' : 'var(--border-color)',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <span>{dom.icon}</span>
                <span>{dom.short}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Workspace */}
      <main className="main-workspace">
        {currentView === 'quiz' ? (
          <div className="quiz-layout">
            <Sidebar />
            <QuizEngine />
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {currentView === 'home' && (
              <HomeDashboard 
                onSelectDomain={(domKey) => setActiveDomain(domKey)} 
                onNavigateView={(view) => setCurrentView(view)} 
                onOpenDailyChallenge={() => setIsDailyOpen(true)}
              />
            )}
            {currentView === 'interview' && <InterviewBank />}
            {currentView === 'architecture' && <ArchitectureVisualizer />}
            {currentView === 'sandbox' && <CodePlayground />}
            {currentView === 'profile' && <UserProfile onNavigateView={(view) => setCurrentView(view)} />}
          </div>
        )}
      </main>

      {/* Certificate Modal */}
      {isCertificateOpen && (
        <CertificateModal onClose={() => setIsCertificateOpen(false)} />
      )}

      {/* Daily Challenge Modal */}
      {isDailyOpen && (
        <DailyChallenge onClose={() => setIsDailyOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
