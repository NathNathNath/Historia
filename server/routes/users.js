import express from 'express';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// GET all users (with optional role filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = new RegExp('^' + req.query.role + '$', 'i'); // case-insensitive
    }
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const roleNew = role.charAt(0).toUpperCase() + role.slice(1);
    const user = new User({
      name,
      email,
      password,
      role: roleNew,
      status: 'Active',
      createdAt: new Date(),
      lastSeen: new Date()
    });

    await user.save();
    // Log activity for new student or teacher
    if (roleNew === 'Student' || roleNew === 'Teacher') {
      await Activity.create({
        type: roleNew === 'Student' ? 'student_enrolled' : 'teacher_hired',
        description: roleNew === 'Student' ? `New student enrolled: ${name}` : `New teacher hired: ${name}`,
        user: user._id
      });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Don't allow updating email if it conflicts with existing user
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { ...updateData, lastSeen: new Date() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// GET total users
router.get('/total', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting users', error: error.message });
  }
});

// GET 3 most recent activities
router.get('/recent-activities', async (req, res) => {
  try {
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name role');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
});

// TODO LIST API ENDPOINTS

// Get todos for a user
router.get('/:id/todos', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('todos');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.todos || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
});

// Add new todo
router.post('/:id/todos', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newTodo = {
      text: req.body.text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    user.todos.push(newTodo);
    await user.save();
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
});

// Update todo
router.put('/:id/todos/:todoId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const todo = user.todos.id(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    if (req.body.text !== undefined) todo.text = req.body.text;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    todo.updatedAt = new Date();
    
    await user.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
});

// Delete todo
router.delete('/:id/todos/:todoId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the todo by filtering
    user.todos = user.todos.filter(t => t._id.toString() !== req.params.todoId);
    await user.save();

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
});

export default router; 