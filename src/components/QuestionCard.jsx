import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Bookmark, BookmarkCheck, Lightbulb } from 'lucide-react';

export const QuestionCard = ({
  questionData,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
  onOpenInsight
}) => {
  const { bookmarks, toggleBookmark } = useProgress();
  const isBookmarked = bookmarks.includes(questionData.id);

  const optionLabels = ['A', 'B', 'C', 'D'];

  // Shuffle options once per question load, keeping track of the original index
  // so we can still pass the correct original index back to the parent component.
  const shuffledItems = React.useMemo(() => {
    const items = questionData.options.map((opt, i) => ({ opt, originalIndex: i }));
    // Simple Fisher-Yates or random sort
    return items.sort(() => Math.random() - 0.5);
  }, [questionData]);

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      {/* Header Info */}
      <div className="question-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--accent-amber)',
            fontWeight: 800,
            fontSize: '0.8rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)'
          }}>
            Q {currentIndex + 1} of {totalQuestions}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {questionData.levelTitle}
          </span>
        </div>

        {/* Action icons: Bookmark */}
        <button
          onClick={() => toggleBookmark(questionData.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isBookmarked ? 'var(--accent-amber)' : 'var(--text-subtle)',
            cursor: 'pointer',
            padding: '0.3rem'
          }}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
        >
          {isBookmarked ? <BookmarkCheck size={20} fill="var(--accent-amber)" /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Question Text */}
      <h2 className="question-title" style={{ marginTop: '1rem' }}>
        {questionData.question}
      </h2>

      {/* Code Snippet if present */}
      {questionData.codeSnippet && (
        <pre className="code-block">
          <code>{questionData.codeSnippet}</code>
        </pre>
      )}

      {/* Options List */}
      <div className="options-grid">
        {shuffledItems.map((item, displayIdx) => {
          let btnClass = "";
          if (isSubmitted) {
            if (item.originalIndex === questionData.correctAnswer) {
              btnClass = "correct";
            } else if (item.originalIndex === selectedAnswer) {
              btnClass = "incorrect";
            }
          }

          return (
            <button
              key={item.originalIndex}
              className={`option-btn ${btnClass}`}
              disabled={isSubmitted}
              onClick={() => onSelectAnswer(item.originalIndex)}
              style={{
                borderWidth: selectedAnswer === item.originalIndex && !isSubmitted ? '2px' : '1px',
                borderColor: selectedAnswer === item.originalIndex && !isSubmitted ? 'var(--accent-terracotta)' : undefined
              }}
            >
              <span className="option-badge">{optionLabels[displayIdx]}</span>
              <span style={{ flex: 1 }}>{item.opt}</span>
            </button>
          );
        })}
      </div>

      {/* Master Teacher Insight Button when Submitted */}
      {isSubmitted && (
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn-primary" 
            onClick={onOpenInsight}
            style={{
              background: 'linear-gradient(135deg, #3D405B, #1E293B)',
              color: 'var(--accent-cream)',
              border: '1px solid var(--accent-terracotta)',
              boxShadow: 'none'
            }}
          >
            <Lightbulb size={18} color="var(--accent-amber)" /> 100-Year Master's Insight & Pitfalls
          </button>
        </div>
      )}
    </div>
  );
};
