"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosinstance";
import { FaUserPlus } from "react-icons/fa";

interface Suggestion {
  _id: string;
  name: string;
  avatar: string;
  background: string;
  verified: boolean;
  isFriend: boolean;
}

export default function SuggestionsList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && (user._id || user.id)) setCurrentUserId(user._id || user.id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    axiosInstance.get(`/friends/suggestions/${currentUserId}`)
      .then(res => {
        console.log('Suggestions:', res.data.suggestions);
        setSuggestions(res.data.suggestions || [])});
  }, [currentUserId]);

  const handleAddFriend = async (recipientId: string) => {
    if (!currentUserId) return;
    setSending(recipientId);
    try {
      await axiosInstance.post("/friends/add", { requesterId: currentUserId, recipientId });
      setSentIds(prev => [...prev, recipientId]);
    } catch {
      alert("Gửi lời mời thất bại!");
    }
    setSending(null);
  };

  const handleUnfriend = async (friendId: string) => {
    if (!currentUserId) return;
    try {
      await axiosInstance.post("/friends/unfriend", { userId: currentUserId, friendId });
      setSuggestions(prev => prev.filter(f => f._id !== friendId));
    } catch {
      alert("Huỷ kết bạn thất bại!");
    }
  };

  if (!currentUserId) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {suggestions.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12">
          Không có gợi ý kết bạn nào.
        </div>
      )}
      {suggestions.map(sug => (
        <div key={sug._id} className="relative bg-white rounded-xl border border-gray-200 shadow flex flex-col items-center p-4">
          <div className="w-full h-24 relative mb-4">
            <Image
              src={sug.background || "/assets/img/banner.png"}
              alt="background"
              fill
              className="object-cover rounded-t-xl"
            />
          </div>
          <Image
            src={sug.avatar || "/assets/img/banner.png"}
            alt={sug.name}
            width={64}
            height={64}
            className="rounded-full border-4 border-white shadow-md object-cover bg-white -mt-12 mb-2"
          />
          <div className="font-semibold text-gray-900">{sug.name}</div>
          {sug.isFriend ? (
            <button
              className="mt-3 flex items-center gap-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => handleUnfriend(sug._id)}
            >
              Huỷ kết bạn
            </button>
          ) : (
            <button
              className="mt-3 flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition"
              onClick={() => handleAddFriend(sug._id)}
              disabled={sending === sug._id || sentIds.includes(sug._id)}
            >
              <FaUserPlus />
              {sentIds.includes(sug._id) ? "Đã gửi lời mời" : sending === sug._id ? "Đang gửi..." : "Kết bạn"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}