import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { 
  Flame, 
  Trash2, 
  Bookmark, 
  LogOut, 
  ChevronRight, 
  X 
} from 'lucide-react';

export const UserProfile = ({ onNavigateView }) => {
  const { user, progress, bookmarks, toggleBookmark, streak, logout, getTotalCompletedLevels } = useProgress();
  const [activeBookmarkQ, setActiveBookmarkQ] = useState(null);

  const completedLevelsCount = getTotalCompletedLevels();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'S';

  // Calculate stats per domain
  const domainStats = Object.keys(DOMAINS).map(key => {
    const dom = DOMAINS[key];
    const domainProgress = progress[key] || {};
    let completed = 0;
    Object.keys(domainProgress).forEach(lvl => {
      if (domainProgress[lvl]?.completed) completed++;
    });
    return {
      id: key,
      name: dom.name,
      icon: dom.icon,
      completed,
      pct: (completed / 10) * 100
    };
  });

  // Calculate badges
  const achievements = [
    { id: 'start', name: 'First Steps', desc: 'Complete Level 1 in any subject', unlocked: completedLevelsCount >= 1, icon: '🌱' },
    { id: 'frontend', name: 'UI Aspirant', desc: 'Complete 5 levels in HTML or CSS', unlocked: (domainStats[0].completed >= 5 || domainStats[1].completed >= 5), icon: '🎨' },
    { id: 'js_oracle', name: 'JS Oracle', desc: 'Complete Level 5 in JavaScript', unlocked: domainStats[2].completed >= 5, icon: '⚡' },
    { id: 'mern_apprentice', name: 'MERN Apprentice', desc: 'Master 10 total levels', unlocked: completedLevelsCount >= 10, icon: '🧱' },
    { id: 'fullstack_sage', name: 'Full-Stack Sage', desc: 'Master 35 total levels', unlocked: completedLevelsCount >= 35, icon: '🔮' },
    { id: 'mern_architect', name: '100-Year Architect', desc: 'Master all 70 levels', unlocked: completedLevelsCount === 70, icon: '🏛️' }
  ];

  // Retrieve all bookmarked question data
  const bookmarkedQuestionsList = [];
  Object.keys(DOMAINS).forEach(domKey => {
    DOMAINS[domKey].questions.forEach(q => {
      if (bookmarks.includes(q.id)) {
        bookmarkedQuestionsList.push({
          ...q,
          domainName: DOMAINS[domKey].short,
          domainIcon: DOMAINS[domKey].icon
        });
      }
    });
  });

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your learning progress? This action is permanent!")) {
      localStorage.removeItem('mern_progress');
      localStorage.removeItem('mern_bookmarks');
      localStorage.removeItem('mern_last_daily');
      localStorage.removeItem('mern_streak');
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Profile Overview Card */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #FFF4EE, #FFFFFF 60%, #EEF2FF)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Avatar and Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--accent-terracotta)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(217, 107, 67, 0.25)'
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {user?.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {user?.email} • <span style={{ color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                  {completedLevelsCount >= 35 ? 'Fullstack Architect Sage' : completedLevelsCount >= 10 ? 'Senior MERN Scholar' : 'Web Dev Apprentice'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1fr solid var(--border-color)', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Streak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <Flame size={20} fill="var(--accent-amber)" /> {streak} Days
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => onNavigateView('quiz')}
              style={{ padding: '0.75rem 1.5rem', alignSelf: 'center' }}
            >
              Resume Learning <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Achievements & Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Domain Progression Bars */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Domain Mastery Metrics
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {domainStats.map(stat => (
              <div key={stat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{stat.icon}</span>
                    <span>{stat.name}</span>
                  </div>
                  <span style={{ color: 'var(--accent-terracotta)' }}>{stat.completed} / 10 Levels Complete</span>
                </div>
                {/* Progress bar container */}
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${stat.pct}%`,
                    height: '100%',
                    background: 'var(--accent-terracotta)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Cabinet */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Achievements Cabinet
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {achievements.map(ach => (
              <div 
                key={ach.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  opacity: ach.unlocked ? 1 : 0.45,
                  background: ach.unlocked ? 'var(--bg-tertiary)' : 'transparent',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{ach.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: ach.unlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {ach.name} {ach.unlocked && '✓'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {ach.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmarked Questions Revision Chest */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={22} color="var(--accent-terracotta)" /> 
          <span>Revision Chest: Bookmarked Questions ({bookmarkedQuestionsList.length})</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Review explanations for complex questions you bookmarked during practice sessions.
        </p>

        {bookmarkedQuestionsList.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {bookmarkedQuestionsList.map(q => (
              <div 
                key={q.id}
                className="glass-card"
                onClick={() => setActiveBookmarkQ(q)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-tertiary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
                    {q.domainIcon} {q.domainName}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Level {q.level}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {q.question}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
            Your revision chest is empty. Bookmark questions during quizzes to review them here.
          </div>
        )}
      </div>

      {/* Account Settings / Actions */}
      <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Reset Learning Data
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Permanently clear all scores, levels unlocked, bookmarks, and streaks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={logout} style={{ color: 'var(--text-muted)' }}>
            <LogOut size={16} /> Log Out
          </button>
          
          <button className="btn-primary" onClick={handleResetProgress} style={{ background: 'var(--accent-rose)', boxShadow: 'none' }}>
            <Trash2 size={16} /> Reset All Progress
          </button>
        </div>
      </div>

      {/* Bookmark Detail Explainer Modal */}
      {activeBookmarkQ && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2.2rem',
            border: '1.5px solid var(--accent-terracotta)',
            position: 'relative',
            background: 'var(--bg-card)'
          }}>
            <button
              onClick={() => setActiveBookmarkQ(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--bg-tertiary)',
                border: 'none',
                color: 'var(--text-main)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span>{activeBookmarkQ.domainIcon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
                {activeBookmarkQ.domainName} — Level {activeBookmarkQ.level}
              </span>
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.2rem', lineHeight: 1.4 }}>
              {activeBookmarkQ.question}
            </h4>

            {activeBookmarkQ.codeSnippet && (
              <pre className="code-block" style={{ margin: '1rem 0' }}>
                <code>{activeBookmarkQ.codeSnippet}</code>
              </pre>
            )}

            <div className="teacher-insight-box">
              <div className="teacher-header" style={{ color: '#B45309', fontWeight: 800 }}>
                💡 Master's Rationale & Explanation
              </div>
              <p style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: 1.6, fontWeight: 500 }}>
                {activeBookmarkQ.masterInsight}
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  toggleBookmark(activeBookmarkQ.id);
                  setActiveBookmarkQ(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-rose)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Trash2 size={16} /> Remove Bookmark
              </button>
              
              <button className="btn-primary" onClick={() => setActiveBookmarkQ(null)}>
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
