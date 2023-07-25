import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { InputBase, useTheme, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { setPost } from "state";
import useApi from "customHooks/useApi";

const CommentWidget = ({ postId, commentId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [comment, setComment] = useState("");
  const { palette } = useTheme();
  const { _id, picturePath } = useSelector((state) => state.user);
  const { fetchData } = useApi();

  const handleComment = async () => {
    const data = await fetchData(
      `posts/${postId}/comment`,
      "POST",
      {
        userId: _id,
        comment: comment,
        parentId: commentId,
      },
      token
    );
    if (data) {
      dispatch(setPost({ post: data }));
      setComment("");
    }
  };

  return (
    <FlexBetween gap="1.5rem" sx={{ padding: "1rem 0 0.75rem 0" }}>
      <UserImage image={picturePath} size="45px" />
      <InputBase
        placeholder="Add a comment..."
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "2rem",
          padding: "0.4rem 1.5rem",
        }}
      />
      {comment && (
        <IconButton onClick={handleComment}>
          <SendIcon />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default CommentWidget;
