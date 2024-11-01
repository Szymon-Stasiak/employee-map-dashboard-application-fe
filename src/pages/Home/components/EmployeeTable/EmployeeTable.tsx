import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';
import EmployeeTableRow from './EmployeeTableRow';
import { useAuth } from '../../../../components/auth/AuthContext.tsx';
import { Address, Employee } from '../../../../models/Employee';
import { useState } from 'react';
import { Button } from '@mui/material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { AnimatePresence } from 'framer-motion';

const sharedStyles = {
  field: {
    fontSize: 'small',
  },
  fullName: {
    fontSize: 'medium',
  },
};

const StyledTableHeader = styled(TableCell)(sharedStyles.field);

function EmployeeTable({ employees, refreshData }: { employees: Employee[]; refreshData: () => void }) {
  const [sort, setSort] = useState({ keyToSort: 'id' as keyof Employee, direction: 'ASC' });
  const auth = useAuth();
  const columnNames = [
    { header: 'Full name', value: 'fullName' },
    { header: 'Department', value: 'department' },
    { header: 'Squad', value: 'squad' },
    { header: 'Location', value: 'address.city' },
  ];

  function handleHeaderClick(value: keyof Employee) {
    if (sort.keyToSort === value) {
      if (sort.direction === 'ASC') {
        setSort({
          keyToSort: value,
          direction: 'DESC',
        });
      } else {
        setSort({
          keyToSort: 'id',
          direction: 'ASC',
        });
      }
    } else {
      setSort({
        keyToSort: value,
        direction: 'ASC',
      });
    }
  }

  const sortedEmployees = employees.slice();
  function getSortedEmployees() {
    if (sort.direction === 'ASC') {
      return sortedEmployees.sort((a, b) => {
        const aVal = getNestedValue(a, sort.keyToSort);
        const bVal = getNestedValue(b, sort.keyToSort);

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
        }
        return String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
      });
    } else {
      return sortedEmployees.sort((a, b) => {
        const aVal = getNestedValue(a, sort.keyToSort);
        const bVal = getNestedValue(b, sort.keyToSort);

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return bVal.localeCompare(aVal, undefined, { sensitivity: 'base' });
        }
        return String(bVal).localeCompare(String(aVal), undefined, { sensitivity: 'base' });
      });
    }
  }
  function getNestedValue(obj: Employee, key: keyof Employee) {
    return key.split('.').reduce<Employee | string | Address>(reducer, obj);
  }

  function reducer(acc: Employee | string | Address, cur: Employee | string | Address) {
    let retVal: Address | string | null = '';
    if (acc && instanceOfEmployee(acc)) {
      retVal = acc[cur as keyof Employee];
    } else if (acc && instanceOfAddress(acc)) {
      retVal = acc[cur as Exclude<keyof Address, 'lng' | 'lat'>];
    } else if (acc) {
      retVal = acc;
    }
    return retVal ?? '';
  }
  function instanceOfEmployee(object: Employee | string | Address): object is Employee {
    if (typeof object === 'string') return false;
    return 'position' in object;
  }

  function instanceOfAddress(object: Employee | string | Address): object is Address {
    if (typeof object === 'string') return false;
    return 'street' in object;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columnNames.map((columnName, index) => (
              <StyledTableHeader key={index + columnName.header}>
                <Button
                  onClick={() => handleHeaderClick(columnName.value as keyof Employee)}
                  sx={{
                    color: 'text.primary',
                    height: '100%',
                    justifyContent: 'flex-start',
                  }}
                  fullWidth
                >
                  {columnName.header}
                  {sort.keyToSort === columnName.value && sort.direction === 'ASC' && <KeyboardDoubleArrowDownIcon />}
                  {sort.keyToSort === columnName.value && sort.direction === 'DESC' && <KeyboardDoubleArrowUpIcon />}
                </Button>
              </StyledTableHeader>
            ))}
            {auth?.userRoles.includes('ADMIN') && (
              <StyledTableHeader>
                <Button
                  sx={{
                    color: 'text.primary',
                    height: '100%',
                    justifyContent: 'flex-start',
                  }}
                  fullWidth
                >
                  Action
                </Button>
              </StyledTableHeader>
            )}
          </TableRow>
        </TableHead>
        <AnimatePresence>
          <TableBody>
            {getSortedEmployees().map((employee) => (
              <EmployeeTableRow employee={employee} key={employee.id} refreshData={refreshData} />
            ))}
          </TableBody>
        </AnimatePresence>
      </Table>
    </TableContainer>
  );
}

export default EmployeeTable;
