import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import Customizer from "../components/site/Customizer";

const HomeLayout = () => {
  const fontFamily = localStorage.getItem("fontFamily");
  const bgColor = localStorage.getItem("bgColor");
  const textColor = localStorage.getItem("textColor");
  const weight = localStorage.getItem("fontWeight");
  const fontStyle = localStorage.getItem("fontStyle");
  return (
    <>
      <div
        className="absolute w-full min-h-screen h-auto "
        style={{
          fontFamily: `${fontFamily}, Arial, sans-serif`,
          backgroundColor: `${bgColor}`,
          color: `${textColor}`,
          fontWeight: `${weight}`,
          fontStyle: `${fontStyle}`,
        }}
      >
        <Header />

        <Customizer />

        <main className="w-full lg:w-[90%]   mx-auto  p-5">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default HomeLayout;
