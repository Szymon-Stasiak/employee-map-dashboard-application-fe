import { Employee } from '../../../../models/Employee.ts';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SeeProfile({ employee }: { employee: Employee }) {
  const navigate = useNavigate();
  const handleOnClcik = () => {
    navigate(`/profile/${employee.id}`);
  };

  return (
    <Typography sx={{ textDecoration: 'none', cursor: 'pointer', mb: 0, pb: 0 }} onClick={handleOnClcik}>
      {employee.fullName}
    </Typography>
  );
}
export default SeeProfile;
