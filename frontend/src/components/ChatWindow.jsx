import React from "react";

const ChatWindow = ({ user }) => {
  return (
    <div className="chat-window border rounded-md p-4">
      <h2 className="font-bold">{user.name}'s Chat</h2>
      {/* Chat messages will go here */}
      <div className="messages">
        {/* Example message */}
        <div className="message">Hello, {user.name}!</div>
      </div>
    </div>
  );
};

export default ChatWindow; 