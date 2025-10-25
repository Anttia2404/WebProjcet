import DarkDottedBackground from "../components/chatbot/DarkDottedBackground.jsx";
import Header_Chat from "../components/chatbot/Header_Chat.jsx";
import MessageInput from "../components/chatbot/MessageInput.jsx";
import MessageList from "../components/chatbot/MessageList.jsx";
import SideBar_Chat from "../components/chatbot/SideBar_Chat.jsx";

const ChatbotPage = () => {
  return (
    <DarkDottedBackground>
      <div className="container flex h-screen bg-transparent">
        {/* Phần SideBar bên trái */}
        <SideBar_Chat />

        {/* Phần chat*/}
        <div className="chat flex flex-col flex-1">
          {/* Phần Header */}
          <Header_Chat />
          <main>
            {/* Phần hiển thị tin nhắn */}
            <MessageList />

            {/* Phần nhập tin nhắn */}
            <MessageInput />
          </main>
        </div>
      </div>
    </DarkDottedBackground>
  );
};

export default ChatbotPage;
