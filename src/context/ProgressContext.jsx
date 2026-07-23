import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  // Active User session state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mern_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme state ('light' | 'dark') - Defaulting to friendly light theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mern_theme') || 'light';
  });

  // Current selected active domain ('html' | 'css' | 'js' | 'react' | 'mongo' | 'node' | 'express')
  const [activeDomain, setActiveDomain] = useState('js');

  // Selected level per domain { html: 1, css: 1, js: 1 ... }
  const [activeLevels, setActiveLevels] = useState({
    html: 1, css: 1, js: 1, react: 1, mongo: 1, node: 1, express: 1
  });

  // User login and logout handlers
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('mern_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mern_user');
  };

  // User Scores & Completed Levels
  // Structure: { [domain]: { level1: { score: 9, completed: true }, ... } }
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('mern_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // User Bookmarked Question IDs
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('mern_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Streak counter & last study date
  const [streak] = useState(() => {
    return parseInt(localStorage.getItem('mern_streak') || '1', 10);
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mern_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('mern_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('mern_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toggle Question Bookmark
  const toggleBookmark = (questionId) => {
    setBookmarks(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  // Record Level Completion & Score
  const recordLevelScore = (domain, level, score, total = 10) => {
    setProgress(prev => {
      const domainProgress = prev[domain] || {};
      const currentBest = domainProgress[level]?.score || 0;

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [level]: {
            score: Math.max(score, currentBest),
            total,
            completed: score >= 7 // Unlocks next level if 70%+ score achieved
          }
        }
      };
    });
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (domain, level) => {
    if (level === 1) return true; // Level 1 is always unlocked
    const domainProgress = progress[domain] || {};
    const prevLevelProgress = domainProgress[level - 1];
    return prevLevelProgress?.completed === true;
  };

  // Get total completed levels across all 7 domains
  const getTotalCompletedLevels = () => {
    let count = 0;
    Object.keys(progress).forEach(dom => {
      Object.keys(progress[dom]).forEach(lvl => {
        if (progress[dom][lvl]?.completed) count++;
      });
    });
    return count;
  };

  return (
    <ProgressContext.Provider value={{
      user,
      login,
      logout,
      theme,
      toggleTheme,
      activeDomain,
      setActiveDomain,
      activeLevels,
      setActiveLevels,
      progress,
      recordLevelScore,
      isLevelUnlocked,
      bookmarks,
      toggleBookmark,
      streak,
      getTotalCompletedLevels
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
