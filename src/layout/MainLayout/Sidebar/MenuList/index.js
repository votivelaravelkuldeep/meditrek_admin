import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupIcon from "@mui/icons-material/Group";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import CategoryIcon from "@mui/icons-material/Category";
import MedicationIcon from "@mui/icons-material/Medication"
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy"
import CoronavirusIcon from "@mui/icons-material/Coronavirus"
import SickIcon from "@mui/icons-material/Sick"
import SummarizeIcon from "@mui/icons-material/Summarize"
import DifferenceIcon from "@mui/icons-material/Difference"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import BroadcastOnHomeIcon from "@mui/icons-material/BroadcastOnHome"
import LanguageIcon from "@mui/icons-material/Language"
import BackupTableIcon from "@mui/icons-material/BackupTable"
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssessmentIcon from '@mui/icons-material/Assessment';

// import { APP_PREFIX_PATH } from "../../../../../src/config";
import { APP_PREFIX_PATH } from "config/constant";
// import { title } from "process";

const menu = [
  {
    title: "Dashboard",
    icon: <HomeOutlinedIcon />,
    url: APP_PREFIX_PATH + "/dashboard"
  },

  {
    title: "Manage User",
    icon: <GroupIcon />,
    children: [
      {
        title: "User List",
        icon: <PersonAddAltIcon />,
        url: APP_PREFIX_PATH + "/manage-user/userlist"
      },
      {
        title: "Deleted Users",
        icon: <PersonRemoveIcon />,
        url: APP_PREFIX_PATH + "/manage-user/deleteuser"
      },
    ]
  },

//   {
//     title: "Manage Doctor Category",
//     icon: <GroupIcon />,
//     children: [
//       {
//         title: "Manage Doctors",
//         icon: <DescriptionIcon />,
//         url: APP_PREFIX_PATH + "/manage-doctor"
//       }
//     ]
//   },

 {
    title: "Manage Doctor Category",
    icon: <CategoryIcon />,
    url: APP_PREFIX_PATH + "/manage-category"
  },
   {
    title: "Manage Doctor",
    icon: <GroupIcon />,
    children: [
      {
        title: "Doctor List",
        icon: <MedicationIcon />,
        url: APP_PREFIX_PATH + "/manage-doctor"
      },
      {
        title: "Deleted Doctor List",
        icon: <PersonRemoveIcon />,
        url: APP_PREFIX_PATH + "/manage-user/deletedoctor"
      },
    ]
  },

//   {
//     title: "Medical Data",
//     icon: <BackupTableIcon />,
//     children: [
//       {
//         title: "Disease",
//         url: APP_PREFIX_PATH + "/manage-disease"
//       },
//       {
//         title: "Medicine",
//         url: APP_PREFIX_PATH + "/manage-medicine"
//       },
//       {
//         title: "Medicine Type",
//         url: APP_PREFIX_PATH + "/manage-medicine/manage-medicine-type"
//       },
//       {
//         title: "Symptoms",
//         url: APP_PREFIX_PATH + "/manage-symptom"
//       }
//     ]
//   },
 {
    title: "Manage Medicine",
    icon: <LocalPharmacyIcon />,
    url: APP_PREFIX_PATH + "/manage-medicine"
  },
   {
    title: "Manage Disease",
    icon: <CoronavirusIcon />,
    url: APP_PREFIX_PATH + "/manage-disease"
  },
   {
    title: "Manage Symptom",
    icon: <SickIcon />,
    url: APP_PREFIX_PATH + "/manage-symptom"
  },
  {
    title: "Manage Report Category",
    icon: <SummarizeIcon />,
    url: APP_PREFIX_PATH + "/manage-report-category"
  },
      {
    title: "Analytics",
    icon: <AutoGraphIcon />,
    url: APP_PREFIX_PATH + "/analytics"
  },
    {
    title: "Manage FAQs",
    icon: <SummarizeIcon />,
    url: APP_PREFIX_PATH + "/manage-faq"
  },
     {
    title: "Manage Content",
    icon: <DifferenceIcon />,
    url: APP_PREFIX_PATH + "/manage-contents"
  },
      {
    title: "Manage Help & Support",
    icon: <ContactPhoneIcon />,
    url: APP_PREFIX_PATH + "/manage-contact-us"
  },
     {
    title: "Manage Broadcast",
    icon: <BroadcastOnHomeIcon />,
    url: APP_PREFIX_PATH + "/manage-broadcast"
  },
   {
     title: "Language",
    icon: <LanguageIcon />,
    url: APP_PREFIX_PATH + "/admin/languages"
    
  },

 
  {
    title: "Tabular Reports",
    icon: <BackupTableIcon />,
    children: [
      {
        title: "User Report",
        icon: <PersonAddAltIcon />,
        url: APP_PREFIX_PATH + "/tabular-report/user-report"
      },
      {
        title: "Doctor Report",
        icon: <LocalHospitalIcon />,
        url: APP_PREFIX_PATH + "/tabular-report/doctor-report"
      },
      {
        title: "Medication Report",
        icon: <MedicalServicesIcon />,

        url: APP_PREFIX_PATH + "/tabular-report/medication-report"
      },
      {
        title: "Health Report",
        icon: <HealthAndSafetyIcon />,
        url: APP_PREFIX_PATH + "/tabular-report/health-report"
      },
      {
        title: "Measurement Report",
        icon: <AssessmentIcon />,
        url: APP_PREFIX_PATH + "/tabular-report/measurement-report"
      },
      // {
      //   title: "Lab Report",
      //   url: APP_PREFIX_PATH + "/tabular-report/lab-report"
      // },
      // {
      //   title: "Shared Report",
      //   url: APP_PREFIX_PATH + "/tabular-report/shared-report"
      // }
    ]
  },

  {
    title: "Analytical Report",
    icon: <AutoGraphIcon />,
    children: [
      {
        title: "User Analytics",
        icon : <PersonAddAltIcon />,
        url: APP_PREFIX_PATH + "/analytic-report/user-ana-report"
      },
      {
        title: "Doctor Analytics",
        icon : <MedicationIcon />,
        url: APP_PREFIX_PATH + "/analytic-report/doctor-ana-report"
      }
    ]
  },

//   {
//     title: "New Insights",
//     icon: <SignalCellularAltIcon />,
//     url: APP_PREFIX_PATH + "/insights/new-insights"
//   },

  {
    title: "New Insights",
    icon: <AddBusinessIcon />,
    url: APP_PREFIX_PATH + "/insights/new-insights"
  },
 

//   {
//     title: "Bulk Upload",
//     icon: <BackupTableIcon />,
//     children: [
//       {
//         title: "Upload Symptom",
//         url: APP_PREFIX_PATH + "/bulk-upload-symptom"
//       },
//       {
//         title: "Upload Disease",
//         url: APP_PREFIX_PATH + "/bulk-upload-desease"
//       },
//       {
//         title: "Upload Medicine",
//         url: APP_PREFIX_PATH + "/bulk_upload_medicine"
//       },
//       {
//         title: "Upload Category",
//         url: APP_PREFIX_PATH + "/bulk_upload_category"
//       }
//     ]
//   }
];

