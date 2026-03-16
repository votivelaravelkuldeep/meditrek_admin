import React from 'react';
// import { Link as RouterLink s} from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// project import
import AuthLogin from './FirebaseLogin';

// assets
import Logo from 'assets/images/logo.png';

// ==============================|| LOGIN ||============================== //

const Login = () => {
  const theme = useTheme();


  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: '#fff', height: '100%', minHeight: '100vh' }}
    >
      {/* <Grid item xs={11} sm={7} md={6} lg={4} style={{display:'none'}}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            '& .MuiCardContent-root': {
              flexGrow: 1,
              flexBasis: '50%',
              width: '60%'
            },
            maxWidth: '575px',
            margin: '24px auto'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4), backgroundColor: '#1ddec4' }}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid item xs={12}>
                <Grid container justifyContent="center">

                  <img src={Logo} alt="Logo" style={{width:'367px'}} />
                 

                </Grid>
              </Grid>


            </Grid>
          </CardContent>
        </Card>
      </Grid> */}
      <Grid item xs={11} sm={7} md={6} lg={4}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            '& .MuiCardContent-root': {
              flexGrow: 1,
              flexBasis: '50%',
              width: '60%'
            },
            maxWidth: '575px',
            margin: '24px auto'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid item xs={12}>

                <Grid container justifyContent="center">

                  <Grid item style={{ textAlign: 'center' }}>
                    <div className='d-flex justify-content-center'><img src={Logo} alt="Logo" style={{ width: '180px' }} /></div>

                    <Typography color="textPrimary" gutterBottom variant="h3" >
                      Login
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Access to our dashboard
                    </Typography>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              {/* <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Grid item>
                  <Typography variant="subtitle2" color="secondary" sx={{ textDecoration: 'none', pl: 2 }}>
                    Create new account
                  </Typography>
                </Grid>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
