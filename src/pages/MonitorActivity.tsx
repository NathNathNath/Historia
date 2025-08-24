import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function MonitorActivity() {
  const [onlineUsers, setOnlineUsers] = useState(4);
  const [registrations, setRegistrations] = useState(11);
  const [notifyStudents, setNotifyStudents] = useState(18);
  const [notifyTeachers, setNotifyTeachers] = useState(4);
  const [activeUsers, setActiveUsers] = useState([
    { name: "michale jordan", role: "Teacher", time: "2 min ago", status: "active" },
    { name: "marcho", role: "Student", time: "Just now", status: "active" },
    { name: "jeffrey D", role: "Student", time: "5 min ago", status: "active" },
    { name: "Jeff Brown", role: "Teacher", time: "1 min ago", status: "active" }
  ]);
  const [idleUsers, setIdleUsers] = useState([
    { name: "Idle User", role: "Student", time: "1 min ago", status: "idle" }
  ]);

  return (
    <AdminLayout title="User Activity Monitor">
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Monitoring Activity Overview */}
          <div className="lg:w-1/3">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Monitoring Activity</h2>
            <div className="space-y-4">
              {/* Online Users */}
              <div className="bg-blue-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Online Users</span>
                  </div>
                  <span className="text-2xl font-bold">{onlineUsers}</span>
                </div>
              </div>

              {/* Registration */}
              <div className="bg-teal-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Registration</span>
                  </div>
                  <span className="text-2xl font-bold">{registrations}</span>
                </div>
              </div>

              {/* Notify Student */}
              <div className="bg-green-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Notify Student</span>
                  </div>
                  <span className="text-2xl font-bold">{notifyStudents}</span>
                </div>
              </div>

              {/* Notify Teachers */}
              <div className="bg-red-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Notify Teachers</span>
                  </div>
                  <span className="text-2xl font-bold">{notifyTeachers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Active and Idle Users List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{activeUsers.length} Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>{idleUsers.length} Idle</span>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {/* Active Users */}
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{user.time}</div>
                  </div>
                ))}

                {/* Idle Users */}
                {idleUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{user.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center text-xs text-gray-400 mt-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
        </div>
      </div>
    </AdminLayout>
  );
}
