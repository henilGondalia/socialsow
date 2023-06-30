import { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { configUrl } from "config";
// import CommentWidget from "../screens/widgets/CommentWidget";

const Comment = ({ userId, commentId, comment, postId, key }) => {
  const [user, setUser] = useState(null);
  const [reply, setReply] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const getUser = async () => {
    const response = await fetch(`${configUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  return (
    <>
      <FlexBetween gap="1.5rem" key={key}>
        <UserImage image={user.picturePath} size="45px" />
        <Box
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "0.2rem",
            padding: "0 0.6rem",
          }}
        >
          <FlexBetween>
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              fontSize="14px"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                navigate(`/profile/${userId}`);
                navigate(0);
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </FlexBetween>
          <Typography color={medium} fontSize="0.75rem" marginTop="-8px">
            {user.location}
          </Typography>
          <Typography sx={{ color: main, m: "0.5rem 0" }}>{comment}</Typography>
        </Box>
      </FlexBetween>
      {/* <FlexBetween
        gap="1.5rem"
        key={key}
        sx={{ paddingBottom: "0.75rem", justifyContent: "flex-start" }}
      >
        <Box
          sx={{
            width: "45px",
          }}
        ></Box>
        <Box
          sx={{
            padding: "0 0.6rem",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={() => setReply(commentId)}
        >
          <Typography color={medium} fontSize="0.75rem">
            Reply
          </Typography>
          {reply === commentId && (
            <CommentWidget postId={postId} commentId={commentId} />
          )}
        </Box>
      </FlexBetween> */}
    </>
  );
};

export default Comment;
