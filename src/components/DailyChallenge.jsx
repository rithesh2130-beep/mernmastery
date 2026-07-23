import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { Timer, Award, AlertTriangle, ArrowRight, CheckCircle2, X } from 'lucide-react';

// Generates 5 deterministic daily questions based on current date hash
const getDailyQuestions = () => {
  const dateStr = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  const domainsList = Object.keys(DOMAINS);
  const selectedQuestions = [];
  
  // Select 5 questions from different domains
  for (let i = 0; i < 5; i++) {
    const domIndex = Math.abs(hash + i * 3) % domainsList.length;
    const domKey = domainsList[domIndex];
    const questions = DOMAINS[domKey].questions;
    const questionIndex = Math.abs(hash * (i + 1)) % questions.length;
    
    selectedQuestions.push({
      ...questions[questionIndex],
      domainName: DOMAINS[domKey].short,
      domainIcon: DOMAINS[domKey].icon
    });
  }
  return selectedQuestions;
};

export const DailyChallenge = ({ onClose }) => {
  const { lastDailyCompleted, completeDailyChallenge } = useProgress();
  const [questions] = useState(getDailyQuestions);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds rapid fire
  const [timerActive, setTimerActive] = useState(true);

  const todayStr = new Date().toDateString();
  const alreadyDone = lastDailyCompleted === todayStr;

  const calculateScore = useCallback(() => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  }, [questions, userAnswers]);

  const handleFinish = useCallback(() => {
    setIsCompleted(true);
    setTimerActive(false);
    const score = calculateScore();
    
    if (score >= 3) {
      completeDailyChallenge();
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [calculateScore, completeDailyChallenge]);

  useEffect(() => {
    let timer = null;
    if (timerActive && timeLeft > 0 && !isCompleted && !alreadyDone) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted && !alreadyDone) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isCompleted, alreadyDone, handleFinish]);

  const handleSelectOption = (optionIndex) => {
    if (submittedAnswers[currentIndex] !== undefined || alreadyDone) return;
    
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setSubmittedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const currentQ = questions[currentIndex];
  const score = calculateScore();
  const passed = score >= 3;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '700px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1.5px solid var(--accent-terracotta)',
        position: 'relative'
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

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
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
            border: '1px solid rgba(217, 107, 67, 0.25)'
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              Daily Quiz Challenge
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              5 Mixed Questions • Complete to increase streak!
            </p>
          </div>
        </div>

        {alreadyDone ? (
          /* Finished State */
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Daily Challenge Completed!
            </h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You have already finished today's daily challenge. Come back tomorrow for 5 new questions!
            </p>
            <button className="btn-primary" onClick={onClose}>
              Back to Dashboard
            </button>
          </div>
        ) : !isCompleted ? (
          /* Active Quiz Form */
          <div>
            {/* Timer & Progress */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-tertiary)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Question {currentIndex + 1} of 5
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: timeLeft <= 20 ? 'var(--accent-rose)' : 'var(--accent-amber)', fontWeight: 800 }}>
                <Timer size={18} />
                <span>{timeLeft}s remaining</span>
              </div>
            </div>

            {/* Question Card Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{currentQ.domainIcon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
                  {currentQ.domainName}
                </span>
              </div>
              
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {currentQ.question}
              </h4>

              {currentQ.codeSnippet && (
                <pre className="code-block">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="options-grid" style={{ marginTop: '1rem' }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      className="option-btn"
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        borderWidth: isSelected ? '2px' : '1.5px',
                        borderColor: isSelected ? 'var(--accent-terracotta)' : undefined,
                        background: isSelected ? 'var(--accent-terracotta-bg)' : undefined
                      }}
                    >
                      <span className="option-badge">{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[0, 1, 2, 3, 4].map(idx => (
                  <div
                    key={idx}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: userAnswers[idx] !== undefined ? 'var(--accent-terracotta)' : 'var(--bg-tertiary)',
                      border: currentIndex === idx ? '2px solid var(--accent-amber)' : 'none'
                    }}
                  />
                ))}
              </div>

              {currentIndex < 4 ? (
                <button
                  className="btn-primary"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  disabled={userAnswers[currentIndex] === undefined}
                  style={{ opacity: userAnswers[currentIndex] === undefined ? 0.6 : 1 }}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleFinish}
                  disabled={userAnswers[currentIndex] === undefined}
                  style={{
                    opacity: userAnswers[currentIndex] === undefined ? 0.6 : 1,
                    background: 'linear-gradient(135deg, var(--accent-emerald), #22C55E)'
                  }}
                >
                  Submit Challenge <Award size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Result View */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: passed ? 'var(--accent-emerald-bg)' : 'var(--accent-rose-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: passed ? 'var(--accent-emerald)' : 'var(--accent-rose)'
            }}>
              {passed ? <CheckCircle2 size={44} /> : <AlertTriangle size={44} />}
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {passed ? 'Challenge Mastered!' : 'Challenge Incomplete'}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              You scored <strong style={{ color: passed ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{score} / 5</strong> correct answers.
            </p>

            {passed ? (
              <div style={{
                background: 'var(--accent-amber-bg)',
                border: '1px solid var(--accent-amber)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                maxWidth: '460px',
                margin: '0 auto 2rem',
                fontSize: '0.9rem',
                color: '#92400E',
                fontWeight: 600
              }}>
                🎉 Awesome! Your daily streak has been incremented!
              </div>
            ) : (
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.88rem', marginBottom: '2rem' }}>
                You need at least 3 correct answers to secure today's streak reward. Try again tomorrow!
              </p>
            )}

            <button className="btn-primary" onClick={onClose}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
