"use client";
import { useEffect, useState } from "react";

export const useSmallDevices = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isSmallDevice;
};
