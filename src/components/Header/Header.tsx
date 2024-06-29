import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { handleLogout } from '../../utils/api/AuthenticateUtils';

const Header = () => {

  // === Using navigator to redirect user back to homepage after log out ===
  const navigator = useNavigate();
  // =======================================================================

  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    // window.location.reload();
  }, [auth]); 

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigator('/userV2');
  }

  // ============================ Proposed changes ==================================
  React.useLayoutEffect(() => { localStorage.getItem("accessToken") == null ? setAuth(false) : setAuth(true) }, []);

  // ============================ End of proposal  ===================================

  return (
    <AppBar position="sticky">
      <Box width='100%' sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Link href="/"><img src="/Logo.png" alt="Logo" style={{ height: '70px' }} /></Link>
            <Box sx={{ display: 'flex', gap: .5 }}>
              <Button variant='text' sx={{ color: ' #00aeeb', fontWeight: 'bold' }}>Tư vấn trực tuyến</Button>
              <Button variant='text' href='/guide' sx={{ color: ' #00aeeb', fontWeight: 'bold' }}>Quy trình</Button>
              <Button variant="text" href='/for-owner' sx={{ color: ' #00aeeb', fontWeight: 'bold' }}>Dành cho chủ phòng khám</Button>
            </Box>
            <Box>
              {auth ? (
                <Box>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle sx={{ color: 'gray', fontSize: '40px' }} />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        width: 150,
                        marginLeft: 2,
                        marginTop: 5
                      }
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>Tài khoản</MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleLogout(navigator) }}>Đăng xuất</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button href='/login' variant='contained' sx={{ color: 'white', borderRadius: '5px' }}>Đăng nhập</Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;
