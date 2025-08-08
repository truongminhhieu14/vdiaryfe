import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPost } from "@/types/post.type";

interface PostState {
  posts: IPost[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts.unshift(action.payload);
    },
    appendPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
  }  
});

export const { setPosts, addPost, appendPosts } = postSlice.actions;
export default postSlice.reducer;
