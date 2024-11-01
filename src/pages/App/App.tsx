import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginPage from '../LoginPage/LoginPage.tsx';
import { ROUTES } from '../../routes/routes.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorModeProvider } from '../../components/ColorModeContex/ColorModeContex.tsx';
import ProtectedRoute from '../../components/ProtectedRoutes/ProtectedRoute.tsx';
import Home from '../Home/Home.tsx';
import MyProfile from '../MyProfile/MyProfile.tsx';
import PageNotFound from '../PageNotFound/PageNotFound.tsx';
import { useJsApiLoader } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import UserProfile from '../UserProfile/UserProfile.tsx';

const queryClient = new QueryClient();

const apiKey = import.meta.env.VITE_MAP_API_KEY;
const googleMapsLibraries: Library[] = ['places', 'marker', 'core'];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: googleMapsLibraries,
  });

  return (
    <ColorModeProvider>
      <QueryClientProvider client={queryClient}>
        <Box
          sx={{
            display: 'flex',
            backgroundColor: 'background.default',
            height: '100%',
            width: '100%',
            minHeight: '100vh',
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.LOG_IN} element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.HOME} element={<Home isLoaded={isLoaded} />} />
                <Route path={ROUTES.MY_PROFILE} element={<MyProfile isLoaded={isLoaded} />} />
                <Route path={ROUTES.EMPLOYEE_PROFILE} element={<UserProfile />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Box>
      </QueryClientProvider>
    </ColorModeProvider>
  );
}

export default App;
