import { Box, TextField, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { Employee, EmployeeForm } from '../../models/Employee.ts';
import { AxiosResponse } from 'axios';
import { UseMutateFunction } from '@tanstack/react-query';
import customModalStyle from '../customModalStyle.ts';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import MenuItem from '@mui/material/MenuItem';
import { fullNameRegex } from '../../utils/Regex';

type ModalEditEmployeeProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  mutate: UseMutateFunction<AxiosResponse<EmployeeForm, undefined>, unknown, Employee, unknown>;
  showSnackbar: () => void;
  employee: Employee;
  refreshData: () => void;
};

const inputFieldVariant = 'outlined';

function ModalEditEmployee({
  modalIsOpen,
  setModalIsOpen,
  mutate,
  showSnackbar,
  employee,
  refreshData,
}: ModalEditEmployeeProps) {
  const [employeeData, setEmployeeData] = useState({
    fullName: employee.fullName,
    department: employee.department,
    position: employee.position,
    squad: employee.squad,
    email: employee.email,
  });
  const [employeeAddressData, setEmployeeAddressData] = useState(employee.address);
  const [fullNameError, setFullNameError] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);

  useEffect(() => {
    if (fullNameRegex.test(employeeData.fullName)) {
      setFullNameError('');
    }
  }, [employeeData.fullName]);

  useEffect(() => {
    setIsCorrect(isFilled && fullNameError === '');
  }, [employeeData, employeeAddressData]);

  const isFilled: boolean =
    Object.values(employeeData).every((value) => value !== '') &&
    Object.values(employeeAddressData).every((value) => value !== '');
  const resetAllFields = () => {
    setEmployeeData({
      fullName: employee.fullName,
      department: employee.department,
      position: employee.position,
      squad: employee.squad,
      email: employee.email,
    });
    setEmployeeAddressData(employee.address);
  };
  const handleEmployeeChangeValue = (key: string, value: string) => {
    setEmployeeData((data) => ({ ...data, [key]: value }));
  };

  const handleAddressChangeValue = (key: string, value: string) => {
    setEmployeeAddressData((data) => ({ ...data, [key]: value }));
  };

  const handleEditEmployeeClick = () => {
    const editedEmployee: Employee = { ...employeeData, address: { ...employeeAddressData }, id: employee.id };
    mutate(editedEmployee, {
      onSuccess: () => {
        showSnackbar();
        refreshData();
        closeModal();
      },
      onError: () => {
        showSnackbar();
      },
    });
  };

  function closeModal() {
    resetAllFields();
    setModalIsOpen(false);
    setFullNameError('');
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

  const handleFullNameBlur = () => {
    if (!fullNameRegex.test(employeeData.fullName)) {
      setFullNameError('Enter name and surname');
    } else {
      setFullNameError('');
    }
  };

  useEffect(() => {
    setValue(employeeAddressData.street);
  }, []);

  const [shouldAutoComplete, setShouldAutoComplete] = useState(false);

  return (
    <Modal open={modalIsOpen} onClose={closeModal} sx={customModalStyle}>
      <Box sx={{ backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', p: 1 }}>
        <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column' }}>
          <Button
            onClick={closeModal}
            sx={{
              marginLeft: 'auto',
              marginBottom: 'auto',
              cursor: 'pointer',
            }}
          >
            <CloseIcon sx={{ color: '#555' }} />
          </Button>
          <Typography variant="h3" color="text.primary">
            Edit employee details
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
            sx={{ flex: 3, backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', p: 1, pr: 4 }}
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
                disabled
                fullWidth
                value={employeeData.email}
                label="Email"
                variant={inputFieldVariant}
                onChange={(e) => handleEmployeeChangeValue('email', e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                fullWidth
                value={employeeData.department}
                label="Department"
                variant={inputFieldVariant}
                sx={{ mr: 1 }}
                onChange={(e) => handleEmployeeChangeValue('department', e.target.value)}
              />
              <TextField
                fullWidth
                value={employeeData.position}
                label="Position"
                variant={inputFieldVariant}
                sx={{ mr: 1 }}
                onChange={(e) => handleEmployeeChangeValue('position', e.target.value)}
              />
              <TextField
                fullWidth
                label="Squad"
                value={employeeData.squad}
                variant={inputFieldVariant}
                onChange={(e) => handleEmployeeChangeValue('squad', e.target.value)}
              />
            </Box>
            <Divider sx={{ pt: 1 }} />
            <Typography color="text.primary" sx={{ pt: 2, pb: 2 }}>
              Address
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setShouldAutoComplete(true);
                }}
                disabled={!ready}
                label="Street"
                fullWidth
              />
              {status === 'OK' && shouldAutoComplete && (
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
                value={employeeAddressData.country}
                label="Country"
                variant={inputFieldVariant}
                sx={{ mb: 1, mr: 1 }}
                onChange={(e) => handleAddressChangeValue('country', e.target.value)}
              />
              <TextField
                disabled
                fullWidth
                value={employeeAddressData.city}
                label="City"
                variant={inputFieldVariant}
                sx={{ mb: 1 }}
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
            <Button variant="contained" disabled={!isCorrect} sx={{ p: 2, mt: 1 }} onClick={handleEditEmployeeClick}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalEditEmployee;
