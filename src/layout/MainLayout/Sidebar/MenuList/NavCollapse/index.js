// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// // project import
// import NavItem from '../NavItem';
// import { useLocation, matchPath } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import * as actionTypes from 'store/actions';

// // assets
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// // ==============================|| NAV COLLAPSE ||============================== //

// const NavCollapse = ({ menu, level }) => {
//   const theme = useTheme();
//   const { pathname } = useLocation();
//   const dispatch = useDispatch();
//   const customization = useSelector((state) => state.customization);

//   // open when redux customization.isOpen matches this menu id
//   const open = customization?.isOpen === menu.id;

//   const handleClick = () => {
//     // toggle: if this menu is already open => close it (null), otherwise open this menu
//     const next = customization?.isOpen === menu.id ? null : menu.id;
//     dispatch({ type: actionTypes.MENU_OPEN, isOpen: next });
//   };

//   // Auto select & open based on current URL:
//   React.useEffect(() => {
//     let shouldOpen = false;

//     // check direct children urls and nested children
//     if (menu.children && menu.children.length) {
//       menu.children.forEach((child) => {
//         // If child has a URL, try matchPath (safe) OR fallback to includes
//         if (child.url) {
//           try {
//             if (matchPath({ path: child.url, end: false }, pathname)) {
//               shouldOpen = true;
//             } else if (pathname.includes(child.url)) {
//               shouldOpen = true;
//             }
//           } catch (e) {
//             // fallback if matchPath throws for some pattern, use includes
//             if (pathname.includes(child.url)) {
//               shouldOpen = true;
//             }
//           }
//         }

//         // support nested collapses
//         if (child.children && child.children.length) {
//           child.children.forEach((sub) => {
//             if (sub.url) {
//               try {
//                 if (matchPath({ path: sub.url, end: false }, pathname)) {
//                   shouldOpen = true;
//                 } else if (pathname.includes(sub.url)) {
//                   shouldOpen = true;
//                 }
//               } catch (e) {
//                 if (pathname.includes(sub.url)) {
//                   shouldOpen = true;
//                 }
//               }
//             }
//           });
//         }
//       });
//     }

//     // if current path should open this menu, set redux state accordingly
//     if (shouldOpen && customization?.isOpen !== menu.id) {
//       dispatch({ type: actionTypes.MENU_OPEN, isOpen: menu.id });
//     }

//     // if none of children match and this menu is currently open, close it
//     if (!shouldOpen && customization?.isOpen === menu.id) {
//       dispatch({ type: actionTypes.MENU_OPEN, isOpen: null });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname, menu.children, dispatch]);

//   const menus = menu.children?.map((item) => {
//     switch (item.type) {
//       case 'collapse':
//         return <NavCollapse key={item.id} menu={item} level={level + 1} />;
//       case 'item':
//         return <NavItem key={item.id} item={item} level={level + 1} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Menu Items Error
//           </Typography>
//         );
//     }
//   });

//   const Icon = menu.icon;
//   const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'default'} />;

//   return (
//     <>
//       <ListItemButton
//         sx={{
//           borderRadius: '55px',
//           mb: 0.6,
//           pl: `${level * 16}px`,
//           ...(level > 1 && { backgroundColor: 'transparent !important', py: 1, borderRadius: '5px' })
//         }}
//         selected={customization?.isOpen === menu.id}
//         onClick={handleClick}
//       >
//         <ListItemIcon sx={{ minWidth: !menu.icon ? '25px' : 'unset' }}>{menuIcon}</ListItemIcon>
//         <ListItemText
//           primary={
//             <Typography variant={customization?.isOpen === menu.id ? 'subtitle1' : 'body1'} color="inherit" sx={{ pl: 1.9 }}>
//               {menu.title}
//             </Typography>
//           }
//           secondary={
//             menu.caption && (
//               <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, pl: 2 }} display="block" gutterBottom>
//                 {menu.caption}
//               </Typography>
//             )
//           }
//         />
//         {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
//       </ListItemButton>

//       <Collapse in={open} timeout="auto" unmountOnExit>
//         <List component="div" disablePadding>
//           {menus}
//         </List>
//       </Collapse>
//     </>
//   );
// };

// NavCollapse.propTypes = {
//   menu: PropTypes.object,
//   level: PropTypes.number,
//   title: PropTypes.string,
//   icon: PropTypes.string,
//   id: PropTypes.string,
//   children: PropTypes.string
// };

// export default NavCollapse;

import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// project import
import NavItem from '../NavItem';
import { useLocation, matchPath } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from 'store/actions';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| NAV COLLAPSE ||============================== //

const NavCollapse = ({ menu, level,collapsed  }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  // open when redux customization.isOpen matches this menu id
  const open = customization?.isOpen === menu.id;

  const handleClick = () => {
    // toggle: if this menu is already open => close it (null), otherwise open this menu
    const next = customization?.isOpen === menu.id ? null : menu.id;
    dispatch({ type: actionTypes.MENU_OPEN, isOpen: next });
  };

  // Auto select & open based on current URL:
  React.useEffect(() => {
    let shouldOpen = false;

    // check direct children urls and nested children
    if (menu.children && menu.children.length) {
      menu.children.forEach((child) => {
        // If child has a URL, try matchPath (safe) OR fallback to includes
        if (child.url) {
          try {
            if (matchPath({ path: child.url, end: false }, pathname)) {
              shouldOpen = true;
            } else if (pathname.includes(child.url)) {
              shouldOpen = true;
            }
          } catch (e) {
            // fallback if matchPath throws for some pattern, use includes
            if (pathname.includes(child.url)) {
              shouldOpen = true;
            }
          }
        }

        // support nested collapses
        if (child.children && child.children.length) {
          child.children.forEach((sub) => {
            if (sub.url) {
              try {
                if (matchPath({ path: sub.url, end: false }, pathname)) {
                  shouldOpen = true;
                } else if (pathname.includes(sub.url)) {
                  shouldOpen = true;
                }
              } catch (e) {
                if (pathname.includes(sub.url)) {
                  shouldOpen = true;
                }
              }
            }
          });
        }
      });
    }

    // if current path should open this menu, set redux state accordingly
    if (shouldOpen && customization?.isOpen !== menu.id) {
      dispatch({ type: actionTypes.MENU_OPEN, isOpen: menu.id });
    }

    // if none of children match and this menu is currently open, close it
    if (!shouldOpen && customization?.isOpen === menu.id) {
      dispatch({ type: actionTypes.MENU_OPEN, isOpen: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children, dispatch]);

  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'default'} />;

  return (
    <>
      <ListItemButton
           sx={{
                mb: 0.5,
                px: collapsed ? 1 : 1.5,
                py: 0.8,
                justifyContent: collapsed ? "center" : "flex-start",
                "&.Mui-selected": {
                  background: "rgba(29,222,196,0.15)",
                  borderLeft: "4px solid #1ddec4"
                },

                "&.Mui-selected:hover": {
                  background: "rgba(29,222,196,0.20)"
                },

                "&:hover": {
                  background: "rgba(29,222,196,0.08)"
                }
              }}
        selected={customization?.isOpen === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 1.5,
            color: '#1ddec4'
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={customization?.isOpen === menu.id ? 'subtitle1' : 'body1'} color="inherit" sx={{ pl: 1.9 }}>
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, pl: 2 }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.string
};

export default NavCollapse;
