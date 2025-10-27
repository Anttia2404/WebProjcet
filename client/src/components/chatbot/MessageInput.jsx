import React, { useState, useRef, useEffect } from "react";

const MessageInput = ({ onSend }) => {
  // State quản lý nội dung tin nhắn
  const [message, setMessage] = useState("");

  // Ref để truy cập trực tiếp đến DOM element (textarea)
  const textareaRef = useRef(null);

  // Xử lý sự kiện thay đổi nội dung
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // Logic Tự động Điều chỉnh Chiều cao
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 1. Đặt chiều cao về auto để tính lại chiều cao dựa trên nội dung
      textarea.style.height = "auto";

      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]); // Chạy lại mỗi khi nội dung 'message' thay đổi

  // Xử lý gửi tin nhắn
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    // Gọi callback lên parent
    if (onSend) onSend(message);

    // Reset sau khi gửi
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto"; // Reset chiều cao sau khi gửi
  };

  return (
    <form className="chat-input-area" onSubmit={handleSubmit}>
      <div className="chat-input">
        <button className="input-button input-add">+</button>
        <textarea
          ref={textareaRef} // Gán ref
          className="input-field"
          placeholder="Nhập tin nhắn..."
          rows={1} // Luôn bắt đầu với 1 dòng
          value={message}
          onChange={handleChange}
        />
        <button type="submit" className="input-button input-submit">
          ➣
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
