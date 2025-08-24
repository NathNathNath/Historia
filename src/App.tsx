import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageSubjects from './pages/ManageSubjects';
import UploadLessons from './pages/UploadLessons';
import MonitorActivity from './pages/MonitorActivity';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentArea from './pages/StudentArea';
import ManageActivity from './pages/ManageActivity';
import MyLesson from './pages/MyLesson';
import DataAnalytics from './pages/DataAnalytics';
import Badges from './pages/Badges';
import Calendar from './pages/Calendar';
import NotFound from './pages/NotFound';
import AdminLayout from './components/AdminLayout';
import TeacherLayout from './components/TeacherLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/manage-subjects" element={<ManageSubjects />} />
          <Route path="/lessons" element={<UploadLessons />} />
          <Route path="/monitor-activity" element={<MonitorActivity />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-area" element={<StudentArea />} />
          <Route path="/manage-activity" element={<ManageActivity />} />
          <Route path="/my-lesson" element={<MyLesson />} />
          <Route path="/data-analytics" element={<DataAnalytics />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
