const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" }); // nhớ load .env
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// Debug để chắc chắn key có giá trị
console.log("🔑 Gemini API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(userMessage);
    const aiResponse = result.response.text();

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ reply: "❌ Lỗi khi gọi AI." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server chạy tại http://localhost:3000");
});
