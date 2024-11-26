import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { clearAuth } from "../../redux/authSlice";

function Header() {
  const navbarColor = localStorage.getItem("navbarColor");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const links = [
    {
      text: "Home",
      path: "/home",
    },
    {
      text: "Tasks",
      path: "/home/tasks",
    },
    {
      text: "My Chats",
      path: "/home/chat",
    },

    {
      text: "File Reader",
      path: "/home/reader",
    },

    {
      text: "Contact",
      path: "/home/contact",
    },
  ];
  const { pathname } = useLocation();
  const textColor = localStorage.getItem("textColor");
  console.log("papth name", pathname);
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
        <Navbar.Brand href="/home">
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
            {user?.role === "admin" && (
              <Dropdown.Item href="/home/dashboard/">Dashboard</Dropdown.Item>
            )}
            <Dropdown.Item href="/home/profile">Profile</Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(clearAuth())}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="">
          {links.map((link: any, idx: number) => {
            return (
              <Navbar.Link
                style={{
                  color: `${link.path === pathname ? "green" : textColor}`,
                }}
                href={link.path}
                active={link.path === pathname ? true : false}
                key={idx}
              >
                {link.text}
              </Navbar.Link>
            );
          })}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
