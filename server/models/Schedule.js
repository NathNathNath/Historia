import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true },
  className: { type: String, required: true },
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;
