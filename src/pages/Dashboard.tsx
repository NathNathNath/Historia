import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const summaryCards = [
  { label: "Total Users", value: 14, sub: "Active members", icon: "👥", gradient: "from-blue-500 to-cyan-500" },
  { label: "Total Subjects", value: 1, sub: "Available courses", icon: "📚", gradient: "from-purple-500 to-pink-500" },
  { label: "Reports", value: 19, sub: "This month", icon: "📊", gradient: "from-green-500 to-emerald-500" },
  { label: "Active Students", value: 8, sub: "Learning now", icon: "🎓", gradient: "from-orange-500 to-red-500" },
];

const recentActivity = [
  { icon: "👤", text: "New Student Enrolled", time: "2 hours ago", color: "text-blue-600" },
  { icon: "📚", text: "New Course Added", time: "5 hours ago", color: "text-purple-600" },
  { icon: "🧑‍🏫", text: "New Teacher Hired", time: "1 day ago", color: "text-green-600" },
];

export default function Dashboard() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    fetchTodos();
  }, [userId, navigate]);

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
    if (!todo.trim() || !userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todo })
      });
      
      if (response.ok) {
        setTodo("");
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

  // Show loading if no user ID
  if (!userId) {
    return null;
  }

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {card.value}
                </div>
              </div>
            </div>
            <div className="text-gray-800 font-semibold text-lg mb-1">{card.label}</div>
            <div className="text-gray-500 text-sm">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Activity and Todo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recent Activity
            </h2>
          </div>
          <ul className="space-y-4">
            {recentActivity.map((act, idx) => (
              <li key={idx} className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">{act.icon}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${act.color}`}>{act.text}</div>
                  <div className="text-gray-500 text-sm">{act.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Todolist */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              To-Do List
            </h2>
          </div>
          
          <div className="flex mb-6">
            <Input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="What needs to be done?"
              value={todo}
              onChange={e => setTodo(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
            />
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={addTodo}
            >
              +
            </Button>
          </div>
          
          <ul className="space-y-3 flex-1">
            {loading ? (
              <li className="text-center text-gray-500">Loading todos...</li>
            ) : todos.length === 0 ? (
              <li className="text-center text-gray-500">No todos yet. Add one above!</li>
            ) : (
              todos.map((todoItem) => (
                <li key={todoItem._id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-3 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => toggleTodo(todoItem._id, todoItem.completed)}
                        className="mr-3 w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center hover:border-indigo-500 transition-colors"
                      >
                        {todoItem.completed && (
                          <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      {editingTodo === todoItem._id ? (
                        <div className="flex items-center flex-1">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 mr-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 p-1 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded ml-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className={`flex-1 ${todoItem.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {todoItem.text}
                        </span>
                      )}
                    </div>
                    
                    {editingTodo !== todoItem._id && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(todoItem)}
                          className="text-orange-500 hover:text-orange-700 p-1 rounded hover:bg-orange-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTodo(todoItem._id)}
                          className="text-gray-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
          
          {todos.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {completedTodos} of {todos.length} tasks done
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}