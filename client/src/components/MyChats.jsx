import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const MyChats = ({
  chat,
  name,
  profilePic,
  selectedChat,
  setSelectedChat,
  customPadding = "16px",
  size,
  showleatestMessage = false,
}) => {
  const { palette } = useTheme();
  const neutralLight = palette.neutral.light;
  const alt = palette.background.alt;

  return (
    <>
      <FlexBetween
        onClick={() => setSelectedChat(chat)}
        bgcolor={
          selectedChat && selectedChat._id === chat._id ? neutralLight : alt
        }
        padding={customPadding}
        key={chat._id}
        sx={{
          "&:hover": {
            backgroundColor: palette.primary.light,
            cursor: "pointer",
          },
        }}
      >
        <FlexBetween padding="0" gap="1rem">
          <UserImage
            image={profilePic}
            size={size}
            bg={palette.primary.light}
          />
          <Box>
            <Typography>{name}</Typography>
            {showleatestMessage && chat.latestMessage && (
              <Typography fontSize="xs">
                <b>{chat.latestMessage.sender.name} : </b>
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content}
              </Typography>
            )}
          </Box>
        </FlexBetween>
      </FlexBetween>
      <Divider />
    </>
  );
};

export default MyChats;
