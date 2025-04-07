import mongoose from 'mongoose';

// Define enums based on component options for better validation
const employeeSizeEnum = ['0-10', '11-50', '51-100', '101-1000', '1000+'];
const industryEnum = [
  'agriculture', 'mining', 'utilities', 'construction', 'manufacturing',
  'wholesale', 'retail', 'transportation', 'information', 'finance',
  'realestate', 'professional', 'management', 'administrative', 'educational',
  'healthcare', 'arts', 'accommodation', 'other', 'public'
];
const postingFrequencyEnum = ['Daily', '2–3 times a week', 'Weekly', 'Less than once a week'];
const yesNoEnum = ['yes', 'no'];
const holdingBackReasonEnum = ['time', 'knowledge', 'resources', 'no-plan', 'other']; // Corrected 'no-plan'

const businessSchema = new mongoose.Schema({
    // --- Required Fields ---
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    employeeSize: {
        type: String,
        required: true,
        enum: employeeSizeEnum // Optional: added enum validation
    },
    businessLocation: {
        type: String,
        required: true // Assuming location is always required
    },
    industry: {
        type: String,
        required: true,
        enum: industryEnum // Optional: added enum validation
    },
    usesSocialMedia: {
        type: String,
        enum: yesNoEnum,
        required: true
    },

    // --- Conditionally Relevant Fields (Not strictly required at schema level) ---
    socialMediaPlatforms: {
        type: [String],
        default: []
    },
    otherSocialMediaPlatform: {
        type: String,
        default: ""
    },
    postingFrequency: {
        type: String,
        enum: postingFrequencyEnum
        // removed required: true
    },
    hasDocumentedStrategy: {
        type: String,
        enum: yesNoEnum
        // removed required: true - might be skipped if usesSocialMedia is 'no'
    },

    // --- Support & Challenges (Often optional or conditional) ---
    supportNeeded: {
        type: [String],
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
        default: []
    },
    otherHelpfulService: {
        type: String,
        default: ""
    },
    strategyChallenges: {
        type: [String],
        default: []
        // Relevant only if hasDocumentedStrategy is 'no'
    },
    otherStrategyChallenge: {
        type: String,
        default: ""
         // Relevant only if strategyChallenges includes 'other'
    },

   // --- Fields from Currently Unimplemented Steps (Now Implemented!) ---
    interestedInGuidance: { // Step 12 - Radio
        type: String,
        enum: ['yes', 'no'], // Matched to radio values
        default: undefined
    },
    guidanceAreas: { // Step 12 - Checkbox
        type: [String], // Array for multiple selections
        default: []
    },
    otherGuidanceArea: { // Step 12 - Text input
        type: String,
        default: ""
    },
    hasSetGoals: { // Step 13 - Radio
        type: String,
        enum: ['yes', 'no'], // Matched to radio values
        default: undefined
    },
    setGoalsDetails: { // Step 13 - Textarea
        type: String,
        default: ""
    },
    wantsHelpWithGoals: { // Step 13 - Radio
        type: String,
        enum: ['yes', 'no'], // Matched to radio values
        default: undefined
    },

    // --- Other Fields ---
    socialMediaIdeas: { // Step 14
        type: String,
        default: ""
    },
    socialMediaTools: { // Step 15 - Keep as array, FIX COMPONENT INPUT TO CHECKBOX
        type: [String],
        default: []
    },
    successMetrics: { // Step 16 - Keep as array, FIX COMPONENT INPUT TO CHECKBOX
        type: [String],
        default: []
    },

    // --- Metadata ---
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying by user
businessSchema.index({ userId: 1 });

const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);

export default Business;
