import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Lesson from '../models/Lesson.js';
import Subject from '../models/Subject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Multer setup for multiple file uploads
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

// GET lessons by subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ subject: req.params.subjectId }).sort({ lessonNumber: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET lesson by id
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('subject', 'name');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE lesson
router.post('/', upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'presentationVideo', maxCount: 1 },
  { name: 'handout', maxCount: 1 }
]), async (req, res) => {
  try {
    const { lessonTitle, subject, description } = req.body;
    const files = req.files;
    
    const lesson = new Lesson({
      lessonTitle,
      subject,
      description,
      coverPhoto: files.coverPhoto ? files.coverPhoto[0].filename : undefined,
      presentationVideo: files.presentationVideo ? files.presentationVideo[0].filename : undefined,
      handout: files.handout ? files.handout[0].filename : undefined
    });
    
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE lesson
router.put('/:id', upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'presentationVideo', maxCount: 1 },
  { name: 'handout', maxCount: 1 }
]), async (req, res) => {
  try {
    const { lessonTitle, description } = req.body;
    const files = req.files;
    
    const update = { lessonTitle, description };
    if (files.coverPhoto) update.coverPhoto = files.coverPhoto[0].filename;
    if (files.presentationVideo) update.presentationVideo = files.presentationVideo[0].filename;
    if (files.handout) update.handout = files.handout[0].filename;
    
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE lesson
router.delete('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
