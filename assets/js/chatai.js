document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-form");
  const sendBtn = document.getElementById("send-button");

  function sendMessage() {
    if (input.value.trim() !== "") {
      // Tạo thẻ tin nhắn
      const msg = document.createElement("div");
      msg.textContent = input.value;
      messages.appendChild(msg);

      // Sau khi gửi -> input xuống dưới
      chatInput.classList.add("active");

      input.value = "";
    }
  }

  // Bấm nút gửi
  sendBtn.addEventListener("click", sendMessage);

  // Nhấn Enter để gửi
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
