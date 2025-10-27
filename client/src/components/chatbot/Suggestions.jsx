import React from "react";

const defaultSuggestions = [
  "Tôi muốn biết về học bổng của trường",
  "Có nên học ở HCMUTE không?",
  "Điểm chuẩn các ngành năm trước là bao nhiêu?",
];

const Suggestions = ({ suggestions = defaultSuggestions, onPick }) => {
  return (
    <div className="suggestions">
      <p className="suggestions-title">✨ Các câu hỏi phổ biến</p>
      <div className="suggestions-list">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="suggestion-chip"
            onClick={() => onPick && onPick(s)}
            type="button"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
