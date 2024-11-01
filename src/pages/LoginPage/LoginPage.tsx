import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Container, InputAdornment, Modal, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from './components/Footer.tsx';
import { SignInSeparator } from './components/SignInSeparator.tsx';
import Typography from '@mui/material/Typography';
import { StyledButtonRadius100 } from '../../components/buttons/CustomButton.ts';
import { useEmployeeLogin } from '../../utils/api.ts';
import { useAuth } from '../../components/auth/AuthContext.tsx';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routes.ts';
import { Navigate } from 'react-router';
import CustomJwtPayload from '../../utils/CustomJwtPayload.ts';
import CustomSnackbar from '../../components/snackbars/CustomSnackbar.tsx';
import { AxiosError } from 'axios';
import HttpErrors from '../../utils/HttpErrors.ts';

const TextFieldInputProps = {
  style: { borderRadius: 8 },
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { mutate: loginEmployee, isError, error } = useEmployeeLogin();

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const navigateBackOrHomePage = () => {
    if (location.state) {
      navigate(location.state);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onTogglePasswordButtonClicked = () => {
    setIsPasswordShown((prevState) => !prevState);
  };

  const onForgotPasswordButtonClicked = () => {
    //TODO
  };

  const onSignInButtonClicked = () => {
    loginEmployee(
      { email: email, password: password },
      {
        onSuccess: (token) => {
          localStorage.setItem('token', token);
          const decodedToken = jwtDecode(token) as CustomJwtPayload;
          const sub = decodedToken.sub;
          const authorities = decodedToken.authorities;
          const roleArray = authorities.map((authority: { authority: string }) => authority.authority);
          if (typeof sub === 'string') {
            auth?.logIn(sub, roleArray);
            navigateBackOrHomePage();
          } else {
            console.log('Email is undefined');
          }
        },
        onError: () => {
          setShowSnackbar(true);
        },
        onSettled: () => {},
      }
    );
  };

  const onSignInWithOrganizationButtonClicked = () => {
    //TODO
  };

  const getLoginErrorMessage = (error: string) => {
    switch (error) {
      case HttpErrors.BadRequest:
        return 'Invalid email or password';
      case HttpErrors.Network:
        return 'Cannot connect to server';
      default:
        return 'Cannot log user in';
    }
  };

  return (
    <>
      {auth?.isLoggedIn ? (
        location.state ? (
          <Navigate to={location.state} />
        ) : (
          <Navigate to={ROUTES.HOME} />
        )
      ) : (
        <Box sx={{ width: '100vw', height: '100vh', backgroundColor: 'background.default', overflow: 'hidden' }}>
          <LoginVideo />
          <Box
            sx={{
              position: 'absolute',
              top: '42vh',
              left: '7vw',
              color: 'white',
            }}
          >
            <Typography variant="h2" gutterBottom fontFamily="DejaVu Sans" fontWeight="bold">
              Welcome back!
            </Typography>
            <Typography variant="h4" fontFamily="DejaVu Sans">
              Where do you want to go today?
            </Typography>
            <Typography variant="h4" fontFamily="DejaVu Sans">
              Your colleagues are waiting for you!
            </Typography>
          </Box>

          <Container
            sx={{
              width: '400px',
              height: '100vh',
              position: 'absolute',
              right: 0,
              top: 0,
              bgcolor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack sx={{ justifyContent: 'center', height: '100%', p: 2 }} spacing={2}>
              <Typography color="primary" variant="h4" sx={{ textAlign: 'center', fontSize: '30px' }}>
                Welcome to Employee Map
              </Typography>

              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                placeholder="e.g., name@empoleemapp.com"
                type="email"
                value={email}
                onChange={onEmailChanged}
                InputProps={TextFieldInputProps}
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChanged}
                InputProps={{
                  ...TextFieldInputProps,
                  autoComplete: 'off',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onTogglePasswordButtonClicked} edge="end">
                        {isPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'inline-block' }}>
                <StyledButtonRadius100
                  sx={{ textDecoration: 'underline', color: 'primary' }}
                  variant="text"
                  onClick={onForgotPasswordButtonClicked}
                >
                  Forgot password?
                </StyledButtonRadius100>
              </Box>

              <StyledButtonRadius100 variant="contained" onClick={onSignInButtonClicked}>
                Sign in
              </StyledButtonRadius100>

              <SignInSeparator />

              <StyledButtonRadius100 variant="contained" onClick={onSignInWithOrganizationButtonClicked}>
                Sign in with Google SSO
              </StyledButtonRadius100>
            </Stack>

            <Footer />
          </Container>
        </Box>
      )}

      <Modal
        /* TODO: show modal when page is loading */
        open={false}
        disableAutoFocus
        disableEnforceFocus
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color="primary" size={80} thickness={5} />
        </div>
      </Modal>
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        status={'error'}
        message={isError ? getLoginErrorMessage((error as AxiosError).code ?? '') : ''}
      />
    </>
  );
}

export default LoginPage;

const LoginVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <video
      autoPlay
      loop
      muted
      ref={videoRef}
      src="/loginVideo.mp4"
      style={{
        objectFit: 'cover',
        height: '100%',
        minWidth: 'calc(100vw - 400px)',
        zIndex: -1,
      }}
    />
  );
};
