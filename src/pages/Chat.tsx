import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Avatar, TextInput } from "flowbite-react";
import { Paperclip, Plus, PlusCircle, Send } from "lucide-react";
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
  const [members, setMembers] = useState([]);
  const { token, user } = useSelector((state: any) => state.auth);
  const { chats } = useSelector((state: any) => state.chat);
  const [groupName, setGroupName] = useState("");
  const [singleUser, setSingleUser] = useState("");
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
        { groupName, otherUser: selectedUsers, isGroupChat: true },
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

    socket.on("receiveMessage", (message: any) => {
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
        // dispatch(getChats());
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
      dispatch(getChats());
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  console.log("chats", chats);
  console.log("messss", messages);

  const AddUser_TO_GROUP = async (id: string) => {
    try {
      const resp = await axios.put(
        `/chat/add/user/${selectedChat}`,
        { newUser: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(getChats());
      toast.success(resp?.data?.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <>
      <div className="flex h-screen bg-white ">
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
                    chat?.isGroupChat === true
                      ? setMembers(chat?.participants)
                      : setMembers([]);

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
                    {chat.isGroupChat ? (
                      <Avatar
                        img={
                          "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                        }
                        rounded
                      />
                    ) : (
                      <Avatar
                        img={
                          chat.isGroupChat
                            ? chat.groupName
                            : chat.participants
                                .filter((p: any) => p._id !== user._id)
                                .map(
                                  (p: any) =>
                                    `http://localhost:4000/uploads/${p.profile_pic}` ||
                                    ""
                                )
                                .join(", ")
                        }
                        rounded
                      />
                    )}
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
                    <p className="text-[13px] text-gray-500 truncate">
                      {chat?.messages?.length
                        ? chat.messages[chat.messages.length - 1]?.content
                        : "No messages yet"}
                    </p>
                  </div>
                  {/* <span className="text-sm text-gray-400">Online</span> */}
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
              messages.map((message: any, idx: number) =>
                message.chat.isGroupChat === true ? (
                  <div
                    key={idx}
                    className={`flex ${
                      message.sender &&
                      (message.sender._id || message.sender) === user._id
                        ? "justify-end"
                        : ""
                    } mb-3`}
                  >
                    <div
                      className={`p-4 rounded-lg shadow-sm max-w-xs ${
                        message.sender &&
                        (message.sender._id || message.sender) === user._id
                          ? "bg-blue-100 text-right"
                          : "bg-gray-200"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {message.sender === user._id
                          ? "You"
                          : message?.sender?.username}
                      </p>
                      <p className="mt-1">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className={`flex ${
                      message.sender &&
                      (message.sender._id || message.sender) === user._id
                        ? "justify-end"
                        : ""
                    } mb-3`}
                  >
                    <div
                      className={`p-4 rounded-lg shadow-sm max-w-xs ${
                        message.sender &&
                        (message.sender._id || message.sender) === user._id
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
                )
              )
            ) : (
              <div className="flex justify-center items-center h-full flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                {/* Chat Icon */}
                <div className="p-4 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-12 h-12 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13.999V16a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2h12a2 2 0 012 2v7.999z"
                    />
                  </svg>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-blue-600">
                  Dyslexia Chat Platform
                </h2>

                {/* Subtext */}
                <p className="text-gray-600 text-center max-w-md">
                  Select a user or group to view messages and start meaningful
                  conversations.
                </p>

                {/* Action Button */}
                <button
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
                  onClick={() => console.log("Create a new chat clicked!")}
                >
                  Create New Chat
                </button>
              </div>
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

        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="xxl"
        >
          <Modal.Header>Add New User</Modal.Header>
          <Modal.Body>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 my-5">
              {users.map((u: any) => {
                // Check if the chat is not a group and both participants match

                const isInChat = chats.some((chat: any) => {
                  if (chat.isGroupChat === false) {
                    return chat.participants.some((c: any) => c._id === u._id);
                  }
                  return false; // Explicitly return false for group chats
                });

                return (
                  <label
                    key={u._id}
                    className={`relative flex flex-col items-center p-4 border rounded-lg shadow-lg 
        ${
          isInChat
            ? "bg-green-200 cursor-not-allowed"
            : "bg-white hover:shadow-xl cursor-pointer"
        } 
        transition-shadow`}
                  >
                    {/* User Image */}
                    <div className="w-20 h-20  rounded-full overflow-hidden border mb-3">
                      <img
                        src={
                          `http://localhost:4000/uploads/${u.profile_pic}` ||
                          "https://via.placeholder.com/150"
                        }
                        alt={`${u.username}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* User Details */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {u.username}
                      </h3>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <div className="absolute top-2 left-2">
                      <button
                        className="text-gray-500 hover:text-green-500"
                        onClick={() => addToList(u._id)}
                      >
                        <PlusCircle />
                      </button>
                    </div>
                  </label>
                );
              })}
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          size="xxl"
        >
          <Modal.Header>Create New Group</Modal.Header>
          <Modal.Body>
            <TextInput
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 my-5">
              {users.map((u: any) => {
                const isSelected = selectedUsers.includes(u._id); // Check if the user is selected
                return (
                  <label
                    key={u._id}
                    className={`relative flex flex-col items-center p-4 border rounded-lg shadow-lg transition-shadow cursor-pointer ${
                      isSelected
                        ? "bg-blue-100 border-blue-500 shadow-md"
                        : "bg-white"
                    } hover:shadow-xl`}
                  >
                    {/* User Image */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border mb-3">
                      <img
                        src={
                          u.profile_pic
                            ? `http://localhost:4000/uploads/${u.profile_pic}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={`${u.username}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* User Details */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {u.username}
                      </h3>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>

                    {/* Icon */}
                    <div className="absolute top-4 right-4">
                      <input
                        type="checkbox"
                        className="hidden"
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
                      <span
                        className={`flex items-center justify-center w-6 h-6 border-2 rounded-full transition ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 bg-white hover:border-blue-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <br />

      <div>
        {/* Group Participants */}
        {members.length > 0 && (
          <h2 className="text-xl my-3">Group Participants</h2>
        )}
        {members && (
          <div className="w-full grid lg:grid-cols-5 grid-cols-2 gap-6">
            {members.map((user: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className="border bg-white text-center shadow-lg rounded-lg flex flex-col justify-center items-center p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Profile Picture */}
                  <div className="mb-4">
                    <img
                      className="w-[80px] h-[80px] rounded-full border-2 border-gray-200"
                      src={
                        user?.profile_pic
                          ? `http://localhost:4000/uploads/${user?.profile_pic}`
                          : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                      }
                      alt={`${user?.username}'s profile`}
                    />
                  </div>

                  {/* Username */}
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.username || "Unknown User"}
                  </h3>

                  {/* Email */}
                  {user?.email && (
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                  )}

                  {/* Role (Optional) */}
                  {user?.role && (
                    <p className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
                      {user.role}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Suggested Users */}
        {members.length > 0 && (
          <div>
            <h2 className="text-xl my-3">Suggested Users</h2>
            <div className="w-full grid lg:grid-cols-5 grid-cols-2 gap-6">
              {users
                .filter(
                  (user: any) => !members.some((m: any) => m._id === user._id)
                ) // Filter out members
                .map((user: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="border relative bg-white text-center shadow-lg rounded-lg flex flex-col justify-center items-center p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Profile Picture */}
                      <div className="mb-4">
                        <img
                          className="w-[80px] h-[80px] rounded-full border-2 border-gray-200"
                          src={
                            user?.profile_pic
                              ? `http://localhost:4000/uploads/${user?.profile_pic}`
                              : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                          }
                          alt={`${user?.username}'s profile`}
                        />
                      </div>

                      {/* Username */}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user?.username || "Unknown User"}
                      </h3>

                      {/* Email */}
                      {user?.email && (
                        <p className="text-sm text-gray-500 mb-2">
                          {user.email}
                        </p>
                      )}

                      {/* Role (Optional) */}
                      {user?.role && (
                        <p className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
                          {user.role}
                        </p>
                      )}
                      <div className="absolute top-2 right-2">
                        <button
                          className=""
                          onClick={() => AddUser_TO_GROUP(user._id)}
                        >
                          <PlusCircle className="text-gray-500 hover:text-green-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
