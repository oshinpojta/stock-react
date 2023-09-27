import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';

function MyApp() {
  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('Subscribed!', { variant });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
    </React.Fragment>
  );
}

export default function Notification() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp />
    </SnackbarProvider>
  );
}