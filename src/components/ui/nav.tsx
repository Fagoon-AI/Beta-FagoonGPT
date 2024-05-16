import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HamburgerIcon from "../icons/HamburgerIcon";
import { LogOutIcon, X } from "lucide-react";
import Trash from "../icons/Trash";
import Sparkle from "../icons/Sparkle";
import Collapse from "../icons/Collapse";
import ChatIcon from "../icons/Chat";
import ChevronDown from "../icons/ChevronDown";
import "./navstyle.css";
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

  useEffect(() => {
    if (!isMenuOpen) {
      const timer = setTimeout(() => {
        setAnimation(false);
      }, 500); // Duration of transition in milliseconds
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    router.push("/logout");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setAnimation(true);
  };

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
        >
          <span className="pr-2">FagoonGPT v1.0</span>
          <ChevronDown />
        </div>
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
                <span style={{ fontWeight: 100, fontSize: "small" }}>
                  {title}
                </span>
                {hoveredIndex === index && (
                  <div className="ml-2 text-gray-400 hover:text-white">
                    <Trash />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-0 w-full py-2 px-4 mt-4 border-r-8 bg-gray-900 ">
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
      </div>
      {/* Logout Button */}
      {/* <button
        className="absolute bottom-4 right-0 text-white py-2 px-4 mt-4 border-r-8 hover:bg-slate-700"
        onClick={handleLogout}
      >
        <LogOutIcon />
      </button> */}
    </div>
  );
}
