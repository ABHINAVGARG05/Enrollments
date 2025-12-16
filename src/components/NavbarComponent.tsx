import { useState } from "react";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const [hoveredItem, setHoveredItem] = useState(-1);
  const navigate = useNavigate();

  const menuItems = [
    { id: 0, label: "Dashboard", src: "/dashboard.png", route: "/dashboard" },
    { id: 1, label: "About", src: "/mfc-logo.png", route: "/about" },
    { id: 2, label: "FAQs", src: "/faq.png", route: "/faq" },
    { id: 3, label: "Profile", src: "/profile.png", route: "/profile" },
    // { id: 4, label: "Meeting", src: "/meeting.png", route: "/meeting" }, //Removed Meeting tab joh visible tha in the sidebar, if readding, logout ka id bhi update karlena

    {
      id: 4,
      label: "Logout",
      src: "/logout.png",
      route: "/",
      action: () => {
        Cookies.remove("jwtToken");
        secureLocalStorage.clear();
      },
    },
  ];

  return (
    <nav className="nav h-full w-full md:max-w-[100px] flex flex-row md:flex-col justify-around items-center border-dashed border-2 border-spacing-4 md:border-spacing-8 border-prime md:border-r-0 p-4 md:p-0 sm:border-b-2">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="relative z-[150] scale-75 lg:scale-100 cursor-pointer group"
          onClick={() => {
            if (item.action) item.action();
            navigate(item.route);
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(-1)}
        >
          <img
            className={`nes-avatar is-medium w-full ${
              item.id !== 1 ? "invert" : ""
            }`}
            alt={item.label}
            src={item.src}
            style={{ imageRendering: "pixelated" }}
          />
          {hoveredItem === item.id && (
            <div className="absolute z-[150] -bottom-12 left-1/2 -translate-x-1/2 scale-75">
              <span className="nes-badge">
                <span className="is-error">{item.label}</span>
              </span>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavbarComponent;
