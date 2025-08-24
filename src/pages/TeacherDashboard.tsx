
import { useState, useEffect } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddScheduleModal from "@/components/AddScheduleModal";
import ScheduleCard from "@/components/ScheduleCard";

export default function TeacherDashboard() {
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');
  const [totalStudents] = useState(8);
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [students] = useState([
    { name: "Emma Thompson", grade: "Grade 2", subject: "Math" },
    { name: "James Wilson", grade: "Grade 2", subject: "Science" },
    { name: "Sophia Davis", grade: "Grade 2", subject: "English" },
    { name: "Noah Martinez", grade: "Grade 2", subject: "Art" }
  ]);
  // Fetch schedules for this teacher
  const fetchSchedules = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/schedules?teacherId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [userId]);

  // Add or update schedule handler
  const handleAddSchedule = async (schedule) => {
    if (!userId) return;
    try {
      const isEditing = scheduleToEdit !== null;
      const url = isEditing 
        ? `http://localhost:5000/api/schedules/${scheduleToEdit.id}`
        : 'http://localhost:5000/api/schedules';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...schedule, teacherId: userId })
      });
      
      if (response.ok) {
        setShowAddSchedule(false);
        setScheduleToEdit(null);
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Handle edit schedule
  const handleEditSchedule = (schedule) => {
    setScheduleToEdit(schedule);
    setShowAddSchedule(true);
  };

  // Handle delete schedule
  const handleDeleteSchedule = async (id) => {
    if (!userId || !window.confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  // Fetch todos from API
  const fetchTodos = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim() || !userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      });
      
      if (response.ok) {
        setNewTodo("");
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Update todo completion status
  const toggleTodo = async (todoId, completed) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Start editing todo
  const startEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.text);
  };

  // Save edited todo
  const saveEdit = async () => {
    if (!editText.trim() || !userId || !editingTodo) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos/${editingTodo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText })
      });
      
      if (response.ok) {
        setEditingTodo(null);
        setEditText("");
        fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos/${todoId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const completedTodos = todos.filter(t => t.completed).length;

  const editSchedule = (id) => {
    // Implementation for editing schedule
    console.log("Edit schedule:", id);
  };

  const deleteSchedule = (id) => {
    // Implementation for deleting schedule
    console.log("Delete schedule:", id);
  };

  return (
    <TeacherLayout title="Teacher Dashboard">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <div className="text-lg text-gray-600">Welcome back Teacher!</div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total of Students */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{totalStudents}</div>
            <div className="text-lg text-gray-700">Total of Students</div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Activity</div>
            <div className="text-blue-600 hover:text-blue-800 cursor-pointer">more info →</div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">Schedule</h3>
          </div>
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
            {schedules.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No schedules yet.</p>
                <p className="text-sm text-gray-400">Click the button below to add your first schedule.</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule._id}
                  id={schedule._id}
                  date={schedule.date}
                  className={schedule.className}
                  timeStart={schedule.timeStart}
                  timeEnd={schedule.timeEnd}
                  onEdit={handleEditSchedule}
                  onDelete={handleDeleteSchedule}
                />
              ))
            )}
          </div>
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white" onClick={() => setShowAddSchedule(true)}>
            + Add Schedule
          </Button>
        </div>
  <AddScheduleModal 
    open={showAddSchedule} 
    onClose={() => {
      setShowAddSchedule(false);
      setScheduleToEdit(null);
    }} 
    onAdd={handleAddSchedule}
    scheduleToEdit={scheduleToEdit}
  />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students Chart */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">Students</h3>
          </div>
          
          {/* Donut Chart */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                  strokeDashoffset="0"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-75"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">8</span>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Boys</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Girls 3</span>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Student List</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Grade</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Subject</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-700">{student.name}</td>
                    <td className="py-2 text-sm text-gray-700">{student.grade}</td>
                    <td className="py-2 text-sm text-gray-700">{student.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer">more info →</div>
        </div>

        {/* To-Do List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">To-Do List</h3>
          </div>
          
          {/* Add New Todo */}
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1"
            />
            <Button onClick={addTodo} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3">
              +
            </Button>
          </div>
          
          {/* Todo Items */}
          <div className="space-y-3 mb-4">
            {loading ? (
              <div className="text-center text-gray-400">Loading todos...</div>
            ) : todos.length === 0 ? (
              <div className="text-center text-gray-400">No todos yet. Add one above!</div>
            ) : (
              todos.map((todoItem) => (
                <div key={todoItem._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => toggleTodo(todoItem._id, todoItem.completed)}
                    className={`w-5 h-5 flex items-center justify-center rounded border-2 ${todoItem.completed ? 'border-indigo-400 bg-indigo-200' : 'border-gray-300 bg-white'} transition-colors`}
                  >
                    {todoItem.completed && (
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  {editingTodo === todoItem._id ? (
                    <div className="flex items-center flex-1 gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-700 p-1 rounded"
                        title="Save"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-400 hover:text-gray-700 p-1 rounded"
                        title="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className={`flex-1 text-sm ${todoItem.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {todoItem.text}
                    </span>
                  )}
                  {editingTodo !== todoItem._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(todoItem)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTodo(todoItem._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="text-sm text-gray-600 text-center">
            {todos.length > 0 ? `${completedTodos} of ${todos.length} tasks done` : 'No tasks yet'}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
