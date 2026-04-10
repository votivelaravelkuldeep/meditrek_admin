// import { Card, Pagination, Stack, Table } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
// import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router';
import { decode as base64_decode } from 'base-64';
import React from 'react';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
import Heading from 'component/common/Heading';
function ViewDoctor() {
  const [doctor_data, setDoctorData] = React.useState({});
  const [doctor_report_data, setDoctorReportData] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const doctorsPerPage = 50;

  /* const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }; */
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  const currentDoctors = filteredUsers.slice(indexOfFirstDoctor, indexOfLastDoctor);
  // eslint-disable-next-line no-unused-vars
  const totalPages = Math.ceil(filteredUsers.length / doctorsPerPage);

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Doctor / Doctor Details
      </Typography> */}
      <div
        className="mb-5"
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        <div className="mb-3" style={{ paddingLeft: '24px' }}>
          <Heading heading="Doctor Details" />
        </div>
        <Card.Body>
          <div className="view-user-content row">
            <div className="col-lg-9">
              <div className="mobile-view ms-3 row">
                <div className="col-lg-5">
                  <img
                    src={doctor_data.image ? `${IMAGE_PATH}${doctor_data.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                    alt="Logo"
                    // style={{ width: '120px',
                    //      height: '120px',
                    //       borderRadius: '50%',
                    //        objectFit: 'cover',
                    //         marginBottom: '50px'
                    //      }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #1ddec4',
                      textAlign: 'center'
                    }}
                  ></img>
                </div>
                {/* <h5>User Detail</h5> */}
                <div className="user-detail row mt-3">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Doctor Name :</p>
                      </div>
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', fontSize: '13px', marginBottom: 8 }}>
                          {doctor_data.doctor_name || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Email :</p>
                      </div>
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', fontSize: '13px', marginBottom: 8 }}>
                          {doctor_data.email || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Mobile No. : </p>
                      </div>
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', fontSize: '13px', marginBottom: 8 }}>
                          {doctor_data.mobile || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}> Specialization : </p>
                      </div>
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', fontSize: '13px', marginBottom: 8 }}>
                          {doctor_data.category_name || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address mb-1">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Approve Status :</p>
                      </div>
                      <div className="col-lg-3">
                        <p
                          style={{
                            // height: '40px',
                            // width: '90px',
                            // color: 'white',
                            padding: '5px 12px',
                            width: 'fit-content',
                            borderRadius: '10px',
                            // backgroundColor: doctor_data.approve_status === 0 ? 'orange' : 'green',
                            backgroundColor: doctor_data.approve_status == 1 ? '#dcfce7' : '#ffedd5',
                            color: doctor_data.approve_status == 1 ? '#16a34a' : '#ea580c',
                            fontSize: '11px',
                            marginBottom: 8,
                            display: 'inline',
                            fontWeight: 600
                          }}
                        >
                          {doctor_data.approve_status_lable || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Active Status :</p>
                      </div>
                      <div className="col-lg-3">
                        <p
                          style={{
                            // height: '40px',
                            // width: '90px',
                            // color: 'white',
                            borderRadius: '12px',
                            padding: '5px 12px',
                            width: 'fit-content',
                            textAlign: 'center', // ✅ center horizontally
                            // lineHeight: '22px',
                            backgroundColor: doctor_data.active_flag == 0 ? '#fee2e2' : '#e6f9f6',
                            color: doctor_data.active_flag == 0 ? '#dc2626' : '#1ddec4',
                            fontSize: '11px',
                            marginBottom: 8,
                            display: 'inline',
                            fontWeight: 600
                          }}
                        >
                          {doctor_data.activestatus_label || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: 8 }}>Create Date & Time :</p>
                      </div>
                      <div className="col-lg-3">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', fontSize: '13px', marginBottom: 8 }}>
                          {doctor_data.createtime || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </div>
    </>
  );
}

export default ViewDoctor;

// ========================================

// import React from 'react';
// import { Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// // import Typography from '@mui/material/Typography';
// import { useNavigate, useParams } from 'react-router';
// import { decode as base64_decode } from 'base-64';
// // import React, { useState } from 'react';
// import axios from 'axios';
// import { API_URL, IMAGE_PATH } from 'config/constant';
// // import CustomTable from 'component/common/CustomTable';

// function ViewDoctor() {
//   const [doctor_data, setDoctorData] = React.useState({});
// //   const [doctor_report_data, setDoctorReportData] = React.useState([]);
// //   const [currentPage, setCurrentPage] = React.useState(1);
// //   const [searchQuery, setSearchQuery] = React.useState('');
// //   const [sortConfig, setSortConfig] = useState(null);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);

// //   const doctorsPerPage = 50;

// //   const handleSearchChange = (event) => {
// //     setSearchQuery(event.target.value);
// //   };

// //   const handleSort = (key) => {
// //     setSortConfig((prev) => {
// //       if (!prev) return { key, direction: 'asc' };
// //       return {
// //         key,
// //         direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
// //       };
// //     });
// //   };

//   const { doctor_id } = useParams();
//   const decodedDoctorId = base64_decode(doctor_id);
//   var navigate = useNavigate();
//   var token = sessionStorage.getItem('token');

//   React.useEffect(() => {
//     axios
//       .get(`${API_URL}get_doctor_detail?doctor_id=${decodedDoctorId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((response) => {
//         if (response.data.key == 'authenticateFailed') {
//           sessionStorage.clear();
//           navigate(APP_PREFIX_PATH + '/login');
//         }
//         if (response.data.success) {
//           setDoctorData(response.data.data);
//         } else {
//           console.error('Error fetching doctor details:', response.data.msg);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching doctor details:', error);
//       });
//   }, [decodedDoctorId]);

//   React.useEffect(() => {
//     axios
//       .get(`${API_URL}get_doctor_user_shared_report?doctor_id=${decodedDoctorId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((response) => {
//         if (response.data.key == 'authenticateFailed') {
//           sessionStorage.clear();
//           navigate(APP_PREFIX_PATH + '/login');
//         }
//         if (response.data.success) {
//           setDoctorReportData(response.data.report_data);
//         } else {
//           console.error('Error fetching doctor details:', response.data.msg);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching doctor details:', error);
//       });
//   }, [decodedDoctorId]);

//   // --- Filter logic (unchanged) ---
// //   const filteredUsers = doctor_report_data.filter(
// //     (user) =>
// //       (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
// //       (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
// //       (user.category_name && user.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
// //       (user.mobile && user.mobile.toString().includes(searchQuery)) ||
// //       (user.formatted_date && user.formatted_date.includes(searchQuery))
// //   );

// //   const indexOfLastDoctor = currentPage * doctorsPerPage;
// //   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
// //   const currentDoctors = filteredUsers.slice(indexOfFirstDoctor, indexOfLastDoctor);
// //   const totalPages = Math.ceil(filteredUsers.length / doctorsPerPage);

//   // --- Shared Report columns for CustomTable ---
// //   const reportColumns = [
// //     {
// //       label: 'S. No',
// //       key: 'sr_no',
// //       render: (_, i) => indexOfFirstDoctor + i + 1
// //     },
// //     {
// //       label: 'Report',
// //       key: 'file',
// //       render: (row) => (
// //         <a href={`${IMAGE_PATH}${row.file}`} target="_blank" rel="noopener noreferrer"
// //           style={{ color: '#1ddec4', fontWeight: 500 }}>
// //           View Report
// //         </a>
// //       )
// //     },
// //     { label: 'User Name', sortable: true, key: 'name' },
// //     { label: 'Email', sortable: true, key: 'email' },
// //     { label: 'Mobile', sortable: true, key: 'mobile' },
// //     { label: 'Category', sortable: true, key: 'category_name' },
// //     { label: 'Create Date & Time', sortable: true, key: 'formatted_date' }
// //   ];

//   return (
//     <>
//       {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
//         <span style={{ color: '#1ddec4' }}>Dashboard</span> / Doctor / Doctor Details
//       </Typography> */}

//       {/* ── Profile Card (ViewUser style) ── */}
//       <Card className="border-0 shadow-lg rounded-4 mb-4">
//         <Card.Body className="p-4">
//           <div className="d-flex align-items-center flex-wrap gap-4">

//             <div style={{ flexShrink: 0 }}>
//               <img
//                 src={
//                   doctor_data.image
//                     ? `${IMAGE_PATH}${doctor_data.image}?${new Date().getTime()}`
//                     : `${IMAGE_PATH}placeholder.jpg`
//                 }
//                 alt="Doctor"
//                 style={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: '50%',
//                   objectFit: 'cover',
//                   border: '3px solid #1ddec4'
//                 }}
//               />
//             </div>

//             <div className="flex-grow-1">
//               <h5 className="fw-bold mb-1">{doctor_data.doctor_name || '-'}</h5>

//               <div className="d-flex gap-3 flex-wrap">
//                 {doctor_data?.email && (
//                   <small className="text-muted">
//                     Email ID:{' '}
//                     <a href={`mailto:${doctor_data.email}`} style={{ color: '#1ddec4', textDecoration: 'underline' }}>
//                       {doctor_data.email}
//                     </a>
//                   </small>
//                 )}
//                 <small className="text-muted">
//                   Mobile: {doctor_data?.mobile || '-'}
//                 </small>
//               </div>

//               <div className="d-flex gap-4 mt-3 flex-wrap">
//                 {[
//                   { label: 'Specialization', value: doctor_data?.category_name || '-' },
//                   { label: 'Approve Status', value: doctor_data?.approve_status_lable || '-', isStatus: true, approved: doctor_data?.approve_status !== 0 },
//                 //   { label: 'Active Status', value: doctor_data?.activestatus_label || '-', isStatus: true, approved: doctor_data?.active_flag != 0 },
//                   { label: 'Created', value: doctor_data?.createtime || '-' }
//                 ].map((item, i) => (
//                   <div key={i}>
//                     <small className="text-muted d-block">{item.label}</small>
//                     {item.isStatus ? (
//                       <span
//                         style={{
//                           display: 'inline-block',
//                           marginTop: '2px',
//                           padding: '2px 10px',
//                           borderRadius: '20px',
//                           fontSize: '12px',
//                           fontWeight: 600,
//                           background: item.approved ? '#dcfce7' : '#fee2e2',
//                           color: item.approved ? '#16a34a' : '#dc2626'
//                         }}
//                       >
//                         {item.value}
//                       </span>
//                     ) : (
//                       <div className="fw-semibold" style={{ fontSize: '13px' }}>{item.value}</div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ flexShrink: 0 }}>
//               <span
//                 style={{
//                   padding: '6px 14px',
//                   borderRadius: '20px',
//                   background: doctor_data.active_flag == 0 ? '#fee2e2' : '#e6f9f6',
//                   color: doctor_data.active_flag == 0 ? '#dc2626' : '#1ddec4',
//                   fontWeight: 600,
//                   fontSize: '13px'
//                 }}
//               >
//                 {doctor_data.active_flag == 0 ? 'Inactive' : 'Active'}
//               </span>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* <Card className="border-0 shadow-lg rounded-4">
//         <Card.Body className="p-0">
//           <div className="p-3">

//             <div className="d-flex gap-2 flex-wrap mb-3">
//               <button
//                 style={{
//                   borderRadius: '999px',
//                   padding: '6px 18px',
//                   fontSize: '13px',
//                   background: '#1ddec4',
//                   color: '#fff',
//                   cursor: 'pointer',
//                   border: 0,
//                   fontWeight: 600
//                 }}
//               >
//                 Shared Reports
//               </button>
//             </div>

//             <div className="mb-3 d-flex justify-content-end w-100">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 onChange={handleSearchChange}
//                 className="custom-search form-control"
//                 style={{ width: '250px', fontSize: '13px' }}
//               />
//             </div>

//             <CustomTable
//               columns={reportColumns}
//               data={filteredUsers}
//               sortConfig={sortConfig}
//               onSort={handleSort}
//               currentPage={currentPage}
//               rowsPerPage={rowsPerPage}
//               onPageChange={(page) => setCurrentPage(page)}
//               onRowsPerPageChange={(size) => {
//                 setRowsPerPage(size);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>
//         </Card.Body>
//       </Card> */}
//     </>
//   );
// }

// export default ViewDoctor;
