import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HamburgerIcon from "../../components/icons/HamburgerIcon";
import { LogOutIcon, X } from "lucide-react";
import Trash from "../../components/icons/Trash";
import Sparkle from "../../components/icons/Sparkle";
import Collapse from "../../components/icons/Collapse";
import ChatIcon from "../../components/icons/Chat";
import ChevronDown from "../../components/icons/ChevronDown";
import "./navstyle.css";
import profile from "./profile.png";
const demoChatTitles = [
  "Careers in USA: freelance",
  "Bishal Kharal: AI Engineer",
  "About Fagoon GPT",
  "Careers in USA: freelance",
  "Bishal Kharal: AI Engineer",
  "About Fagoon GPT",
  "Careers in USA: freelance",
  "Bishal Kharal: AI Engineer",
  "About Fagoon GPT",
  "Careers in USA: freelance",
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animation, setAnimation] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showuserprofile, setShowuserprofile] = useState(false);
<<<<<<< HEAD

=======
>>>>>>> fagoongpt/master
  useEffect(() => {
    if (!isMenuOpen) {
      const timer = setTimeout(() => {
        setAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    router.push("/logout");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setAnimation(true);
  };

  const toggleDropDown = () => {
<<<<<<< HEAD
    setShowDropDown((prev) => !prev);
  };

  const toggleuserprofile = () => {
    setShowuserprofile((prev) => !prev);
  };

=======
    setShowDropDown(!showDropDown);
  };
  const toggleuserprofile = () => {
    setShowuserprofile(!showuserprofile);
  };
>>>>>>> fagoongpt/master
  return (
    <div className="relative h-100vh">
      <div className="fixed top-4 left-0 z-10 w-full flex items-center px-4">
        <div onClick={toggleMenu}>
          <HamburgerIcon isMenuOpen={isMenuOpen} />
        </div>
        <div
          className={`absolute left-12 md:left-16 text-xl mt-0 flex items-center hovered-div`}
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
<<<<<<< HEAD
          onMouseEnter={toggleDropDown}
          onMouseLeave={toggleDropDown}
=======
          onClick={toggleDropDown}
>>>>>>> fagoongpt/master
        >
          <span className="pr-2">FagoonGPT v2.0</span>
          <ChevronDown />
        </div>

        {showDropDown && (
          <div
            ref={dropdownRef}
<<<<<<< HEAD
            className="absolute left-12 md:left-16 top-full mt-3 bg-gray-800 rounded-md shadow-lg transition-all duration-300"
            style={{ width: "max-content" }}
            onMouseEnter={toggleDropDown}
            onMouseLeave={toggleDropDown}
=======
            className="absolute left-12 md:left-16 top-full mt-5 bg-gray-800 rounded-md shadow-lg transition-all duration-300"
            style={{ width: "max-content" }}
>>>>>>> fagoongpt/master
          >
            <li
              className="px-4 py-1 text-white flex items-center justify-between cursor-pointer"
              style={{ marginBottom: "4px", marginTop: "4px" }}
              onClick={() => router.push("/")}
            >
              <div className="py-1 px-1 mt-1 bg-2E2F rounded-md">
                <div className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <div className="mr-2">
                    <Sparkle />
                  </div>
                  <div style={{ width: "calc(100% - 8px)" }}>
                    <h4 className="text-sm">FagoonGPT v1.0</h4>
                    <p
                      className="text-sm text-gray-400"
                      style={{ fontSize: "12px" }}
                    >
<<<<<<< HEAD
                      Normal Model
=======
                      Blazingly fast
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="px-4 py-1 text-white flex items-center justify-between cursor-pointer"
              style={{ marginBottom: "4px", marginTop: "4px" }}
            >
              <div className="py-1 px-1 mt-1 bg-2E2F rounded-md">
                <div className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <div className="mr-2">
                    <Sparkle />
                  </div>
                  <div style={{ width: "calc(100% - 8px)" }}>
                    <h4 className="text-sm">FagoonGPT v3.0</h4>
                    <p
                      className="text-sm text-gray-400"
                      style={{ fontSize: "12px" }}
                    >
                      Extra fast
>>>>>>> fagoongpt/master
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </div>
        )}
      </div>
      <div
        className="fixed top-0 left-0 z-10 w-64 h-full bg-gray-800 transform transition-transform duration-500"
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          opacity: animation ? 1 : 0,
        }}
      >
        <div className="flex items-center justify-between h-16 bg-gray-900">
          <h1 className="text-xl p-4 text-white">FagoonGPT</h1>
          <button
            className="text-white p-4 focus:outline-none"
            onClick={toggleMenu}
          >
            <Collapse></Collapse>{" "}
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <ul className="py-2">
            <li
              className="px-4 py-2 text-white flex items-center justify-between "
              style={{ marginBottom: "8px", marginTop: "8px" }}
            >
              <button className="flex items-center text-white px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-300 w-full">
                <ChatIcon /> <span className="ml-2">New Chat</span>
              </button>
            </li>

            {demoChatTitles.map((title, index) => (
              <li
                key={index}
                className={`px-4 py-2 text-white cursor-pointer flex items-center justify-between ${
                  hoveredIndex === index ? "rounded-lg hover:bg-gray-700" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
<<<<<<< HEAD
                <span style={{ fontWeight: 100, fontSize: "small" }}>
                  {title}
                </span>
=======
                <span>{title}</span>
>>>>>>> fagoongpt/master
                {hoveredIndex === index && (
                  <div className="ml-2 text-gray-400 hover:text-white">
                    <Trash />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
<<<<<<< HEAD
      </div>{" "}
      <div
        className="fixed top-4 right-0 px-4"
        onMouseEnter={() => setHoveredIndex(1)}
        onMouseLeave={() => setHoveredIndex(null)}
        onMouseEnter={toggleuserprofile}
        onMouseLeave={toggleuserprofile}
      >
=======
        <div className="absolute bottom-0 w-full py-2 px-4 mt-4   bg-gray-900 ">
          <div className="flex items-center">
            <div className="mr-2">
              <Sparkle />
            </div>
            <div style={{ width: "calc(100% - 8px)" }}>
              <h4 className="text-lg font-semibold">Upgrade Plan</h4>
              <p className="text-sm text-gray-400" style={{ fontSize: "12px" }}>
                Get FagoonGPT V2 and more
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="fixed top-4 right-0 px-4">
>>>>>>> fagoongpt/master
        <img
          src={profile.src}
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={toggleuserprofile}
        />
        {showuserprofile && (
          <div
            ref={dropdownRef}
<<<<<<< HEAD
            className="absolute right-2 mt-0 bg-gray-800 rounded-md shadow-lg transition-all duration-300"
=======
            className="absolute right-2 mt-2  bg-gray-800 rounded-md shadow-lg transition-all duration-300"
>>>>>>> fagoongpt/master
          >
            <li className="px-4 py-1 text-white flex items-center justify-between cursor-pointer">
              <div className=" bg-2E2F rounded-md" onClick={handleLogout}>
                <div className="flex items-center hover:bg-gray-700 rounded-md p-2">
                  <div className="mr-2">
                    <LogOutIcon />
                  </div>
                  <div>
                    <h4 className="text-sm">Logout</h4>
                  </div>
                </div>
              </div>
            </li>
          </div>
        )}{" "}
      </div>
    </div>
  );
}
