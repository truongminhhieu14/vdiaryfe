import { IComment } from "@/types/comment.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getSocket } from "@/utils/socket";
import commentApi from "@/services/comment.service";
import { IoMdSend } from "react-icons/io";

type Props = {
  className?: string;
  comment: IComment;
};

export default function Comment({ className, comment }: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<IComment[]>([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchReplies = async () => {
      if (showReplies && comment._id) {
        try {
          const res = await commentApi.getChildComments(comment._id.toString());
          setReplies(res.data);
        } catch (err) {
          console.error("Lỗi khi fetch replies:", err);
        }
      }
    };

    fetchReplies();
  }, [showReplies, comment._id]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNewChildComment = (data: {
      parentCommentId: string;
      newComment: IComment;
    }) => {
      if (data.parentCommentId === comment._id) {
        setReplies((prev) => [...prev, data.newComment]);
      }
    };

    socket.on("new-child-comment", handleNewChildComment);
    return () => {
      socket.off("new-child-comment", handleNewChildComment);
    };
  }, [comment._id]);

  const handleSubmitReply = async () => {
    if (!commentText.trim() || !user) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("send-comment", {
        text: commentText,
        postId: comment.postId,
        author: user._id,
        parentId: comment._id,
        mentions: [],
      });
      setCommentText("");
    }
  };
  return (
    <div className={`${className} flex flex-col gap-2`}>
      {/* Parent comment */}
      <div className="flex items-start">
        <Image
          src={comment.author.avatar || "/assets/img/user.png"}
          alt="avt"
          width={40}
          height={40}
          className="object-cover w-10 h-10 mr-4 rounded-full"
        />
        <div className="text-sm flex-1">
          <p className="font-semibold mr-2">{comment.author.name}</p>
          <p>{comment.text}</p>
          <p className="text-xs text-slate-400 my-1">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
            <button
              onClick={() => {
                setShowReplyInput((prev) => {
                  const nextState = !prev;
                  if (!prev) {
                    setCommentText(`@${comment.author.name} `);
                  } else {
                    setCommentText("");
                  }
                  return nextState;
                });
              }}
              className="hover:underline"
            >
              {showReplyInput ? "Hủy" : "Trả lời"}
            </button>

            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:underline"
            >
              {showReplies ? "Hide replies" : "View replies"}
            </button>
          </div>
        </div>
      </div>
      {/* Child comments */}
      {showReplies && (
        <div className="ml-6 flex flex-col gap-2 relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300" />

          {replies.map((reply) => (
            <div key={reply._id} className="flex items-start gap-2 relative">
              <div className="w-6 flex justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
              </div>

              {/* Bình luận con */}
              <div className="flex-1">
                <Comment comment={reply} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showReplyInput && (
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
                  handleSubmitReply();
                }
              }}
              placeholder="Viết phản hổi "
              className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <IoMdSend
              className="absolute right-3 top-2.5 text-blue-500 cursor-pointer"
              onClick={handleSubmitReply}
            />
          </div>
        </div>
      )} 
    </div>
  );
}
