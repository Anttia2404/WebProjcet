import React from "react";

const MessageBubble = ({
  sender,
  content,
  timestamp,
  isTyping = false,
  avatarUrl,
}) => {
  const isUser = sender === "user";
  const bubbleClass = isUser ? "message-user" : "message-bot";
  const alignmentClass = isUser ? "justify-end" : "justify-start";

  return (
    <div className={`message-row ${alignmentClass}`}>
      {/* Avatar bên trái cho bot */}
      {!isUser && (
        <div className="message-avatar">
          <img src={avatarUrl || "/robot.png"} alt="AI" />
        </div>
      )}

      <div
        className={`message-bubble ${bubbleClass} ${isTyping ? "typing" : ""}`}
      >
        {isTyping ? (
          <div className="typing-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p className="message-content">{content}</p>
        )}
        <span className="message-timestamp">{timestamp}</span>
      </div>

      {/* Avatar bên phải cho user (nếu có) */}
      {isUser && (
        <div className="message-avatar message-avatar-right">
          <img src={avatarUrl || "/robot.png"} alt="You" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
