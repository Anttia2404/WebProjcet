import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const ChatBotContext = createContext(null);

export const ChatBotProvider = ({ children }) => {
  const { token, user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return setMessages([]);
    // local temp convs have ids starting with local-
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

  const selectConversation = useCallback(
    (conversationId) => {
      setCurrentConversationId(conversationId);
      loadMessages(conversationId);
    },
    [loadMessages]
  );

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

  const sendMessage = useCallback(
    async (text) => {
      if (!text || text.trim() === "") return;
      const trimmed = text.trim();

      // optimistic UI: add user message and typing placeholder
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
        // ensure conversation exists on server: if temp or null, create it now
        let convId = currentConversationId;
        if (convId && String(convId).startsWith("local-")) {
          const tempId = convId;
          // mark we're creating a server conversation to avoid other effects
          setIsCreating(true);
          const { createConversation } = await import(
            "../services/conversationService"
          );
          const resp = await createConversation({
            title: trimmed.slice(0, 120),
          });
          const serverConv = resp.data.conversation;
          setConversations((prev) => [
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
          // mark we're creating a server conversation to avoid other effects
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
        }

        const { createMessage } = await import(
          "../services/conversationService"
        );
        await createMessage(convId, { sender: "user", content: trimmed });

        const { postChatMessage } = await import("../services/apichat.js");
        const resp = await postChatMessage(trimmed, history);

        if (resp && resp.success) {
          const botText = resp.content || "(Không có phản hồi)";
          const botMsg = {
            id: `bot-${Date.now()}`,
            text: botText,
            from: "bot",
          };
          setMessages((prev) =>
            prev.map((m) => (m.id === typingId ? botMsg : m))
          );
          await createMessage(convId, {
            sender: "bot",
            content: botText,
            gemini_history_json: resp.updatedHistory || null,
          });
          if (resp.updatedHistory) setHistory(resp.updatedHistory);
        } else {
          const botErr = {
            id: `bot-err-${Date.now()}`,
            text: (resp && resp.error) || "Lỗi khi lấy phản hồi từ server.",
            from: "bot",
          };
          setMessages((prev) =>
            prev.map((m) => (m.id === typingId ? botErr : m))
          );
        }
      } catch (err) {
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
        // done with creating/sending, allow message loader to run normally
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
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = () => {
  return useContext(ChatBotContext);
};

export default ChatBotContext;
