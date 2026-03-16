import { useRoutes } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
// import ExtraRoutes from './MainRouting';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
  return useRoutes([
    AuthenticationRoutes,
    // ExtraRoutes,
    MainRoutes
  ]);
}
