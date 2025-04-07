import mongoose from 'mongoose';

// Define enums based on component options
const employeeSizeEnum = ['0-10', '11-50', '51-100', '101-1000', '1000+'];
const industryEnum = [
  'agriculture', 'mining', 'utilities', 'construction', 'manufacturing',
  'wholesale', 'retail', 'transportation', 'information', 'finance',
  'realestate', 'professional', 'management', 'administrative', 'educational',
  'healthcare', 'arts', 'accommodation', 'other', 'public'
];

const socialMediaPlatformsEnum = [
  'Facebook', 'Instagram', 'X (formerly Twitter)', 'TikTok', 
  'LinkedIn', 'Pinterest', 'YouTube'
];

const postingFrequencyEnum = ['Daily', '2–3 times a week', 'Weekly', 'Less than once a week'];
const yesNoEnum = ['yes', 'no'];

const supportNeededEnum = [
  'strategy', 'content', 'setup', 'ads', 'other'
];

const holdingBackReasonEnum = ['time', 'knowledge', 'resources', 'no-plan', 'other'];

const helpfulServicesEnum = [
  'setup', 'strategy', 'ads', 'management', 'analytics', 'other'
];

const strategyChallengesEnum = [
  'lack-time', 'lack-knowledge', 'not-sure', 'no-need', 'other'
];

const guidanceAreasEnum = [
  'content', 'audience', 'schedule', 'goals', 'tracking', 'other'
];

const socialMediaToolsEnum = [
  'Scheduling tools like Buffer',
  'Personal team or social media employee',
  'Hootsuite',
  'Analytics tools like Google Analytics',
  'No tools'
];

const successMetricsEnum = [
  'Engagement metrics',
  'Sales/conversions',
  'Follower growth',
  'Don\'t track'
];

const businessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    employeeSize: {
        type: String,
        required: true,
        enum: employeeSizeEnum
    },
    businessLocation: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true,
        enum: industryEnum
    },
    usesSocialMedia: {
        type: String,
        enum: yesNoEnum,
        required: true
    },
    socialMediaPlatforms: {
        type: [String],
        enum: socialMediaPlatformsEnum,
        default: []
    },
    otherSocialMediaPlatform: {
        type: String,
        default: ""
    },
    postingFrequency: {
        type: String,
        enum: postingFrequencyEnum
    },
    hasDocumentedStrategy: {
        type: String,
        enum: yesNoEnum
    },
    supportNeeded: {
        type: [String],
        enum: supportNeededEnum,
        default: []
    },
    otherSupport: {
        type: String,
        default: ""
    },
    holdingBackReason: {
        type: String,
        enum: holdingBackReasonEnum,
        default: ""
    },
    otherHoldingBackReason: {
        type: String,
        default: ""
    },
    helpfulServices: {
        type: [String],
        enum: helpfulServicesEnum,
        default: []
    },
    otherHelpfulService: {
        type: String,
        default: ""
    },
    strategyChallenges: {
        type: [String],
        enum: strategyChallengesEnum,
        default: []
    },
    otherStrategyChallenge: {
        type: String,
        default: ""
    },
    interestedInGuidance: {
        type: String,
        enum: yesNoEnum,
        default: undefined
    },
    guidanceAreas: {
        type: [String],
        enum: guidanceAreasEnum,
        default: []
    },
    otherGuidanceArea: {
        type: String,
        default: ""
    },
    hasSetGoals: {
        type: String,
        enum: yesNoEnum,
        default: undefined
    },
    setGoalsDetails: {
        type: String,
        default: ""
    },
    wantsHelpWithGoals: {
        type: String,
        enum: yesNoEnum,
        default: undefined
    },
    socialMediaIdeas: {
        type: String,
        default: ""
    },
    socialMediaTools: {
        type: [String],
        enum: socialMediaToolsEnum,
        default: []
    },
    successMetrics: {
        type: [String],
        enum: successMetricsEnum,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying by user
businessSchema.index({ userId: 1 });

// Validator middleware to ensure required fields when usesSocialMedia is 'yes'
businessSchema.pre('save', function(next) {
    if (this.usesSocialMedia === 'yes') {
        if (!this.postingFrequency) {
            next(new Error('Posting frequency is required when using social media'));
        }
        if (!this.hasDocumentedStrategy) {
            next(new Error('Documentation strategy status is required when using social media'));
        }
    }
    next();
});

// Create model
const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);

export default Business;