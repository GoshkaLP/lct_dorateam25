import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../images/header/profile_icon.png";
import doraTeam from "../../images/android-chrome-512x512.png";
import "./Header.css";
import { MAIN_HEADER_MENU } from "../../const/const";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../const/const";
import { useUserProfile } from "../../store/UserProfile";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useUserProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Фильтруем меню, исключая пустые элементы
  const menuItems = MAIN_HEADER_MENU.filter(item => item.name.trim() !== '');

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Меню
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                },
              }}
            >
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#ffffff',
          color: 'text.primary',
          boxShadow: '0px 4px 15px rgba(13, 76, 211, 0.15)',
          borderRadius: { xs: 0, sm: '0px 0px 40px 40px' },
        }}
      >
        <Toolbar sx={{ 
          justifyContent: isMobile ? 'space-between' : 'space-between', 
          px: { xs: 2, sm: 5 } 
        }}>
          {/* Левая часть - Мобильное меню или Десктопное меню */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            minWidth: { xs: 'auto', md: '200px' },
            flex: isMobile ? 'none' : 1
          }}>
            {/* Мобильное меню */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Десктопное меню */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Typography
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      whiteSpace: 'nowrap',
                      textDecoration: 'none',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      opacity: location.pathname === item.path ? 1 : 0.7,
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    {item.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* Центральная иконка - только для мобильных */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              maxWidth: '120px'
            }}>
              <Link 
                to={ROUTES.MAIN}
                style={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src={doraTeam} 
                  alt="DoraTeam Logo" 
                  style={{ 
                    height: '40px', 
                    width: 'auto',
                    objectFit: 'contain',
                    cursor: 'pointer'
                  }}
                />
              </Link>
            </Box>
          )}

          {/* Правая часть - Профиль пользователя */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            minWidth: { xs: 'auto', md: '200px' }, 
            justifyContent: 'flex-end',
            flex: isMobile ? 'none' : 1
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {data?.name}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                src={profile} 
                alt="profile icon"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Мобильное меню */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Лучше для производительности на мобильных
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Меню профиля */}
      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem 
          onClick={() => {
            handleNavigation(ROUTES.ACCOUNT);
            handleProfileMenuClose();
          }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          Профиль
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
