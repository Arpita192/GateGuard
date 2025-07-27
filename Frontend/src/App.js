import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // [cite: 1998]
import ProtectedRoute from './components/ProtectedRoute'; // [cite: 2000]
import Navbar from './components/layout/Navbar'; 

// Import all pages
import LoginPage from './pages/LoginPage'; // [cite: 2002]
import SignupPage from './pages/SignupPage'; // [cite: 2004]
import VerifyEmailPage from './pages/VerifyEmailPage'; // [cite: 2005]
import StudentDashboardPage from './pages/StudentDashboardPage'; // [cite: 2007]
import WardenDashboardPage from './pages/WardenDashboardPage'; // [cite: 2007]
import SecurityScannerPage from './pages/SecurityScannerPage'; // [cite: 2007]
import ClerkDashboardPage from './pages/ClerkDashboardPage'; // [cite: 2008]
import UserManagementPage from './pages/UserManagementPage'; 
import StudentSearchPage from './pages/StudentSearchPage'; 
import ProfilePage from './pages/ProfilePage'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar /> {/* Render Navbar on all pages */}
                <div className="App">
                    <Routes>
                        {/* === PUBLIC ROUTES === */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

                        {/* === PROTECTED DASHBOARD & FUNCTIONAL ROUTES === */}
                        <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
                        <Route path="/warden/dashboard" element={<ProtectedRoute><WardenDashboardPage /></ProtectedRoute>} />
                        <Route path="/security/scanner" element={<ProtectedRoute><SecurityScannerPage /></ProtectedRoute>} />
                        <Route path="/clerk/dashboard" element={<ProtectedRoute><ClerkDashboardPage /></ProtectedRoute>} />
                        
                        {/* Added Missing Routes */}
                        <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
                        <Route path="/warden/students" element={<ProtectedRoute><StudentSearchPage /></ProtectedRoute>} />
                        <Route path="/clerk/students" element={<ProtectedRoute><StudentSearchPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                        {/* === DEFAULT ROUTE === */}
                        <Route path="/" element={<LoginPage />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;