import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext(null);
const API_URL = '/api';

export const ProgressProvider = ({ children }) => {
  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mern_theme') || 'light';
  });

  // Current active domain
  const [activeDomain, setActiveDomain] = useState('js');

  // Selected level per domain
  const [activeLevels, setActiveLevels] = useState({
    html: 1, css: 1, js: 1, react: 1, mongo: 1, node: 1, express: 1
  });

  // Auth States
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mern_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mern_token') || '';
  });

  // Study Progression States
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('mern_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('mern_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('mern_streak') || '1', 10);
  });

  const [lastDailyCompleted, setLastDailyCompleted] = useState(() => {
    return localStorage.getItem('mern_last_daily') || '';
  });

  // 1. JWT Auto-Login Hook on Startup
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid or expired');
        return res.json();
      })
      .then(data => {
        // Sync states with MongoDB
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          bio: data.bio,
          affiliation: data.affiliation,
          targetGoal: data.targetGoal,
          avatarColor: data.avatarColor,
          profilePic: data.profilePic,
          isVerified: data.isVerified
        });
        setProgress(data.progress || {});
        setBookmarks(data.bookmarks || []);
        setStreak(data.streak || 1);
        setLastDailyCompleted(data.lastDailyChallenge || '');
      })
      .catch(err => {
        console.error("MongoDB auto-login failed, falling back:", err);
        // Clear expired tokens but retain guest progress
        logout();
      });
    }
  }, [token]);

  // 2. Database Sync Helper
  const syncProgressToDB = (updatedFields) => {
    if (!token) return;
    
    fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedFields)
    })
    .catch(err => console.error("MongoDB sync operations failed:", err));
  };

  // Auth triggers
  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    localStorage.setItem('mern_token', jwtToken);
    
    setUser(userData);
    localStorage.setItem('mern_user', JSON.stringify(userData));

    // Restore stats from DB
    if (userData.progress) setProgress(userData.progress);
    if (userData.bookmarks) setBookmarks(userData.bookmarks);
    if (userData.streak) setStreak(userData.streak);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('mern_token');
    setUser(null);
    localStorage.removeItem('mern_user');
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('mern_user', JSON.stringify(nextUser));
      return nextUser;
    });

    if (token) {
      fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })
      .catch(err => console.error("Failed to update profile on MongoDB:", err));
    }
  };

  // Study Progress modifiers
  const completeDailyChallenge = () => {
    const todayStr = new Date().toDateString();
    if (lastDailyCompleted !== todayStr) {
      setLastDailyCompleted(todayStr);
      localStorage.setItem('mern_last_daily', todayStr);
      
      setStreak(prev => {
        const nextStreak = prev + 1;
        localStorage.setItem('mern_streak', nextStreak.toString());
        
        // Sync to DB
        syncProgressToDB({ streak: nextStreak, lastDailyChallenge: todayStr });
        return nextStreak;
      });
    }
  };

  const toggleBookmark = (questionId) => {
    setBookmarks(prev => {
      const nextBookmarks = prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId];
      
      localStorage.setItem('mern_bookmarks', JSON.stringify(nextBookmarks));
      
      // Sync to DB
      syncProgressToDB({ bookmarks: nextBookmarks });
      return nextBookmarks;
    });
  };

  const recordLevelScore = (domain, level, score, total = 10) => {
    setProgress(prev => {
      const domainProgress = prev[domain] || {};
      const currentBest = domainProgress[level]?.score || 0;

      const nextProgress = {
        ...prev,
        [domain]: {
          ...domainProgress,
          [level]: {
            score: Math.max(score, currentBest),
            total,
            completed: score >= 7
          }
        }
      };

      localStorage.setItem('mern_progress', JSON.stringify(nextProgress));
      
      // Sync to DB
      syncProgressToDB({ progress: nextProgress });
      return nextProgress;
    });
  };

  // Theme modifiers
  useEffect(() => {
    localStorage.setItem('mern_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isLevelUnlocked = (domain, level) => {
    if (level === 1) return true;
    const domainProgress = progress[domain] || {};
    const prevLevelProgress = domainProgress[level - 1];
    return prevLevelProgress?.completed === true;
  };

  const getTotalCompletedLevels = () => {
    let count = 0;
    Object.keys(progress).forEach(dom => {
      Object.keys(progress[dom] || {}).forEach(lvl => {
        if (progress[dom][lvl]?.completed) count++;
      });
    });
    return count;
  };

  return (
    <ProgressContext.Provider value={{
      user,
      setUser,
      token,
      login,
      logout,
      updateUserProfile,
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
      getTotalCompletedLevels,
      lastDailyCompleted,
      completeDailyChallenge
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
