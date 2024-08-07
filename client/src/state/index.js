import { createSlice } from '@reduxjs/toolkit';

const initialServerMsg = {
  message: '',
  severity: 'success'
}

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  notifications: [],
  showSnackBar: false,
  serverMsg: initialServerMsg,
  isSearching: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload.isSearching;
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent :(');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    UpdatePostAfterDelete: (state, action) => {
      const updatedPosts = state.posts.filter((post) => post._id !== action.payload.post._id);
      state.posts = updatedPosts;
    },
    setBookmarks: (state, action) => {
      if (state.user) {
        state.user.bookmarks = action.payload.bookmarks;
      } else {
        console.error('Bookmarks non-existent :(');
      }
    },
    removeUnBookmarkedPost: (state, action) => {
      const updatedPosts = state.posts.filter((post) => post._id !== action.payload.postId);
      state.posts = updatedPosts;
    },
    setNotification: (state, action) => {
      state.notifications = action.payload.notifications
    },
    updateNotifications: (state, action) => {
      const updatedNotifications = state.notifications.filter((notification) => notification._id !== action.payload.notificationId);
      console.log("notificationId", updatedNotifications, state.notifications, action.payload)
      state.notifications = updatedNotifications;
    },
    showSnackBar: (state, action) => {
      state.showSnackBar = action.payload.showSnackBar
      state.serverMsg = action.payload.serverMsg || initialServerMsg
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setBookmarks,
  setPosts,
  setPost,
  UpdatePostAfterDelete,
  removeUnBookmarkedPost,
  setNotification,
  updateNotifications,
  showSnackBar,
  setIsSearching
} =
  authSlice.actions;
export default authSlice.reducer;
