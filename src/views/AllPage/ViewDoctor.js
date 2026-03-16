// import { Card, Pagination, Stack, Table } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router';
import { decode as base64_decode } from 'base-64';
import React from 'react';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
function ViewDoctor() {
  const [doctor_data, setDoctorData] = React.useState({});
  const [doctor_report_data, setDoctorReportData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const doctorsPerPage = 50;

 /* const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }; */

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const { doctor_id } = useParams();
  const decodedDoctorId = base64_decode(doctor_id);
  var navigate = useNavigate();
  var token = sessionStorage.getItem('token');

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_doctor_detail?doctor_id=${decodedDoctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setDoctorData(response.data.data);
        } else {
          console.error('Error fetching doctor details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor details:', error);
      });
  }, [decodedDoctorId]);
   console.log(doctor_report_data);
  React.useEffect(() => {
    axios
      .get(`${API_URL}get_doctor_user_shared_report?doctor_id=${decodedDoctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setDoctorReportData(response.data.report_data);
        } else {
          console.error('Error fetching doctor details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor details:', error);
      });
  }, [decodedDoctorId]);

  const filteredUsers = doctor_report_data.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.category_name && user.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchQuery)) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.formatted_date && user.formatted_date.includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredUsers.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredUsers.length / doctorsPerPage);

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Doctor / Doctor Details
      </Typography>
      <Card className="mb-5">
        <Card.Header className="bg-white">
          <Card.Title as="h5" className="mt-2">
            Doctor Details
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="view-user-content row">
            <div className="col-lg-9">
              <div className="mobile-view ms-3 ">
                <td style={{ textAlign: 'center' }}>
                  <img
                    src={doctor_data.image ? `${IMAGE_PATH}${doctor_data.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                    alt="Logo"
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover',marginBottom: '50px'}}
                  ></img>
                </td>
                {/* <h5>User Detail</h5> */}
                <div className="user-detail row ">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Doctor Name :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{doctor_data.doctor_name || '-'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Email :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{doctor_data.email || '-'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Mobile No. : </p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{doctor_data.mobile || '-'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}> Specialization : </p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{doctor_data.category_name || '-'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Approve Status :</p>
                      </div>
                      <div className="col-lg-6">
                        <p
                          style={{
                            height: '40px',
                            width: '90px',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '9px',
                            backgroundColor: doctor_data.approve_status === 0 ? 'orange' : 'green'
                          }}
                        >
                          {doctor_data.approve_status_lable || '-'}
                        </p>
                      </div>
                    </div>


                      <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Active Status :</p>
                      </div>
                      <div className="col-lg-6">
                        <p
                          style={{
                            height: '40px',
                            width: '90px',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '9px',
                            textAlign: 'center',        // ✅ center horizontally
        lineHeight: '22px' ,
                            backgroundColor: doctor_data.active_flag == 0 ? 'red' : 'green'
                          }}
                        >
                          {doctor_data.activestatus_label || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Create Date & Time :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{doctor_data.createtime || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* <Card>
        <Card.Header className=" bg-white ">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                Search
              </label>
              <input
                className="search-input"
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
              />
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {currentDoctors.length > 0 ? (
            <>
              {' '}
              <Table responsive hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Report</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>User Name</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Category</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors.map((doctor, index) => (
                    <tr key={doctor.doctor_id}>
                      <th scope="row" style={{ textAlign: 'center' }}>
                        {indexOfFirstDoctor + index + 1}
                      </th>
                      <td style={{ textAlign: 'center' }}>
                        <a href={`${IMAGE_PATH}${doctor.file}`} target="_blank" rel="noopener noreferrer">
                          View Report
                        </a>
                      </td>
                      <td style={{ textAlign: 'center' }}>{doctor.name}</td>
                      <td style={{ textAlign: 'center' }}>{doctor.email}</td>
                      <td style={{ textAlign: 'center' }}>{doctor.mobile}</td>
                      <td style={{ textAlign: 'center' }}>{doctor.category_name}</td>
                      <td style={{ textAlign: 'center' }}>{doctor.formatted_date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between">
                <p style={{ fontWeight: '500' }} className="pagination">
                  Showing {indexOfFirstDoctor + 1} to {Math.min(indexOfLastDoctor, currentDoctors.length)} of {currentDoctors.length}{' '}
                  entries
                </p>
                <Stack spacing={2} alignItems="right">
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </Stack>
              </div>
            </>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Report</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>User Name</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Category</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7}>
                      <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card> */}
    </>
  );
}

export default ViewDoctor;