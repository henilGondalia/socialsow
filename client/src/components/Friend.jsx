import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, UpdatePostAfterDelete } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import MoreOption from "components/MoreOption";
import useApi from "customHooks/useApi";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { fetchData } = useApi();

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend =
    (friends.length > 0 && friends.find((friend) => friend._id === friendId)) ||
    false;
  const isSelf = friendId === _id;

  const patchFriend = async () => {
    const data = await fetchData(
      `users/${_id}/${friendId}`,
      "PATCH",
      null,
      token
    );
    if (data) {
      dispatch(setFriends({ friends: data }));
    }
  };

  const onClicKDelete = async () => {
    const data = await fetchData(`posts/${postId}`, "DELETE", null, token);
    if (data) {
      dispatch(UpdatePostAfterDelete({ post: data }));
    }
  };

  return (
    <FlexBetween key={friendId}>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {!isSelf ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : (
        <MoreOption id="post-options-menu" onClicKDelete={onClicKDelete} />
      )}
    </FlexBetween>
  );
};

export default Friend;
