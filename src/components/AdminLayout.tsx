import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: "📊", path: "/dashboard" },
  { label: "Manage Users", icon: "👥", path: "/users" },
  { label: "Manage Subjects", icon: "📚", path: "/manage-subjects" },
  { label: "Upload Lessons", icon: "⬆️", path: "/lessons" },
  { label: "Monitor Activity", icon: "🕵️", path: "/activity" },
  { label: "Analysis", icon: "📈", path: "/analysis" },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    // Redirect to login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 fixed inset-0">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-white/20 flex flex-col justify-between py-6 px-4 min-h-screen shadow-2xl">
          <div>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg mb-4">
                <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HISTORIA - AI
              </h2>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span> {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mb-2">
            <Button 
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Top Bar */}
          {location.pathname === '/dashboard' && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {title}
                </h1>
             
                  <p className="text-gray-600">
                    Welcome back, {localStorage.getItem('userName') || 'Admin'}
                  </p>
           
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
               )}
          {children}
        </main>
      </div>
    </div>
  );
}