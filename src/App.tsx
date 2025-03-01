import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AttendanceProvider } from './context/AttendanceContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AttendancePage from './pages/AttendancePage';
import ScanPage from './pages/ScanPage';
import ScanResultPage from './pages/ScanResultPage';

function App() {
  return (
    <AttendanceProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="pb-16 md:pb-0"> {/* Add padding at bottom for mobile nav */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/student/:id" element={<StudentDetailPage />} />
              <Route path="/student/new" element={<StudentDetailPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/scan/:id" element={<ScanResultPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AttendanceProvider>
  );
}

export default App;