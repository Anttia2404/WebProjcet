document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    // Thêm tin nhắn người dùng vào khung chat
    appendMessage("user-message", message);
    chatInput.value = "";

    // Gọi AI để lấy phản hồi
    appendMessage("ai-message", "⏳ Đang suy nghĩ..."); // loading message
    const reply = await getAIResponse(message);

    // Thêm phản hồi AI thật sự
    appendMessage("ai-message", "🤖 " + reply);
  });

  function appendMessage(type, text) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Hàm gọi backend Node.js
  async function getAIResponse(userMessage) {
    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      return data.reply || "⚠️ AI không trả lời được.";
    } catch (err) {
      console.error(err);
      return "❌ Lỗi kết nối tới AI server.";
    }
  }
});
