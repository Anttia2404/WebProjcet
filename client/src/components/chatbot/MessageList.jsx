import React, { useRef, useEffect } from "react";
import MessageBubble from "../common/ChatUI/MessageBubble";

// containerClass: allows callers (e.g. ChatPop) to namespace the container
// so the pop can use its own scrolling rules instead of the page-wide ones.
const MessageList = ({
  conversationId,
  messages = [],
  currentUser = null,
  containerClass = "message-list-content",
}) => {
  // Use only the messages prop; if empty, we'll show the empty placeholder
  const msgs = messages;

  // Ref để tự động cuộn xuống tin nhắn mới nhất
  const endOfMessagesRef = useRef(null);
  // Ref tới container chứa danh sách tin nhắn — ta sẽ scroll container này
  const containerRef = useRef(null);

  // Hàm cuộn xuống dưới — scroll nội bộ của container để không ảnh hưởng viewport
  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      try {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      } catch (e) {
        container.scrollTop = container.scrollHeight;
      }
    } else {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Cuộn xuống dưới mỗi khi danh sách tin nhắn thay đổi (tin nhắn mới)
    scrollToBottom();
  }, [msgs]);
  if (!msgs || msgs.length === 0) {
    return (
      <div className={`${containerClass} empty`} ref={containerRef}>
        <div className="empty-placeholder">
          <h1>Chào mừng bạn đến kênh chat FA 🙌</h1>
          <p> Bạn muốn hỏi gì?☺️☺️</p>
        </div>
        <div ref={endOfMessagesRef} />
      </div>
    );
  }

  return (
    <div className={containerClass} ref={containerRef}>
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
