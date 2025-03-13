import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    socialAccounts: {
        facebook: {
            accessToken: String,
            pageIds: [String],
            expiresAt: Date
        },
        instagram: {
            businessAccountId: String,
            accessToken: String,
            expiresAt: Date
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.SocialMedia || mongoose.model('SocialMedia', socialMediaSchema);