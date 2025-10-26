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
    setCurrentUser(mockCurrentUser);
    setConversations(mockConversations);
  }, []);

  // Hàm xử lý khi người dùng chọn một mục trong sidebar
  const handleSelectConversation = (conversationId) => {
    console.log(`Đã chọn cuộc trò chuyện: ${conversationId}`);
    setCurrentConversationId(conversationId);
  };

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // gọi server -> Gemini và cập nhật UI
  const handleSend = async (text) => {
    if (!text || text.trim() === "") return;

    const trimmed = text.trim();

    // 1) Thêm tin nhắn người dùng vào UI ngay lập tức
    const userMsg = {
      id: Date.now().toString(),
      text: trimmed,
      from: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    // 1.5) Thêm placeholder 'typing' của bot để hiển thị animation
    const typingId = `bot-typing-${Date.now()}`;
    const typingMsg = {
      id: typingId,
      from: "bot",
      typing: true,
    };
    setMessages((prev) => [...prev, typingMsg]);

    // 2) Gọi server để lấy phản hồi từ Gemini
    try {
      // lazy-import để tránh vòng phụ thuộc khi chưa có file
      const { postChatMessage } = await import("../services/apichat.js");

      const resp = await postChatMessage(trimmed, history);

      if (resp && resp.success) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          text: resp.content || "(Không có phản hồi)",
          from: "bot",
        };

        // thay thế placeholder typing bằng phản hồi thực
        setMessages((prev) =>
          prev.map((m) => (m.id === typingId ? botMsg : m))
        );

        // lưu lại history mới để tái sử dụng trong các lần gọi tiếp theo
        if (resp.updatedHistory) setHistory(resp.updatedHistory);
      } else {
        const botErr = {
          id: `bot-err-${Date.now()}`,
          text: (resp && resp.error) || "Lỗi khi lấy phản hồi từ server.",
          from: "bot",
        };
        setMessages((prev) =>
          prev.map((m) => (m.id === typingId ? botErr : m))
        );
      }
    } catch (err) {
      const botErr = {
        id: `bot-err-${Date.now()}`,
        text: "Không thể kết nối tới server chat.",
        from: "bot",
      };
      setMessages((prev) => prev.map((m) => (m.id === typingId ? botErr : m)));
      console.error(err);
    }
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
            {messages.length > 0 && (
              <MessageList messages={messages} currentUser={currentUser} />
            )}

            {/* Phần nhập tin nhắn */}
            <MessageInput
              onSend={handleSend}
              isCentered={messages.length === 0}
            />

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
