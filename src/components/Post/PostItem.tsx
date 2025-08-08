"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import useLikeCount from "../LikeOfPost/LikeCount";
import useCommentCount from "@/hook/useCommentCount";
import { AiFillHeart } from "react-icons/ai";
import likeApi from "@/services/like.service";
import DetailPost from "../DetailPost/DetailPost";
import { LikeUser } from "@/types/like.type";
import { FaGlobeAsia, FaLock, FaUserFriends } from "react-icons/fa";
import LikeListModal from "../LikeOfPost/LikeIsPost";

const PostItem = ({ post }: { post: any }) => {
  const formattedTime = moment(post.createdAt).fromNow();
  const { likeCount, loading } = useLikeCount(post._id);

  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [likeUsers, setLikeUsers] = useState<LikeUser[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const { count: commentsCount, loading: loadingCommentCount } =
    useCommentCount(post._id);

  useEffect(() => {
    const fetchLikeState = async () => {
      try {
        const res = await likeApi.checkIsLiked(post._id);
        setIsLiked(res.data.isLiked);
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái like:", error);
      }
    };
    fetchLikeState();
    setLocalLikeCount(likeCount);
  }, [post._id, likeCount]);

  const handleOpenModal = async () => {
    // const res = await likeApi.seeAllLikes(post._id);
    // setLikeUsers(res.data.data);
    setShowLikeModal(true);
  };

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const action = isLiked ? "unlike" : "like";
    await likeApi.handleLike(post._id, action);
    setLocalLikeCount((prev) => prev + (isLiked ? -1 : 1));
    setIsLiked((prev) => !prev);
    setIsLiking(false);
  };

  return (
    <div className="bg-white max-w-xl rounded-lg shadow-md p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img
            src={post.author.avatar || "/assets/img/user.png"}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              {post.author.name}
            </p>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{formattedTime}</span>
              <span>•</span>
              {post.privacy === "public" && (
                <span className="flex items-center space-x-1">
                  <FaGlobeAsia />
                  <span>Công khai</span>
                </span>
              )}
              {post.privacy === "friends" && (
                <span className="flex items-center space-x-1">
                  <FaUserFriends />
                  <span>Bạn bè</span>
                </span>
              )}
              {post.privacy === "private" && (
                <span className="flex items-center space-x-1">
                  <FaLock />
                  <span>Chỉ mình tôi</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      {/* Nội dung bài viết */}
      {post.caption?.startsWith("http") && post.links?.[0] ? (
        <a
          href={post.links[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-3 leading-relaxed"
        >
          {post.links[0].url}
        </a>
      ) : (
        <p className="text-gray-800 mb-3 leading-relaxed">{post.caption}</p>
      )}
      {/* Ảnh */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <div className="mb-3">
          {post.images.length === 1 && (
            <img
              src={post.images[0]}
              alt="post-img-0"
              className="w-full h-auto object-cover rounded-lg"
            />
          )}

          {post.images.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {post.images.length === 3 && (
            <div className="grid grid-cols-3 gap-2">
              {post.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {post.images.length > 3 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 3).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`post-img-${i}`}
                  className="w-full h-[200px] object-cover rounded-lg"
                />
              ))}
              <div className="relative">
                <img
                  src={post.images[3]}
                  alt="post-img-3"
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                {post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg text-white text-xl font-bold">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Video */}
      {post.videos?.length > 0 && (
        <div className="mb-3">
          {post.videos.length === 1 && (
            <video
              src={post.videos[0]}
              controls
              className="w-full max-h-[500px] rounded-lg"
            />
          )}

          {post.videos.length === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {post.videos.map((video: string, index: number) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className="w-full max-h-[400px] rounded-lg"
                />
              ))}
            </div>
          )}

          {post.videos.length > 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {post.videos.map((video: string, index: number) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className="w-full max-h-[400px] rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* Link Preview */}
      {Array.isArray(post.links) && post.links.length > 0 && (
        <div className="mb-3 space-y-3">
          {post.links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Nếu có ảnh thu nhỏ */}
              {link.image && (
                <img
                  src={link.image}
                  alt={link.title || "Link preview"}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="p-3 bg-gray-50">
                <p className="font-semibold text-gray-800 truncate">
                  {link.title || link.url}
                </p>
                {link.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {link.description}
                  </p>
                )}
                <p className="text-xs text-blue-600 mt-1 truncate">
                  {link.url}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Like + Comment count */}
      <div className="flex justify-between items-center text-gray-500 text-sm mb-3 border-b pb-3 border-gray-100">
        <div className="flex items-center" onClick={handleOpenModal}>
          <AiFillHeart className="text-xl text-red-600" />
          <span>
            {isLiking || loading ? "Đang tải..." : localLikeCount + " like"}
          </span>
        </div>
        <div>
          <span>
            {loadingCommentCount ? "Đang tải..." : `${commentsCount}`} bình luận
          </span>
        </div>
      </div>

      {/* Nút tương tác */}
      <div className="flex justify-around items-center text-gray-600 text-sm font-semibold">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1 ${
            isLiked ? "text-blue-600" : ""
          }`}
        >
          <i className="fas fa-smile mr-2"></i>
          <span>{isLiked ? "Đã thích" : "Cảm xúc"}</span>
        </button>

        <button className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1">
          <i className="fas fa-award mr-2"></i>
          <span>Huy hiệu</span>
        </button>

        <button
          onClick={() => setShowDetail(true)}
          className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1"
        >
          <i className="fas fa-comment-alt mr-2"></i>
          <span>Bình luận</span>
        </button>

        <button className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1 justify-center mx-1">
          <i className="fas fa-share-alt mr-2"></i>
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Lượt xem */}
      <div className="text-right text-gray-500 text-sm mt-3 pt-3 border-t border-gray-100">
        <i className="fas fa-eye mr-1"></i>
        <span>{post.viewsCount || 0} lượt xem</span>
      </div>

      {showLikeModal && (
        <LikeListModal isOpen postId={post._id} onClose={() => setShowLikeModal(false)} />
      )}
      {showDetail && (
        <DetailPost
          isOpen
          postId={post._id}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default PostItem;
