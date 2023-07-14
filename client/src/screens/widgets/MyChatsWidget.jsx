import {
  Box,
  Typography,
  Divider,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import MyChats from "../../components/MyChats";

const MyChatsWidget = ({
  chats,
  selectedChat,
  setSelectedChat,
  setNewChatOpen,
}) => {
  const _id = useSelector((state) => state.user._id);
  const { palette } = useTheme();

  const getSender = (users) => {
    return users[0]._id === _id ? users[1] : users[0];
  };

  return (
    <WidgetWrapper height="100%">
      <FlexBetween gap="0.5rem" pb="1rem">
        <Typography fontSize="1rem" fontWeight="500" marginLeft="1rem">
          Message
        </Typography>
        <IconButton
          sx={{ backgroundColor: palette.primary.light, p: "0.6rem" }}
          onClick={() => setNewChatOpen(true)}
        >
          <PersonAddIcon />
        </IconButton>
      </FlexBetween>
      <Divider />
      <Box height="calc(100vh - 13rem )" sx={{ overflowY: "scroll" }}>
        {chats ? (
          chats.map((chat) => {
            return (
              <MyChats
                chat={chat}
                name={
                  !chat.isGroupChat
                    ? getSender(chat.users).firstName
                    : chat.chatName
                }
                profilePic={
                  !chat.isGroupChat
                    ? getSender(chat.users).picturePath
                    : "team.png"
                }
                key={chat._id}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                size="35px"
              />
            );
          })
        ) : (
          <Typography fontSize="1rem" fontWeight="500" marginLeft="1rem">
            No Users
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default MyChatsWidget;
