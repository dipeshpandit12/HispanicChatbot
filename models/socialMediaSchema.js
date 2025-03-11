import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    socialAccounts: {
        Instagram: {
            type: String,
            default: ''
        },
        Facebook: {
            type: String,
            default: ''
        },
        Twitter: {
            type: String,
            default: ''
        },
        LinkedIn: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

socialMediaSchema.index({ userId: 1 });

const SocialMedia = mongoose.models.SocialMedia || mongoose.model('SocialMedia', socialMediaSchema);

export default SocialMedia;