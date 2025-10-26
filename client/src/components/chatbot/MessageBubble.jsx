import React from "react";

const MessageBubble = ({ sender, content, timestamp }) => {
  // 1. Xác định người gửi để căn chỉnh và chọn màu nền
  const isUser = sender === "user";

  // 2. Gán class để CSS xử lý căn chỉnh và màu sắc
  const bubbleClass = isUser ? "message-user" : "message-bot";
  const alignmentClass = isUser ? "justify-end" : "justify-start";

  return (
    // message-row: Dùng Flexbox để căn chỉnh toàn bộ bong bóng tin nhắn qua trái/phải
    <div className={`message-row ${alignmentClass}`}>
      {/* message-bubble: Phần chứa nội dung và màu nền */}
      <div className={`message-bubble ${bubbleClass}`}>
        <p className="message-content">{content}</p>
        <span className="message-timestamp">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
