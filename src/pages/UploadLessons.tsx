import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";

export default function UploadLessons() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [operationSuccess, setOperationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editData, setEditData] = useState({
    lessonTitle: "",
    description: "",
    coverPhoto: null,
    presentationVideo: null,
    handout: null
  });
  const [editProgress, setEditProgress] = useState({
    coverPhoto: 0,
    presentationVideo: 0,
    handout: 0
  });
  const [uploadData, setUploadData] = useState({
    lessonTitle: "",
    description: "",
    coverPhoto: null,
    presentationVideo: null,
    handout: null
  });
  const [uploadProgress, setUploadProgress] = useState({
    coverPhoto: 0,
    presentationVideo: 0,
    handout: 0
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("http://localhost:5000/api/subjects");
    if (res.ok) setSubjects(await res.json());
  };

  const fetchLessons = async (subjectId) => {
    setLoadingLessons(true);
    try {
      const res = await fetch(`http://localhost:5000/api/lessons/subject/${subjectId}`);
      if (res.ok) {
        const lessonsData = await res.json();
        setLessons(lessonsData);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
    setLoadingLessons(false);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setShowLessonsModal(true);
    fetchLessons(subject._id);
  };

  const handleUploadModule = (subject) => {
    setSelectedSubject(subject);
    setUploadData({
      lessonTitle: "",
      description: "",
      coverPhoto: null,
      presentationVideo: null,
      handout: null
    });
    setShowUploadModal(true);
    setOpenDropdown(null); // Close dropdown
  };

  const handleFileUpload = (field, file) => {
    setUploadData(prev => ({ ...prev, [field]: file }));
    // Set upload progress for all file types
    setUploadProgress(prev => ({ ...prev, [field]: 100 }));
  };

  const handleEditFileUpload = (field, file) => {
    setEditData(prev => ({ ...prev, [field]: file }));
    // Set edit progress for all file types
    setEditProgress(prev => ({ ...prev, [field]: 100 }));
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setEditData({
      lessonTitle: lesson.lessonTitle,
      description: lesson.description,
      coverPhoto: null, // Will be set to existing file if no new file is uploaded
      presentationVideo: null,
      handout: null
    });
    setEditProgress({
      coverPhoto: 0,
      presentationVideo: 0,
      handout: 0
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingLesson) return;

    const formData = new FormData();
    formData.append('lessonTitle', editData.lessonTitle);
    formData.append('description', editData.description);
    
    // Only append new files if they exist, otherwise keep existing ones
    if (editData.coverPhoto) formData.append('coverPhoto', editData.coverPhoto);
    if (editData.presentationVideo) formData.append('presentationVideo', editData.presentationVideo);
    if (editData.handout) formData.append('handout', editData.handout);

    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${editingLesson._id}`, {
        method: 'PUT',
        body: formData
      });
      if (res.ok) {
        const updatedLesson = await res.json();
        // Update the lesson in the lessons list
        setLessons(prev => prev.map(l => 
          l._id === editingLesson._id ? updatedLesson : l
        ));
        setShowEditModal(false);
        setEditingLesson(null);
        // Show success message
        setOperationSuccess(true);
        setSuccessMessage("Lesson updated successfully!");
        setTimeout(() => setOperationSuccess(false), 3000);
        // Reset edit form
        setEditData({
          lessonTitle: "",
          description: "",
          coverPhoto: null,
          presentationVideo: null,
          handout: null
        });
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;

    const formData = new FormData();
    formData.append('lessonTitle', uploadData.lessonTitle);
    formData.append('subject', selectedSubject._id);
    formData.append('description', uploadData.description);
    if (uploadData.coverPhoto) formData.append('coverPhoto', uploadData.coverPhoto);
    if (uploadData.presentationVideo) formData.append('presentationVideo', uploadData.presentationVideo);
    if (uploadData.handout) formData.append('handout', uploadData.handout);

    try {
      const res = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setShowUploadModal(false);
        setSelectedSubject(null);
        // Show success message
        setOperationSuccess(true);
        setSuccessMessage("Lesson uploaded successfully!");
        setTimeout(() => setOperationSuccess(false), 3000);
        // Reset form
        setUploadData({
          lessonTitle: "",
          description: "",
          coverPhoto: null,
          presentationVideo: null,
          handout: null
        });
        // Refresh lessons if lessons modal is open
        if (showLessonsModal && selectedSubject) {
          fetchLessons(selectedSubject._id);
        }
      }
    } catch (error) {
      console.error('Error uploading lesson:', error);
    }
  };

  const handleDeleteLesson = (lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${lessonToDelete._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Show success message
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
        // Remove lesson from list
        setLessons(prev => prev.filter(l => l._id !== lessonToDelete._id));
        // Close confirmation modal
        setShowDeleteConfirm(false);
        setLessonToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleImagePreview = (imagePath, lessonTitle) => {
    setPreviewImage({ path: imagePath, title: lessonTitle });
    setShowImagePreview(true);
  };

  const handleVideoPlay = (videoPath, lessonTitle) => {
    setVideoToPlay({ path: videoPath, title: lessonTitle });
    setShowVideoPlayer(true);
  };

  const handleFileDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = `/public/assets/${filePath}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDropdown = (subjectId) => {
    setOpenDropdown(openDropdown === subjectId ? null : subjectId);
  };

  const filteredSubjects = subjects.filter(s =>
    (s.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Upload Lessons">
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Lessons
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Search subject by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm"
            >
              <option value="">FILTER</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-xl font-semibold shadow ${view === "grid" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-200"}`}
            >
              GRID
            </Button>
            <Button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-xl font-semibold shadow ${view === "list" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-200"}`}
            >
              LIST
            </Button>
          </div>
          <Button className="bg-indigo-900 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded-xl shadow-lg">
            + Post in Teacher
          </Button>
        </div>
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredSubjects.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No subjects found.</div>
            ) : (
              filteredSubjects.map(subject => (
                <div key={subject._id} className="rounded-2xl border border-indigo-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 p-0 overflow-visible relative flex flex-col min-h-[260px] cursor-pointer" onClick={() => handleSubjectClick(subject)}>
                  <div className="h-24 bg-gray-100 flex items-center justify-center">
                    {subject.background ? (
                      <img src={`/public/assets/${subject.background}`} alt={subject.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image Available</span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-lg text-indigo-800 mb-1 truncate">{subject.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{subject.teacherName || "-"}</div>
                      <div className="text-xs font-bold text-green-700 uppercase tracking-wide">{subject.status || "DRAFT"}</div>
                    </div>
                    <div className="flex justify-end items-center mt-4">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleDropdown(subject._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openDropdown === subject._id && (
                          <div className="absolute bottom-0 right-0 mb-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            <button
                              onClick={() => handleUploadModule(subject)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload Module
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredSubjects.length === 0 ? (
              <div className="text-center text-gray-400">No subjects found.</div>
            ) : (
              filteredSubjects.map(subject => (
                <div key={subject._id} className="rounded-2xl border border-indigo-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center p-4 gap-6 cursor-pointer" onClick={() => handleSubjectClick(subject)}>
                  <div className="w-24 h-16 bg-gray-100 flex items-center justify-center">
                    {subject.background ? (
                      <img src={`/public/assets/${subject.background}`} alt={subject.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image Available</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-indigo-800 mb-1 truncate">{subject.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{subject.teacherName || "-"}</div>
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide">{subject.status || "DRAFT"}</div>
                  </div>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => toggleDropdown(subject._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {openDropdown === subject._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => handleUploadModule(subject)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Module
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="text-center text-xs text-gray-400 mt-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
        </div>
      </div>

      {/* Lessons Modal */}
      {showLessonsModal && selectedSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Lessons for {selectedSubject.name}
              </h2>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleUploadModule(selectedSubject)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  + Add New Lesson
                </Button>
                <Button
                  onClick={() => setShowLessonsModal(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Close
                </Button>
              </div>
            </div>

            {loadingLessons ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading lessons...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Lessons Yet</h3>
                <p className="text-gray-500 mb-4">This subject doesn't have any lessons uploaded yet.</p>
                <Button
                  onClick={() => handleUploadModule(selectedSubject)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Upload First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{lesson.lessonTitle}</h3>
                        <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(lesson.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteLesson(lesson)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {/* Files Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-4">
                        {lesson.coverPhoto && (
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleImagePreview(lesson.coverPhoto, lesson.lessonTitle)}
                            >
                              <img 
                                src={`/public/assets/${lesson.coverPhoto}`} 
                                alt="Cover Photo" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-600">Cover Photo</p>
                          </div>
                        )}
                        {lesson.presentationVideo && (
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100 relative cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleVideoPlay(lesson.presentationVideo, lesson.lessonTitle)}
                            >
                              <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">Video</p>
                          </div>
                        )}
                        {lesson.handout && (
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleFileDownload(lesson.handout, lesson.handout)}
                            >
                              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">Handout</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Module Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Module</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lesson Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Title</label>
                  <Input
                    type="text"
                    value={uploadData.lessonTitle}
                    onChange={e => setUploadData(prev => ({ ...prev, lessonTitle: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Enter lesson title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={e => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none"
                    placeholder="Enter lesson description..."
                    required
                  />
                </div>
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-3 gap-4">
                {/* Cover Photo */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Cover Photo</h3>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop image or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max 800 x 400)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload('coverPhoto', e.target.files[0])}
                      className="hidden"
                      id="coverPhoto"
                    />
                    <label htmlFor="coverPhoto" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {uploadData.coverPhoto && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{uploadData.coverPhoto.name}</span>
                        <button
                          onClick={() => setUploadData(prev => ({ ...prev, coverPhoto: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.coverPhoto}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Presentation Video */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Presentation Video</h3>
                  {uploadProgress.presentationVideo > 0 && (
                    <div className="text-purple-600 text-sm font-semibold mb-2">{uploadProgress.presentationVideo}%</div>
                  )}
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop video or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV (max 100MB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={e => handleFileUpload('presentationVideo', e.target.files[0])}
                      className="hidden"
                      id="presentationVideo"
                    />
                    <label htmlFor="presentationVideo" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {uploadData.presentationVideo && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{uploadData.presentationVideo.name}</span>
                        <button
                          onClick={() => setUploadData(prev => ({ ...prev, presentationVideo: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${uploadProgress.presentationVideo}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Handout */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Handout</h3>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop file or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => handleFileUpload('handout', e.target.files[0])}
                      className="hidden"
                      id="handout"
                    />
                    <label htmlFor="handout" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {uploadData.handout && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{uploadData.handout.name}</span>
                        <button
                          onClick={() => setUploadData(prev => ({ ...prev, handout: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${uploadProgress.handout}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <Button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                  + Add More
                </Button>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-red-600 underline hover:text-red-700"
                >
                  Cancel lesson
                </button>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save/Continue
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Lesson</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Lesson Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Title</label>
                  <Input
                    type="text"
                    value={editData.lessonTitle}
                    onChange={e => setEditData(prev => ({ ...prev, lessonTitle: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Enter lesson title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Description</label>
                  <textarea
                    value={editData.description}
                    onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none"
                    placeholder="Enter lesson description..."
                    required
                  />
                </div>
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-3 gap-4">
                {/* Cover Photo */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Cover Photo</h3>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop image or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max 800 x 400)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleEditFileUpload('coverPhoto', e.target.files[0])}
                      className="hidden"
                      id="editCoverPhoto"
                    />
                    <label htmlFor="editCoverPhoto" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {editData.coverPhoto && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{editData.coverPhoto.name}</span>
                        <button
                          onClick={() => setEditData(prev => ({ ...prev, coverPhoto: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${editProgress.coverPhoto}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Presentation Video */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Presentation Video</h3>
                  {editProgress.presentationVideo > 0 && (
                    <div className="text-purple-600 text-sm font-semibold mb-2">{editProgress.presentationVideo}%</div>
                  )}
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop video or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV (max 100MB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={e => handleEditFileUpload('presentationVideo', e.target.files[0])}
                      className="hidden"
                      id="editPresentationVideo"
                    />
                    <label htmlFor="editPresentationVideo" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {editData.presentationVideo && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{editData.presentationVideo.name}</span>
                        <button
                          onClick={() => setEditData(prev => ({ ...prev, presentationVideo: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${editProgress.presentationVideo}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Handout */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">Handout</h3>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & Drop file or <span className="text-blue-600 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => handleEditFileUpload('handout', e.target.files[0])}
                      className="hidden"
                      id="editHandout"
                    />
                    <label htmlFor="editHandout" className="block mt-2 text-blue-600 underline cursor-pointer text-sm">
                      Choose File
                    </label>
                  </div>
                  {editData.handout && (
                    <div className="mt-3 bg-blue-50 border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate">{editData.handout.name}</span>
                        <button
                          onClick={() => setEditData(prev => ({ ...prev, handout: null }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${editProgress.handout}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <Button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                  + Add More
                </Button>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-red-600 underline hover:text-red-700"
                >
                  Cancel lesson
                </button>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save/Continue
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && lessonToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete "{lessonToDelete.lessonTitle}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteLesson}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success Message */}
      {operationSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      {/* Delete Success Message */}
      {deleteSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Lesson deleted successfully!
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{previewImage.title}</h3>
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={`/public/assets/${previewImage.path}`}
                alt="Cover Photo Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && videoToPlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{videoToPlay.title}</h3>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <video
                src={`/public/assets/${videoToPlay.path}`}
                controls
                className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
