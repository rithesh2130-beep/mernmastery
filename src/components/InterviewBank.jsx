import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { ChevronDown, ChevronUp, Code, Lightbulb, AlertTriangle, Search } from 'lucide-react';

export const InterviewBank = () => {
  const { activeDomain, setActiveDomain } = useProgress();
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentDomainData = DOMAINS[activeDomain] || DOMAINS.js;

  // Fetch interviews from MongoDB API with static fallback
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/interviews?domain=${activeDomain}`)
      .then(res => {
        if (!res.ok) throw new Error('Backend server is offline');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setInterviews(data);
        } else {
          setInterviews(currentDomainData.interviews || []);
        }
      })
      .catch(err => {
        console.warn("Express MongoDB backend offline, utilizing local static files:", err);
        setInterviews(currentDomainData.interviews || []);
      })
      .finally(() => setLoading(false));
  }, [activeDomain, currentDomainData]);

  const filteredItems = interviews.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Filter Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Top Interview Questions & Architectural Answers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Curated by 100-Year Experienced Master Teacher & Staff MERN Architect
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search interview concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.55rem 1rem 0.55rem 2.5rem',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Single Clean Subject Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
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
                <span>{dom.icon}</span> <span>{dom.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            ⏳ Loading Senior Interview Q&As...
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="interview-card">
                <div 
                  className="interview-title"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span className={item.difficulty === 'Staff' ? 'badge-staff' : 'badge-senior'}>
                      {item.difficulty}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="var(--accent-terracotta)" /> : <ChevronDown size={20} color="var(--text-subtle)" />}
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    {/* Question Statement */}
                    <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--accent-terracotta)', marginBottom: '0.75rem' }}>
                      Q: {item.question}
                    </div>

                    {/* Detailed Answer */}
                    <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: 'var(--text-main)', marginBottom: '1rem' }}>
                      {item.answer}
                    </p>

                    {/* Code Solution */}
                    {item.code && (
                      <div style={{ margin: '1.2rem 0' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                          <Code size={15} /> Production Code Solution:
                        </div>
                        <pre className="code-block" style={{ marginTop: 0 }}>
                          <code>{item.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* 100-Year Teacher Tip */}
                    <div className="teacher-insight-box">
                      <div className="teacher-header" style={{ color: '#B45309', fontWeight: 800 }}>
                        <Lightbulb size={18} />
                        <span>Master Educator Tip: How to answer this in an interview</span>
                      </div>
                      <p style={{ fontSize: '0.94rem', color: '#1E293B', lineHeight: 1.6, marginTop: '0.35rem', fontWeight: 500 }}>
                        {item.teacherTip}
                      </p>
                    </div>

                    {/* Trap */}
                    {item.trap && (
                      <div style={{
                        background: '#FEF2F2',
                        border: '1.5px solid #FCA5A5',
                        borderLeft: '5px solid var(--accent-rose)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.1rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{ color: '#B91C1C', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                          <AlertTriangle size={17} /> Candidate Trap to Avoid:
                        </div>
                        <p style={{ fontSize: '0.92rem', color: '#7F1D1D', lineHeight: 1.55, fontWeight: 500 }}>
                          {item.trap}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No interview questions found matching your search term. Try adjusting your query or selecting another domain tab above.
          </div>
        )}
      </div>
    </div>
  );
};
