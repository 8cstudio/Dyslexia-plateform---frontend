import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Avatar, TextInput } from "flowbite-react";
import { Paperclip, PlusCircle, Send } from "lucide-react";
import { getChats } from "../redux/chatSlice";
import { HiUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";

const socket = io("http://localhost:4000", { autoConnect: false });

const Chat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const { token, user } = useSelector((state: any) => state.auth);
  const { chats } = useSelector((state: any) => state.chat);
  const [groupName, setGroupName] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddUser = async () => {
    try {
      const resp = await axios.post("/user/add", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => [...prev, resp.data.user]);
      setNewUser({ username: "", email: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Create new group
  const handleCreateGroup = async () => {
    try {
      const resp = await axios.post(
        "/chat/create",
        { groupName, members: selectedUsers, isGroupChat: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(getChats()); // Refresh chats list
      setGroupName("");
      setSelectedUsers([]);
      setIsGroupModalOpen(false);
      toast.success(resp.data?.message);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all users
  const getALLUsers = async () => {
    try {
      const resp = await axios.get("/user/", {
        headers: { Authorization: `Bearer ${token}` },
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
      if (selectedChat) {
        setMessages((prevMessages) => [...prevMessages, message]);
        const audio = new Audio("/sound/notif.mp3");
        audio.play();
      }
    });

    socket.on("disconnect", () => {
      console.error("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const textColor = localStorage.getItem("textColor");

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
        //  setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("sendMessage", newMessage);
        const audio = new Audio("/sound/burbuja.mp3");
        audio.play();
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
                      ? { username: chat.groupName }
                      : chat.participants.find((p: any) => p._id !== user._id)
                  );
                }}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                  selectedChat === chat._id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  <Avatar
                    img="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                    rounded
                  />
                  <span className="w-[15px] top-0 right-0 border-2 absolute border-white h-[15px] rounded-full bg-green-500"></span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold">
                    {chat.isGroupChat
                      ? chat.groupName
                      : chat.participants
                          .filter((p: any) => p._id !== user._id)
                          .map((p: any) => p.username)
                          .join(", ")}
                  </span>
                  <p className="text-[13px] text-gray-500 truncate mt-2">
                    Last message here...
                  </p>
                </div>
                <span className="text-sm text-gray-400">Online</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 mb-2"
          >
            <PlusCircle size={20} className="mr-2" />
            Add User
          </Button>
          <Button
            onClick={() => setIsGroupModalOpen(true)}
            className="w-full text-white bg-green-600 hover:bg-green-700"
          >
            <HiUserGroup size={20} className="mr-2" />
            Create Group
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-blue-600 text-white flex items-center px-4 shadow-lg">
          {selectedChat ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src=""
                  className="h-[40px] w-[40px]  rounded-full"
                  alt=""
                />
                <span className="w-[15px] top-0 right-0 border-2 absolute border-white h-[15px] rounded-full bg-green-500"></span>
              </div>
              <div>
                <h3>{selectedUser?.username || "Group Name"}</h3>
                <p className="text-sm font-medium">Online</p>
              </div>
            </div>
          ) : (
            <h2
              // style={{ color: `${textColor}` }}
              className="text-xl font-semibold"
            >
              Select a chat to start messaging
            </h2>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {selectedChat ? (
            messages.map((message: any, idx: number) => (
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
          <div ref={messagesEndRef} />
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

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Add New User</Modal.Header>
        <Modal.Body>
          <TextInput placeholder="Username" />
          <TextInput placeholder="Email" />
        </Modal.Body>
        <Modal.Footer>
          <Button>Add User</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
        <Modal.Header>Create New Group</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div>
            {users.map((u: any) => (
              <label key={u._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={u._id}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedUsers((prev) =>
                      isChecked
                        ? [...prev, u._id]
                        : prev.filter((id) => id !== u._id)
                    );
                  }}
                />
                <span>{u.username}</span>
              </label>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chat;
