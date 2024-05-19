import { useState, useEffect, useRef, Fragment } from "react";
import { redirect, useRouter } from "next/navigation";
import HamburgerIcon from "../../components/icons/HamburgerIcon";
import { LogOutIcon, X } from "lucide-react";
import Trash from "../../components/icons/Trash";
import Sparkle from "../../components/icons/Sparkle";
import { getCurrentUserAPI, refreshTokenAPI } from "@/services/authService";
import { AxiosError } from "axios";
import ProfileIcon from "../../components/icons/Profile";
import Collapse from "../../components/icons/Collapse";
import ChatIcon from "../../components/icons/Chat";
import ChevronDown from "../../components/icons/ChevronDown";
import HistoryIcon from "@/components/icons/History";
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
  const [full_name, setFull_name] = useState<string>("");

  const getCurrentUser = async (accessToken: string) => {
    try {
      const response = await getCurrentUserAPI({ accessToken });
      setFull_name(response.data.full_name);
      return response.data;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return await handleUnauthorizedError(accessToken);
      }
      throw error;
    }
  };
  const handleUnauthorizedError = async (accessToken: string) => {
    let refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || refreshToken === "undefined" || refreshToken === "") {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      return redirect("/login");
    }
    refreshToken = JSON.parse(refreshToken);
    try {
      const response = await refreshTokenAPI({ refreshToken } as {
        refreshToken: string;
      });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", JSON.stringify(access_token));
      localStorage.setItem("refreshToken", JSON.stringify(refresh_token));
      const userData = await getCurrentUserAPI({ accessToken: access_token });
      return userData.data;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");
        router.push("/login");
        router.refresh();
        return null;
      }
    }
  };

  const isUnauthorizedError = (error: unknown) => {
    return (
      (error instanceof AxiosError && error.response?.status === 401) || 404
    );
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "undefined" || accessToken === "") {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      redirect("/login");
    } else {
      getCurrentUser(JSON.parse(accessToken));
    }
  }, []);

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
    setShowDropDown((prev) => !prev);
  };

  const toggleuserprofile = () => {
    setShowuserprofile((prev) => !prev);
  };

  return (
    <Fragment>
      <div className="relative h-100vh">
        <div className="fixed top-4 left-0 z-10 w-full flex items-center px-4">
          {/* <div onClick={toggleMenu}>
          <HamburgerIcon isMenuOpen={isMenuOpen} />
        </div> */}
          <div
            className={`absolute left-12 md:left-16 text-xl mt-0 flex items-center hovered-div`}
            onMouseEnter={toggleDropDown}
            onMouseLeave={toggleDropDown}
          >
            <span className="pr-2">FagoonGPT v2.0</span>
            <ChevronDown />
          </div>

          {showDropDown && (
            <div
              ref={dropdownRef}
              className="absolute left-12 md:left-16 top-full mt-3 bg-gray-800 rounded-md shadow-lg transition-all duration-300"
              style={{ width: "max-content" }}
              onMouseEnter={toggleDropDown}
              onMouseLeave={toggleDropDown}
            >
              <div className="flex justify-end">
                <li
                  className="px-4 py-1 text-white flex items-center justify-between cursor-pointer"
                  style={{ marginBottom: "4px", marginTop: "4px" }}
                  onClick={() => router.push("/")}
                >
                  <div className="py-1 px-1 mt-1 bg-2E2F rounded-md">
                    <div className="flex items-center  rounded-md p-2">
                      <div style={{ width: "calc(100% - 8px)" }}>
                        <h4 className="text-sm">v1.0</h4>
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            </div>
          )}
        </div>
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-9"
            onClick={(e) => e.stopPropagation()}
          ></div>
        )}
        <div
          className="fixed top-0 left-0 z-10 w-64 h-full bg-gray-800 transform transition-transform duration-500"
          style={{
            transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
            opacity: animation ? 1 : 0,
          }}
        >
          <div className="flex items-center justify-between h-16 bg-gray-900">
            <h1 className="text-xl p-4 bg-gradient-to-r from-[#4285F4] via-[#9B72CB] via-[#D96570] via-[#D96570] via-[#9B72CB] via-[#4285F4] via-[#9B72CB] via-[#D96570] to-[#131314] bg-clip-text text-transparent">
              FagoonGPT
            </h1>
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
                  <span
                    style={{
                      fontWeight: 100,
                      fontSize: "small",
                      color: "#BBC1C5",
                    }}
                  >
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
        </div>
        <div className="fixed top-4 right-0 px-4 flex flex-col">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {!isMenuOpen && (
              <div onClick={toggleMenu} style={{ marginRight: "20px" }}>
                <HistoryIcon isMenuOpen={isMenuOpen} />
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              onMouseEnter={toggleuserprofile}
              onMouseLeave={toggleuserprofile}
            >
              <ProfileIcon />
              <p>{full_name}</p>
            </div>
          </div>
          {/* {showuserprofile && (
          <div
            ref={dropdownRef}
            className="absolute right-2 mt-2 bg-gray-800 rounded-md shadow-lg transition-all duration-300"
            style={{ width: "120px", padding: "8px" }} // Reduced width and padding for a smaller box
          >
            <div
              className="cursor-pointer text-gray-300 hover:text-white text-center"
              onClick={handleLogout}
            >
              <LogOutIcon size={14} className="block mx-auto mb-1" /> Logout
            </div>
          </div>
        )} */}
        </div>
      </div>{" "}
    </Fragment>
  );
}
