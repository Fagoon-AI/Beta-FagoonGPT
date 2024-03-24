"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerIcon from "../icons/HamburgerIcon";
import { LogOutIcon, X } from "lucide-react";

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
      <div className="fixed top-4 left-0 z-10 w-full flex items-center px-4">
        <div onClick={toggleMenu}>
          <HamburgerIcon isMenuOpen={isMenuOpen} />
        </div>
        <span className="absolute left-12 md:left-16 text-xl">Fagoon</span>
      </div>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 z-10 w-64 h-full bg-gray-800">
          <div className="flex items-center justify-between h-16 bg-gray-900">
            <h1 className="text-xl p-4 text-white">Fagoon</h1>
            <button
              className="text-white p-4 focus:outline-none"
              onClick={toggleMenu}
            >
              <X />
            </button>
          </div>
          <button
            className="absolute bottom-4 right-0 text-white py-2 px-4 mt-4 border-r-8 hover:bg-slate-700"
            onClick={handleLogout}
          >
            <LogOutIcon />
          </button>
        </div>
      )}
    </div>
  );
}
