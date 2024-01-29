import React, { useState, useContext } from 'react';
import Iconify from '../Iconify';
import { styled } from '@mui/material/styles';
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { Menu as SidebarMenu } from 'react-pro-sidebar';
import { MenuItem as SidebarMenuItem } from 'react-pro-sidebar';
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import { Menu as AvatarMenu } from '@mui/material';
import { MenuItem as AvatarMenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import ProjectDropDown from '../ProjectDropDown';
import 'react-pro-sidebar/dist/css/styles.css';
import './Navbar.css';

const StyledAppBar = styled(AppBar)(() => ({
  position: 'fixed',
  background: 'none',
  boxShadow: 'none',
}));

const StyledAvatar = styled(Box)(() => ({
  position: 'absolute',
  right: 30,
  top: 30,
  color: 'black',
}));

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#00AB55',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#B0B9C2',
    },
    '&:hover fieldset': {
      borderColor: '#000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00AB55',
    },
  },
});

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [menuStateisCollapsed, setMenuStateisCollapsed] = useState(false);

  const menuIconClick = () => {
    if (menuCollapse) {
      setMenuCollapse(false);
    } else if (!menuCollapse && menuStateisCollapsed) {
      setMenuCollapse(false);
      setMenuStateisCollapsed(false);
    } else {
      setMenuCollapse(true);
      setMenuStateisCollapsed(true);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div id="header">
        <header>
          <StyledAppBar>
            <Toolbar>
              <React.Fragment>
                <StyledAvatar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                </StyledAvatar>
                <AvatarMenu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      width: 250,
                      overflow: 'visible',
                      boxShadow:
                        'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <AvatarMenuItem>
                    <Typography
                      sx={{ fontWeight: 800, mb: 1 }}
                      variant={'inherit'}
                    >
                      {user.username}
                      <Typography
                        sx={{ fontWeight: 400, mb: -1 }}
                        variant={'inherit'}
                      >
                        {user.email}
                      </Typography>
                    </Typography>
                  </AvatarMenuItem>
                  <Divider />
                  <AvatarMenuItem onClick={logoutUser}>
                    <Typography variant={'body1'}>Logout</Typography>
                  </AvatarMenuItem>
                </AvatarMenu>
              </React.Fragment>
            </Toolbar>
          </StyledAppBar>
        </header>
        <ProSidebar
          collapsed={menuCollapse}
          onMouseEnter={() => {
            menuStateisCollapsed && setMenuCollapse(false);
          }}
          onMouseLeave={() => {
            menuStateisCollapsed && setMenuCollapse(true);
          }}
        >
          <SidebarHeader>
            <div className="logotext">
              <Iconify height={32} width={32} icon={'emojione:rocket'} />
            </div>

            <div className="closemenu" onClick={menuIconClick}>
              {menuStateisCollapsed ? (
                !menuCollapse && (
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="translate(25,0) scale(-1, 1)" fill="none">
                      <path d="M0 0h24v24H0z" />
                      <g fill="currentColor">
                        <path
                          d="M14.3283 11.4343 18.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z"
                          opacity=".48"
                        />
                        <path d="M8.3283 11.4343 12.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z" />
                      </g>
                    </g>
                  </svg>
                )
              ) : (
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none">
                    <path d="M0 0h24v24H0z" />
                    <g fill="currentColor">
                      <path
                        d="M14.3283 11.4343 18.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z"
                        opacity=".48"
                      />
                      <path d="M8.3283 11.4343 12.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z" />
                    </g>
                  </g>
                </svg>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem
                active={window.location.pathname === '/'}
              // icon={<FiHome />}
              >
                <ProjectDropDown />
              </SidebarMenuItem>
              <SidebarMenuItem
                active={window.location.pathname === '/'}
                icon={<Iconify height={24} width={24} icon={'tabler:home'} />}
              >
                Home<Link to="/"></Link>
              </SidebarMenuItem><SidebarMenuItem
                active={window.location.pathname === '/pods'}
                icon={<Iconify height={24} width={24} icon={'lucide:container'} />}
              >
                Pods<Link to="/pods"></Link>
              </SidebarMenuItem>
              <SidebarMenuItem
                active={window.location.pathname === '/deployments'}
                icon={<Iconify height={24} width={24} icon={'mdi:web'} />}
              >
                Deployments < Link to="/deployments"></Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem
                className="logout"
                active={true}
                icon={<Iconify height={24} width={24} icon={'tabler:logout'} />}
                onClick={logoutUser}
              >
                Logout
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </ProSidebar>
      </div >
    </>
  );
};

export default NavBar;
