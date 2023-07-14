import { Box } from "@mui/material";
import { configUrl } from "config";

const UserImage = ({ image, size = "60px", bg = "none" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          backgroundColor: bg,
        }}
        width={size}
        height={size}
        alt="user"
        crossOrigin="anonymous"
        src={`${configUrl}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
