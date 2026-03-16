import Login from 'views/Login';
import ForgotPassword from 'views/AllPage/ForgotPassword';
import ResetPassword from 'views/AllPage/ResetPassword';
import { APP_PREFIX_PATH } from 'config/constant';

const ExtraRoutes  = {
  path: APP_PREFIX_PATH,
  children: [
    { path: 'login', element: <Login /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password', element: <ResetPassword /> }
  ]
};

export default ExtraRoutes ;
