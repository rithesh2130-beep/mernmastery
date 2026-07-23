import React from 'react';
import { X, AlertTriangle, BookOpenCheck } from 'lucide-react';

export const ExplanationModal = ({ questionData, onClose }) => {
  if (!questionData) return null;

  return (
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
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        border: '1.5px solid var(--accent-terracotta)',
        position: 'relative',
        background: 'var(--bg-card)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-tertiary)',
            border: 'none',
            color: 'var(--text-main)',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <X size={18} />
        </button>

        {/* Master Educator Persona Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--accent-terracotta-bg)',
            color: 'var(--accent-terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            border: '1px solid rgba(217, 107, 67, 0.25)',
            flexShrink: 0
          }}>
            👨‍🏫
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              100-Year Master Educator Insight
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              Senior MERN Stack Architect Explanation
            </p>
          </div>
        </div>

        {/* Core Question Statement */}
        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          borderLeft: '4px solid var(--accent-terracotta)'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
            Target Concept:
          </span>
          <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.35rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            {questionData.question}
          </p>
        </div>

        {/* Deep Explanation Box */}
        <div className="teacher-insight-box" style={{ marginTop: 0 }}>
          <div className="teacher-header" style={{ color: '#B45309', fontWeight: 800 }}>
            <BookOpenCheck size={20} />
            <span>Master's Technical Analysis & Correct Choice Rationale</span>
          </div>
          <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: '#1E293B', marginTop: '0.5rem', fontWeight: 500 }}>
            {questionData.masterInsight}
          </p>
        </div>

        {/* Pitfalls & Common Senior Traps */}
        {questionData.pitfall && (
          <div style={{
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderLeft: '5px solid var(--accent-rose)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
              <AlertTriangle size={20} />
              <span>Common Senior Trap & Production Pitfall</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#7F1D1D', lineHeight: 1.6, fontWeight: 500 }}>
              {questionData.pitfall}
            </p>
          </div>
        )}

        {/* Close CTA */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose} style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}>
            Got It, Master Teacher
          </button>
        </div>
      </div>
    </div>
  );
};
