import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

const ChatMessages = ({ messages }) => {
  const _id = useSelector((state) => state.user._id);

  const isSameUser = (messages, message, index) => {
    // console.log(i === messages.length - 1);
    return (
      index != 0 &&
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
                  message.sender._id === _id ? "#BEE3F8" : "#B9F5D0"
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
    </ScrollableFeed>
  );
};
export default ChatMessages;
