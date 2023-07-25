import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import CommentWidget from "./CommentWidget";
import Comment from "components/Comment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removeUnBookmarkedPost, setBookmarks } from "state";
import { configUrl } from "config";
import useApi from "customHooks/useApi";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  page,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const bookmarkedPosts = useSelector((state) => state.user.bookmarks);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { fetchData } = useApi();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const data = await fetchData(
      `posts/${postId}/like`,
      "PATCH",
      { userId: loggedInUserId },
      token
    );
    if (data) {
      dispatch(setPost({ post: data }));
    }
  };

  const bookMarkPost = async () => {
    const data = await fetchData(
      `users/${loggedInUserId}/bookmark`,
      "POST",
      { userId: loggedInUserId, postId: postId },
      token
    );
    if (data) {
      if (page === "isSaved") {
        dispatch(removeUnBookmarkedPost({ postId: postId }));
      }
      dispatch(setBookmarks({ bookmarks: data }));
    }
  };

  const isPostBookmarked = (postId) => {
    return bookmarkedPosts.includes(postId);
  };
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          crossOrigin="anonymous"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${configUrl}/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>

          <IconButton onClick={bookMarkPost}>
            {isPostBookmarked(postId) ? (
              <BookmarkAddedIcon />
            ) : (
              <BookmarkAddOutlinedIcon />
            )}
          </IconButton>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <Divider />
          <CommentWidget postId={postId} />
          {comments.map((comment, i) => (
            <Comment
              userId={comment.userId}
              commentId={comment._id}
              comment={comment.comment}
              postId={postId}
              key={`${name}-${i}`}
            />
          ))}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
