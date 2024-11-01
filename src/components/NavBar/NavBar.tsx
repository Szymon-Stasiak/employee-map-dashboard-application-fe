import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import { NavLink } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { ROUTES } from '../../routes/routes.ts';
import { AnimatedText } from '../AnimatedText/AnimatedText.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch.tsx';
import { useColorMode } from '../ColorModeContex/ColorModeContex.tsx';
import { useGetEmployeeImage } from '../../utils/api.ts';

type NavbarProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 200;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function NavBar(props: NavbarProps) {
  const handleDrawerOpen = () => {
    props.setOpen(true);
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const auth = useAuth();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { toggleColorMode, mode } = useColorMode();

  const { data } = useGetEmployeeImage(auth!.userEmail!);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'background.paper' }} open={props.open}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(props.open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              height: '64px',
              alignItems: 'center',
              flexGrow: { xs: 1, md: '0' },
              pr: { xs: 5, md: 0 },
            }}
          >
            <img
              src="/Logo.png"
              alt="logo"
              style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'middle' }}
            />
          </Box>

          <Box sx={{ pl: 3, display: { xs: 'none', md: 'flex' } }}>
            <AnimatedText text="Employee Map" />
          </Box>
          <DarkModeSwitch
            sx={{ felxGrow: 0, ml: 'auto', mr: 2 }}
            checked={mode === 'dark'}
            onChange={toggleColorMode}
          />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={data} />
              </IconButton>
            </Tooltip>

            <Menu
              disableScrollLock
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <NavLink style={{ textDecoration: 'none', color: '#555' }} to={ROUTES.MY_PROFILE}>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" color="text.primary">
                    My Profile
                  </Typography>
                </MenuItem>
              </NavLink>
              <MenuItem
                sx={{ color: '#555' }}
                onClick={() => {
                  handleCloseUserMenu();
                  auth?.logOut();
                }}
              >
                <Typography textAlign="center" color="text.primary">
                  Log Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
