import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Question from './models/Question.js';
import Interview from './models/Interview.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mernmastery';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // support large base64 image data upload

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => console.error('MongoDB database connection error:', err));

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

    // Create new user (hook inside model hashes password automatically)
    const newUser = new User({
      name,
      email,
      passwordHash: password
    });

    await newUser.save();

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
        progress: newUser.progress
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
        progress: user.progress
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during login.' });
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
      progress: user.progress
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
    if (email) user.email = email;
    if (targetGoal) user.targetGoal = targetGoal;
    if (affiliation) user.affiliation = affiliation;
    if (avatarColor) user.avatarColor = avatarColor;
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;

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
      progress: user.progress
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
        progress: user.progress
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sync operations failed.' });
  }
});

// Start Server listener
app.listen(PORT, () => {
  console.log(`Express API Server is listening on http://localhost:${PORT}`);
});
