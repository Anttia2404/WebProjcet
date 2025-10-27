import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

// Tạo ngữ cảnh (Context) để chia sẻ trạng thái ChatBot
const ChatBotContext = createContext(null);

export const ChatBotProvider = ({ children }) => {
  const { token, user } = useAuth(); // Khai báo các trạng thái (State) chính

  const [conversations, setConversations] = useState([]); // Danh sách các cuộc trò chuyện
  const [currentConversationId, setCurrentConversationId] = useState(null); // ID của cuộc trò chuyện đang hiển thị
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn của cuộc trò chuyện hiện tại
  const [history, setHistory] = useState([]); // Lịch sử trò chuyện (dùng cho mô hình AI)
  const [isCreating, setIsCreating] = useState(false); // Trạng thái đang tạo cuộc trò chuyện trên server
  const [loading, setLoading] = useState(false); // Trạng thái đang tải tin nhắn
  /**
   * Tải danh sách các cuộc trò chuyện đã lưu của người dùng từ server.
   * Cập nhật danh sách conversations và tự động chọn cuộc trò chuyện đầu tiên nếu chưa có.
   */

  const loadConversations = useCallback(async () => {
    if (!token) return setConversations([]);
    try {
      const { listConversations } = await import(
        "../services/conversationService"
      );
      const resp = await listConversations();
      const convs = (resp.data.conversations || []).map((c) => ({
        id: c.id,
        title: c.title || "Cuộc trò chuyện",
        timestamp: c.updated_at || c.created_at,
      }));
      setConversations(convs);
      if (convs.length > 0 && !currentConversationId) {
        setCurrentConversationId(convs[0].id);
      }
    } catch (err) {
      console.warn("Failed to load conversations", err);
      setConversations([]);
    }
  }, [token, currentConversationId]);

  // Side effect: Gọi loadConversations khi token hoặc user thay đổi (khi đăng nhập/xuất)
  useEffect(() => {
    loadConversations();
  }, [token, user]);
  /**
   * Tải tin nhắn cho một cuộc trò chuyện cụ thể (conversationId) từ server.
   * Cập nhật danh sách messages. Bỏ qua nếu là cuộc trò chuyện tạm thời (local-).
   */

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return setMessages([]); // Bỏ qua nếu là cuộc trò chuyện tạm thời (ID bắt đầu bằng local-)
    if (String(conversationId).startsWith("local-")) {
      setMessages([]);
      return;
    }
    setLoading(true);
    try {
      const { listMessages } = await import("../services/conversationService");
      const resp = await listMessages(conversationId);
      const msgs = (resp.data.messages || []).map((m) => ({
        id: m.id.toString(),
        text: m.content,
        from: m.sender === "user" ? "user" : "bot",
        timestamp: m.created_at,
      }));
      setMessages(msgs);
    } catch (err) {
      console.error("Không thể tải tin nhắn", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);
  /**
   * Chọn một cuộc trò chuyện mới.
   * Đặt currentConversationId và gọi loadMessages để hiển thị tin nhắn.
   */

  const selectConversation = useCallback(
    (conversationId) => {
      setCurrentConversationId(conversationId);
      loadMessages(conversationId);
    },
    [loadMessages]
  );
  /**
   * Tạo một cuộc trò chuyện tạm thời mới trên giao diện (UI).
   * Thêm cuộc trò chuyện tạm thời (có id bắt đầu bằng 'local-') vào danh sách và đặt nó làm cuộc trò chuyện hiện tại.
   */

  const newConversation = useCallback(() => {
    const tempId = `local-${Date.now()}`;
    const tempConv = {
      id: tempId,
      title: "Cuộc trò chuyện mới",
      timestamp: new Date().toISOString(),
      local: true,
    };
    setConversations((prev) => [tempConv, ...prev]);
    setCurrentConversationId(tempId);
    setMessages([]);
  }, []);
  /**
   * Xử lý việc gửi tin nhắn từ người dùng.
   * Gồm 5 bước chính: (1) Cập nhật UI tạm thời, (2) Tạo cuộc trò chuyện trên Server nếu cần, (3) Lưu tin nhắn User, (4) Gửi API Chatbot, (5) Cập nhật phản hồi Bot.
   */

  const sendMessage = useCallback(
    async (text) => {
      if (!text || text.trim() === "") return;
      const trimmed = text.trim(); // Bước 1: Optimistic UI - Thêm tin nhắn người dùng và tin nhắn "đang gõ" của bot

      const userMsg = {
        id: Date.now().toString(),
        text: trimmed,
        from: "user",
      };
      setMessages((prev) => [...prev, userMsg]);
      const typingId = `bot-typing-${Date.now()}`;
      const typingMsg = { id: typingId, from: "bot", typing: true };
      setMessages((prev) => [...prev, typingMsg]);

      try {
        // Bước 2: Đảm bảo cuộc trò chuyện tồn tại trên server (Nếu là tạm thời hoặc chưa có, tạo mới)
        let convId = currentConversationId;
        if (convId && String(convId).startsWith("local-")) {
          // Logic tạo cuộc trò chuyện trên server từ ID tạm thời
          const tempId = convId;
          setIsCreating(true);
          const { createConversation } = await import(
            "../services/conversationService"
          );
          const resp = await createConversation({
            title: trimmed.slice(0, 120),
          });
          const serverConv = resp.data.conversation;
          setConversations((prev) => [
            // Thay thế cuộc trò chuyện tạm thời bằng cuộc trò chuyện server mới tạo
            {
              id: serverConv.id,
              title: serverConv.title || "Cuộc trò chuyện",
              timestamp: serverConv.updated_at || serverConv.created_at,
            },
            ...prev.filter((c) => c.id !== tempId),
          ]);
          convId = serverConv.id;
          setCurrentConversationId(convId);
        } else if (!convId) {
          // Logic tạo cuộc trò chuyện server mới hoàn toàn nếu chưa có ID nào
          setIsCreating(true);
          const { createConversation } = await import(
            "../services/conversationService"
          );
          const resp = await createConversation({
            title: trimmed.slice(0, 120),
          });
          convId = resp.data.conversation.id;
          setCurrentConversationId(convId);
          setConversations((prev) => [
            {
              id: convId,
              title: resp.data.conversation.title || "Cuộc trò chuyện",
              timestamp:
                resp.data.conversation.updated_at ||
                resp.data.conversation.created_at,
            },
            ...prev,
          ]);
        } // Bước 3: Lưu tin nhắn người dùng vào server

        const { createMessage } = await import(
          "../services/conversationService"
        );
        await createMessage(convId, { sender: "user", content: trimmed }); // Bước 4: Gọi API Chatbot (AI) để lấy phản hồi

        const { postChatMessage } = await import("../services/apichat.js");
        const resp = await postChatMessage(trimmed, history); // Bước 5: Xử lý và cập nhật phản hồi của Bot

        if (resp && resp.success) {
          const botText = resp.content || "(Không có phản hồi)";
          const botMsg = {
            id: `bot-${Date.now()}`,
            text: botText,
            from: "bot",
          };
          // Thay thế tin nhắn "đang gõ" bằng tin nhắn thật của bot
          setMessages((prev) =>
            prev.map((m) => (m.id === typingId ? botMsg : m))
          );
          // Lưu tin nhắn bot và lịch sử mới vào server
          await createMessage(convId, {
            sender: "bot",
            content: botText,
            gemini_history_json: resp.updatedHistory || null,
          });
          if (resp.updatedHistory) setHistory(resp.updatedHistory);
        } else {
          // Xử lý lỗi từ API chatbot
          const botErr = {
            id: `bot-err-${Date.now()}`,
            text: (resp && resp.error) || "Lỗi khi lấy phản hồi từ server.",
            from: "bot",
          };
          // Thay thế tin nhắn "đang gõ" bằng tin nhắn lỗi
          setMessages((prev) =>
            prev.map((m) => (m.id === typingId ? botErr : m))
          );
        }
      } catch (err) {
        // Xử lý lỗi kết nối chung
        const botErr = {
          id: `bot-err-${Date.now()}`,
          text: "Không thể kết nối tới server chat.",
          from: "bot",
        };
        setMessages((prev) =>
          prev.map((m) => (m.id === typingId ? botErr : m))
        );
        console.error(err);
      } finally {
        // Kết thúc quá trình tạo/gửi, cho phép message loader chạy lại bình thường
        setIsCreating(false);
      }
    },
    [currentConversationId, history]
  );

  return (
    <ChatBotContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        history,
        loading,
        loadConversations,
        loadMessages,
        isCreating,
        selectConversation,
        newConversation,
        sendMessage,
      }}
    >
            {children}   {" "}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = () => {
  return useContext(ChatBotContext);
};

export default ChatBotContext;
