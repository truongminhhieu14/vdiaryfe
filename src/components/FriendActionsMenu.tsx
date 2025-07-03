import React from "react";
import {
  FaCommentDots, FaShareAlt, FaUserMinus, FaCopy, FaFolderPlus, FaEdit, FaUserFriends, FaUserPlus, FaUserCheck, FaLink, FaUser, FaTimes
} from "react-icons/fa";

const menuItems = [
  { icon: <FaCommentDots />, label: "Chat" },
  { icon: <FaShareAlt />, label: "Quick share" },
  { icon: <FaEdit />, label: "Create new post" },
  { icon: <FaUserFriends />, label: "Share with friends" },
  { icon: <FaUserPlus />, label: "Share to page" },
  { icon: <FaUserCheck />, label: "Share to group" },
  { icon: <FaCommentDots />, label: "Send via message" },
  { icon: <FaUser />, label: "Switch to another app" },
  { icon: <FaLink />, label: "Copy link" },
  { icon: <FaFolderPlus />, label: "Add to folder" },
  { icon: <FaEdit />, label: "Rename" },
  { icon: <FaUserCheck />, label: "Pairing" },
  { icon: <FaUserMinus />, label: "Unfriend", danger: true },
];

export default function FriendActionsMenu({ onClose, onAction }: { onClose: () => void, onAction?: (action: string) => void }) {
  return (
    <div className="absolute right-0 top-12 z-30 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 px-1 animate-fade-in">
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100 shadow -z-10"></div>
      <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
        <FaTimes />
      </button>
      <ul className="pt-2">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <button
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left ${
                item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-800"
              }`}
              onClick={() => {
                if (onAction) onAction(item.label);
                onClose();
              }}
            >
              <span className={`text-lg ${item.danger ? "text-red-500" : "text-blue-500"}`}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}