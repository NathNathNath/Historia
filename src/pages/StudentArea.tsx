import TeacherLayout from "@/components/TeacherLayout";

export default function StudentArea() {
  return (
    <TeacherLayout title="Student Area">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Area</h1>
        <p className="text-gray-600">This page is under development. Student management features will be available here.</p>
      </div>
    </TeacherLayout>
  );
}
