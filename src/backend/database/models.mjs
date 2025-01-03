import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  creditScore: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['basketball', 'football', 'badminton'], required: true },
  fee: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['pending', 'open', 'full', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reminders: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: { type: Date, required: true },
    sent: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  facilities: [{ type: String }],
  availableTimes: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  }],
  pricePerHour: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Activity = mongoose.model('Activity', activitySchema);
const pointSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, enum: ['basic', 'premium', 'vip'], default: 'basic' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  createdAt: { type: Date, default: Date.now }
});

const matchStatSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, required: true },
    performance: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Venue = mongoose.model('Venue', venueSchema);
export const Point = mongoose.model('Point', pointSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const Membership = mongoose.model('Membership', membershipSchema);
export const Club = mongoose.model('Club', clubSchema);
export const MatchStat = mongoose.model('MatchStat', matchStatSchema);
