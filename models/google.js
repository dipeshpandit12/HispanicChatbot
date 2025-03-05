import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  hasBusinessData: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GoogleUser = mongoose.models.GoogleUser || mongoose.model('GoogleUser', googleUserSchema);
export default GoogleUser;