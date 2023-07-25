import * as React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { showSnackBar } from "state";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MySnackbar() {
  const open = useSelector((state) => state.showSnackBar);
  const serverMsg = useSelector((state) => state.serverMsg);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(showSnackBar({ showSnackBar: false }));
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={serverMsg.severity}
          sx={{ width: "100%" }}
        >
          {serverMsg.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
