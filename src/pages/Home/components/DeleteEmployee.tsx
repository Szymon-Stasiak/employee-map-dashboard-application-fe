import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDeleteEmployee } from '../../../utils/api';
import CustomSnackbar from '../../../components/snackbars/CustomSnackbar';
import { AxiosError } from 'axios';
import HttpErrors from '../../../utils/HttpErrors';

type DeleteEmployeeProps = {
  employeeId: string;
  employeeFullName: string;
  refreshData: () => void;
};

function DeleteEmployee(deleteEmployeeProps: DeleteEmployeeProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const isDropDownOpen = Boolean(anchorEl);
  const { mutate, isSuccess, error, isError } = useDeleteEmployee();
  const handleDeleteEmployee = () => {
    mutate(deleteEmployeeProps.employeeId, {
      onSuccess: () => {
        setShowSnackbar(true);
        deleteEmployeeProps.refreshData();
      },
      onError: () => {
        setShowSnackbar(true);
      },
    });
  };

  const getDeleteErrorMessage = (error: string) => {
    switch (error) {
      case HttpErrors.BadRequest:
        return "Employee doesn't exist";
      case HttpErrors.Network:
        return 'Cannot connect to server';
      default:
        return 'Cannot delete employee';
    }
  };

  return (
    <>
      <IconButton aria-label="more" id="delete-button" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        disableScrollLock
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'delete-button',
        }}
        anchorEl={anchorEl}
        open={isDropDownOpen}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setIsDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          Delete Employee
        </MenuItem>
      </Menu>
      <Dialog
        open={isDialogOpen}
        disableScrollLock
        disableEnforceFocus
        hideBackdrop
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteEmployeeProps.employeeFullName} employee profile? Profile will be
            deleted permanently and cannot be restored.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteEmployee();
              setIsDialogOpen(false);
            }}
            autoFocus
            color="error"
            variant="outlined"
          >
            Delete Employee
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        status={isSuccess ? 'success' : 'error'}
        message={
          isSuccess ? 'Employee deleted' : isError ? getDeleteErrorMessage((error as AxiosError).code ?? '') : ''
        }
      />
    </>
  );
}

export default DeleteEmployee;
