import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import TypingLoader from "components/TypingLoader";

const ChatMessages = ({ messages, isTyping }) => {
  const _id = useSelector((state) => state.user._id);
  const { palette } = useTheme();

  const isSameUser = (messages, message, index) => {
    return (
      index !== 0 &&
      index - 1 >= 0 &&
      messages[index - 1].sender._id === message.sender._id
    );
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: `${
                message.sender._id === _id ? "row-reverse" : "row"
              }`,
            }}
            key={message._id}
          >
            <span
              style={{
                backgroundColor: `${
                  // message.sender._id === _id ? "#BEE3F8" : "#B9F5D0"
                  message.sender._id === _id
                    ? palette.primary.light
                    : palette.primary.main
                }`,
                marginTop: isSameUser(messages, message, index)
                  ? "3px"
                  : "10px",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </Box>
        ))}
      {isTyping && <TypingLoader />}
    </ScrollableFeed>
  );
};
export default ChatMessages;
