import { useState } from 'react';
import ModalAddEmployee from '../../../../components/AddEmployee/ModalAddEmployee.tsx';
import CustomSnackbar from '../../../../components/snackbars/CustomSnackbar.tsx';
import { useAddNewEmployee } from '../../../../utils/api.ts';
import HttpErrors from '../../../../utils/HttpErrors.ts';
import { AxiosError } from 'axios';

type AddEmployeeProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  refreshData: () => void;
};

function AddEmployee(props: AddEmployeeProps) {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { mutate: mutateAddEmployee, isSuccess, isError, error } = useAddNewEmployee();

  const getAddErrorMessage = (error: string) => {
    switch (error) {
      case HttpErrors.BadRequest:
        return 'Employee with that email already exists';
      case HttpErrors.Network:
        return 'Cannot connect to server';
      default:
        return 'Cannot add employee';
    }
  };

  return (
    <div>
      <ModalAddEmployee
        modalIsOpen={props.isModalOpen}
        setModalIsOpen={props.setIsModalOpen}
        mutate={mutateAddEmployee}
        showSnackbar={() => setShowSnackbar(true)}
        refreshData={props.refreshData}
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        status={isSuccess ? 'success' : 'error'}
        message={isSuccess ? 'Employee added' : isError ? getAddErrorMessage((error as AxiosError).code ?? '') : ''}
      />
    </div>
  );
}

export default AddEmployee;
