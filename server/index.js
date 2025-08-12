import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import todosRouter from './routes/todos.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import subjectsRouter from './routes/subjects.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://nathdaaco123:rggCv4vv7kLWWrIr@cluster0.jwy6m.mongodb.net/historia?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/public/assets', express.static('public/assets'));
app.use('/api/todos', todosRouter);
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/subjects', subjectsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));