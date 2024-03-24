"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    router.push("/logout");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative h-100vh">
      <div className="fixed top-4 left-0 z-10 w-full flex justify-between items-center px-4">
        <div onClick={toggleMenu}>
          <svg
            className="w-6 h-6 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </div>
        <span className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl">
          Fagoon
        </span>
      </div>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 z-10 w-64 h-full bg-gray-800">
          <div className="flex items-center justify-between h-16 bg-gray-900">
            <h1 className="text-2xl p-4 font-bold text-white">Fagoon</h1>
            <button
              className="text-white p-4 focus:outline-none"
              onClick={toggleMenu}
            >
              Close
            </button>
          </div>
          <button
            className="bg-red-500 text-white py-2 px-4 mx-4 rounded-md mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
