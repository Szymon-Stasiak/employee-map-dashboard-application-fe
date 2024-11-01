import { Button } from '@mui/material';
import { useState } from 'react';
import ModalEditEmployee from '../../../../components/EditEmployee/ModalEditEmployee';
import { useEditEmployee } from '../../../../utils/api';
import { Employee } from '../../../../models/Employee';
import CustomSnackbar from '../../../../components/snackbars/CustomSnackbar';
import HttpErrors from '../../../../utils/HttpErrors';
import { AxiosError } from 'axios';

const EditButtonStyle = {
  borderRadius: '50px',
  color: 'text.primary',
  float: 'left',
  margin: '5px 10px 0 0',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'background.paper',
  },
};

function EditEmployee({ employee, refreshData }: { employee: Employee; refreshData: () => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { mutate: mutateEditEmployee, isSuccess, isError, error } = useEditEmployee();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const getEditErrorMessage = (error: string) => {
    switch (error) {
      case HttpErrors.BadRequest:
        return "Employee doesn't exist";
      case HttpErrors.Network:
        return 'Cannot connect to server';
      default:
        return 'Cannot edit employee';
    }
  };

  return (
    <>
      <Button variant="outlined" size="small" sx={EditButtonStyle} onClick={() => setIsEditModalOpen(true)}>
        Edit
      </Button>
      <ModalEditEmployee
        modalIsOpen={isEditModalOpen}
        setModalIsOpen={setIsEditModalOpen}
        mutate={mutateEditEmployee}
        showSnackbar={() => setShowSnackbar(true)}
        employee={employee}
        refreshData={refreshData}
      />
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
    </>
  );
}

export default EditEmployee;
