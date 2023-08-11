import { styled } from "@mui/system";

const UpDownMove = styled("img")({
  animation: "mymove 3s ease-out infinite alternate",
  position: "absolute",
  width: "20%",
  height: "auto",
  top: "4rem",

  "@keyframes mymove": {
    from: {
      top: "4rem",
    },
    to: {
      top: "20rem",
    },
  },
});

export default UpDownMove;
