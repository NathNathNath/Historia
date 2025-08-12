import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";

const initialForm = {
  code: "",
  name: "",
  teacher: "",
  status: "Active",
  background: null,
  backgroundName: ""
};

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsSubject, setStudentsSubject] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addableStudents, setAddableStudents] = useState([]);
  const [addStudentSearch, setAddStudentSearch] = useState("");
  const [addStudentLoading, setAddStudentLoading] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null); // student to remove
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch subjects and teachers
  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await fetch("http://localhost:5000/api/subjects");
      if (res.ok) setSubjects(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    // Replace with your API endpoint
    const res = await fetch("http://localhost:5000/api/users?role=teacher");
    if (res.ok) setTeachers(await res.json());
  };

  const handleAdd = () => {
    setEditingSubject(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      teacher: subject.teacher,
      status: subject.status,
      background: null,
      backgroundName: subject.backgroundName || ""
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;
    // Replace with your API endpoint
    await fetch(`http://localhost:5000/api/subjects/${deletingSubject._id}`, { method: "DELETE" });
    setShowDeleteModal(false);
    setDeletingSubject(null);
    fetchSubjects();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("code", formData.code);
    form.append("name", formData.name);
    form.append("teacher", formData.teacher);
    form.append("status", formData.status);
    if (formData.background) form.append("background", formData.background);
    const url = editingSubject
      ? `http://localhost:5000/api/subjects/${editingSubject._id}`
      : "http://localhost:5000/api/subjects";
    const method = editingSubject ? "PUT" : "POST";
    await fetch(url, { method, body: form });
    setShowModal(false);
    setEditingSubject(null);
    setFormData(initialForm);
    fetchSubjects();
  };

  const handleViewStudents = async (subject) => {
    setStudentsSubject(subject);
    setShowStudentsModal(true);
    setStudentsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${subject._id}/students`);
      if (res.ok) {
        setStudentsList(await res.json());
      } else {
        setStudentsList([]);
      }
    } catch {
      setStudentsList([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleOpenAddStudent = async () => {
    if (!studentsSubject) return;
    setShowAddStudentModal(true);
    setAddStudentLoading(true);
    try {
      // Get all students
      const res = await fetch('http://localhost:5000/api/users?role=student');
      let allStudents = [];
      if (res.ok) allStudents = await res.json();
      // Remove already enrolled
      const enrolledIds = new Set(studentsList.map(s => s._id));
      setAddableStudents(allStudents.filter(s => !enrolledIds.has(s._id)));
    } catch {
      setAddableStudents([]);
    } finally {
      setAddStudentLoading(false);
    }
  };

  const handleAddStudentToSubject = async (student) => {
    if (!studentsSubject) return;
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${studentsSubject._id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: student._id })
      });
      if (res.ok) {
        setStudentsList(prev => [...prev, student]);
        setAddableStudents(prev => prev.filter(s => s._id !== student._id));
      }
    } catch {}
  };

  const handleRemoveStudentFromSubject = (student) => {
    setConfirmRemove(student);
  };
  const confirmRemoveStudent = async () => {
    if (!studentsSubject || !confirmRemove) return;
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${studentsSubject._id}/students/${confirmRemove._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStudentsList(prev => prev.filter(s => s._id !== confirmRemove._id));
        setSuccessMsg('Student removed successfully!');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch {}
    setConfirmRemove(null);
  };

  const filteredAddableStudents = addableStudents.filter(s =>
    s.name.toLowerCase().includes(addStudentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(addStudentSearch.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (s) =>
      (s.code?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Subjects">
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 7h.01M15 7h.01M12 7h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Manage Subjects
            </h2>
          </div>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              + Add New Subject
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <th className="px-6 py-4 font-semibold text-gray-700">SUBJECT CODE</th>
                <th className="px-6 py-4 font-semibold text-gray-700">SUBJECT NAME</th>
                <th className="px-6 py-4 font-semibold text-gray-700">ASSIGNED TEACHER</th>
                <th className="px-6 py-4 font-semibold text-gray-700">STATUS</th>
                <th className="px-6 py-4 font-semibold text-gray-700">STUDENTS</th>
                <th className="px-6 py-4 font-semibold text-gray-700">PREVIEW</th>
                <th className="px-6 py-4 font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300">
                  <td className="px-6 py-4 font-medium text-gray-800">{subject.code}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.name}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.teacherName || subject.teacher}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {subject.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleViewStudents(subject)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow"
                    >
                      View Students
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    {subject.background ? (
                      <img
                        src={`/public/assets/${subject.background}`}
                        alt="Preview"
                        className="w-16 h-10 object-cover rounded shadow border"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image Available</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(subject)}
                      title="Edit"
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.978 18.312a4.2 4.2 0 0 1-1.768 1.06l-3.18.954.954-3.18a4.2 4.2 0 0 1 1.06-1.768L16.862 4.487ZM19.5 6.75l-1.5-1.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setDeletingSubject(subject); setShowDeleteModal(true); }}
                      title="Delete"
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
        </div>
      </div>
      {/* Modal for Add/Edit Subject */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-[420px] max-w-md">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 7h.01M15 7h.01M12 7h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Code</label>
                <Input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Teacher</label>
                <select
                  value={formData.teacher}
                  onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, background: file, backgroundName: file ? file.name : "" });
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm"
                />
                {formData.backgroundName && (
                  <div className="text-xs text-gray-500 mt-1 truncate">{formData.backgroundName}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingSubject ? 'Update' : 'Add Subject'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-96 max-w-md">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Delete Subject
                </h3>
                <p className="text-gray-600 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 mb-6 border border-red-100">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <span className="font-semibold text-red-600">{deletingSubject.name}</span>?
              </p>
              <p className="text-gray-500 text-sm">
                Subject Code: {deletingSubject.code}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Delete Subject
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingSubject(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-[420px] max-w-md relative">
            <button
              className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded shadow hover:from-green-600 hover:to-emerald-700"
              onClick={handleOpenAddStudent}
            >
              + Add Student
            </button>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Students Enrolled
            </h3>
            {successMsg && (
              <div className="mb-2 text-green-600 text-center font-semibold animate-pulse">{successMsg}</div>
            )}
            {studentsLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : studentsList.length === 0 ? (
              <div className="text-center text-gray-400">No Student Enrolled</div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {studentsList.map((student) => (
                  <li key={student._id} className="py-2 px-1 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{student.name}</span>
                      <span className="text-xs text-gray-500">{student.email}</span>
                      <span className="text-xs text-gray-400">{student.status}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2 px-3 py-1 rounded shadow"
                      onClick={() => handleRemoveStudentFromSubject(student)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowStudentsModal(false)} variant="outline">Close</Button>
            </div>
            {/* Confirmation Dialog */}
            {confirmRemove && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="bg-white rounded-xl shadow-xl p-6 w-80 border">
                  <h4 className="text-lg font-bold mb-2 text-red-600">Remove Student</h4>
                  <p className="mb-4 text-gray-700">Are you sure you want to remove <span className="font-semibold">{confirmRemove.name}</span> from this subject?</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="destructive" onClick={confirmRemoveStudent}>Remove</Button>
                    <Button variant="outline" onClick={() => setConfirmRemove(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-[420px] max-w-md relative">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Add Student
            </h3>
            <Input
              type="text"
              placeholder="Search students..."
              value={addStudentSearch}
              onChange={e => setAddStudentSearch(e.target.value)}
              className="mb-4"
            />
            {addStudentLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : filteredAddableStudents.length === 0 ? (
              <div className="text-center text-gray-400">No students available</div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {filteredAddableStudents.map(student => (
                  <li key={student._id} className="py-2 px-1 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800">{student.name}</span>
                      <span className="block text-xs text-gray-500">{student.email}</span>
                    </div>
                    <Button
                      size="sm"
                      className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded shadow"
                      onClick={() => handleAddStudentToSubject(student)}
                    >
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowAddStudentModal(false)} variant="outline">Close</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
