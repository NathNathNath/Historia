import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  description: { type: String, required: true },
  coverPhoto: { type: String }, // filename
  presentationVideo: { type: String }, // filename
  handout: { type: String }, // filename
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', LessonSchema);
export default Lesson;
