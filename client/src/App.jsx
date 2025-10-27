import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
// Import các trang khác
import ForumPage from './pages/ForumPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx'; // <-- THÊM IMPORT NÀY

// (Component HomePage ví dụ)
const HomePage = () => {
    return (
        <div>
            <p>Đây là nội dung chính của trang chủ.</p>
        </div>
    );
};

// (Component ProtectedRoute giữ nguyên)
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// (Component LayoutWrapper giữ nguyên)
const LayoutWrapper = ({ children }) => {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
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
                                <LayoutWrapper>
                                    <HomePage />
                                </LayoutWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/forum"
                        element={
                            <ProtectedRoute>
                                <LayoutWrapper>
                                    <ForumPage />
                                </LayoutWrapper>
                            </ProtectedRoute>
                        }
                    />
                     {/* --- THÊM ROUTE MARKETPLACE --- */}
                     <Route
                        path="/marketplace"
                        element={
                            <ProtectedRoute>
                                <LayoutWrapper>
                                    <MarketplacePage />
                                </LayoutWrapper>
                            </ProtectedRoute>
                        }
                    />
                    {/* --- KẾT THÚC ROUTE MARKETPLACE --- */}


                    {/* (Thêm các route cần layout khác vào đây) */}


                    {/* Mặc định chuyển về /home nếu đã đăng nhập */}
                     <Route path="*" element={
                         <ProtectedRoute>
                             <Navigate to="/home" replace />
                         </ProtectedRoute>
                     } />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

