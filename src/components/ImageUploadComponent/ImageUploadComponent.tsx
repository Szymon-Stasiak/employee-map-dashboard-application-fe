import { ChangeEvent, useState } from 'react';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useGetEmployeeImage, useUploadEmployeeImage } from '../../utils/api.ts';
import { jwtDecode } from 'jwt-decode';
import CustomJwtPayload from '../../utils/CustomJwtPayload.ts';
import { useAuth } from '../auth/AuthContext.tsx';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { StyledButtonRadius100 } from '../buttons/CustomButton.ts';
import CustomSnackbar from '../snackbars/CustomSnackbar.tsx';

const ImageUploadComponent = () => {
  const [selectedImage, setSelectedImage] = useState<File | null | undefined>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { mutate: uploadEmployeeImage, isLoading, isSuccess, isError } = useUploadEmployeeImage();
  const auth = useAuth();
  const decodedToken = auth?.isLoggedIn
    ? (jwtDecode(localStorage.getItem('token') ?? '') as CustomJwtPayload)
    : undefined;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
  };
  const handleUpload = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('employeeId', decodedToken?.id ?? '');
      formData.append('file', selectedImage);
      uploadEmployeeImage(formData, {
        onSuccess: () => {
          setShowSnackbar(true);
        },
        onError: () => {
          setShowSnackbar(true);
        },
      });
    }
  };

  const { data: employeeImageUrl } = useGetEmployeeImage(auth?.userEmail ? auth.userEmail : '');

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Box sx={{ padding: 0, textAlign: 'center', height: '100%' }}>
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="contained-button-file">
            <Tooltip title="Change Profile Picture">
              <Button
                sx={{ cursor: 'pointer', marginBottom: 2, width: '250px', height: '250px', position: 'relative' }}
                color="primary"
                component="span"
              >
                {selectedImage || employeeImageUrl ? (
                  <img
                    src={selectedImage ? URL.createObjectURL(selectedImage!) : employeeImageUrl}
                    alt="Selected"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      border: '2px dashed #aaa',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      +
                    </Typography>
                  </Box>
                )}
              </Button>
            </Tooltip>
          </label>

          {isLoading && <CircularProgress sx={{ marginBottom: 2 }} />}
          <StyledButtonRadius100
            variant={!selectedImage || isLoading ? 'outlined' : 'contained'}
            color="primary"
            onClick={handleUpload}
            disabled={!selectedImage || isLoading}
            sx={{ width: '250px', mt: 2 }}
          >
            Save Profile Picture
          </StyledButtonRadius100>
        </Box>
      </Grid>

      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        status={isSuccess ? 'success' : 'error'}
        message={isSuccess ? 'Profile Picture Saved' : isError ? 'Saving Photo Failed' : ''}
      />
    </>
  );
};

export default ImageUploadComponent;
