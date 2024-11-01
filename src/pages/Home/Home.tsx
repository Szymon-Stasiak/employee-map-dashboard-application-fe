import { useEffect, useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { Employee } from '../../models/Employee';
import { Box, Card, Typography } from '@mui/material';
import FilterEmployeeComponents from './components/EmployeeTable/FilterEmployeeComponents.tsx';
import EmployeeMap from './components/EmployeeMap/EmployeeMap.tsx';
import { StyledButtonRadius100 } from '../../components/buttons/CustomButton.ts';
import AddIcon from '@mui/icons-material/Add';
import AddEmployee from './components/EmployeeTable/AddEmployee.tsx';
import EmployeeTable from './components/EmployeeTable/EmployeeTable.tsx';
import axiosConfig from '../../utils/axiosConfig.ts';
import { useGetEmployees } from '../../utils/api.ts';
import { jwtDecode } from 'jwt-decode';
import DesignConversationImage from '../../assets/conversation.svg';
import CustomJwtPayload from '../../utils/CustomJwtPayload.ts';

axiosConfig;

const ButtonStyle = {
  float: 'right',
  p: 1,
  pr: 3,
  pl: 3,
  mb: 3,
};

type HomePageProps = {
  isLoaded: boolean;
};

function Home(props: HomePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useAuth();
  const isAdmin = auth?.userRoles.includes('ADMIN');

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const { data, isSuccess, refetch } = useGetEmployees();

  useEffect(() => {
    setFilteredEmployees(data ?? []);
  }, [data]);

  useEffect(() => {
    axiosConfig;
  }, []);

  const firstName = auth?.isLoggedIn
    ? data
        ?.find((x) => x.id === (jwtDecode(localStorage.getItem('token') ?? '') as CustomJwtPayload).id)
        ?.fullName.split(' ')[0]
    : '';

  const handleModalOpenClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h2" color="primary" sx={{ marginRight: '20px' }}>
            Hello, {firstName}
          </Typography>
          <Typography paragraph color="text.primary">
            Discover, connect and communicate with your colleagues nearby.
          </Typography>
          <FilterEmployeeComponents
            employees={data ?? []}
            onFiltered={(filteredEmployees) => {
              setFilteredEmployees(filteredEmployees);
            }}
          />
        </Box>
        <Box sx={{ maxWidth: '250px', maxHeight: '250px', overflow: 'hidden', ml: 'auto', mb: 3 }}>
          <img src={DesignConversationImage} alt="conversation" style={{ width: '100%' }} />
        </Box>
      </Box>

      <Card variant="outlined" sx={{ marginBottom: '50px' }}>
        {isSuccess && props.isLoaded && EmployeeMap(filteredEmployees)}
      </Card>
      {isAdmin && (
        <Box>
          <StyledButtonRadius100
            variant="contained"
            sx={ButtonStyle}
            onClick={handleModalOpenClick}
            disabled={!props.isLoaded}
            startIcon={props.isLoaded && <AddIcon />}
          >
            {props.isLoaded ? 'Add employee' : 'Loading...'}
          </StyledButtonRadius100>
          {props.isLoaded && (
            <AddEmployee isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refreshData={refetch} />
          )}
        </Box>
      )}
      {isSuccess && props.isLoaded && <EmployeeTable employees={filteredEmployees} refreshData={refetch} />}
    </>
  );
}

export default Home;
