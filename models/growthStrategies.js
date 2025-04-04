import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  colorClasses: { type: String, required: true }
});

const solutionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true },
  thumbnail: { type: String, required: true },
  colorClasses: { type: String, required: true }
});

const growthStrategySchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  problem: problemSchema,
  solution: solutionSchema
});

// Prevent model recompilation error
const GrowthStrategy = mongoose.models.GrowthStrategy || mongoose.model('GrowthStrategy', growthStrategySchema);

export default GrowthStrategy;