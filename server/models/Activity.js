import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'student_enrolled', 'teacher_hired'
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

const Activity = mongoose.model('Activity', ActivitySchema);
export default Activity;