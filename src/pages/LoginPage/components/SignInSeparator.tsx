import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';

export function SignInSeparator() {
  const lineStyle = {
    backgroundColor: '#DDDDDD',
    height: '1px',
    flex: 1,
  };

  const orTextStyle = {
    color: '#999999',
    margin: '0 16px',
  };

  return (
    <Grid container alignItems="center">
      <Divider style={lineStyle} />
      <Grid item style={orTextStyle}>
        or
      </Grid>
      <Divider style={lineStyle} />
    </Grid>
  );
}