// const bottomMenu = [
//   {
//     title: "Contact Us",
//     icon: <ContactSupportIcon />,
//     url: APP_PREFIX_PATH + "/manage-contact-us"
//   },
//   {
//     title: "More Info",
//     icon: <DescriptionIcon />,
//     url: APP_PREFIX_PATH + "/profile"
//   }
// ];

const MenuList = ({ collapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState({});
  const isActive = (url) => {
    return location.pathname === url;
  };
  const toggleMenu = (title) => {
    setOpenMenu((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isChildActive = (children) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.url);
  };

  React.useEffect(() => {
    const newOpenMenu = {};

    menu.forEach((item) => {
      if (item.children) {
        const childActive = item.children.some(
          (child) => location.pathname === child.url
        );

        if (childActive) {
          newOpenMenu[item.title] = true;
        }
      }
    });

    setOpenMenu(newOpenMenu);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* TOP MENU */}
      <List  sx={{
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom:'100px'
  }}>
        {menu.map((item) => (
          <React.Fragment key={item.title}>
            <ListItemButton
              component={item.url ? Link : "div"}
              to={item.url || undefined}
              onClick={() => item.children && toggleMenu(item.title)}
              selected={isActive(item.url) || isChildActive(item.children)}
              sx={{
                mb: 0.5,
                px: collapsed ? 1 : 1.5,
                py: 0.8,
                // overflow:"auto",
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
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  color: "#1ddec4"
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={item.title} />}

              {!collapsed &&
                item.children &&
                (openMenu[item.title] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {/* SUBMENU */}
            {item.children && (
              <Collapse in={openMenu[item.title]} timeout="auto" unmountOnExit>
                <List disablePadding sx={{
                  px: 1,
                  width: "100%"
                }}>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      component={Link}
                      to={child.url}
                      selected={isActive(child.url)}
                      sx={{
                        mb: 0.5,
                        width: "100%",
                        px: collapsed ? 0 : 2,
                        py: 0.8,
                        justifyContent: collapsed ? "center" : "flex-start",
                        "&.Mui-selected": {
                          color: "#1ddec4",
                          fontWeight: 600
                        },

                        "&:hover": {
                          background: "rgba(29,222,196,0.08)"
                        }
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: collapsed ? "100%" : 32,
                          color: "#1ddec4"
                        }}
                      >
                        {child.icon}
                      </ListItemIcon>

                      {!collapsed && <ListItemText primary={child.title} />}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* BOTTOM MENU */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 1 }} />

        {/* <List>
          {bottomMenu.map((item) => (
            <ListItemButton
              key={item.title}
              component={Link}
              to={item.url}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start"
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  color: "#1ddec4"
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText primary={item.title} />
              )}
            </ListItemButton>
          ))}
        </List> */}
      </Box>
    </Box>
  );
};

export default MenuList;