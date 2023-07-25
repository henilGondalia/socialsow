import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";

export default function BasicMenu({
  anchorEl,
  handleClose,
  open,
  notifications,
}) {
  const user = useSelector((state) => state.user);

  const getSender = (users) => {
    return users[0]._id === user._id ? users[1] : users[0];
  };

  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {!notifications.length ? (
        <MenuItem onClick={handleClose}>No New Notification</MenuItem>
      ) : (
        notifications.map((notification) => {
          return (
            <MenuItem onClick={handleClose} key={notification._id}>
              {notification.chat.isGroupChat
                ? `New Message in ${notification.chat.chatName}`
                : `New Message from ${
                    getSender(notification.chat.users).firstName
                  }`}
            </MenuItem>
          );
        })
      )}
    </Menu>
  );
}
