import { Typography } from '@mui/material';
import { Employee } from '../../../../models/Employee.ts';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ListItem from '@mui/material/ListItem';

function EmployeeListItem({ style, index, data }: ListChildComponentProps<Employee[]>) {
  const employee = data[index];

  return (
    <ListItem style={{ ...style, borderBottom: '1px solid #ccc', padding: '8px' }} key={employee.id}>
      <Typography color="black">{`${index + 1}. ${employee.fullName}`}</Typography>
    </ListItem>
  );
}

function EmployeeListPopup(employees: Employee[]) {
  const popupWidth = 250;

  return (
    <FixedSizeList
      height={200}
      width={popupWidth}
      itemSize={40}
      itemCount={employees.length}
      itemData={employees}
      overscanCount={5}
    >
      {EmployeeListItem}
    </FixedSizeList>
  );
}

export default EmployeeListPopup;
