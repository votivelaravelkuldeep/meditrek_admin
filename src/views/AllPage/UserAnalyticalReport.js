import React, { useEffect, useState } from 'react';

// material-ui
import { Card, Grid, Typography } from '@mui/material';

// project import

import { gridSpacing } from 'config.js';
import Chart from 'react-apexcharts';
import Authentication from 'views/auth/authentication';
import axios from 'axios';
import { API_URL } from 'config/constant';

// ==============================|| SAMPLE PAGE ||============================== //

const UserAnaReport = () => {
  const [monthlyDetails, setmonthlyDetails] = useState([]);
  const [yearlyDetails, setyearlyDetails] = useState([]);

  const fetchManageUserDetails = async () => {
    try {
      //    var data={action:"get_users_analytical_report"};
      const response = await axios.get(`${API_URL}/users_analytical_report?action=get_users_analytical_report`);
      const monDetail = response.data.data.month_report_arr;
      console.log('monthly data is ', monDetail);
      const yearDetail = response.data.data.year_report_arr;
      console.log('monthly data is ', yearDetail);
      var newVariable = [];
      monDetail.forEach(function (obj) {
        newVariable.push(obj['month_user_arr']);
      });

      var newYearVariable = [];
      yearDetail.forEach(function (obj) {
        newYearVariable.push(obj['year_user_arr']);
      });

      setmonthlyDetails(newVariable);
      setyearlyDetails(newYearVariable);
    } catch (error) {
      console.error('Error fetching manage user details:', error);
    }
  };

  useEffect(() => {
    fetchManageUserDetails();
  }, []);

  const seriesmonthly = [
    {
      name: 'Total Users',
      data: monthlyDetails
    }
  ];
  const seriesyearly = [
    {
      name: 'Total Users',
      data: yearlyDetails
    }
  ];

  // Monthly chart configuration
  const monthly = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      // colors: ['#4D6A98']
      colors: ['#fd7e14']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  // Yearly chart configuration
  const yearly = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['2020', '2021', '2022', '2023', '2024', '2025']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      // colors: ['#4D6A98']
      colors: ['#fd7e14']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  return (
    <>
      <Authentication />
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#4D6A98', textAlign: 'center' }}>Dashboard</span> / User Analytical Report
      </Typography>

      <Typography
        className="d-flex justify-content-center"
        style={{ marginTop: '30px', marginBottom: '30px', color: '#000' }}
        variant="h4"
        gutterBottom
      >
        2024 Monthly Analytical Reports of Users
      </Typography>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart ">
              {/* ApexCharts component */}
              <Chart options={monthly} series={seriesmonthly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>

        <Typography className="" style={{ margin: ' 40px auto 0px', color: '#000' }} variant="h4" gutterBottom>
          2024 Yearly Analytical Reports of Users
        </Typography>

        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart">
              {/* ApexCharts component */}
              <Chart options={yearly} series={seriesyearly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserAnaReport;
