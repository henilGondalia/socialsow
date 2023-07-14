import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlexBetween from "./FlexBetween";

const ModelWrapper = ({ children, open, onClose, palette, title }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        padding="2rem 0"
        sx={{
          transform: "translate(-50%, -50%)",
          minWidth: "50%",
          height: "80%",
          overflow: "hidden",
        }}
        borderRadius="10px"
        backgroundColor={palette.background.alt}
      >
        <FlexBetween gap="3rem" padding="0 6% 1rem">
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            fontWeight="500"
          >
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </FlexBetween>
        {children}
      </Box>
    </Modal>
  );
};

export default ModelWrapper;
