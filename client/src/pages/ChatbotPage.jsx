import React, { useState, useEffect } from "react";

import DarkDottedBackground from "../components/chatbot/DarkDottedBackground.jsx";
import Header_Chat from "../components/chatbot/Header_Chat.jsx";
import MessageInput from "../components/chatbot/MessageInput.jsx";
import MessageList from "../components/chatbot/MessageList.jsx";
import SideBar_Chat from "../components/chatbot/SideBar_Chat.jsx";
import Suggestions from "../components/chatbot/Suggestions.jsx";

// Dữ liệu mẫu
const mockConversations = [
  {
    id: "c1",
    title: "Phát triển Chatbot bằng AI",
    timestamp: "10/10/2025",
  },
  {
    id: "c2",
    title: "Lỗi không thấy background",
    timestamp: "09/10/2025",
  },
  {
    id: "c3",
    title: "Hỏi về cú pháp CSS thuần",
    timestamp: "08/10/2025",
  },
  {
    id: "c4",
    title: "Hỏi về cú pháp CSS thuần",
    timestamp: "08/10/2025",
  },
  {
    id: "c5",
    title: "Hỏi về cú pháp CSS thuần",
    timestamp: "08/10/2025",
  },
];

// Dữ liệu người dùng hiện tại (Current User)
const mockCurrentUser = {
  id: "u123",
  name: "Nguyễn Văn A",
  avatarUrl: "robot.png", // Có thể là null
};

const ChatbotPage = () => {
  // State lưu trữ danh sách các cuộc trò chuyện
  const [conversations, setConversations] = useState([]);
  // State lưu trữ ID của cuộc trò chuyện đang được chọn
  const [currentConversationId, setCurrentConversationId] = useState("c1");

  // State lưu trữ thông tin người dùng
  const [currentUser, setCurrentUser] = useState(null);

  // Bước 1: Tải danh sách cuộc trò chuyện khi component được mount
  useEffect(() => {
    // Bước 1: Tải thông tin người dùng
    // Trong thực tế: fetch('/api/user/me').then(...)
    setCurrentUser(mockCurrentUser);

    // Bước 2: Tải danh sách cuộc trò chuyện
    // Trong thực tế, bạn sẽ gọi fetch() API ở đây
    // Ví dụ: fetch('/api/conversations').then(res => setConversations(res.json()));
    setConversations(mockConversations); // Dùng dữ liệu mẫu
  }, []);

  // Hàm xử lý khi người dùng chọn một mục trong sidebar
  const handleSelectConversation = (conversationId) => {
    console.log(`Đã chọn cuộc trò chuyện: ${conversationId}`);
    setCurrentConversationId(conversationId);
  };

  // State cho messages trong cuộc trò chuyện hiện tại (simple client-side)
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    if (!text || text.trim() === "") return;
    const newMsg = {
      id: Date.now().toString(),
      text: text.trim(),
      from: "user",
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleNewChat = () => {
    // reset messages để vào trạng thái 'mới' — input sẽ nằm giữa
    setMessages([]);
  };

  return (
    <DarkDottedBackground>
      <div className="container bg-transparent">
        {/* Phần SideBar bên trái */}
        <SideBar_Chat
          currentUser={currentUser}
          conversations={conversations}
          selectedId={currentConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />

        {/* Phần chat*/}
        <div className="chat">
          {/* Phần Header */}
          <Header_Chat />
          <main className={messages.length === 0 ? "main empty" : "main"}>
            {/* Phần hiển thị tin nhắn */}
            <MessageList messages={messages} />

            {/* Phần nhập tin nhắn */}
            <MessageInput onSend={handleSend} />

            {/* Khi chưa có tin nhắn, hiển thị gợi ý phía dưới input */}
            {messages.length === 0 && (
              <Suggestions
                onPick={(text) => {
                  // gửi trực tiếp khi người dùng chọn gợi ý
                  handleSend(text);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </DarkDottedBackground>
  );
};

export default ChatbotPage;
