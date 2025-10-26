import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ conversationId, messages = [], currentUser = null }) => {
  // Use only the messages prop; if empty, we'll show the empty placeholder
  const msgs = messages;

  // Ref để tự động cuộn xuống tin nhắn mới nhất
  const endOfMessagesRef = useRef(null);

  // Hàm cuộn xuống dưới
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Cuộn xuống dưới mỗi khi danh sách tin nhắn thay đổi (tin nhắn mới)
    scrollToBottom();
  }, [msgs]);
  if (!msgs || msgs.length === 0) {
    return (
      <div className="message-list-content empty">
        <div className="empty-placeholder">
          <h1>Chào mừng bạn đến kênh chat FA 🙌</h1>
          <p> Bạn muốn hỏi gì?☺️☺️</p>
        </div>
        <div ref={endOfMessagesRef} />
      </div>
    );
  }

  return (
    <div className="message-list-content">
      {msgs.map((message) => (
        <MessageBubble
          key={message.id}
          sender={message.sender || (message.from === "user" ? "user" : "bot")}
          content={message.content || message.text}
          timestamp={message.timestamp}
          isTyping={!!message.typing}
          avatarUrl={
            message.from === "user"
              ? currentUser && currentUser.avatarUrl
                ? currentUser.avatarUrl
                : "/robot.png"
              : "/robot.png"
          }
        />
      ))}
      {/* Phần tử rỗng dùng để cuộn xuống cuối cùng */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
