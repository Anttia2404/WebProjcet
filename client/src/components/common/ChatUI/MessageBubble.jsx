import React from "react";

// Escape HTML to prevent XSS when inserting generated markup
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Very small markdown-like renderer: handles headings (#/##/###), bold (**text**),
// italics (*text*), links [text](url), unordered lists starting with '* ', and
// paragraphs/line breaks. We escape HTML first then apply transformations.
function renderMarkdown(raw) {
  if (raw == null) return "";
  const escaped = escapeHtml(String(raw));

  const lines = escaped.split(/\r?\n/);
  let inList = false;
  const out = [];

  const inlineTransforms = (s) =>
    s
      // links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // italics (single asterisks)
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line === "---") {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push("<hr />");
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    const h2 = line.match(/^##\s+(.*)$/);
    const h1 = line.match(/^#\s+(.*)$/);
    const li = line.match(/^\*\s+(.*)$/);

    if (h3) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h3>${inlineTransforms(h3[1])}</h3>`);
    } else if (h2) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h2>${inlineTransforms(h2[1])}</h2>`);
    } else if (h1) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h1>${inlineTransforms(h1[1])}</h1>`);
    } else if (li) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineTransforms(li[1])}</li>`);
    } else if (line === "") {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      // preserve paragraph break
      out.push("<br/>");
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<p>${inlineTransforms(line)}</p>`);
    }
  }

  if (inList) out.push("</ul>");

  return out.join("");
}

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
          <div
            className="message-content message-content-html"
            // Render a small, safe markdown-like subset: headings, bold, italics,
            // lists, links and paragraphs. We escape HTML first to avoid XSS.
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
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
