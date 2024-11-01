import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import NavBar from '../NavBar/NavBar';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import SideBar from '../SideBar/SideBar';
import { ROUTES } from '../../routes/routes';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate(ROUTES.LOG_IN, { state: location.pathname });
    }
  });

  return (
    <>
      <NavBar open={open} setOpen={setOpen} />
      <Box component={'main'} sx={{ display: 'flex', marginTop: '80px', flexGrow: 1 }}>
        <SideBar open={open} setOpen={setOpen} />
        <Box sx={{ flexGrow: 1, p: 7, pt: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default ProtectedRoute;
