// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Box, Grid, IconButton } from '@mui/material';

// // project import
// // import SearchSection from './SearchSection';
// import ProfileSection from './ProfileSection';
// // import NotificationSection from './NotificationSection';
// import { drawerWidth } from 'config.js';


// // assets
// import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
// import logo from 'assets/images/logo.png';
// // import Typography from '@mui/material/Typography';

// // ==============================|| HEADER ||============================== //

// const Header = ({ drawerToggle }) => {
//   const theme = useTheme();

//   return (
//     <>
//       <Box width={drawerWidth}>
//         <Grid container justifyContent="space-between" alignItems="center">
//           <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//             <Grid item>
//               <Box mt={0.5}>
//                 <img src={logo} alt="Logo" style={{width:'60px'}} />
//                    <span style={{ color: '#fff', fontSize: '25px', fontWeight: 600 }}>
//     Meditrek
//   </span>
//                 {/* <Typography className="text-white" variant="h3" gutterBottom>
//                   Thera Data
//                 </Typography> */}
//               </Box>
//             </Grid>
//           </Box>
//           <Grid item>
//             <IconButton
//               edge="start"
//               sx={{ mr: theme.spacing(1.25) }}
//               color="inherit"
//               aria-label="open drawer"
//               onClick={drawerToggle}
//               size="large"
//             >
//               <MenuTwoToneIcon sx={{ fontSize: '1.5rem' , color:'#fff'}} />
//             </IconButton>
//           </Grid>
//         </Grid>
//       </Box>
//       <Box sx={{ flexGrow: 1 }} />
//       {/* <SearchSection theme="light" /> */}
//       <ProfileSection />
//     </>
//   );
// };

// Header.propTypes = {
//   drawerToggle: PropTypes.func
// };

// export default Header;


import React from "react";
import PropTypes from "prop-types";

import { IconButton, InputBase, Paper } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import SearchIcon from "@mui/icons-material/Search";

import ProfileSection from "./ProfileSection";
import logo from "assets/images/logo1.png";

const Header = ({ drawerOpen, drawerToggle }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
};
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
     <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
  <img src={logo} alt="logo" style={{ width: 32 }} />

  {drawerOpen && (
    <span
      style={{
        fontSize: "20px",
        fontWeight: 600
      }}
    >
      Meditrek
    </span>
  )}

  <IconButton
    onClick={drawerToggle}
    style={{ background: "#f5f7fa" }}
  >
    <MenuTwoToneIcon style={{ color: "#1ddec4" }} />
  </IconButton>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginLeft: "8px",
      gap: "10px"
    }}
  >
    <div
      style={{
        width: "1px",
        height: "28px",
        background: "#eaecef"
      }}
    />

    <span
      style={{
        fontSize: "14px",
        color: "#6c757d"
      }}
    >
      Dashboard
    </span>
  </div>
</div>

      

      {/* SEARCH */ }
  <Paper
    sx={{
      display: "flex",
      alignItems: "center",
      px: 1.5,
      py: 0.5,
      borderRadius: "8px",
      width: 320,
      background: "#f6f8fa",
      boxShadow: "none"
    }}
  >
    <SearchIcon sx={{ fontSize: 20, color: "#9aa0a6" }} />

    <InputBase
      placeholder="Search Doctor..."
      sx={{
        ml: 1,
        fontSize: "14px",
        flex: 1
      }}
    />
  </Paper>

  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}
>
  {/* Fullscreen Button */}
  <IconButton
    onClick={toggleFullscreen}
    style={{ background: "#f5f7fa" }}
  >
    {isFullscreen ? (
      <FullscreenExitIcon style={{ color: "#6c757d" }} />
    ) : (
      <FullscreenIcon style={{ color: "#6c757d" }} />
    )}
  </IconButton>

  {/* Profile */}
  <ProfileSection />
</div>
    </div >
  );
};

Header.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func
};

export default Header;