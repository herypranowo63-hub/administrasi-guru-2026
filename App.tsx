
import React, { useState, useEffect } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import AttendancePage from './pages/AttendancePage';
import BiodataPage from './pages/BiodataPage';
import SchedulePage from './pages/SchedulePage';
import ProtaPage from './pages/ProtaPage';
import PromesPage from './pages/PromesPage';
import TPPage from './pages/TPPage';
import ATPPage from './pages/ATPPage';
import KKTPPage from './pages/KKTPPage';
import KaldikPage from './pages/KaldikPage';
import ModulePage from './pages/ModulePage';
import PlanningPage from './pages/PlanningPage';
import JournalPage from './pages/JournalPage';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Role } from './types';
import { CLASSES, ADMIN_USERNAME, ADMIN_PASSWORD, DEFAULT_PASSWORD_TEACHER, DEFAULT_PASSWORD_WALAS } from './constants';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [username, setUsername] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('spensa_user');
    if (savedUser) {
      const data = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setUserRole(data.role);
      setUsername(data.username);
    }
  }, []);

  const handleLogin = (user: string, pass: string) => {
    // Admin Check
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      const data = { role: 'ADMIN' as Role, username: user };
      localStorage.setItem('spensa_user', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserRole('ADMIN');
      setUsername(user);
      return true;
    }
    
    // Walas Check (7A-9I)
    if (CLASSES.includes(user.toUpperCase()) && pass === DEFAULT_PASSWORD_WALAS) {
      const data = { role: 'WALAS' as Role, username: user.toUpperCase() };
      localStorage.setItem('spensa_user', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserRole('WALAS');
      setUsername(user.toUpperCase());
      return true;
    }

    // Teacher Check
    if (user && pass === DEFAULT_PASSWORD_TEACHER) {
      const data = { role: 'TEACHER' as Role, username: user };
      localStorage.setItem('spensa_user', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserRole('TEACHER');
      setUsername(user);
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('spensa_user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername('');
  };

  if (location.pathname === '/') {
    return <LandingPage />;
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {isAuthenticated && <Sidebar role={userRole!} username={username} onLogout={handleLogout} />}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {isAuthenticated && <Navbar username={username} role={userRole!} />}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/dashboard" element={<Dashboard username={username} role={userRole!} />} />
              <Route path="/students" element={<StudentsPage role={userRole!} classFilter={userRole === 'WALAS' ? username : undefined} />} />
              <Route path="/attendance" element={<AttendancePage role={userRole!} />} />
              <Route path="/biodata" element={<BiodataPage role={userRole!} username={username} />} />
              <Route path="/schedule" element={<SchedulePage role={userRole!} username={username} />} />
              <Route path="/prota" element={<ProtaPage username={username} />} />
              <Route path="/promes" element={<PromesPage username={username} />} />
              <Route path="/tp" element={<TPPage username={username} />} />
              <Route path="/atp" element={<ATPPage username={username} />} />
              <Route path="/kktp" element={<KKTPPage username={username} />} />
              <Route path="/kaldik" element={<KaldikPage />} />
              <Route path="/modules" element={<ModulePage role={userRole!} username={username} />} />
              <Route path="/plans" element={<PlanningPage role={userRole!} username={username} />} />
              <Route path="/journals" element={<JournalPage role={userRole!} username={username} />} />
              <Route path="/admin" element={userRole === 'ADMIN' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
