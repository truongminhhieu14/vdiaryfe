"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { getUserIdFromLocalStorage } from "@/utils/auth";
import friendApi, { getMutualFriends } from "@/services/friend.service";
import { IFriend } from "@/types/friend.type";
import FriendActionMenu from "./FriendActionMenu";

export default function FriendsList() {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [mutualFriendsData, setMutualFriendsData] = useState<{[key: string]: {count: number, mutualFriends: IFriend[]}}>({});

  const userId = getUserIdFromLocalStorage();

  const fetchMutualFriends = async (friendIds: string[]) => {
    if (friendIds.length === 0) return;
    
    try {
      const res = await getMutualFriends(friendIds);
      console.log("Mutual friends response:", res.data);
      
      // Cập nhật mutual friends data
      const newMutualData = { ...mutualFriendsData };
      // TODO: Implement mutual friends logic based on actual API response
      setMutualFriendsData(newMutualData);
    } catch (err) {
      console.error("Error fetching mutual friends:", err);
    }
  };

  const fetchFriends = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await friendApi.getAllFriend(pageNum, 10);
      const friendsList = res.data.data?.friends || [];
      const hasMore = res.data.data?.pagination?.hasMore || false;

      if (pageNum === 1) {
        setFriends(friendsList);
      } else {
        setFriends((prev) => [...prev, ...friendsList]);
      }
      setHasMore(hasMore);

      if (friendsList.length > 0) {
        const friendIds = friendsList.map(friend => friend._id);
        fetchMutualFriends(friendIds);
      }
    } catch (err: any) {
      console.error("Error fetching friends:", err);
      setError(err.response?.data?.message || "Lỗi khi tải danh sách bạn bè");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (userId) fetchFriends(page);
    console.log("page", page);
  }, [userId, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  const handleUnFriend = async (friendId: string) => {
    try {
      await friendApi.unfriend(friendId);
      setFriends(friends.filter((friend) => friend._id !== friendId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi hủy bạn bè");
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-yellow-500 text-2xl mb-2">⚠️</div>
          <p className="text-yellow-700 font-medium">
            Vui lòng đăng nhập để xem danh sách bạn bè.
          </p>
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
          <p className="text-gray-500">
            Start connecting with people to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 animate-pulse"
            >
              <div className="w-full h-24 bg-gray-200 rounded-t-xl mb-4" />
              <div className="w-16 h-16 rounded-full bg-gray-300 -mt-12 mb-2 border-4 border-white shadow" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 group transition hover:shadow-lg"
          >
            <FriendActionMenu friend={friend} onUnFriend={handleUnFriend} />
            <div className="w-full h-24 relative mb-4 rounded-t-xl overflow-hidden">
              <Image
                src={friend.background || "/assets/img/bg1.jpg"}
                alt="background"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative -mt-12 mb-2">
              <Image
                src={friend.avatar || "/assets/img/trainers/hieu.jpg"}
                alt={friend.name}
                width={64}
                height={64}
                className="rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            </div>

            <div className="font-semibold text-gray-900 flex items-center gap-1">
              {friend.name}
              {friend.verified && (
                <FaCheckCircle
                  className="text-blue-500 text-sm ml-1"
                  title="Verified"
                />
              )}
            </div>

            <div className="flex items-center gap-1 mt-1 mb-2">
              {(mutualFriendsData[friend._id]?.mutualFriends || []).slice(0, 2).map((mf, idx) => (
                <Image
                  key={idx}
                  src={mf.avatar}
                  alt={mf.name}
                  width={20}
                  height={20}
                  className="rounded-full border-2 border-white -ml-2 first:ml-0 bg-white"
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">
                {mutualFriendsData[friend._id]?.count || 0} mutual friends
              </span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </>
  );
}
