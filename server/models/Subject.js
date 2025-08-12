import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  background: { type: String }, // image filename
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Subject = mongoose.model('Subject', SubjectSchema);
export default Subject;
