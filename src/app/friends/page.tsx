"use client";

import FriendsList from "@/components/FriendList";
import Image from "next/image";
import { FaUserFriends, FaUserPlus, FaUserCheck, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import SuggestionsList from "@/components/SuggestionList";
import FollowingList from "@/components/FollowingList";
import FriendRequestsList from "@/components/FriendRequestsList";
import friendApi from "@/services/friend.service";

export default function Friends() {
  const [tab, setTab] = useState<
    "all" | "suggestions" | "requests" | "following"
  >("all");
  const [friendCount, setFriendCount] = useState<number>(0);

  useEffect(() => {
    const fetchFriendCount = async () => {
      const response = await friendApi.getAllFriend();
      const data = response.data.data.pagination.count;
      setFriendCount(data);
    };
    fetchFriendCount();
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
  
      <aside className="w-72 bg-white rounded-xl shadow border border-gray-200 flex flex-col pt-6 pb-4 px-4 min-h-[calc(100vh-32px)] mx-2 my-2">
        <h2 className="text-2xl font-bold mb-6 pl-2 tracking-wide">Friends</h2>
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  tab === "all"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTab("all")}
              >
                <FaUserFriends className="text-lg" />
                All
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  tab === "suggestions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTab("suggestions")}
              >
                <FaUserPlus className="text-lg" />
                Suggestions
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  tab === "requests"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTab("requests")}
              >
                <FaUserCheck className="text-lg" />
                Friend requests
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-semibold ${
                  tab === "following"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTab("following")}
              >
                <FaUser className="text-lg" />
                Following
              </button>
            </li>
          </ul>
        </nav>
        <div className="border-t border-gray-200 mt-6 pt-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-3 pl-2">
            New friends
          </h4>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <Image
              src="/assets/img/banner.png"
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full object-cover border"
            />
            <div className="text-xs text-gray-700">
              <span className="font-semibold">Châu Đức and Hương Hồng</span>{" "}
              have accepted your friend request.
              <div className="text-gray-400 text-[11px]">4 hours ago</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Banner */}
        <div className="w-full h-48 relative">
          <Image
            src="/assets/img/banner.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Search and header */}
        <div className="bg-white border-b border-gray-200 px-8 pt-4 pb-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <h3 className="text-xl font-bold text-gray-800">Friends</h3>
              <span className="text-blue-600 font-semibold text-base">
                {(friendCount ?? 0).toLocaleString()} friends
              </span>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Enter friends' names, VDB ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Friends List hoặc Suggestions List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 bg-gray-50">
          {tab === "all" && <FriendsList />}
          {tab === "suggestions" && <SuggestionsList />}
          {tab === "following" && <FollowingList />}
          {tab === "requests" && <FriendRequestsList />}
        </div>
      </main>
    </div>
  );
}
