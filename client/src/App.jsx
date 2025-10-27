import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatBotProvider } from "./context/ChatBotContext";
import AuthPage from "./pages/AuthPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ChatbotPage from "./pages/ChatbotPage";
// Import các trang khác của bạn
// import HomePage from './pages/HomePage.jsx';
// import ForumPage from './pages/ForumPage.jsx';

const HomePage = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Chào mừng, {user?.fullName || user?.email}!</h1>
      <div style={{ display: "flex", gap: 10 }}>
        <a href="/chat">
          <button className="btn">Mở Chatbot</button>
        </a>
        <button onClick={logout}>Đăng xuất</button>
      </div>
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
        <ChatBotProvider>
          <Routes>
            {/* Route công khai */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/chat" element={<ChatbotPage />} />
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
        </ChatBotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
