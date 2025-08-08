import Image from "next/image";
import {
  FaHeart,
  FaStar,
  FaShareAlt,
  FaCommentDots,
  FaTimes,
} from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { IPost } from "@/types/post.type";
import Modal from "../Modal/modal";
import { useEffect, useState } from "react";
import postApi from "@/services/post.service";
import useDisableBodyScroll from "@/hook/useDisableBodyScroll";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CommentList from "../Comment/CommentList";
import { getSocket } from "@/utils/socket";
import useCommentCount from "@/hook/useCommentCount";

interface DetailPostProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

export default function DetailPost({
  isOpen,
  postId,
  onClose,
}: DetailPostProps) {
  const [post, setPost] = useState<IPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const { count: commentCount, loading: loadingCommentCount } = useCommentCount(postId);
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    const fetchPost = async () => {
      const res = await postApi.getPostByPostId(postId);
      setPost(res.data.data);
    };
    fetchPost();
  }, [postId]);
  const handleSendComment = async () => {
  if (!commentText.trim() || !user) return;

  const socket = getSocket();
  if (socket) {
    socket.emit("send-comment", {
      text: commentText,
      postId,
      author: user._id,
      parentId: null,
      mentions: [], 
    });
    
    setCommentText(""); 
  }
};
  useDisableBodyScroll(isOpen);
  if (!isOpen) return null;
  if (!post) return <p>Đang tải bài viết...</p>;
 
  return (
    <Modal>
      <div className="relative max-w-2xl max-h-[90vh] mx-auto bg-white shadow-lg rounded-md overflow-hidden mt-6">
        <div className="overflow-y-auto max-h-[85vh]">
          {/* Nút đóng modal */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-2 z-10"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="flex items-start p-4">
            <Image
              src={post.author.avatar || "/assets/img/user.png"}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full object-cover w-12 h-12"
            />
            <div className="ml-3">
              <p className="font-semibold text-blue-600 flex items-center">
                {post.author.name}
                <span className="ml-1 text-green-500">🛡️</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
              {post.caption && (
                <p className="text-gray-800 text-base mt-1">{post.caption}</p>
              )}
            </div>
          </div>

          {/* Image */}
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

          {/* Reactions */}
          <div className="flex justify-between items-center text-gray-500 text-sm px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <FaHeart className="text-red-500" />
              <AiOutlineLike className="text-blue-500" />
              <span>{post.likes?.length || 0} lượt thích</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                <FaCommentDots className="inline mr-1" /> {loadingCommentCount ? "Đang tải..." : `${commentCount} comments`}
              </span>
              <span>
                <BsEye className="inline mr-1" /> 5
              </span>
            </div>
          </div>

          {/* Emoji bar */}
          <div className="flex items-center px-4 py-2 space-x-2 overflow-x-auto border-b">
            <span className="text-sm font-medium text-gray-600">Cảm xúc</span>
            <span className="text-2xl">🎉</span>
            <span className="text-2xl">😍</span>
            <span className="text-2xl">👏</span>
            <span className="text-2xl">❤️</span>
            <span className="text-2xl">🔥</span>
            <span className="text-2xl">😂</span>
            <span className="text-2xl">🤩</span>
            <span className="text-2xl">💯</span>
            <span className="ml-auto text-blue-500 cursor-pointer flex items-center text-sm">
              <FaStar className="mr-1" /> Huy hiệu
            </span>
            <FaShareAlt className="text-blue-500 cursor-pointer ml-2" />
          </div>

          {/* Comment input */}
          <div className="flex items-center px-4 py-3 w-full">
            <Image
              src={user?.avatar || "/assets/img/user.png"}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full object-cover w-8 h-8 mr-3"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                  }
                }}
                placeholder="Chia sẻ cảm nhận của bạn"
                className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <IoMdSend className="absolute right-3 top-2.5 text-blue-500 cursor-pointer" onClick={handleSendComment}/>
            </div>
          </div>
          {/* Danh sách comment (mock) */}
          <div className="px-4 pb-4 space-y-4" >
            <CommentList postId={postId}/>
          </div>
        </div>
      </div>
    </Modal>
  );
}
