import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Divider, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { StyledButtonRadius100 } from '../../components/buttons/CustomButton.ts';
import { Employee } from '../../models/Employee.ts';
import { useEditEmployee, useGetEmployeeById } from '../../utils/api.ts';
import { jwtDecode } from 'jwt-decode';
import CustomSnackbar from '../../components/snackbars/CustomSnackbar.tsx';
import CustomJwtPayload from '../../utils/CustomJwtPayload.ts';
import { useAuth } from '../../components/auth/AuthContext.tsx';
import { fullNameRegex } from '../../utils/Regex';
import HttpErrors from '../../utils/HttpErrors.ts';
import { AxiosError } from 'axios';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import MenuItem from '@mui/material/MenuItem';
import ImageUploadComponent from '../../components/ImageUploadComponent/ImageUploadComponent.tsx';

const inputFieldVariant = 'outlined';
const emptyEmployee: Employee = {
  fullName: '',
  position: '',
  squad: '',
  department: '',
  address: {
    street: '',
    city: '',
    state: '',
    postCode: '',
    country: '',
    lat: 0,
    lng: 0,
  },
  email: '',
  id: '',
};

type MyProfilePageProps = {
  isLoaded: boolean;
};

function MyProfile(props: MyProfilePageProps) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee>(emptyEmployee);
  const [fullNameError, setFullNameError] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (fullNameRegex.test(employeeData.fullName)) {
      setFullNameError('');
    }
  }, [employeeData.fullName]);

  const isFilled: boolean =
    Object.values(employeeData).every((value) => value !== '') &&
    Object.values(employeeData.address).every((value) => value !== '');

  useEffect(() => {
    setIsCorrect(isFilled && fullNameError === '');
  }, [employeeData, fullNameError, isFilled]);

  const decodedToken = auth?.isLoggedIn
    ? (jwtDecode(localStorage.getItem('token') ?? '') as CustomJwtPayload)
    : undefined;

  const { data: loadedEmployeData, isLoading } = useGetEmployeeById(decodedToken?.id ?? '');
  const { mutate: mutateEditEmployee, isSuccess, isError, error } = useEditEmployee();

  useEffect(() => {
    setEmployeeData(loadedEmployeData ?? emptyEmployee);
  }, [loadedEmployeData]);

  const handleEmployeeChangeValue = (key: string, value: string) => {
    setEmployeeData((data) => ({ ...data, [key]: value }));
  };

  const handleAddressChangeValue = (key: string, value: string) => {
    setEmployeeData((data) => ({ ...data, address: { ...data.address, [key]: value } }));
  };
  const handleSaveEmployeeClick = () => {
    const editedEmployee: Employee = employeeData;
    mutateEditEmployee(editedEmployee, {
      onSuccess: () => {
        setShowSnackbar(true);
      },
      onError: () => {
        setShowSnackbar(true);
      },
    });
  };

  const getEditErrorMessage = (error: string) => {
    switch (error) {
      case HttpErrors.Network:
        return 'Cannot connect to server';
      default:
        return 'Cannot edit employee';
    }
  };

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
      componentRestrictions: {
        country: 'pl',
      },
      language: 'pl,en',
    },
  });

  const handleFullNameBlur = () => {
    if (!fullNameRegex.test(employeeData.fullName)) {
      setFullNameError('Enter name and surname');
    } else {
      setFullNameError('');
    }
  };

  useEffect(() => {
    setValue(employeeData.address.street);
  }, [employeeData]);
  const handleSelect = async (address: string) => {
    clearSuggestions();
    setShowOptions(false);
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    const addressComponents = results[0].address_components;
    handleAddressChangeValue('lat', lat.toString());
    handleAddressChangeValue('lng', lng.toString());
    addressComponents.forEach((component) => {
      switch (true) {
        case component.types.includes('route'):
          setValue(component.long_name, false);
          handleAddressChangeValue('street', component.long_name);
          break;
        case component.types.includes('locality'):
          handleAddressChangeValue('city', component.long_name);
          break;
        case component.types.includes('administrative_area_level_1'):
          handleAddressChangeValue('state', component.long_name);
          break;
        case component.types.includes('postal_code'):
          handleAddressChangeValue('postCode', component.long_name);
          break;
        case component.types.includes('country'):
          handleAddressChangeValue('country', component.long_name);
          break;
      }
    });
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', p: 1 }}>
      <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" color="primary">
          My profile
        </Typography>
        <Typography paragraph color="text.primary" sx={{ pb: '50px' }}>
          Edit your personal information, position and working address
        </Typography>
      </Box>
      <Divider />
      {isLoading && props.isLoaded ? (
        <>
          <Typography color="text.primary">Loading...</Typography>
          <LinearProgress color={'secondary'} />
        </>
      ) : (
        <Box sx={{ display: 'flex', pl: 3, pb: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', m: 1, pt: 1 }}>
            <ImageUploadComponent />
          </Box>
          <Box
            sx={{
              flex: 3,
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
              p: 1,
              pr: 4,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
              <TextField
                id="full-name"
                label="Full name"
                variant={inputFieldVariant}
                fullWidth
                sx={{ mb: 1, mr: 1 }}
                onChange={(e) => handleEmployeeChangeValue('fullName', e.target.value)}
                onBlur={handleFullNameBlur}
                error={Boolean(fullNameError)}
                helperText={fullNameError}
                value={employeeData?.fullName}
              />
              <TextField
                disabled
                fullWidth
                value={employeeData?.email}
                label="Email"
                variant={inputFieldVariant}
                onChange={(e) => handleEmployeeChangeValue('email', e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                fullWidth
                value={employeeData?.department}
                label="Department"
                variant={inputFieldVariant}
                sx={{ mr: 1 }}
                onChange={(e) => handleEmployeeChangeValue('department', e.target.value)}
              />
              <TextField
                fullWidth
                value={employeeData?.position}
                label="Position"
                variant={inputFieldVariant}
                sx={{ mr: 1 }}
                onChange={(e) => handleEmployeeChangeValue('position', e.target.value)}
              />
              <TextField
                fullWidth
                label="Squad"
                value={employeeData?.squad}
                variant={inputFieldVariant}
                onChange={(e) => handleEmployeeChangeValue('squad', e.target.value)}
              />
            </Box>
            <Divider sx={{ pt: 1 }} />
            <Typography color="text.primary" sx={{ pt: 2, pb: 2, pl: 1 }}>
              Address
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                type="text"
                value={value}
                onClick={() => setShowOptions(true)}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                label="Street"
                fullWidth
              />

              {status === 'OK' && showOptions && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 2000,
                    backgroundColor: 'background.paper',
                    width: '100%',
                    color: 'text.primary',
                  }}
                >
                  {data.map(({ place_id, description }) => (
                    <MenuItem key={place_id} onClick={() => handleSelect(description)}>
                      {description}
                    </MenuItem>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
              <TextField
                disabled
                fullWidth
                value={employeeData?.address.country}
                label="Country"
                variant={inputFieldVariant}
                sx={{ mb: 1, mr: 1 }}
                onChange={(e) => handleAddressChangeValue('country', e.target.value)}
              />
              <TextField
                disabled
                fullWidth
                value={employeeData?.address.city}
                label="City"
                variant={inputFieldVariant}
                sx={{ mb: 1 }}
                onChange={(e) => handleAddressChangeValue('city', e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                disabled
                value={employeeData?.address.state}
                fullWidth
                label="State / Province"
                variant={inputFieldVariant}
                sx={{ mb: 1, mr: 1 }}
                onChange={(e) => handleAddressChangeValue('state', e.target.value)}
              />
              <TextField
                disabled
                value={employeeData?.address.postCode}
                fullWidth
                label="Post Code"
                variant={inputFieldVariant}
                onChange={(e) => handleAddressChangeValue('postCode', e.target.value)}
              />
            </Box>
            <Grid container spacing={2} sx={{ mt: '20px', gap: '10px' }} justifyContent={'flex-end'}>
              <StyledButtonRadius100
                variant="outlined"
                sx={{ width: '100px' }}
                onClick={() => {
                  setEmployeeData(loadedEmployeData ?? emptyEmployee);
                }}
              >
                Cancel
              </StyledButtonRadius100>
              <StyledButtonRadius100
                variant="contained"
                disabled={!isCorrect}
                sx={{ width: '100px' }}
                onClick={handleSaveEmployeeClick}
              >
                Save
              </StyledButtonRadius100>
            </Grid>
          </Box>
        </Box>
      )}
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        status={isSuccess ? 'success' : 'error'}
        message={
          isSuccess ? 'Employee details updated' : isError ? getEditErrorMessage((error as AxiosError).code ?? '') : ''
        }
      />
    </Box>
  );
}

export default MyProfile;
