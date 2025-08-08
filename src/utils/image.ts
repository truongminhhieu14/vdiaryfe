export const getImageUrl = (url?: string, fallback: string = "/assets/img/trainers/hieu.jpg") => {
  if (!url || url.trim() === "") {
    return fallback;
  }
  
  // Nếu là URL Cloudinary, trả về nguyên URL
  if (url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // Nếu là URL localhost (development), trả về nguyên URL
  if (url.includes('localhost')) {
    return url;
  }
  
  // Nếu là URL không hợp lệ hoặc không được hỗ trợ, trả về fallback
  return fallback;
};

export const getAvatarUrl = (avatar?: string) => {
  return getImageUrl(avatar, "/assets/img/trainers/hieu.jpg");
};

export const getBackgroundUrl = (background?: string) => {
  return getImageUrl(background, "/assets/img/bg1.jpg");
}; 