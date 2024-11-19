import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeLayout from "./layout/HomeLayout";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Tasks from "./pages/Tasks";
import Contact from "./pages/Contact";
import TextToSpeech from "./pages/Reader";
import Home from "./pages/Home";
import { useSelector } from "react-redux";

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state?.auth);

  // Redirect to login if no token is present
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const { token, user } = useSelector((state) => state?.auth);

  console.log("token", token, "user", user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={!token ? <Register /> : <Navigate to={"/dashboard"} />}
      />
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to={"/dashboard"} />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/:id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="reader"
          element={
            <ProtectedRoute>
              <TextToSpeech />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
