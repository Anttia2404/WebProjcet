import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChatBot } from "../context/ChatBotContext";
import api from "../services/api";
import DarkDottedBackground from "../components/chatbot/DarkDottedBackground.jsx";
import Header_Chat from "../components/chatbot/Header_Chat.jsx";
import MessageInput from "../components/chatbot/MessageInput.jsx";
import MessageList from "../components/chatbot/MessageList.jsx";
import SideBar_Chat from "../components/chatbot/SideBar_Chat.jsx";
import { Link } from "react-router-dom";
import Suggestions from "../components/chatbot/Suggestions.jsx";

const ChatbotPage = () => {
  const { user: authUser, token } = useAuth();
  const {
    conversations,
    currentConversationId,
    messages,
    loading,
    loadConversations,
    loadMessages,
    selectConversation,
    newConversation,
    sendMessage,
    isCreating,
  } = useChatBot();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    document.body.classList.add("chatbot-full");
    return () => {
      document.body.classList.remove("chatbot-full");
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      if (token && authUser) {
        try {
          const resp = await api.get("/auth/me");
          const profile = resp.data.user;
          const derived = {
            id: profile.id || authUser.id,
            name:
              profile.full_name ||
              profile.fullName ||
              authUser.fullName ||
              authUser.email ||
              "Người dùng",
            avatarUrl: profile.avatar_url || authUser.avatar_url || "robot.png",
          };
          setCurrentUser(derived);
          // ask context to load conversations (context already calls load on auth change,
          // but calling explicitly here ensures immediate load)
          await loadConversations();
        } catch (err) {
          console.warn("/auth/me failed, using token payload as fallback", err);
          // fallback: derive user from token payload if available
          setCurrentUser({
            id: authUser.id,
            name: authUser.fullName || authUser.email,
            avatarUrl: authUser.avatar_url || "robot.png",
          });
          // ensure context clears or loads conversations (will set [] when no token)
          await loadConversations();
        }
      } else {
        // not authenticated: don't use demo data; leave null so UI shows login prompt
        setCurrentUser(null);
        loadConversations();
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authUser]);

  // when context changes the selected conversation, ensure messages are loaded
  useEffect(() => {
    if (!currentConversationId) return;
    if (isCreating) return; // skip loading while we're creating/sending initial message
    if (String(currentConversationId).startsWith("local-")) {
      // local conversation: context already sets messages to [] for local convs
      return;
    }
    loadMessages(currentConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId]);

  const handleSelectConversation = (conversationId) => {
    selectConversation(conversationId);
  };

  const handleSend = (text) => {
    sendMessage(text);
  };

  const handleNewChat = () => {
    newConversation();
  };

  return (
    <DarkDottedBackground>
      <div className="container-chat bg-transparent">
        <SideBar_Chat
          currentUser={currentUser}
          conversations={conversations}
          selectedId={currentConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />

        <div className="chat">
          <Header_Chat />

          <main className={messages.length === 0 ? "main empty" : "main"}>
            {!token || !currentUser ? (
              <div className="empty-state">
                <h3>Vui lòng đăng nhập để sử dụng Chatbot</h3>
                <p>
                  Bạn cần tài khoản để lưu lịch sử và truy cập các cuộc trò
                  chuyện của mình.
                </p>
                <Link to="/login" className="btn">
                  Đăng nhập
                </Link>
              </div>
            ) : (
              <>
                <MessageList messages={messages} currentUser={currentUser} />

                <MessageInput
                  onSend={handleSend}
                  isCentered={messages.length === 0}
                />

                {messages.length === 0 && (
                  <Suggestions onPick={(text) => handleSend(text)} />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </DarkDottedBackground>
  );
};

export default ChatbotPage;
