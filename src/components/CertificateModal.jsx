import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { X, Printer } from 'lucide-react';

export const CertificateModal = ({ onClose }) => {
  const { getTotalCompletedLevels, user } = useProgress();
  const completedLevels = getTotalCompletedLevels();
  const [studentName, setStudentName] = useState(user?.name || 'Senior MERN Engineer');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '95vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-tertiary)',
            border: 'none',
            color: 'var(--text-main)',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Student Name Input */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Student Certificate Name:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Printable Certificate Frame */}
        <div className="certificate-frame">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <div className="certificate-title">Certificate of Master Achievement</div>
          <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            This official certificate is proudly awarded to
          </p>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#C5A059', borderBottom: '2px solid #C5A059', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            {studentName}
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#333', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            For successfully completing <strong>{completedLevels} out of 70 Levels</strong> in HTML5, CSS3, JavaScript ES6+, React.js, MongoDB, Node.js, and Express.js under the guidance of the 100-Year Master Educator.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #CCC' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2C3E50' }}>100-Year Master Teacher</div>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>Chief MERN Architect & Educator</div>
            </div>

            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              border: '3px double #C5A059',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C5A059',
              fontWeight: 800,
              fontSize: '0.7rem',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              Official Seal
            </div>

            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2C3E50' }}>{new Date().toLocaleDateString()}</div>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>Date of Issuance</div>
            </div>
          </div>
        </div>

        {/* Print Action Controls */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
