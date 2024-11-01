import React, { forwardRef } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type SnackbarProps = {
  status: 'success' | 'info' | 'warning' | 'error';
  message: string;
  open: boolean;
  onClose: () => void;
  color?: string;
  autoHideDuration?: number;
  anchorOrigin?: { vertical: 'bottom' | 'top'; horizontal: 'center' | 'left' | 'right' };
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomSnackbar(props: SnackbarProps) {
  return (
    <React.Fragment>
      <Snackbar
        open={props.open}
        autoHideDuration={props.autoHideDuration}
        onClose={props.onClose}
        anchorOrigin={props.anchorOrigin}
      >
        <Alert severity={props.status} sx={{ width: '100%', backgroundColor: props.color }}>
          {props.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
