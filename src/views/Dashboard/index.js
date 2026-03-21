// import React, { useState } from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Grid, Typography } from '@mui/material';

// //project import
// import ReportCard from './ReportCard';
// import { gridSpacing } from 'config.js';


// import { API_URL, APP_PREFIX_PATH, 
//   // APP_PREFIX_PATH 
// } from 'config/constant';
// import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// import CategoryIcon from '@mui/icons-material/Category';
// import MedicationIcon from '@mui/icons-material/Medication';
// import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
// import CoronavirusIcon from '@mui/icons-material/Coronavirus';
// import SummarizeIcon from '@mui/icons-material/Summarize';
// import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
// import SickIcon from '@mui/icons-material/Sick';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// // ==============================|| DASHBOARD DEFAULT ||============================== //

// const Default = () => {
//   const theme = useTheme();
//   const [doctor, setDoctor] = useState(0);
//     const [users, setUsers] = useState(0);
//     const [category, setCategory] = useState(0);
//     const [contact, setContact] = useState(0);
//     const [report, setReport] = useState(0);
//     const [symptoms, setSymptoms] = useState(0);
//     const [disease, setDisease] = useState(0);
//     const [medicine, setMedicine] = useState(0);


//       React.useEffect(() => {
//         const fetchData = async () => {
//           try {
            
//             const response = await axios.get(`${API_URL}get_all_data_count`,);
//             console.log(response.data)
      
//             if (response.data.success) {
//               setDoctor(response?.data?.data?.total_doctors);
//               setCategory(response?.data?.data?.total_doctor_category);
//               setUsers(response?.data?.data?.active_users);
//               setContact(response?.data?.data?.total_contactUs);
//               setReport(response?.data?.data?.total_report_category);
//               setSymptoms(response?.data?.data?.total_symptoms);
//               setDisease(response?.data?.data?.total_disease);
//               setMedicine(response?.data?.data?.total_medicine);

//             } else {
//               console.log("Fetch unsuccessful", response.data.message);
//             }
//           } catch (error) {
//             console.error('Error fetching dashboard data', error);
//           }
//         };
      
//         fetchData();
//       }, []);

//   return (
//     <Grid container spacing={gridSpacing}>
//       <Typography style={{ marginTop: '15px' }} variant="h4" gutterBottom>
//         <span style={{ color: '#1ddec4' }}>Dashboard</span> 
//       </Typography>

//       <Grid item xs={12} style={{ marginTop: '25px' }}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item lg={3} sm={6} xs={12}>
//             <Link to={APP_PREFIX_PATH + "/manage-user/userlist"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${users}`}
//               secondary="Total Users"
//               color={theme.palette.success.main}
//               footerData=""
//               iconPrimary={PersonAddAltIcon}
//             />
//             </Link>
//           </Grid>
//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-contact-us"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${contact}`}
//               secondary="Contact Us"
//               color={theme.palette.primary.main}
//               footerData=""
//               iconPrimary={ContactPhoneIcon}
//             />
//             </Link>
//           </Grid>


//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-doctor"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${doctor}`}
//               secondary="Total Doctor"
//               color={theme.palette.warning.main}
//               footerData=""
//               iconPrimary={MedicationIcon}
//             />
//             </Link>
//           </Grid>
//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-medicine"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${medicine}`}
//               secondary="Total Medicine"
//               color={theme.palette.warning.main}
//               footerData=""
//               iconPrimary={LocalPharmacyIcon}
//             />
//             </Link>
//           </Grid>
//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-disease"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${disease}`}
//               secondary="Total Disease"
//               color={theme.palette.warning.main}
//               footerData=""
//               iconPrimary={CoronavirusIcon}
//             />
//             </Link>
//           </Grid>
//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-symptom"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${symptoms}`}
//               secondary="Total Symptoms"
//               color={theme.palette.warning.main}
//               footerData=""
//               iconPrimary={SickIcon}
//             />
//             </Link>
//           </Grid>

//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-report-category"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${report}`}
//               secondary="Report Category"
//               color={theme.palette.warning.main}
//               footerData=""
//               iconPrimary={SummarizeIcon}
//             />
//             </Link>
//           </Grid>
          
//           <Grid item lg={3} sm={6} xs={12}>
//           <Link to={APP_PREFIX_PATH + "/manage-category"} style={{ textDecoration: 'none' }}>
//             <ReportCard
//                primary={`${category}`}
//               secondary="Doctor Category"
//               color={theme.palette.success.main}
//               footerData=""
//               iconPrimary={CategoryIcon}
//             />
//             </Link>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default Default;


import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

//project import
import ReportCard from './ReportCard';
import { gridSpacing } from 'config.js';


import { API_URL, APP_PREFIX_PATH, 
  // APP_PREFIX_PATH 
} from 'config/constant';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CategoryIcon from '@mui/icons-material/Category';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SickIcon from '@mui/icons-material/Sick';
import axios from 'axios';
import { Link } from 'react-router-dom';
// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const [doctor, setDoctor] = useState(0);
    const [users, setUsers] = useState(0);
    const [category, setCategory] = useState(0);
    const [contact, setContact] = useState(0);
    const [report, setReport] = useState(0);
    const [symptoms, setSymptoms] = useState(0);
    const [disease, setDisease] = useState(0);
    const [medicine, setMedicine] = useState(0);


      React.useEffect(() => {
        const fetchData = async () => {
          try {
            
            const response = await axios.get(`${API_URL}get_all_data_count`,);
            console.log(response.data)
      
            if (response.data.success) {
              setDoctor(response?.data?.data?.total_doctors);
              setCategory(response?.data?.data?.total_doctor_category);
              setUsers(response?.data?.data?.active_users);
              setContact(response?.data?.data?.total_contactUs);
              setReport(response?.data?.data?.total_report_category);
              setSymptoms(response?.data?.data?.total_symptoms);
              setDisease(response?.data?.data?.total_disease);
              setMedicine(response?.data?.data?.total_medicine);

            } else {
              console.log("Fetch unsuccessful", response.data.message);
            }
          } catch (error) {
            console.error('Error fetching dashboard data', error);
          }
        };
      
        fetchData();
      }, []);

  return (
    <Grid container sx={{ width: "100%" }}>
      {/* <Typography style={{ marginTop: '15px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> 
      </Typography> */}

      <Grid item xs={12} style={{ marginTop: '0' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link to={APP_PREFIX_PATH + "/manage-user/userlist"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${users}`}
              secondary="Total Users"
              color={theme.palette.success.main}
              footerData=""
              iconPrimary={PersonAddAltIcon}
            />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-contact-us"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${contact}`}
              secondary="Contact Us"
              color={theme.palette.primary.main}
              footerData=""
              iconPrimary={ContactPhoneIcon}
            />
            </Link>
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-doctor"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${doctor}`}
              secondary="Total Doctor"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={MedicationIcon}
            />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-medicine"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${medicine}`}
              secondary="Total Medicine"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={LocalPharmacyIcon}
            />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-disease"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${disease}`}
              secondary="Total Disease"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={CoronavirusIcon}
            />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-symptom"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${symptoms}`}
              secondary="Total Symptoms"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={SickIcon}
            />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-report-category"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${report}`}
              secondary="Report Category"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={SummarizeIcon}
            />
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to={APP_PREFIX_PATH + "/manage-category"} style={{ textDecoration: 'none' }}>
            <ReportCard
               primary={`${category}`}
              secondary="Doctor Category"
              color={theme.palette.success.main}
              footerData=""
              iconPrimary={CategoryIcon}
            />
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
