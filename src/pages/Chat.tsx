import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { Avatar } from "flowbite-react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const usersAndGroups = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "See you later!",
      time: "2:30 PM",
      online: true,
    },
    {
      id: 2,
      name: "Project Group",
      lastMessage: "Meeting at 5 PM",
      time: "1:15 PM",
      online: false,
    },
    {
      id: 3,
      name: "Jane Smith",
      lastMessage: "Got it, thanks!",
      time: "12:00 PM",
      online: true,
    },
    {
      id: 4,
      name: "Team A",
      lastMessage: "Let's wrap up!",
      time: "11:30 AM",
      online: false,
    },
  ];

  const messages = [
    { id: 1, sender: "John Doe", content: "Hello!" },
    { id: 2, sender: "You", content: "Hi there!" },
    { id: 3, sender: "John Doe", content: "How are you?" },
    { id: 1, sender: "John Doe", content: "Hello!" },
    { id: 2, sender: "You", content: "Hi there!" },
    { id: 3, sender: "John Doe", content: "How are you?" },
    { id: 1, sender: "John Doe", content: "Hello!" },
    { id: 2, sender: "You", content: "Hi there!" },
    {
      id: 3,
      sender: "John Doe",
      content:
        "How are you? what us are u feeling tired or not please tell me bro?",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-md border border-gray-300  focus:outline-none focus:border-blue-500 mb-4"
        />
        <div className="space-y-4">
          {usersAndGroups.map((user: any) => (
            <div
              key={user.id}
              onClick={() => setSelectedChat(user.name)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                selectedChat === user.name ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <Avatar img="https://via.placeholder.com/40" rounded={true} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {user.lastMessage}
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      user.online ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={user.online ? "Online" : "Offline"}
                  ></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-blue-600 text-white flex items-center px-4 shadow-lg">
          <h2 className="text-xl font-semibold">
            {selectedChat || "Select a chat to start messaging"}
          </h2>
        </div>

        {/* Messages Section */}
        <div
          className="flex-1 p-4 overflow-y-auto bg-white"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          {selectedChat ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : ""
                } mb-3`}
              >
                <div
                  className={`p-4 rounded-lg shadow-sm max-w-xs ${
                    message.sender === "You"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {message.sender === "You" ? "You" : message.sender}
                  </p>
                  <p className="mt-1">{message.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Select a user or group to view messages.
            </p>
          )}
        </div>

        {/* Message Input Section */}
        {selectedChat && (
          <div className="h-16 border-t flex items-center px-4 space-x-3 bg-white">
            <button
              className="p-2 hover:bg-gray-200 rounded-full transition"
              title="Upload File"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              title="Send Message"
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
