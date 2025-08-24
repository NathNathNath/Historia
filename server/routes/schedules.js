import express from 'express';

import Schedule from '../models/Schedule.js';

const router = express.Router();
// Create a new schedule

// Create a new schedule (requires teacherId)
router.post('/', async (req, res) => {
  try {
    const { date, className, timeStart, timeEnd, teacherId } = req.body;
    if (!teacherId) return res.status(400).json({ error: 'teacherId is required' });
    const schedule = new Schedule({ date, className, timeStart, timeEnd, teacherId });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get schedules for a specific teacher
router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) return res.status(400).json({ error: 'teacherId is required' });
    const schedules = await Schedule.find({ teacherId });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a schedule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, className, timeStart, timeEnd, teacherId } = req.body;
    
    // Verify teacherId is provided
    if (!teacherId) return res.status(400).json({ error: 'teacherId is required' });

    // Find schedule and verify ownership
    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    if (schedule.teacherId.toString() !== teacherId) {
      return res.status(403).json({ error: 'Not authorized to update this schedule' });
    }

    // Update the schedule
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { date, className, timeStart, timeEnd },
      { new: true } // Return the updated document
    );

    res.json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a schedule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find schedule first to verify ownership
    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    // Delete the schedule
    await Schedule.findByIdAndDelete(id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

