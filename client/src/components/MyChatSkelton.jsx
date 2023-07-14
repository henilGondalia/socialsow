import { Box, Divider, Skeleton, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const MyChatSkelton = ({ customPadding = "16px" }) => {
  return (
    <>
      <FlexBetween padding={customPadding}>
        <FlexBetween padding="0" gap="1rem" width="100%">
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
          <Box width="90%">
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="40%" />
          </Box>
        </FlexBetween>
      </FlexBetween>
      <Divider />
    </>
  );
};

export default MyChatSkelton;
