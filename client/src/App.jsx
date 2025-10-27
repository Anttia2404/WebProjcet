import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatBotProvider } from "./context/ChatBotContext";
import AuthPage from "./pages/AuthPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ChatbotPage from "./pages/ChatbotPage";
import ChatPop from "./components/chatbot/ChatPop";
import MainLayout from "./components/layout/MainLayout.jsx";
// Import các trang khác
import ForumPage from "./pages/ForumPage.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";

// (Component HomePage ví dụ)
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
  return <MainLayout>{children}</MainLayout>;
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
            {/* Mặc định chuyển về /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
          {/* Floating chat pop available when ChatBotProvider is mounted */}
          <ChatPop />
        </ChatBotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
