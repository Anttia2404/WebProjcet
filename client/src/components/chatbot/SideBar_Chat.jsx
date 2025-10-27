import { useNavigate } from "react-router-dom";

const SideBar_Chat = ({
  currentUser,
  conversations,
  selectedId,
  onSelect,
  onNewChat,
}) => {
  const navigate = useNavigate();
  if (!currentUser) {
    return (
      <div className="sidebar loading">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="sidebar-chat">
      {/* Logo */}
      <div className="header-sidebar">
        <img
          className="chatlogo-ktx"
          src="./src/assets/images/logo_ktx.png"
          alt="logo-ktx"
          title="Trang chủ"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/home")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/home");
          }}
        />
      </div>
      {/* Nút thêm chat */}
      <button className="btn-new-chat" onClick={onNewChat}>
        <span>+</span> New
      </button>

      <p className="text-history">
        <strong>Lịch sử</strong>
      </p>
      {/* Danh sách lịch sử các cuộc trò chuyện */}
      <nav className="conversation-list">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            // Dùng class điều kiện cho mục đang chọn
            className={`conv-item ${
              selectedId === conv.id ? "conv-item-active" : ""
            }`}
          >
            {/* Tiêu đề cuộc trò chuyện */}
            <p className="conv-title">{conv.title}</p>
            {/* Thời gian */}
            <p className="conv-timestamp">{conv.timestamp}</p>
          </button>
        ))}
      </nav>

      <footer className="footer-sidebar">
        <div className="avatar-user">
          <img src={currentUser.avatarUrl} alt={currentUser.name} />
          <div className="text-user">
            <span>
              <strong>{currentUser.name}</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SideBar_Chat;
