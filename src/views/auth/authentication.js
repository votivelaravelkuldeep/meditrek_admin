// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import { APP_PREFIX_PATH } from 'config/constant';

function Authentication(){
    // const navigate = useNavigate();
  console.log('auth page enter');

  // useEffect(()=>{
  //   const path = window.location.pathname
  //   const protectedPaths = [
  //       '/',
  //       // APP_PREFIX_PATH + '/userlist',
  //       // APP_PREFIX_PATH + '/deleteuser',
  //       APP_PREFIX_PATH + '/dashboard',
  //       APP_PREFIX_PATH + '/manage-user/userlist',
  //       APP_PREFIX_PATH + '/manage-user/userlist/view_user/:user_id',
  //       APP_PREFIX_PATH + "/manage-user/deleteuser",
  //       APP_PREFIX_PATH + '/manage-category',
  //       APP_PREFIX_PATH + '/manage-client',
  //       APP_PREFIX_PATH + '/manage-client/view-client/',
  //       APP_PREFIX_PATH + '/manage-client/create-client',
  //       APP_PREFIX_PATH + '/manage-ticket-and-license',
  //       APP_PREFIX_PATH + '/manage-jobs',
  //       APP_PREFIX_PATH + '/manage-jobs/create-jobs',
  //       APP_PREFIX_PATH + '/manage-jobs/view-jobs/:user_id',
  //       APP_PREFIX_PATH + '/manage-category',
  //       APP_PREFIX_PATH + '/manage-site-induction',
  //       APP_PREFIX_PATH + '/manage-contents',
  //       APP_PREFIX_PATH + '/manage-contact-us',
  //       APP_PREFIX_PATH + '/manage-broadcast',
  //       APP_PREFIX_PATH + '/tabular-report/user-report',
  //       APP_PREFIX_PATH + '/tabular-report/job-report',
  //       APP_PREFIX_PATH + '/analytic-report/user-ana-report',
  //       APP_PREFIX_PATH + '/profile'

        
  //   ]

  //   const token = localStorage.getItem('token');
  //   const userType = localStorage.getItem('user_type');
  //   console.log('Current Path:', path);
  //   console.log('Token:', token);

  //   if (!token) {
  //       navigate(APP_PREFIX_PATH + '/login');
  //     } else if (path === APP_PREFIX_PATH) {
  //       console.log('Token present, redirecting to dashboard');
  //       navigate(APP_PREFIX_PATH + '/dashboard');
  //     }

  //     // Case 1: No token - Redirect to login page for any protected route
  //   if (!token) {
  //       if (![APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/forgot-password', APP_PREFIX_PATH + '/reset-password'].includes(path)) {
  //         console.log('Navigating to /');
  //         navigate(APP_PREFIX_PATH + '/login');
  //       }
  //     } else {
  //       // Case 2: Token is present
  //       // if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/reset-password', APP_PREFIX_PATH + '/forgot-password'].includes(path)) {
  //       //   // Redirect to dashboard if accessing login/reset/forgot-password while logged in
  //       //   console.log('Navigating to dashboard since token is present');
  //       //   navigate(APP_PREFIX_PATH + '/dashboard');
  //       // }
  
  //       if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/reset-password', APP_PREFIX_PATH + '/forgot-password'].includes(path)) {
  //         console.log('Navigating to dashboard since token is present');
  //         navigate(APP_PREFIX_PATH + '/dashboard');
  //       }
  
  //       // Check for protected paths and user type validity
  //       if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
  //         console.log('Protected path');
  //         if (userType !== '0' && !token) {
  //           console.log('Invalid user type, navigating to /logout');
  //           navigate(APP_PREFIX_PATH + '/login');
  //         }
  //       }
  //     }
      

  // }, [navigate])

  return null;
}

export default Authentication;