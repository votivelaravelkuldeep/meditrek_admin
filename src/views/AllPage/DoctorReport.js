import { Row, Col, Form, Button } from 'react-bootstrap';
// import Typography from '@mui/material/Typography';
// import CustomerList from 'views/AllPage/CustomerList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// import Image from 'assets/images/img.jfif';
// import {encode as base64_encode} from 'base-64'
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { encode as base64_encode } from 'base-64';
import CustomTable from 'component/common/CustomTable';
import ImportExportIcon from '@mui/icons-material/ImportExport';

function DoctorReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUserData] = useState([]);
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  const [from_date_error, setFromDateError] = React.useState('');
  const [to_date_error, setToDateError] = React.useState('');
  const [userPageCount, setUserPageCount] = useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  //page entries logic
  let entriesCount = 5;
  console.log(entriesCount);

  if (userPageCount < 5) {
    entriesCount = userPageCount;
  }

//   const usersPerPage = 50; // Show 5 rows per page

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    // const usernameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const statusMatch = lowercasedTerm == 'active' ? user.active_flag === 1 : lowercasedTerm == 'deactive' ? user.active_flag === 0 : false;

    return mobileMatch || dateMatch || statusMatch || emailMatch;
  });

  // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!from_date) {
      setFromDateError('Please Enter From Date.');
      hasError = true;
    } else {
      setFromDateError('');
    }

    if (!to_date) {
      setToDateError('Please Enter To Date');
      hasError = true;
    } else if (to_date < from_date) {
      setToDateError('To Date Must Be Greter Than from date');
    } else {
      setToDateError('');
    }

    if (hasError) {
      return;
    }

    axios
      .get(`${API_URL}get_tabular_doctor?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.doctor_arr)) {
          setUserData(response.data.doctor_arr);
          setUserPageCount(response.data.doctor_arr.length);
          console.log('users', users);
        } else {
          setUserData([]);
        }
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
        setUserData([]);
      });
  };

  //-------------------- show user data logic here -----------------------

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      users.map((user, index) => ({
        'S. No.': index + 1,
        Name: user.doctor_name,
        'Profile Image': user.image ? `${IMAGE_PATH}${user.image}` : `${IMAGE_PATH}placeholder.png`,
        Email: user.email,
        'Create Date & Time': user.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DoctorReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'DoctorReport.xlsx');
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Image',
      key: 'image',
      render: (user) => (
        <img
          src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
          alt=""
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #1ddec4'
          }}
        />
      )
    },

    { label: 'Name', key: 'doctor_name', sortable: true },
    { label: 'Specialization', key: 'category_name', sortable: true },
    { label: 'Mobile', key: 'mobile', sortable: true },
    { label: 'Email', key: 'email', sortable: true },

    {
      label: 'Status',
      key: 'status',
      render: (user) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: user.approve_status === 1 ? '#dcfce7' : '#ffedd5',
            color: user.approve_status === 1 ? '#16a34a' : '#ea580c',
            fontWeight: 600
          }}
        >
          {user.approve_status_lable}
        </span>
      )
    },

    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (user) => <span style={{ whiteSpace: 'nowrap' }}>{user.createtime}</span>
    },

    {
      label: 'Action',
      key: 'action',
      render: (user) => (
        <div className="text-center">
          <Link
            to={`${APP_PREFIX_PATH}/view-doctor/${base64_encode(user.doctor_id).toString()}`}
            style={{
              background: 'rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 222, 196, 0.25)',
              display: 'inline-flex'
            }}
          >
            <VisibilityIcon style={{ fontSize: '16px' }} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={'/'} style={{ textDecoration: 'none' }}><span style={{ color: '#f68519' }}>Dashboard</span></Link> / Doctor Report
      </Typography> */}
      <div
        className="mb-4"
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          padding: '16px'
        }}
      >
        <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
          Doctor Report
        </h5>

        <div>
          <Form onSubmit={handleSubmit}>
            <div className="container">
              <div className="mt-3">
                <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center' }} as={Row}>
                  <Col sm={3}>
                    {/* <div className="mb-2">From Date</div> */}
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Subject"
                      onChange={(e) => {
                        setFromDate(e.target.value);
                        setFromDateError('');
                        setToDateError('');
                      }}
                      className="custom-input custom-search"
                      style={{ fontSize: '13px' }}
                    />
                    <p style={{ color: 'red', fontSize: '12px' }}>{from_date_error}</p>
                  </Col>
                  <Col sm={3}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Subject"
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        if (!from_date) {
                          setToDateError('Please Select From Date first');
                        } else {
                          setToDate(e.target.value);
                          setFromDateError('');
                          setToDateError('');
                        }
                      }}
                      className="custom-input custom-search"
                      style={{ fontSize: '13px' }}
                    />
                    <p style={{ color: 'red', fontSize: '12px' }}>{to_date_error}</p>
                  </Col>
                  <Col sm={2}>
                    <div style={{ marginTop: '14px' }}>
                      <Button type="submit" style={{ fontSize: '12px' }}>
                        View
                      </Button>
                     
                    </div>
                  </Col>
                </Form.Group>
              </div>
            </div>
          </Form>
        </div>
      </div>
      {/* <CustomerList/> */}

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          padding: '16px'
        }}
      >
        <div className="d-flex justify-content-between flex-wrap">
          <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
            Doctor List
          </h5>

          <div className="d-flex gap-2">
            <input
              className="custom-search form-control"
              style={{ width: '250px', fontSize: '13px' }}
              placeholder="Search..."
              onChange={handleSearch}
            />

            {users.length > 0 && (
              <Button
                onClick={exportToExcel}
                style={{
                  fontSize: '12px',
                  background: '#1ddec4',
                  border: 'none'
                }}
              >
                <ImportExportIcon style={{ fontSize: '16px' }} />
                  Export to Excel
              </Button>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: '16px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <CustomTable
            columns={columns}
            data={filteredUsers}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            sortConfig={sortConfig}
            onSort={handleSort}
            onPageChange={(page) => setCurrentPage(page)}
            onRowsPerPageChange={(size) => {
              setRowsPerPage(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </>
    // </>
  );
}

export default DoctorReport;
