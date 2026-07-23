import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  
  // Verification states
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: '' },
  emailVerificationExpires: { type: Date },
  pendingEmail: { type: String, default: '' },
  
  // Profile settings
  bio: { type: String, default: 'Passionate developer mastering the MERN stack.' },
  affiliation: { type: String, default: 'Independent Academy' },
  targetGoal: { type: String, default: 'Senior MERN Developer' },
  avatarColor: { type: String, default: '#D96B43' },
  profilePic: { type: String, default: '' }, // Base64 data string
  
  // Study Metrics
  streak: { type: Number, default: 1 },
  lastDailyChallenge: { type: String, default: '' },
  progress: { type: Map, of: Object, default: {} }, // { html: { level1: { score: 9, completed: true } } }
  bookmarks: [{ type: String }] // Array of question IDs
}, { timestamps: true });

// Pre-save password hashing hook
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password helper
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model('User', UserSchema);
