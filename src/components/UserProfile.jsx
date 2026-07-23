import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { 
  Flame, 
  Trash2, 
  Bookmark, 
  LogOut, 
  ChevronRight, 
  X,
  Edit3,
  Check,
  User,
  Mail,
  Building,
  Target
} from 'lucide-react';

export const UserProfile = ({ onNavigateView }) => {
  const { user, progress, bookmarks, toggleBookmark, streak, logout, getTotalCompletedLevels, updateUserProfile } = useProgress();
  const [activeBookmarkQ, setActiveBookmarkQ] = useState(null);
  
  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editGoal, setEditGoal] = useState(user?.targetGoal || 'Senior MERN Developer');
  const [editAffiliation, setEditAffiliation] = useState(user?.affiliation || 'Independent Academy');
  const [editColor, setEditColor] = useState(user?.avatarColor || '#D96B43'); // Default Terracotta
  const [successMsg, setSuccessMsg] = useState('');

  const completedLevelsCount = getTotalCompletedLevels();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'S';

  const avatarColorThemes = [
    { name: 'Terracotta', color: '#D96B43' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Indigo', color: '#4F46E5' },
    { name: 'Amber', color: '#D97706' },
    { name: 'Teal', color: '#0D9488' }
  ];

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!editName || !editEmail) {
      alert("Name and Email are required fields.");
      return;
    }

    updateUserProfile({
      name: editName,
      email: editEmail,
      targetGoal: editGoal,
      affiliation: editAffiliation,
      avatarColor: editColor
    });

    setSuccessMsg('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

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
      
      {/* Toast Notification Banner */}
      {successMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--accent-emerald)',
          color: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.25)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          <Check size={18} /> {successMsg}
        </div>
      )}

      {/* Profile Overview / Card Header */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #FFF4EE, #FFFFFF 60%, #EEF2FF)' }}>
        {!isEditing ? (
          /* Profile Summary Mode */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '82px',
                height: '82px',
                borderRadius: '24px',
                background: editColor,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                boxShadow: `0 8px 24px ${editColor}33`,
                border: '2.5px solid #FFFFFF'
              }}>
                {initials}
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {user?.name}
                  <button 
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Edit Profile Settings"
                  >
                    <Edit3 size={18} />
                  </button>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  <strong>Goal:</strong> {editGoal} • <strong>Org:</strong> {editAffiliation}
                </p>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', marginTop: '0.1rem' }}>
                  {user?.email} • MERN Rank: <span style={{ color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                    {completedLevelsCount >= 35 ? 'Fullstack Architect Sage' : completedLevelsCount >= 10 ? 'Senior MERN Scholar' : 'Web Dev Apprentice'}
                  </span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1fr solid var(--border-color)', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Streak</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <Flame size={20} fill="var(--accent-amber)" /> {streak} Days
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={() => onNavigateView('quiz')}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Resume Learning <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* Profile Edit Settings Form */
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800 }}>
                ⚙️ Professional Profile Settings
              </h3>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {/* Left Column Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    Full Name (printed on certificate)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.7rem 1rem 0.7rem 2.5rem',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.7rem 1rem 0.7rem 2.5rem',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    Target Career Goal
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Target size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input 
                      type="text" 
                      value={editGoal}
                      onChange={(e) => setEditGoal(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.7rem 1rem 0.7rem 2.5rem',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    Company / School Affiliation
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input 
                      type="text" 
                      value={editAffiliation}
                      onChange={(e) => setEditAffiliation(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.7rem 1rem 0.7rem 2.5rem',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Color Accents Selection */}
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Profile Avatar Accent Color
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {avatarColorThemes.map(theme => (
                  <button
                    key={theme.color}
                    type="button"
                    onClick={() => setEditColor(theme.color)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: theme.color,
                      border: editColor === theme.color ? '3px solid var(--text-main)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Profile Changes <Check size={16} />
              </button>
            </div>
          </form>
        )}
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
