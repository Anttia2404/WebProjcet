import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
// Import các trang khác của bạn
// import HomePage from './pages/HomePage.jsx';
// import ForumPage from './pages/ForumPage.jsx';

const HomePage = () => {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Chào mừng, {user?.fullName || user?.email}!</h1>
            <button onClick={logout}>Đăng xuất</button>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Route công khai */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    {/* Route được bảo vệ */}
                    <Route 
                        path="/home" 
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        } 
                    />
                    {/* Mặc định chuyển về /home */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;