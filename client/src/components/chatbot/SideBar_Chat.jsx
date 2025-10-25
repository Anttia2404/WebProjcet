const SideBar_Chat = () => {
  return (
    <div className="sidebar-chat">
      {/* Logo */}
      <div className="header-sidebar">
        <img className="logo-robot" src="robot.png" alt="ai_robot" />
      </div>
      {/* Nút thêm chat */}
      <button className="btn-new-chat">
        <span>+</span> New
      </button>
      {/* Danh sách lịch sử các cuộc trò chuyện */}
    </div>
  );
};

export default SideBar_Chat;
