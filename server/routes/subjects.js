import express from 'express';

import multer from 'multer';
import path from 'path';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/assets'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacher', 'name');
    res.json(subjects.map(s => ({
      ...s.toObject(),
      teacherName: s.teacher?.name || '',
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET subject by id
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('teacher', 'name');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ ...subject.toObject(), teacherName: subject.teacher?.name || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE subject
router.post('/', upload.single('background'), async (req, res) => {
  try {
    const { code, name, teacher, status } = req.body;
    const background = req.file ? req.file.filename : undefined;
    const subject = new Subject({ code, name, teacher, status, background });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE subject
router.put('/:id', upload.single('background'), async (req, res) => {
  try {
    const { code, name, teacher, status } = req.body;
    const update = { code, name, teacher, status };
    if (req.file) update.background = req.file.filename;
    const subject = await Subject.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE subject
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get students enrolled in a subject
router.get('/:id/students', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate({
      path: 'students',
      select: 'name email status',
    });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject.students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a student to a subject
router.post('/:id/students', async (req, res) => {
  try {
    const { userId } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    // Check if user exists and is a student
    const user = await User.findById(userId);
    if (!user || user.role.toLowerCase() !== 'student') {
      return res.status(400).json({ message: 'User is not a student or does not exist' });
    }
    if (subject.students.includes(userId)) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }
    subject.students.push(userId);
    await subject.save();
    res.json({ message: 'Student added', students: subject.students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a student from a subject
router.delete('/:id/students/:studentId', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    const studentId = req.params.studentId;
    subject.students = subject.students.filter(sid => sid.toString() !== studentId);
    await subject.save();
    res.json({ message: 'Student removed', students: subject.students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 
