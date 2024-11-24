import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearAuth } from "../../redux/authSlice";

function Header() {
  const navbarColor = localStorage.getItem("navbarColor");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <div
      className="w-full px-16 shadow"
      style={{ backgroundColor: `${navbarColor}` }}
    >
      <Navbar
        fluid
        rounded
        className=" w-full  z-10  m-auto"
        style={{ backgroundColor: `${navbarColor}` }}
      >
        <Navbar.Brand href="/dashboard">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9759/9759879.png"
            className="mr-3 h-6 sm:h-9"
            alt="Dyslexia logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Dyslexia Learning
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={
                  user?.profile_pic
                    ? user?.profile_pic
                    : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.username}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
            <Dropdown.Item href="/dashboard/profile">Profile</Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(clearAuth())}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="">
          <Navbar.Link href="/dashboard" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="/dashboard/chat">My Chat</Navbar.Link>
          <Navbar.Link href="/dashboard/tasks">Tasks</Navbar.Link>
          <Navbar.Link href="/dashboard/reader">Text to Speech</Navbar.Link>
          <Navbar.Link href="/dashboard/contact">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
