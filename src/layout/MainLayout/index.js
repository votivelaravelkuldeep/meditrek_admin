// import React from 'react';
// import { Outlet } from 'react-router-dom';

// // material-ui
// import { styled, useTheme } from '@mui/material/styles';
// import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// // project import
// import { drawerWidth } from 'config.js';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import { APP_PREFIX_PATH } from 'config/constant';

// // custom style
// const Main = styled((props) => <main {...props} />)(({ theme }) => ({
//   width: '100%',
//   minHeight: '100vh',
//   flexGrow: 1,
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen
//   }),
//   [theme.breakpoints.up('md')]: {
//     marginLeft: -drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`
//   }
// }));

// const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
//   [theme.breakpoints.down('md')]: {
//     padding: theme.spacing(3)
//   },
//   padding: theme.spacing(5)
// }));

// // ==============================|| MAIN LAYOUT ||============================== //

// const MainLayout = () => {
//   const theme = useTheme();
//   const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
//   const [drawerOpen, setDrawerOpen] = React.useState(false);
//   const navigate = useNavigate();

//   const handleDrawerToggle = () => {
//     setDrawerOpen(!drawerOpen);
//   };

  
// React.useEffect(() => {
//   setDrawerOpen(matchUpMd);

//   const currentPath = window.location.pathname;
//   const token = sessionStorage.getItem('token');

//   const isAuthPage =
//     currentPath.includes('/login') ||
//     currentPath.includes('/forgot-password') ||
//     currentPath.includes('/reset-password');

//   // allow login pages
//   if (isAuthPage) return;

//   // protect admin pages
//   if (!token) {
//     navigate(APP_PREFIX_PATH + '/login', { replace: true });
//   }

// }, [matchUpMd, navigate]);




//   return (
//     <Box sx={{ display: 'flex', width: '100%' }}>
//       <AppBar position="fixed"  elevation={0}  sx={{
//           background: "#fff",
//           borderBottom: "1px solid #e9ecef",
//           zIndex: 1201
//         }}>
//         <Toolbar 
//         // sx={{ background: 'linear-gradient(to right, gray, white)', }}
//         sx={{ minHeight: "64px !important", px: 3 }}
//         >
//           <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
//         </Toolbar>
//       </AppBar>

//       <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
//       <Main
//         style={{
//           ...(drawerOpen && {
//             transition: theme.transitions.create('margin', {
//               easing: theme.transitions.easing.easeOut,
//               duration: theme.transitions.duration.enteringScreen
//             }),
//             marginLeft: 0,
//             marginRight: 'inherit'
//           })
//         }}
//       >
//         <Box sx={theme.mixins.toolbar} />
//         <OutletDiv>
//           <Outlet />
//         </OutletDiv>
//       </Main>
//     </Box>
//   );
// };

// export default MainLayout;


import React from "react";
import { Outlet } from "react-router-dom";

import { styled } from "@mui/material/styles";
import { AppBar, Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 232;
const collapsedWidth = 72;

const Main = styled("main")(({ theme, open }) => ({
  flexGrow: 1,
  background: "#f5f7fa",
  minHeight: "100vh",
  transition: "margin 0.25s ease",
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? drawerWidth : collapsedWidth
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0 // No margin on mobile
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Close drawer on mobile when navigating (optional but recommended)
  React.useEffect(() => {
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "#fff",
          borderBottom: "1px solid #e9ecef",
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: 3 }}>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />

      {/* CONTENT */}
      <Main open={drawerOpen}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
