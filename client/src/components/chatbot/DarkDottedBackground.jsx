import React from "react";

const DarkDottedBackground = ({ children }) => {
  return (
    // Container chính với nền tối
    <div className="min-h-screen w-full bg-black relative chatbot-bg">
      {/* Midnight Mist */}
      <div
        className="chatbot-bg__overlay absolute inset-0 z-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
        `,
        }}
      />

      {/* Nội dung của bạn sẽ được đặt ở đây */}
      <div className="chatbot-content relative z-10 w-full h-full p-8 text-white">
        {/* 'relative z-10' giúp nội dung nổi lên trên nền lưới (z-0) */}
        {children}
      </div>
    </div>
  );
};

export default DarkDottedBackground;
