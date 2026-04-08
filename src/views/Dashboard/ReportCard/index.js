// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// // ==============================|| REPORT CARD ||============================== //

// const ReportCard = ({ primary, secondary, iconPrimary, color, footerData, iconFooter }) => {
//   const theme = useTheme();
//   const IconPrimary = iconPrimary;
//   const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
//   const IconFooter = iconFooter;
//   const footerIcon = iconFooter ? <IconFooter /> : null;

//   return (
//     <Card>
//       <CardContent>
//         <Grid container justifyContent="space-between" alignItems="center">
//           <Grid item>
//             <Typography variant="h3" sx={{ color: color }}>
//               {primary}
//             </Typography>
//             <Typography variant="subtitle1" sx={{ marginTop: '.5rem' }}>
//               {secondary}
//             </Typography>
//           </Grid>
//           <Grid item>
//             <Typography variant="h2" sx={{ color: color }}>
//               {primaryIcon}
//             </Typography>
//           </Grid>
//         </Grid>
//       </CardContent>
//       <Box sx={{ background: color }}>
//         <Grid
//           container
//           justifyContent="space-between"
//           sx={{
//             textAlign: 'center',
//             padding: theme.spacing(1.2),
//             pl: 2.5,
//             pr: 2.5,
//             color: theme.palette.common.white
//           }}
//         >
//           <Grid item>
//             <Typography variant="body2">{footerData}</Typography>
//           </Grid>
//           <Grid item>
//             <Typography variant="body2">{footerIcon}</Typography>
//           </Grid>
//         </Grid>
//       </Box>
//     </Card>
//   );
// };

// ReportCard.propTypes = {
//   primary: PropTypes.string,
//   secondary: PropTypes.string,
//   iconPrimary: PropTypes.object,
//   footerData: PropTypes.string,
//   iconFooter: PropTypes.object,
//   color: PropTypes.string
// };

// export default ReportCard;

import PropTypes from 'prop-types';
import React from 'react';
import { styled } from "@mui/system";

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Typography,CircularProgress } from '@mui/material';

// ==============================|| REPORT CARD ||============================== //

const ReportCard = ({ primary, secondary, iconPrimary, color,loading }) => {
  // const value = parseFloat(growth);
  // const isPositive = value > 0;
  // const isZero = value === 0;
  // const theme = useTheme();
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="20px" /> : null;
  // const IconFooter = iconFooter;
  // const footerIcon = iconFooter ? <IconFooter /> : null;

  const StyledCard = styled(Card)(() => ({
    borderRadius: 12,
    height: '100%',
    background: '#fff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    transition: 'all .25s ease',
    cursor: 'pointer',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
    }
  }));
  const IconBox = styled(Box)(({ color }) => ({
    width: 42,
    height: 42,
    borderRadius: 10,
    background: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color
  }));

  // const Growth = styled(Box)(() => ({
  //   fontSize: 12,
  //   marginTop: 6,
  //   color: '#6b7280'
  // }));

  return (
    // <StyledCard>
    //   <CardContent
    //     sx={{
    //       p: 2
    //     }}
    //   >
    //     <Grid container justifyContent="space-between" alignItems="center">
    //       <Grid item>
    //         <Typography variant="h3" sx={{ color: color }}>
    //           {primary}
    //         </Typography>
    //         <Typography variant="subtitle1" sx={{ marginTop: '.5rem' }}>
    //           {secondary}
    //         </Typography>
    //       </Grid>
    //       <Grid item>
    //         <Typography variant="h2" sx={{ color: color }}>
    //           {primaryIcon}
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //   </CardContent>
    //   <Box sx={{ background: color }}>
    //     <Grid
    //       container
    //       justifyContent="space-between"
    //       sx={{
    //         textAlign: 'center',
    //         padding: theme.spacing(1.2),
    //         pl: 2.5,
    //         pr: 2.5,
    //         color: theme.palette.common.white
    //       }}
    //     >
    //       <Grid item>
    //         <Typography variant="body2">{footerData}</Typography>
    //       </Grid>
    //       <Grid item>
    //         <Typography variant="body2">{footerIcon}</Typography>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </StyledCard>
      <StyledCard>
      <CardContent
        sx={{
          p: 2
        }}
      >
        {/* Top Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontWeight: 600
            }}
          >
            {secondary}
          </Typography>

          <IconBox color={color}>
            {/* <Icon sx={{ fontSize: 20 }} /> */}
             {primaryIcon}
          </IconBox>
        </Box>

        {/* Stat */}
        {loading ? (
          <CircularProgress size="20px" />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827"
            }}
          >
            {primary}
            {/* {footerData} */}
          </Typography>
        )}

        {/* Growth */}
        {/* <Growth>
          <span
            style={{
              color: isZero
                ? "#6b7280"
                : isPositive
                  ? "#16a34a"
                  : "#dc2626",
              fontWeight: 700
            }}
          >
            {isPositive ? "+" : ""}
            {isNaN(value) ? 0 : value}%
          </span>{" "}
          from last week
        </Growth> */}
      </CardContent>
    </StyledCard>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.object,
  footerData: PropTypes.string,
  iconFooter: PropTypes.object,
  color: PropTypes.string
};

export default ReportCard;
