import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { BookOpen, Award, Flame, CheckCircle, ArrowRight, HelpCircle, GraduationCap } from 'lucide-react';

export const HomeDashboard = ({ onSelectDomain, onNavigateView }) => {
  const { progress, getTotalCompletedLevels, streak } = useProgress();
  const completedLevels = getTotalCompletedLevels();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%' }}>
      {/* Welcome Hero Banner */}
      <div className="glass-card" style={{
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, #FFF6F0 0%, #FFFFFF 50%, #FFFDF5 100%)',
        border: '1.5px solid #FDBA74',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px -15px rgba(217, 107, 67, 0.12)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'var(--accent-terracotta-bg)',
            color: 'var(--accent-terracotta)',
            fontSize: '0.82rem',
            fontWeight: 800,
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem',
            border: '1px solid rgba(217, 107, 67, 0.2)'
          }}>
            <GraduationCap size={18} /> 100-Year Master Educator & MERN Architect
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, marginBottom: '1rem' }}>
            Master HTML, CSS, JS & MERN Stack with Progressive 100-MCQ Level Tiers
          </h1>

          <p style={{ fontSize: '1.08rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.8rem' }}>
            Welcome! Learn through <strong>700 carefully crafted MCQs across 10 progressive difficulty levels</strong>, deep architectural explanations, and senior interview Q&A solutions designed to turn you into a Staff Engineer.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              onClick={() => onNavigateView('quiz')}
              style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
            >
              Start 100 MCQs Quiz <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigateView('interview')}
              style={{ fontSize: '0.95rem', padding: '0.9rem 1.6rem', background: '#FFFFFF' }}
            >
              <HelpCircle size={18} /> Top Interview Q&A
            </button>
          </div>
        </div>
      </div>

      {/* Quick Learning Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#FFF4EE', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-terracotta)', flexShrink: 0 }}>
            <BookOpen size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>700 MCQs</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>7 Subjects • 10 Tiers Each</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-emerald)', flexShrink: 0 }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>{completedLevels} / 70</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Levels Mastered</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-amber)', flexShrink: 0 }}>
            <Flame size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>{streak} Day</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Study Streak</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-indigo)', flexShrink: 0 }}>
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>Master Seal</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Printable Certificate</div>
          </div>
        </div>
      </div>

      {/* 7 Technology Learning Modules Grid */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
            Explore Learning Modules
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Click any domain to start practicing MCQs from Level 1 Fundamentals to Level 10 Master Architect.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Object.keys(DOMAINS).map(key => {
            const dom = DOMAINS[key];
            const domainProgress = progress[key] || {};
            let domCompletedCount = 0;
            Object.keys(domainProgress).forEach(lvl => {
              if (domainProgress[lvl]?.completed) domCompletedCount++;
            });

            return (
              <div 
                key={key} 
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)'
                }}
                onClick={() => {
                  onSelectDomain(key);
                  onNavigateView('quiz');
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: dom.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.7rem'
                    }}>
                      {dom.icon}
                    </div>

                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {domCompletedCount} / 10 Tiers
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {dom.name}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    100 progressive MCQs from core syntax up to senior architecture edge cases.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-terracotta)' }}>
                    Practice 100 MCQs
                  </span>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-terracotta-bg)',
                    color: 'var(--accent-terracotta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
