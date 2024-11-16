import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

function Header() {
  const navbarColor = localStorage.getItem("navbarColor");
  return (
    <Navbar
      fluid
      rounded
      className=" w-full   border z-10  m-auto"
      style={{ backgroundColor: `${navbarColor}` }}
    >
      <Navbar.Brand href="https://flowbite-react.com">
        <img
          src="https://flowbite-react.com/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
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
              img="https://tse2.mm.bing.net/th?id=OIP.gxCrcJ9wcnuS-hppF4l8ggHaHa&pid=Api&P=0&h=220"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">James Herichson</span>
            <span className="block truncate text-sm font-medium">
              james889@gmail.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/dashboard/profile">Profile</Dropdown.Item>

          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="">
        <Navbar.Link href="/dashboard" active>
          Home
        </Navbar.Link>
        <Link to="/dashboard/chat">My Chat</Link>
        <Navbar.Link href="/dashboard/tasks">Tasks</Navbar.Link>
        <Navbar.Link href="/dashboard/contact">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
