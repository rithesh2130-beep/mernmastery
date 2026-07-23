import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useProgress } from '../context/ProgressContext';
import { DOMAINS } from '../data';
import { QuestionCard } from './QuestionCard';
import { ExplanationModal } from './ExplanationModal';
import { ArrowLeft, ArrowRight, RotateCcw, Award, CheckCircle, Timer, Sparkles } from 'lucide-react';

export const QuizEngine = () => {
  const { activeDomain, activeLevels, recordLevelScore } = useProgress();
  const domainData = DOMAINS[activeDomain];
  const currentLevel = activeLevels[activeDomain] || 1;

  const [levelQuestions, setLevelQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [activeModalQuestion, setActiveModalQuestion] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Fetch questions from MongoDB API with static fallback
  useEffect(() => {
    setLoading(true);
    fetch(`/api/questions?domain=${activeDomain}&level=${currentLevel}`)
      .then(res => {
        if (!res.ok) throw new Error('Backend server is offline');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setLevelQuestions(data);
        } else {
          const fallback = domainData ? domainData.questions.filter(q => q.level === currentLevel) : [];
          setLevelQuestions(fallback);
        }
      })
      .catch(err => {
        console.warn("Express MongoDB backend offline, utilizing local static files:", err);
        const fallback = domainData ? domainData.questions.filter(q => q.level === currentLevel) : [];
        setLevelQuestions(fallback);
      })
      .finally(() => setLoading(false));

    // Reset quiz state variables
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmittedQuestions({});
    setIsQuizComplete(false);
    setTimerSeconds(0);
    setIsTimerActive(true);
  }, [activeDomain, currentLevel, domainData]);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isTimerActive && !isQuizComplete) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isQuizComplete]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        ⏳ Loading MERN Database Assessment Tiers...
      </div>
    );
  }

  if (!domainData || levelQuestions.length === 0) return null;

  const currentQData = levelQuestions[currentIndex];
  const selectedAns = userAnswers[currentIndex];
  const isCurrentSubmitted = submittedQuestions[currentIndex] === true;

  // Handle Option Select & Auto Submit
  const handleSelectOption = (optionIndex) => {
    if (isCurrentSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setSubmittedQuestions(prev => ({ ...prev, [currentIndex]: true }));
  };

  // Calculate final score
  const calculateScore = () => {
    let correctCount = 0;
    levelQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correctCount++;
    });
    return correctCount;
  };

  // Finish Quiz
  const handleFinishQuiz = () => {
    const score = calculateScore();
    recordLevelScore(activeDomain, currentLevel, score, levelQuestions.length);
    setIsQuizComplete(true);
    setIsTimerActive(false);

    if (score >= 7) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const score = calculateScore();
  const passThreshold = 7;
  const passed = score >= passThreshold;

  return (
    <div className="quiz-container">
      {/* Quiz Header Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{domainData.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>
              {domainData.short} — Level {currentLevel} Assessment
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              10 MCQs • Pass Mark: 70% (7/10)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Timer Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.9rem' }}>
            <Timer size={16} />
            <span>{Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s</span>
          </div>

          {/* Quick Level Reset */}
          <button 
            className="btn-secondary"
            onClick={() => {
              setUserAnswers({});
              setSubmittedQuestions({});
              setCurrentIndex(0);
              setIsQuizComplete(false);
              setTimerSeconds(0);
            }}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      {!isQuizComplete ? (
        <>
          {/* Active Question Card */}
          <QuestionCard
            questionData={currentQData}
            currentIndex={currentIndex}
            totalQuestions={levelQuestions.length}
            selectedAnswer={selectedAns}
            onSelectAnswer={handleSelectOption}
            isSubmitted={isCurrentSubmitted}
            onOpenInsight={() => setActiveModalQuestion(currentQData)}
          />

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <button
              className="btn-secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {/* Pagination Bullet Indicators */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {levelQuestions.map((_, idx) => {
                const isAnswered = submittedQuestions[idx];
                const isCorrect = userAnswers[idx] === levelQuestions[idx].correctAnswer;
                let bg = 'var(--bg-tertiary)';
                if (isAnswered) {
                  bg = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
                }
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: 'var(--radius-full)',
                      background: bg,
                      border: currentIndex === idx ? '2px solid var(--accent-amber)' : 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  />
                );
              })}
            </div>

            {currentIndex < levelQuestions.length - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex(prev => Math.min(levelQuestions.length - 1, prev + 1))}
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleFinishQuiz}
                style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #22C55E)' }}
              >
                Submit Level <Award size={16} />
              </button>
            )}
          </div>
        </>
      ) : (
        /* Score & Celebration Summary Screen */
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            background: passed ? 'rgba(129, 178, 154, 0.2)' : 'rgba(230, 57, 70, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            {passed ? <CheckCircle size={44} color="var(--accent-emerald)" /> : <RotateCcw size={44} color="var(--accent-rose)" />}
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            {passed ? "Level Mastered!" : "Keep Practicing, Student!"}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0.5rem 0 1.5rem' }}>
            You scored <strong style={{ color: passed ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontSize: '1.3rem' }}>{score} / 10</strong> on Level {currentLevel} ({domainData.name})
          </p>

          {passed ? (
            <div style={{
              background: 'rgba(242, 204, 143, 0.15)',
              border: '1px solid var(--accent-amber)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <Sparkles size={24} color="var(--accent-amber)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>Level {currentLevel + 1} Unlocked!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  You earned the Master Teacher's Seal of Competency for this tier.
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-subtle)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Requirement to unlock Level {currentLevel + 1}: Reach at least 7 / 10 correct answers.
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                setUserAnswers({});
                setSubmittedQuestions({});
                setCurrentIndex(0);
                setIsQuizComplete(false);
                setTimerSeconds(0);
                setIsTimerActive(true);
              }}
            >
              <RotateCcw size={16} /> Retake Level {currentLevel}
            </button>
          </div>
        </div>
      )}

      {/* Teacher Explanation Modal */}
      {activeModalQuestion && (
        <ExplanationModal
          questionData={activeModalQuestion}
          onClose={() => setActiveModalQuestion(null)}
        />
      )}
    </div>
  );
};
