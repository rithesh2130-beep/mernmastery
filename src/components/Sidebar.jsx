import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { Lock, CheckCircle2, ChevronRight, Star } from 'lucide-react';

export const Sidebar = () => {
  const { activeDomain, activeLevels, setActiveLevels, isLevelUnlocked, progress } = useProgress();
  const domainData = DOMAINS[activeDomain];

  if (!domainData) return null;

  const currentActiveLevel = activeLevels[activeDomain] || 1;

  return (
    <aside className="sidebar-panel">
      {/* Subject Header */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>{domainData.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700 }}>
              {domainData.name}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              100 MCQs • 10 Progressive Difficulty Tiers
            </p>
          </div>
        </div>
      </div>

      {/* Levels 1 to 10 Navigation List */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', fontWeight: 700 }}>
          Select Level Tier
        </h4>

        <div className="level-list">
          {domainData.levels.map((lvl) => {
            const unlocked = isLevelUnlocked(activeDomain, lvl.level);
            const isActive = currentActiveLevel === lvl.level;
            const levelProgress = progress[activeDomain]?.[lvl.level];
            const isCompleted = levelProgress?.completed;
            const bestScore = levelProgress?.score;

            return (
              <div
                key={lvl.level}
                className={`level-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (unlocked) {
                    setActiveLevels(prev => ({ ...prev, [activeDomain]: lvl.level }));
                  }
                }}
                style={{
                  opacity: unlocked ? 1 : 0.55,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {unlocked ? (
                    isCompleted ? (
                      <CheckCircle2 size={18} color="var(--accent-emerald)" />
                    ) : (
                      <span className="level-number">L{lvl.level}</span>
                    )
                  ) : (
                    <Lock size={16} color="var(--text-subtle)" />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isActive ? 'var(--accent-amber)' : 'var(--text-main)' }}>
                      Level {lvl.level}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lvl.title.split(': ')[1] || lvl.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {bestScore !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                      <Star size={12} fill="var(--accent-amber)" />
                      {bestScore}/10
                    </div>
                  )}
                  {unlocked && <ChevronRight size={14} color="var(--text-subtle)" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
