import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizEngine } from './components/QuizEngine';
import { InterviewBank } from './components/InterviewBank';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { CodePlayground } from './components/CodePlayground';
import { CertificateModal } from './components/CertificateModal';
import { DOMAINS } from './data';

import { Login } from './components/Login';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'quiz' | 'interview' | 'architecture' | 'sandbox'
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const { activeDomain, setActiveDomain, user, login } = useProgress();

  if (!user) {
    return <Login onLogin={login} />;
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
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            <Sidebar />
            <QuizEngine />
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {currentView === 'home' && (
              <HomeDashboard 
                onSelectDomain={(domKey) => setActiveDomain(domKey)} 
                onNavigateView={(view) => setCurrentView(view)} 
              />
            )}
            {currentView === 'interview' && <InterviewBank />}
            {currentView === 'architecture' && <ArchitectureVisualizer />}
            {currentView === 'sandbox' && <CodePlayground />}
          </div>
        )}
      </main>

      {/* Certificate Modal */}
      {isCertificateOpen && (
        <CertificateModal onClose={() => setIsCertificateOpen(false)} />
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
