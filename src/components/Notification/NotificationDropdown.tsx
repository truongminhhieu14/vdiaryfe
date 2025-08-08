import { useContext, useEffect, useRef, useState } from "react";
import { Bell, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import notificationApi from "@/services/notification.service";
import { INotification } from "@/types/notification.type";
import { AppContext } from "@/context/app.context";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { socket, user } = useContext(AppContext);


  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await notificationApi.getNotifications();
        setNotifications(res.data?.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification: INotification) => {
        console.log("🔥 Received new notification", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={notificationRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-5 h-5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white shadow-lg rounded-xl z-50">
          <div className="p-3 border-b font-semibold text-lg">Thông báo</div>
          <div className="flex gap-2 px-3 py-2 border-b">
            <button
              className={cn(
                "text-sm",
                filter === "all" && "font-semibold text-blue-600"
              )}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={cn(
                "text-sm",
                filter === "unread" && "font-semibold text-blue-600"
              )}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc
            </button>
          </div>
          <ul className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <li className="text-center text-sm text-gray-500 py-6">
                Đang tải...
              </li>
            ) : filtered.length === 0 ? (
              <li className="text-center text-sm text-gray-500 py-6">
                Không có thông báo nào
              </li>
            ) : (
              filtered.map((n) => (
                <li
                  key={n._id}
                  className="flex gap-3 items-start p-3 hover:bg-gray-50"
                >
                  <img
                    src={n.senderId.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">
                      {n.senderId.name || "Người dùng"}
                    </span>{" "}
                    {n.type === "comment"
                      ? "đã bình luận bài viết của bạn."
                      : "đã thích bài viết của bạn."}
                    <div className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  {!n.isRead && <Dot className="text-blue-500" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
