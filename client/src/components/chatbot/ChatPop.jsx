import React, { useState, useEffect } from "react";
import { useChatBot } from "../../context/ChatBotContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
// DarkDottedBackground is intentionally NOT used in ChatPop to avoid full-page layout

const ChatPop = ({ compact = true }) => {
  const { currentConversationId, messages, newConversation, sendMessage } =
    useChatBot();
  const [open, setOpen] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const { conversations, selectConversation } = useChatBot();

  useEffect(() => {
    // If user opens the pop and there's no conversation selected, create a local one
    if (open && !currentConversationId) {
      newConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  const handleSend = (text) => {
    sendMessage(text);
  };

  return (
    <div className={`chatpop-root ${open ? "open" : "closed"}`}>
      {!open && (
        <button
          className="chatpop-button"
          onClick={toggle}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {open && (
        <div className="chatpop-panel" role="dialog" aria-modal="false">
          <div className="chatpop-header">
            <div className="chatpop-title">AI Assistant</div>
            <div className="chatpop-actions">
              <button
                className="chatpop-plus"
                title="Tạo cuộc trò chuyện mới"
                onClick={() => {
                  newConversation();
                  setShowConversations(false);
                }}
              >
                +
              </button>
              <button
                className="chatpop-list-toggle"
                title="Lịch sử"
                onClick={() => setShowConversations((v) => !v)}
              >
                ☰
              </button>
              <button
                className="chatpop-close"
                onClick={toggle}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          {showConversations && (
            <div className="chatpop-conv-list">
              {conversations && conversations.length > 0 ? (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    className={`chatpop-conv-item ${
                      String(c.id) === String(currentConversationId)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      selectConversation(c.id);
                      setShowConversations(false);
                    }}
                  >
                    {c.title}
                  </button>
                ))
              ) : (
                <div className="chatpop-conv-empty">Chưa có lịch sử</div>
              )}
            </div>
          )}
          <div className="chatpop-body-wrapper">
            <div className="chatpop-body">
              {/* Use a namespaced class so pop uses its own scrolling rules */}
              <MessageList
                messages={messages}
                containerClass="chatpop-message-list-content"
              />
            </div>
          </div>

          <div className="chatpop-footer">
            <MessageInput onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPop;
