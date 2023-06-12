import { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { configUrl } from "config";

const Comment = ({ userId, comment, key }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

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
    <FlexBetween gap="1.5rem" key={key} sx={{ paddingBottom: "0.75rem" }}>
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
  );
};

export default Comment;
