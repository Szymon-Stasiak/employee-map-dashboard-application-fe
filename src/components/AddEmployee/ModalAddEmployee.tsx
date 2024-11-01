import { Box, TextField, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { departmentOptions, positionOptions } from '../../utils/OptionLists';
import { EmployeeForm } from '../../models/Employee.ts';
import { AxiosResponse } from 'axios';
import { UseMutateFunction } from '@tanstack/react-query';
import customModalStyle from '../customModalStyle.ts';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { emailRegex, fullNameRegex } from '../../utils/Regex';

type ModalAddEmployeeProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: UseMutateFunction<AxiosResponse<any, any>, unknown, EmployeeForm, unknown>;
  showSnackbar: () => void;
  refreshData: () => void;
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '160px',
    },
  },
};
const inputFieldVariant = 'outlined';

function ModalAddEmployee(props: ModalAddEmployeeProps) {
  const [employeeData, setEmployeeData] = useState({
    fullName: '',
    department: '',
    position: '',
    squad: '',
    email: '',
  });
  const [employeeAddressData, setEmployeeAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postCode: '',
    country: '',
    lat: 0,
    lng: 0,
  });
  const [emailError, setEmailError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (emailRegex.test(employeeData.email)) {
      setEmailError('');
    }
  }, [employeeData.email]);

  useEffect(() => {
    if (fullNameRegex.test(employeeData.fullName)) {
      setFullNameError('');
    }
  }, [employeeData.fullName]);
  useEffect(() => {
    setIsCorrect(isFilled && emailError === '' && fullNameError === '');
  }, [employeeData, employeeAddressData]);

  const isFilled: boolean =
    Object.values(employeeData).every((value) => value !== '') &&
    Object.values(employeeAddressData).every((value) => value !== '');
  const resetAllFields = () => {
    setEmployeeData({ fullName: '', department: '', position: '', squad: '', email: '' });
    setEmployeeAddressData({ street: '', city: '', state: '', postCode: '', country: '', lat: 0, lng: 0 });
    setValue('');
  };
  const handleEmployeeChangeValue = (key: string, value: string) => {
    setEmployeeData((data) => ({ ...data, [key]: value }));
  };
  const handleAddressChangeValue = (key: string, value: string) => {
    setEmployeeAddressData((data) => ({ ...data, [key]: value }));
  };

  const handleAddNewEmployeeClick = () => {
    const newEmployee: EmployeeForm = { ...employeeData, address: { ...employeeAddressData } };
    props.mutate(newEmployee, {
      onSuccess: () => {
        props.showSnackbar();
        props.refreshData();
        closeModal();
      },
      onError: () => {
        props.showSnackbar();
      },
    });
  };

  function closeModal() {
    resetAllFields();
    props.setModalIsOpen(false);
    setFullNameError('');
    setEmailError('');
  }

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

  const handleEmailBlur = () => {
    if (!emailRegex.test(employeeData.email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSelect = async (address: string) => {
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    const addressComponents = results[0].address_components;
    setEmployeeAddressData((data) => ({ ...data, lat, lng }));
    addressComponents.forEach((component) => {
      switch (true) {
        case component.types.includes('route'):
          setValue(component.long_name, false);
          setEmployeeAddressData((data) => ({ ...data, street: component.long_name }));
          break;
        case component.types.includes('locality'):
          setEmployeeAddressData((data) => ({ ...data, city: component.long_name }));
          break;
        case component.types.includes('administrative_area_level_1'):
          setEmployeeAddressData((data) => ({ ...data, state: component.long_name }));
          break;
        case component.types.includes('postal_code'):
          setEmployeeAddressData((data) => ({ ...data, postCode: component.long_name }));
          break;
        case component.types.includes('country'):
          setEmployeeAddressData((data) => ({ ...data, country: component.long_name }));
          break;
      }
    });
  };

  return (
    <>
      <Modal open={props.modalIsOpen} onClose={closeModal} sx={customModalStyle}>
        <Box sx={{ backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', p: 1 }}>
          <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column' }}>
            <Button
              onClick={closeModal}
              style={{
                marginLeft: 'auto',
                marginBottom: 'auto',
                cursor: 'pointer',
              }}
            >
              <CloseIcon style={{ color: '#555' }} />
            </Button>
            <Typography variant="h3" color="text.primary">
              Add Employee
            </Typography>
          </Box>

          <Divider />
          <Box sx={{ display: 'flex', pl: 3, pb: 3 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', m: 1, pt: 1 }}>
              <Typography color="text.primary">Photo</Typography>
              <img src="src/images/logo.png" alt="logo" style={{ maxWidth: '180px' }} />
              <Button fullWidth variant="contained" sx={{ p: 2, mt: 'auto' }} onClick={closeModal}>
                Cancel
              </Button>
            </Box>
            <Box
              sx={{
                flex: 3,
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                pr: 4,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  fullWidth
                  value={employeeData.fullName}
                  label="Full name"
                  variant={inputFieldVariant}
                  sx={{ mb: 1, mr: 1 }}
                  onChange={(e) => handleEmployeeChangeValue('fullName', e.target.value)}
                  onBlur={handleFullNameBlur}
                  error={Boolean(fullNameError)}
                  helperText={fullNameError}
                />

                <TextField
                  fullWidth
                  value={employeeData.email}
                  label="Email"
                  variant={inputFieldVariant}
                  onChange={(e) => handleEmployeeChangeValue('email', e.target.value)}
                  onBlur={handleEmailBlur}
                  error={Boolean(emailError)}
                  helperText={emailError}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <FormControl fullWidth sx={{ mr: 1 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={employeeData.department}
                    variant={inputFieldVariant}
                    label="Department"
                    MenuProps={MenuProps}
                    onChange={(e) => handleEmployeeChangeValue('department', e.target.value)}
                  >
                    {departmentOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mr: 1 }}>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={employeeData.position}
                    variant={inputFieldVariant}
                    label="Position"
                    MenuProps={MenuProps}
                    onChange={(e) => handleEmployeeChangeValue('position', e.target.value)}
                  >
                    {positionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Squad"
                  value={employeeData.squad}
                  variant={inputFieldVariant}
                  onChange={(e) => handleEmployeeChangeValue('squad', e.target.value)}
                />
              </Box>
              <Divider sx={{ pt: 1 }} />
              <Typography sx={{ pt: 2, pb: 2 }} color="text.primary">
                Address
              </Typography>

              <Box sx={{ position: 'relative' }}>
                <TextField
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={!ready}
                  label="Street"
                  fullWidth
                />

                {status === 'OK' && (
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

              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  disabled
                  fullWidth
                  sx={{ mb: 1, mr: 1, mt: 1 }}
                  value={employeeAddressData.country}
                  variant={inputFieldVariant}
                  label="Country"
                  onChange={(e) => handleAddressChangeValue('country', e.target.value)}
                />

                <TextField
                  disabled
                  fullWidth
                  sx={{ mb: 1, mt: 1 }}
                  value={employeeAddressData.city}
                  variant={inputFieldVariant}
                  label="City"
                  onChange={(e) => handleAddressChangeValue('city', e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  disabled
                  value={employeeAddressData.state}
                  fullWidth
                  label="State / Province"
                  variant={inputFieldVariant}
                  sx={{ mb: 1, mr: 1 }}
                  onChange={(e) => handleAddressChangeValue('state', e.target.value)}
                />
                <TextField
                  disabled
                  value={employeeAddressData.postCode}
                  fullWidth
                  label="Post Code"
                  variant={inputFieldVariant}
                  onChange={(e) => handleAddressChangeValue('postCode', e.target.value)}
                />
              </Box>
              <Button
                variant="contained"
                disabled={!isCorrect}
                sx={{ p: 2, mt: 1 }}
                onClick={handleAddNewEmployeeClick}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ModalAddEmployee;
