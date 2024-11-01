import Paper from '@mui/material/Paper';
import { Employee } from '../../../../models/Employee.ts';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const avatarStyle = {
  width: '40px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  fontWeight: 'bold',
};

function EmployeeMarkerContent(employee: Employee) {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const colorPairs = [
    { backgroundColor: primaryColor, textColor: 'white' },
    { backgroundColor: secondaryColor, textColor: 'white' },
    { backgroundColor: '#13346c', textColor: 'white' },
    { backgroundColor: '#258890', textColor: 'white' },
  ];

  const firstLettersOfFullName = employee.fullName
    .split(' ')
    .map((name) => name[0])
    .join('');

  const colorPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];

  return (
    <Paper sx={avatarStyle} style={{ backgroundColor: colorPair.backgroundColor }} elevation={3}>
      <Typography sx={{ fontSize: '50', color: colorPair.textColor }}>{firstLettersOfFullName}</Typography>
    </Paper>
  );
}

export default EmployeeMarkerContent;
