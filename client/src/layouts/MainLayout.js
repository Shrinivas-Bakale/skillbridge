import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Event as EventIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Styled search component
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// Active link style
const NavLink = styled(Button)(({ theme, active }) => ({
  color: theme.palette.text.primary,
  position: "relative",
  "&::after": active
    ? {
        content: '""',
        position: "absolute",
        bottom: 6,
        left: 12,
        right: 12,
        height: 2,
        borderRadius: 1,
        backgroundColor: theme.palette.secondary.main,
      }
    : {},
}));

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  // State for profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      navigate(`/events?search=${query}`);
      if (drawerOpen) setDrawerOpen(false);
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }} role="presentation">
      <List>
        <ListItem
          component={RouterLink}
          to="/"
          onClick={() => setDrawerOpen(false)}
        >
          <ListItemIcon>
            <HomeIcon color={isActive("/") ? "secondary" : "inherit"} />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{
              color: isActive("/") ? "secondary" : "inherit",
              fontWeight: isActive("/") ? "bold" : "normal",
            }}
          />
        </ListItem>
        <ListItem
          component={RouterLink}
          to="/events"
          onClick={() => setDrawerOpen(false)}
        >
          <ListItemIcon>
            <EventIcon color={isActive("/events") ? "secondary" : "inherit"} />
          </ListItemIcon>
          <ListItemText
            primary="Events"
            primaryTypographyProps={{
              color: isActive("/events") ? "secondary" : "inherit",
              fontWeight: isActive("/events") ? "bold" : "normal",
            }}
          />
        </ListItem>

        {user && (
          <>
            <ListItem
              component={RouterLink}
              to="/dashboard"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <DashboardIcon
                  color={isActive("/dashboard") ? "secondary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  color: isActive("/dashboard") ? "secondary" : "inherit",
                  fontWeight: isActive("/dashboard") ? "bold" : "normal",
                }}
              />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/create-event"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <AddIcon
                  color={isActive("/create-event") ? "secondary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Create Event"
                primaryTypographyProps={{
                  color: isActive("/create-event") ? "secondary" : "inherit",
                  fontWeight: isActive("/create-event") ? "bold" : "normal",
                }}
              />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/profile"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <PersonIcon
                  color={isActive("/profile") ? "secondary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  color: isActive("/profile") ? "secondary" : "inherit",
                  fontWeight: isActive("/profile") ? "bold" : "normal",
                }}
              />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/settings"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <SettingsIcon
                  color={isActive("/settings") ? "secondary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  color: isActive("/settings") ? "secondary" : "inherit",
                  fontWeight: isActive("/settings") ? "bold" : "normal",
                }}
              />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}

        {!user && (
          <>
            <Divider />
            <ListItem
              component={RouterLink}
              to="/login"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/register"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}

        <Divider />
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              textDecoration: "none",
              color: "#3e878a",
              "&:hover": {
                color: "#357173",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                backgroundColor: "#3e878a",
                color: "white",
                px: 1,
                py: 0.5,
                mr: 1,
                borderRadius: 1,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              SB
            </Box>
            SkillBridge
          </Typography>

          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search events…"
                inputProps={{ "aria-label": "search" }}
                onKeyPress={handleSearch}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Dark/Light mode toggle */}
          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <NavLink
                component={RouterLink}
                to="/"
                active={isActive("/") ? 1 : 0}
              >
                Home
              </NavLink>
              <NavLink
                component={RouterLink}
                to="/events"
                active={isActive("/events") ? 1 : 0}
              >
                Events
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    component={RouterLink}
                    to="/dashboard"
                    active={isActive("/dashboard") ? 1 : 0}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    component={RouterLink}
                    to="/create-event"
                    active={isActive("/create-event") ? 1 : 0}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{
                      ml: 1,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Create
                  </NavLink>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                    alt={user.name || "User"}
                    src={user.avatar || ""}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawerContent}
      </Drawer>

      {/* User dropdown menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={RouterLink} to="/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem component={RouterLink} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
