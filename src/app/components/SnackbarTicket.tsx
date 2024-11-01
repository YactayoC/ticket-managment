import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface Props {
  openSnackbar: boolean;
  setOpenSnackbar: (value: boolean) => void;
  snackbarMessage: string;
}

const SnackbarTicket = (props: Props) => {
  const { openSnackbar, setOpenSnackbar, snackbarMessage } = props;

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity="error"
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarTicket;
