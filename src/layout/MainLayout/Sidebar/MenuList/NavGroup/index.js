// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { List, Typography } from '@mui/material';

// // project import
// import NavItem from '../NavItem';
// import NavCollapse from '../NavCollapse';

// // ==============================|| NAVGROUP ||============================== //

// const NavGroup = ({ item }) => {
//   const theme = useTheme();
//   const items = item.children.map((menu) => {
//     switch (menu.type) {
//       case 'collapse':
//         return <NavCollapse key={menu.id} menu={menu} level={1} />;
//       case 'item':
//         return <NavItem key={menu.id} item={menu} level={1} />;
//       default:
//         return (
//           <Typography key={menu.id} variant="h6" color="error" align="center">
//             Menu Items Error
//           </Typography>
//         );
//     }
//   });

//   return (
//     <List
//       subheader={
//         <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
//           {item.title}
//           {item.caption && (
//             <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
//               {item.caption}
//             </Typography>
//           )}
//         </Typography>
//       }
//     >
//       {items}
//     </List>
//   );
// };

// NavGroup.propTypes = {
//   item: PropTypes.object,
//   children: PropTypes.object,
//   title: PropTypes.string,
//   caption: PropTypes.string
// };

// export default NavGroup;

import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, Typography } from '@mui/material';

// project import
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

// ==============================|| NAVGROUP ||============================== //

const NavGroup = ({ item, collapsed }) => {
  const theme = useTheme();
  const items = item.children.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <List
      sx={{
        px: 1,
        width: '100%'
      }}
      subheader={
        <Typography
          sx={{
            mb: 0.5,
            width: '100%',
            px: collapsed ? 0 : 2,
            py: 0.8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&.Mui-selected': {
              color: '#1ddec4',
              fontWeight: 600
            },

            '&:hover': {
              background: 'rgba(29,222,196,0.08)'
            }
          }}
          variant="caption"
          // sx={{ ...theme.typography.menuCaption }}
          display="block"
          gutterBottom
        >
          {item.title}
          {item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )}
        </Typography>
      }
    >
      {items}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  children: PropTypes.object,
  title: PropTypes.string,
  caption: PropTypes.string
};

export default NavGroup;
