"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosinstance";

interface Friend {
  _id: string;
  name: string;
  avatar: string;
  background: string;
  mutualFriends: number;
  verified: boolean;
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/friends");
        setFriends(res.data.friends);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
      }
    };

    fetchFriends();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="relative rounded-lg shadow hover:shadow-lg overflow-hidden transition bg-gray-100"
        >
          <Image
            src={friend.background || "/default-bg.jpg"}
            alt="bg"
            width={400}
            height={200}
            className="w-full h-32 object-cover"
          />
          <div className="absolute bottom-2 left-2 flex items-center space-x-2">
            <Image
              src={friend.avatar || "/default-avatar.png"}
              alt={friend.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
            <div className="text-white drop-shadow">
              <div className="font-semibold text-sm">
                {friend.name}
                {friend.verified && (
                  <span className="ml-1 text-blue-400">✔️</span>
                )}
              </div>
              <div className="text-xs">{friend.mutualFriends} mutual friends</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
