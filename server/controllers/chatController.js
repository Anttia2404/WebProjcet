import { GoogleGenAI } from "@google/genai";

// Khởi tạo AI Client bằng API Key từ biến môi trường
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log(process.env.GEMINI_API_KEY);
/**
 * Xử lý yêu cầu chat, duy trì lịch sử và nhận phản hồi từ Gemini.
 * @param {object} req - Đối tượng Request (chứa message và history từ frontend)
 * @param {object} res - Đối tượng Response
 */
export const handleChat = async (req, res) => {
  // Lấy tin nhắn người dùng và lịch sử AI (nếu có) từ body request
  const { message, history } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, error: "Thiếu nội dung tin nhắn." });
  }

  try {
    // 1. Khởi tạo phiên chat với model và lịch sử cũ
    const chat = ai.chats.create({
      model: "gemini-2.5-flash", // Model tối ưu cho tốc độ và chat
      history: history || [], // Sử dụng lịch sử cũ hoặc mảng rỗng nếu là tin nhắn đầu tiên
    });

    // 2. Gửi tin nhắn mới
    const response = await chat.sendMessage({ message: message });

    // 3. Lấy lịch sử CẬP NHẬT (bao gồm tin nhắn mới nhất)
    const updatedHistory = await chat.getHistory();

    // 4. Trả về phản hồi và lịch sử mới cho frontend
    res.json({
      success: true,
      // Phản hồi của Bot
      content: response.text,
      // Lịch sử mới mà frontend cần lưu lại để gửi trong lần chat tiếp theo
      updatedHistory: updatedHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi API Gemini:", error);
    res
      .status(500)
      .json({ success: false, error: "Lỗi Server hoặc API Gemini." });
  }
};
