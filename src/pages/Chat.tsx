import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Avatar } from "flowbite-react";
import { Paperclip, PlusCircle, Send } from "lucide-react";
import { getChats } from "../redux/chatSlice";

const socket = io("http://localhost:4000", { autoConnect: false });

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const { token, user } = useSelector((state: any) => state?.auth);
  const { chats } = useSelector((state: any) => state.chat);

  const dispatch = useDispatch();

  // Fetch all users
  const getALLUsers = async () => {
    try {
      const resp = await axios.get("/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(resp?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch messages for the selected chat
  const getMessages = async () => {
    try {
      const resp = await axios.get(`/message/${selectedChat}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(resp?.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Initialize socket connection and listeners
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      console.error("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    getALLUsers();
  }, [token]);

  // Join the selected chat room and fetch messages
  useEffect(() => {
    if (selectedChat) {
      socket.emit("joinChat", { chatId: selectedChat });
      getMessages();

      return () => {
        socket.emit("leaveRoom", selectedChat);
      };
    }
  }, [selectedChat]);

  // Dispatch to fetch all chats
  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!socket.connected) {
      console.error("Socket not connected");
      return;
    }

    if (messageInput.trim()) {
      const newMessage = {
        chat: selectedChat,
        content: messageInput,
        sender: user._id,
        isGroupChat: false,
      };

      try {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("sendMessage", newMessage);
        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle adding a user to the contact list
  const addToList = async (userId: string) => {
    try {
      const resp = await axios.post(
        "/chat/create/",
        {
          isGroupChat: false,
          groupName: "",
          otherUser: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added to contact list:", resp.data);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border p-4 overflow-auto">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
        />
        {isPending ? (
          <div className="h-[150px] flex justify-center items-center">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {chats?.map((chat: any) => (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat._id);
                  setSelectedUser(
                    chat.isGroupChat
                      ? chat.groupName
                      : chat.participants.find((p: any) => p._id !== user._id)
                  );
                }}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                  selectedChat === chat._id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <Avatar img="https://via.placeholder.com/40" rounded />
                <div className="flex-1">
                  <span className="font-semibold">
                    {chat.isGroupChat
                      ? chat.groupName
                      : chat.participants
                          .filter((p: any) => p._id !== user._id)
                          .map((p: any) => p.username)
                          .join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={20} className="mr-2" />
            Add User to Contact List
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-blue-600 text-white flex items-center px-4 shadow-lg">
          {selectedChat ? (
            <div>
              <h3>{selectedUser?.username || "Group Name"}</h3>
              <p className="text-sm font-medium">Online</p>
            </div>
          ) : (
            <h2 className="text-xl font-semibold">
              Select a chat to start messaging
            </h2>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {selectedChat ? (
            messages?.map((message: any, idx: number) => (
              <div
                key={idx}
                className={`flex ${
                  message.sender === user._id ? "justify-end" : ""
                } mb-3`}
              >
                <div
                  className={`p-4 rounded-lg shadow-sm max-w-xs ${
                    message.sender === user._id
                      ? "bg-blue-100 text-right"
                      : "bg-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {message.sender === user._id
                      ? "You"
                      : selectedUser?.username}
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
        {selectedChat && (
          <div className="h-16 border-t flex items-center px-4 space-x-3 bg-white">
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-full"
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add User</Modal.Header>
        <Modal.Body>
          {users.map((u: any) => (
            <div
              key={u._id}
              className="flex items-center justify-between py-2 px-4 rounded-md bg-gray-100 mb-2"
            >
              <div className="flex items-center space-x-3">
                <Avatar img="https://via.placeholder.com/40" rounded />
                <span className="font-semibold">{u.username}</span>
              </div>
              <Button
                onClick={() => addToList(u._id)}
                size="xs"
                className="bg-blue-600 text-white"
              >
                Add
              </Button>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Chat;
