"use client";

import { useEffect, useRef, useState } from "react";
import likeApi from "@/services/like.service";
import Image from "next/image";
import useDisableBodyScroll from "@/hook/useDisableBodyScroll";

interface LikeUser {
  _id: string;
  name: string;
  avatar: string;
}

interface Props {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LikeListModal({ postId, isOpen, onClose }: Props) {
  const [likeUsers, setLikeUsers] = useState<LikeUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readyToObserve, setReadyToObserve] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const LIMIT = 10;

  const fetchLikes = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await likeApi.seeAllLikes(postId, pageNum, LIMIT);
      const newLikes: LikeUser[] = res.data.data;
      const hasMore = newLikes.length === LIMIT;

      if (pageNum === 1) {
        setLikeUsers(newLikes);
      } else {
        setLikeUsers((prev) => {
          const ids = new Set(prev.map((u) => u._id));
          const filtered = newLikes.filter((u) => !ids.has(u._id));
          return [...prev, ...filtered];
        });
      }

      setHasMore(hasMore);
    } catch (err: any) {
      setError("Không thể tải danh sách đã thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      setLikeUsers([]);
      setPage(1);
      setHasMore(true);
      setReadyToObserve(false);

      fetchLikes(1).then(() => {
        setReadyToObserve(true);
      });
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (page === 1 || !readyToObserve) return;
    fetchLikes(page);
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || !readyToObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1, rootMargin: "0px 0px 100px 0px" }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading, readyToObserve]);

  useDisableBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-[400px] max-h-[80vh] rounded-xl relative flex flex-col">
        {/* Header - cố định */}
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách người đã thích</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* Scrollable danh sách */}
        <div className="overflow-y-auto px-6 pb-6 space-y-4 flex-1">
          {likeUsers.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <Image
                src={user.avatar || "/assets/img/user.png"}
                alt={user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{user.name}</span>
            </div>
          ))} 
          
          {hasMore && <div ref={loadMoreRef} className="h-10" />}
        </div>
      </div>
    </div>
  );
}
