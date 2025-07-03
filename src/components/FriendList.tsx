"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosinstance";
import { FaCheckCircle, FaEllipsisH, FaUserPlus } from "react-icons/fa";
import FriendActionsMenu from "./FriendActionsMenu";

// Hàm gửi lời mời kết bạn
const sendFriendRequest = async (requesterId: string, recipientId: string) => {
  return axiosInstance.post("/friends/add", { requesterId, recipientId });
};

interface Friend {
  _id: string;
  name: string;
  avatar: string;
  background: string;
  mutualFriends: number;
  verified: boolean;
  isFriend?: boolean; // giả lập, thực tế nên lấy từ API
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null); // id đang gửi
  const [sentIds, setSentIds] = useState<string[]>([]); // id đã gửi
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy userId từ localStorage
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && (user._id || user.id)) {
        setCurrentUserId(user._id || user.id);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || typeof currentUserId !== 'string') return;
    const fetchFriends = async (uid: string) => {
      try {
        const res = await axiosInstance.get(`/friends/${uid}`);
        setFriends(res.data.friends);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
      }
    };
    fetchFriends(currentUserId);
  }, [currentUserId]);

  const handleAddFriend = async (recipientId: string) => {
    if (!currentUserId) return;
    setSending(recipientId);
    try {
      await sendFriendRequest(currentUserId, recipientId);
      setSentIds((prev) => [...prev, recipientId]);
    } catch (err) {
      alert("Gửi lời mời thất bại!");
    }
    setSending(null);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.friend-actions-menu') && !(e.target as HTMLElement).closest('.friend-menu-btn')) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-yellow-500 text-2xl mb-2">⚠️</div>
          <p className="text-yellow-700 font-medium">Vui lòng đăng nhập để xem danh sách bạn bè.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No friends yet</h3>
          <p className="text-gray-500">Start connecting with people to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="relative bg-white rounded-xl border border-gray-200 shadow group overflow-hidden flex flex-col"
        >
          {/* 3-dot menu */}
          <button
            className="friend-menu-btn absolute top-3 right-3 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition"
            onClick={() => setOpenMenuId(openMenuId === friend._id ? null : friend._id)}
          >
            <FaEllipsisH className="text-gray-500 text-lg" />
          </button>
          {openMenuId === friend._id && (
            <div className="friend-actions-menu">
              <FriendActionsMenu onClose={() => setOpenMenuId(null)} onAction={(action) => {
                // Xử lý action ở đây nếu muốn
                if (action === "Unfriend") alert(`Unfriend ${friend.name}`);
              }} />
            </div>
          )}
          {/* Background image */}
          <div className="h-32 w-full relative">
            <Image
              src={friend.background || "/assets/img/banner.png"}
              alt="background"
              fill
              className="object-cover"
            />
          </div>
          {/* Avatar */}
          <div className="flex justify-center -mt-8 z-10 relative">
            <Image
              src={friend.avatar || "/assets/img/banner.png"}
              alt={friend.name}
              width={64}
              height={64}
              className="rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
          </div>
          {/* Info */}
          <div className="flex flex-col items-center px-4 pt-2 pb-4 flex-1">
            <div className="flex items-center gap-1 mt-2">
              <span className="font-semibold text-gray-900 truncate max-w-[120px]">{friend.name}</span>
              {friend.verified && (
                <FaCheckCircle className="text-blue-500 text-sm ml-1" title="Verified" />
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{friend.mutualFriends} mutual friends</span>
            {/* Nút Kết bạn */}
            {!friend.isFriend && (
              <button
                className="mt-3 flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition"
                onClick={() => handleAddFriend(friend._id)}
                disabled={sending === friend._id || sentIds.includes(friend._id)}
              >
                <FaUserPlus />
                {sentIds.includes(friend._id) ? "Đã gửi lời mời" : sending === friend._id ? "Đang gửi..." : "Kết bạn"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
