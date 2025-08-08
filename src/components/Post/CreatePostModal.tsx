import postApi, { CreatePostPayload } from "@/services/post.service";
import { addPost } from "@/store/postSlice";
import { LinkMeta } from "@/types/post.type";
import { uploadImage, uploadVideo } from "@/utils/uploadImage";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const actions = [
  { label: "Bài đăng", icon: "📝" },
  { label: "Thiết kế ảnh", icon: "🎨" },
  { label: "Hình ảnh", icon: "🖼️" },
  { label: "Video", icon: "🎬" },
  { label: "Phát trực tiếp", icon: "📺" },
  { label: "Mp3", icon: "🎵" },
  { label: "Tài liệu", icon: "📄" },
  { label: "Thẻ", icon: "🙋" },
  { label: "Đóng góp", icon: "🤝" },
  { label: "Khảo sát", icon: "📊" },
  { label: "Sự kiện", icon: "📅" },
  { label: "Hành động", icon: "🎯" },
  { label: "Địa chỉ", icon: "📍" },
  { label: "Gửi vị trí", icon: "📡" },
];

export default function CreatePostModal({
  open,
  onClose,
}: CreatePostModalProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState<"public" | "friends">("public");
  const [links, setLinks] = useState<LinkMeta[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matched = caption.match(urlRegex);

      if (matched && matched[0]) {
        const url = matched[0];
        const alreadyExists = links.some((link) => link.url === url);
        if (alreadyExists) return;

        try {
          const res = await postApi.getLinkMetadata(url);
          if (res?.data.data) {
            setLinks((prev) => [...prev, res.data.data[0]]);
          }
        } catch (error) {
          console.error("Không thể lấy metadata:", error);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [caption]);
  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedVideos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewVideos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
    setPreviewVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrls = await Promise.all(
        selectedImages.map((file) => uploadImage(file))
      );
      const videoUrls = await Promise.all(
        selectedVideos.map((file) => uploadVideo(file))
      );

      const payload: CreatePostPayload = {
        caption,
        images: imageUrls,
        videos: videoUrls,
        links: links,
        hashtags: [],
        mentions: [],
        privacy,
      };

      const res = await postApi.createPost(payload);
      toast.success("Đăng bài viết thành công!");
      dispatch(addPost(res.data.result));

      // Reset state
      setCaption("");
      setSelectedImages([]);
      setPreviewImages([]);
      setSelectedVideos([]);
      setPreviewVideos([]);
      onClose();
    } catch (error) {
      console.error("Tạo bài viết thất bại:", error);
      toast.error("Tạo bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] p-4 relative overflow-hidden flex flex-col">
        <button className="absolute top-3 right-3" onClick={onClose}>
          ×
        </button>

        <h2 className="text-xl font-semibold text-center mb-2">Create Post</h2>

        <div className="overflow-y-auto pr-2 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <select
              value={privacy}
              onChange={(e) =>
                setPrivacy(e.target.value as "public" | "friends")
              }
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="public">Công khai</option>
              <option value="friends">Bạn bè</option>
            </select>
            <span className="text-gray-500 text-sm">Quyền riêng tư</span>
          </div>

          <textarea
            className="w-full border rounded p-2 text-sm mb-4"
            placeholder="Thêm mô tả..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {links.length > 0 && (
            <ul className="mb-4 space-y-2">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="relative flex border rounded overflow-hidden shadow bg-gray-50"
                >
                  {link.image ? (
                    <img
                      src={link.image}
                      alt="preview"
                      className="w-32 h-32 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}

                  <div className="p-3 flex-1 overflow-hidden">
                    <p className="font-semibold text-sm line-clamp-2">
                      {link.title || "No title"}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {link.description || "No description"}
                    </p>
                    <a
                      href={link.url}
                      className="text-xs text-blue-600 mt-1 block truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url}
                    </a>
                  </div>

                  <button
                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full px-2"
                    onClick={() => handleRemoveLink(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt="preview" className="h-24 rounded shadow" />
                <button
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {previewVideos.map((src, index) => (
              <div key={index} className="relative">
                <video src={src} controls className="h-24 rounded shadow" />
                <button
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                  onClick={() => handleRemoveVideo(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-4 mb-4">
            {actions.map((action) => {
              const isImage = action.label === "Hình ảnh";
              const isVideo = action.label === "Video";

              return (
                <button
                  key={action.label}
                  className="flex flex-col items-center p-2 hover:bg-gray-100 rounded"
                  type="button"
                  onClick={
                    isImage
                      ? () => imageInputRef.current?.click()
                      : isVideo
                      ? () => videoInputRef.current?.click()
                      : undefined
                  }
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs mt-1">{action.label}</span>
                </button>
              );
            })}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <input
            type="file"
            accept="video/*"
            multiple
            ref={videoInputRef}
            style={{ display: "none" }}
            onChange={handleVideoChange}
          />
        </div>

        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang đăng..." : "Tiếp theo"}
        </button>
      </div>
    </div>
  );
}
