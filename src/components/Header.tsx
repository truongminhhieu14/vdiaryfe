"use client";

import {
  AlignJustify,
  Bell,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import SideBar from "./SideBar";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false); // 👈 sidebar đăng ký/đăng nhập
  const router = useRouter();
  return (
    <>
      <header className="w-full h-16 bg-white shadow px-4 flex items-center justify-between">
        {/* Bên trái: nút menu + thời tiết */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-black hover:text-gray-600"
          >
            <AlignJustify className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://openweathermap.org/img/w/03d.png"
              alt="weather"
              className="w-8 h-8"
            />
            <div className="text-sm leading-4">
              <span className="text-green-600 font-semibold">
                Hanoi, 19.03°C
              </span>
              <p className="text-gray-500 text-xs">mây cụm</p>
            </div>
          </div>
        </div>

        {/* Giữa: avatar + tên (ẩn trên mobile) */}
        <div className="hidden md:flex items-center gap-2">
          <img
            src="https://file.apetavers.com/api/files/users/6863323c8f5be914059de295/9c475a1a-ee1b-499f-b080-34e0336f6f80--150.jpeg"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />

          <span className="text-sm font-medium text-blue-600">
            Truong Minh Hiếu
          </span>
        </div>

        {/* Bên phải: icon + avatar bấm vào hiện sidebar đăng ký/đăng nhập */}
        <div className="flex items-center gap-4">
          <Star className="w-5 h-5 text-gray-500" />

          <div className="relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              6
            </span>
          </div>

          <MessageCircle className="w-5 h-5 text-gray-500" />
          <Users className="w-5 h-5 text-gray-500" />

          {/* Avatar cuối để mở sidebar đăng ký / đăng nhập */}
          <img
            onClick={() => setIsAuthSidebarOpen(true)}
            src="https://file.apetavers.com/api/files/users/6863323c8f5be914059de295/9c475a1a-ee1b-499f-b080-34e0336f6f80--150.jpeg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
          />
        </div>
      </header>

      {/* Sidebar trái */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar đăng ký / đăng nhập phải */}
      {isAuthSidebarOpen && (
        <div className="fixed right-0 top-0 w-64 h-auto bg-white shadow-lg z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Đăng nhập / Đăng ký</h2>
            <button
              className="text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setIsAuthSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <button onClick={()=> router.push("/login")} className="bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700">
            Đăng nhập
          </button>
          <button onClick={()=> router.push("/register") }  className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
            Đăng ký
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
