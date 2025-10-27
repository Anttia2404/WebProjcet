import React, { useState, useEffect } from "react";
import { useChatBot } from "../../context/ChatBotContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
// Use a compact inner wrapper instead of the full-page DarkDottedBackground

const ChatPop = ({ compact = true }) => {
  const { currentConversationId, messages, newConversation, sendMessage } =
    useChatBot();
  const [open, setOpen] = useState(false);

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
            <button
              className="chatpop-close"
              onClick={toggle}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="chatpop-inner">
            <div className="chatpop-body">
              {/* MessageList knows how to render empty placeholder */}
              <MessageList messages={messages} />
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
