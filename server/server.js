import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Question from './models/Question.js';
import Interview from './models/Interview.js';
import { authMiddleware } from './middleware/auth.js';
import { sendVerificationEmail } from './services/emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mernmastery';

// --------------------------------------------------
// 🛡️ SECURITY MIDDLEWARE
// --------------------------------------------------

// Helmet — sets secure HTTP response headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // allow images across origins
}));

// CORS — restrict to known frontend origins
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / curl / Postman (no Origin header)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://mernmastery.onrender.com',
      'https://courageous-bubblegum-d7d411.netlify.app',
      'http://localhost:5173'
    ];
    if (FRONTEND_URL) allowedOrigins.push(FRONTEND_URL);
    
    // In dev allow any localhost port
    if (!isProd && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error(`CORS policy blocked: ${origin}`));
    }
  },
  credentials: true
}));


// Rate Limiting — protect auth endpoints from brute-force
const isDev = process.env.NODE_ENV !== 'production';
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-minute window
  max: isDev ? 200 : 20,      // 200 in dev (allows test suites), 20 in production
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  skip: () => isDev && process.env.DISABLE_RATE_LIMIT === 'true'
});

app.use('/api/auth/', authLimiter);
app.use(express.json({ limit: '10mb' })); // support large base64 image data upload

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => console.error('MongoDB database connection error:', err));

// --------------------------------------------------
// ❤️ HEALTH CHECK
// --------------------------------------------------

// GET /api/health — used by Render, monitoring tools, and devs to verify the server is up
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MERN Mastery Academy API is running',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------
// 🔑 AUTHENTICATION ROUTES
// --------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All inputs are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Password strength check (regex validation)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.' 
      });
    }

    // Generate secure email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user (hook inside model hashes password automatically)
    const newUser = new User({
      name,
      email,
      passwordHash: password,
      isVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    await newUser.save();

    // Send verification email in development / production
    await sendVerificationEmail(newUser.email, verificationToken);

    // Sign JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'supersecretmernkeys',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        affiliation: newUser.affiliation,
        targetGoal: newUser.targetGoal,
        avatarColor: newUser.avatarColor,
        profilePic: newUser.profilePic,
        streak: newUser.streak,
        bookmarks: newUser.bookmarks,
        progress: newUser.progress,
        isVerified: newUser.isVerified
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Password mismatch.' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'supersecretmernkeys',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        affiliation: user.affiliation,
        targetGoal: user.targetGoal,
        avatarColor: user.avatarColor,
        profilePic: user.profilePic,
        streak: user.streak,
        bookmarks: user.bookmarks,
        progress: user.progress,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/auth/verify-email
app.get('/api/auth/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<h1>Verification token is missing.</h1>');
  }

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('<h1>Email verification token is invalid or has expired.</h1><p>Please log in and resend the email link.</p>');
    }

    user.isVerified = true;
    user.emailVerificationToken = '';
    user.emailVerificationExpires = undefined;

    // Finalize pending email change
    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = '';
    }

    await user.save();

    // Redirect to frontend app with verification success query
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?verified=true`);

  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Internal server error verifying address.</h1>');
  }
});

// POST /api/auth/resend-verification
app.post('/api/auth/resend-verification', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Student account not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'Email address is already verified.' });

    // Generate fresh verification token
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const targetEmail = user.pendingEmail || user.email;
    await sendVerificationEmail(targetEmail, token);

    res.json({ message: 'Verification email resent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resending verification.' });
  }
});

// --------------------------------------------------
// 📚 DATA QUERY ROUTES
// --------------------------------------------------

// GET /api/questions
app.get('/api/questions', async (req, res) => {
  const { domain, level } = req.query;
  const filter = {};
  
  if (domain) filter.domain = domain;
  if (level) filter.level = parseInt(level, 10);

  try {
    const questions = await Question.find(filter).sort({ id: 1 });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving questions.' });
  }
});

// GET /api/interviews
app.get('/api/interviews', async (req, res) => {
  const { domain } = req.query;
  const filter = {};

  if (domain) filter.domain = domain;

  try {
    const interviews = await Interview.find(filter);
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving interviews.' });
  }
});

// --------------------------------------------------
// 👤 USER PROFILE & METRICS SYNC ROUTES
// --------------------------------------------------

// GET /api/users/profile
app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User profile not found.' });
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      affiliation: user.affiliation,
      targetGoal: user.targetGoal,
      avatarColor: user.avatarColor,
      profilePic: user.profilePic,
      streak: user.streak,
      bookmarks: user.bookmarks,
      progress: user.progress,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
});

// PUT /api/users/profile
app.put('/api/users/profile', authMiddleware, async (req, res) => {
  const { name, email, targetGoal, affiliation, avatarColor, bio, profilePic } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Update details
    if (name) user.name = name;
    if (targetGoal) user.targetGoal = targetGoal;
    if (affiliation) user.affiliation = affiliation;
    if (avatarColor) user.avatarColor = avatarColor;
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;

    // Secure Email Swap Verification Logic
    let emailChanged = false;
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const conflict = await User.findOne({ email: email.toLowerCase() });
      if (conflict) {
        return res.status(400).json({ message: 'Email address already in use.' });
      }

      user.pendingEmail = email.toLowerCase();
      user.isVerified = false;

      const token = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = token;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      await sendVerificationEmail(user.pendingEmail, token);
      emailChanged = true;
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      affiliation: user.affiliation,
      targetGoal: user.targetGoal,
      avatarColor: user.avatarColor,
      profilePic: user.profilePic,
      streak: user.streak,
      bookmarks: user.bookmarks,
      progress: user.progress,
      isVerified: user.isVerified,
      emailChanged
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving user profile.' });
  }
});

// POST /api/users/sync
app.post('/api/users/sync', authMiddleware, async (req, res) => {
  const { streak, progress, bookmarks, lastDailyChallenge } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (streak !== undefined) user.streak = streak;
    if (progress) user.progress = progress;
    if (bookmarks) user.bookmarks = bookmarks;
    if (lastDailyChallenge !== undefined) user.lastDailyChallenge = lastDailyChallenge;

    await user.save();

    res.json({
      message: 'Sync completed successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        affiliation: user.affiliation,
        targetGoal: user.targetGoal,
        avatarColor: user.avatarColor,
        profilePic: user.profilePic,
        streak: user.streak,
        bookmarks: user.bookmarks,
        progress: user.progress,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sync operations failed.' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// 🌐 SERVE REACT FRONTEND (production + Render)
// --------------------------------------------------
// Serve Vite's compiled dist/ folder — works when NODE_ENV=production
// or when the dist/ folder actually exists (Render always builds it)
const distPath = path.join(__dirname, '../dist');
const distIndex = path.join(distPath, 'index.html');

const distExists = fs.existsSync(distIndex);

if (distExists) {
  // Serve static assets (JS, CSS, images)
  app.use(express.static(distPath));

  // Any non-API route → serve React app (client-side routing)
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found.' });
    }
    res.sendFile(distIndex);
  });

  console.log(`✅ Serving React frontend from: ${distPath}`);
} else {
  console.log('⚠️  dist/ not found — frontend not being served (run npm run build)');
}

// Start Server listener
app.listen(PORT, () => {
  console.log(`Express API Server is listening on http://localhost:${PORT}`);
});
