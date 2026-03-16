import Login from 'views/Login';
import ForgotPassword from 'views/AllPage/ForgotPassword';
import ResetPassword from 'views/AllPage/ResetPassword';
import { APP_PREFIX_PATH } from 'config/constant';

const AuthenticationRoutes = {
  path: '/',
  children: [
    { path: APP_PREFIX_PATH + '/login', element: <Login /> },
    { path: APP_PREFIX_PATH + '/forgot-password', element: <ForgotPassword /> },
    { path: APP_PREFIX_PATH + '/reset-password', element: <ResetPassword /> }
  ]
};

export default AuthenticationRoutes;
