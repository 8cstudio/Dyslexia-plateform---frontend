import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeLayout from "./layout/HomeLayout";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Tasks from "./pages/Tasks";
import Contact from "./pages/Contact";
import TextToSpeech from "./pages/Reader";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<HomeLayout />}>
        <Route index element={<h1>Home page</h1>} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/chat" element={<Chat />} />
        <Route path="/dashboard/chat/:id" element={<Chat />} />
        <Route path="/dashboard/tasks" element={<Tasks />} />
        <Route path="/dashboard/contact" element={<Contact />} />
        <Route path="/dashboard/reader" element={<TextToSpeech />} />
      </Route>
    </Routes>
  );
};

export default App;
