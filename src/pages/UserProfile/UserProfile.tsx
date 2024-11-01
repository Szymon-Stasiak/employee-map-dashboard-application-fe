import { useGetEmployeeById, useGetEmployeeImage } from '../../utils/api.ts';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Divider, FormControl, LinearProgress, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import placeHolder from './images/user-profile-placeholder.jpg';

function UserProfile() {
  const { userId } = useParams<string>();

  if (userId) {
    return <LoadedUserProfile userId={userId} />;
  } else {
    return (
      <Typography variant="h3" color="primary">
        Invalid user ID
      </Typography>
    );
  }
}

function LoadedUserProfile({ userId }: { userId: string }) {
  const { data: employeeData, isLoading, isError } = useGetEmployeeById(userId);
  const { data: employeeImageUrl } = useGetEmployeeImage(employeeData ? employeeData.email : '');

  if (isLoading) {
    return (
      <>
        <Typography color="text.primary">Loading...</Typography>
        <LinearProgress color={'secondary'} />
      </>
    );
  }

  if (isError) {
    return (
      <Typography variant="h3" color="primary">
        Error loading user data
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h3" color="primary">
        {employeeData.fullName}
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ pt: '20px' }}>
        <Grid item xs={3}>
          {employeeImageUrl ? (
            <img
              src={employeeImageUrl}
              style={{
                width: '100%',
                height: '80%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src={placeHolder} // Replace with the path to your placeholder image
              style={{
                width: '100%',
                height: '80%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          )}
        </Grid>
        <Grid item xs={9}>
          <Stack spacing={2}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={employeeData.email}
            />
            <Grid container spacing={0} justifyContent={'space-between'} columns={30}>
              <Box sx={{ display: 'flex', flex: 1, gap: '16px' }}>
                <FormControl fullWidth>
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    id="department-select"
                    value={employeeData.department}
                    label="Department"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    id="position-select"
                    value={employeeData.position}
                    label="Position"
                  />
                </FormControl>

                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  id="squad"
                  label="Squad"
                  variant="outlined"
                  fullWidth
                  value={employeeData.squad}
                />
              </Box>
            </Grid>
            <Divider />
            <Typography color="text.primary">Address</Typography>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="street"
              label="Street address"
              variant="outlined"
              fullWidth
              value={employeeData.address.street}
            />
            <Box sx={{ display: 'flex', flex: 1, gap: '16px' }}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="city"
                label="City"
                variant="outlined"
                fullWidth
                value={employeeData.address.city}
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                id="state-select"
                value={employeeData.address.state}
                label="State / Province"
              />
            </Box>
            <Box sx={{ display: 'flex', flex: 1, gap: '16px' }}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="postcode"
                label="Postcode"
                variant="outlined"
                fullWidth
                value={employeeData.address.postCode}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                id="country-select"
                value={employeeData.address.country}
                label="Country"
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default UserProfile;
