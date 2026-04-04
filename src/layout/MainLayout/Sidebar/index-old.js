// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme, styled } from '@mui/material/styles';
// import { useMediaQuery, Divider, Drawer, Grid, Box } from '@mui/material';

// // third party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// // project import
// import MenuList from './MenuList';
// import { drawerWidth } from 'config.js';
// // import NavCard from './MenuList/NavCard';

// // assets
// import logo from 'assets/images/logo.png';
// // import { red } from '@mui/material/colors';

// // custom style
// const Nav = styled((props) => <nav {...props} />)(({ theme }) => ({
//   [theme.breakpoints.up('md')]: {
//     width: drawerWidth,
//     flexShrink: 0
//   }
// }));

// // ==============================|| SIDEBAR ||============================== //

// const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
//   const theme = useTheme();
//   const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
//   const drawer = (
//     <>
//       <Box sx={{ display: { md: 'none', xs: 'block' } }}>
//         <Grid
//           container
//           direction="row"
//           justifyContent="center"
//           elevation={5}
//           alignItems="center"
//           spacing={0}
//           sx={{
//             ...theme.mixins.toolbar,
//             lineHeight: 0,
//             background: theme.palette.primary.main,
//             boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
//           }}
//         >
//           <Grid item>
//             <img src={logo} alt="Logo"  style={{width:'120px'}}/ >
//           </Grid>
//         </Grid>
//       </Box>
//       <Divider />
//       <PerfectScrollbar style={{ height: 'calc(100vh - 65px)', padding: '10px' }}>
//         <MenuList />
//         {/* <NavCard /> */}
//       </PerfectScrollbar>
//     </>
//   );

//   const container = window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Nav>
//       <Drawer
//         container={container}
//         variant={matchUpMd ? 'persistent' : 'temporary'}
//         anchor="left"
//         open={drawerOpen}
//         onClose={drawerToggle}
//         sx={{
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             borderRight: 'none',
//             boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
//             top: { md: 64, sm: 0 }
//           }
//         }}
//         ModalProps={{ keepMounted: true }}
//       >
//         {drawer}
//       </Drawer>
//     </Nav>
//   );
// };

// Sidebar.propTypes = {
//   drawerOpen: PropTypes.bool,
//   drawerToggle: PropTypes.func,
//   window: PropTypes.object
// };

// export default Sidebar;


import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Grid, Box } from '@mui/material';

// third party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import MenuList from './MenuList';
import { drawerWidth } from 'config.js';
import { collapsedWidth } from 'config.js';
// import NavCard from './MenuList/NavCard';

// assets
import logo from 'assets/images/logo.png';
// import { config } from 'process';
// import { red } from '@mui/material/colors';

// custom style
const Nav = styled((props) => <nav {...props} />)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: drawerWidth,
    flexShrink: 0
  }
}));

// ==============================|| SIDEBAR ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const drawer = (
    <>
      <Box sx={{ display: { md: 'none', xs: 'block' } }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          elevation={5}
          alignItems="center"
          spacing={0}
          sx={{
            ...theme.mixins.toolbar,
            lineHeight: 0,
            background: theme.palette.primary.main,
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Grid item>
            <img src={logo} alt="Logo"  style={{width:'120px'}}/ >
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
  sx={{
    height: "calc(100vh - 64px)",
    overflowY: "auto",
    px: 1
  }}
>
  <MenuList />
</Box>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Nav>
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
       sx={{
        "& .MuiDrawer-paper": {
          width: matchUpMd ? (drawerOpen ? drawerWidth : collapsedWidth) : drawerWidth,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          overflowY: "auto",
          borderRight: "1px solid #e9ecef",
          top: { md: 64, xs: 0 },
          boxShadow: matchUpMd ? 'none' : '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)'
        }
      }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;

