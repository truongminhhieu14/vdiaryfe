import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";

type CommentInputProps = {
  onSubmitComment: (text: string) => void;
  mentionName?: string;
};

export default function CommentInput({onSubmitComment, mentionName}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const avatar = user?.avatar || "/assets/img/user.png";

  useEffect(() => {
    if (mentionName) {
      setComment(`@${mentionName} `);
      inputRef.current?.focus();
    }
  }, [mentionName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (trimmed) {
      onSubmitComment(trimmed);
      setComment("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-start gap-2 p-2 mt-2"
    >
      <img
        src={avatar}
        className="w-8 h-8 rounded-full object-cover mt-1"
        alt="User Avatar"
      />
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Viết phản hồi..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:opacity-40"
          disabled={!comment.trim()}
        >
          <IoMdSend size={18} />
        </button>
      </div>
    </form>
  );
}
