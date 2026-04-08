import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
// import CustomerList from 'views/AllPage/CustomerList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// import Image from 'assets/images/img.jfif';
// import {encode as base64_encode} from 'base-64'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { encode as base64_encode } from 'base-64';



function DoctorReport() {

  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUserData] = useState([])
  const [from_date, setFromDate] = useState('')
  const [to_date, setToDate] = useState('')
  const [from_date_error, setFromDateError] = React.useState('');
  const [to_date_error, setToDateError] = React.useState('');
  const [userPageCount, setUserPageCount] = useState('')
  const [searchQuery, setSearchQuery] = React.useState('');

  //page entries logic
  let entriesCount = 5;
  console.log(entriesCount);

  if (userPageCount < 5) {
    entriesCount = userPageCount
  }

  const usersPerPage = 50; // Show 5 rows per page

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
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

    axios.get(`${API_URL}get_tabular_doctor?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.doctor_arr)) {
          setUserData(response.data.doctor_arr);
          setUserPageCount(response.data.doctor_arr.length)
          console.log("users", users);

        } else {
          setUserData([])
        }
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
        setUserData([])
      })
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


  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={'/'} style={{ textDecoration: 'none' }}><span style={{ color: '#f68519' }}>Dashboard</span></Link> / Doctor Report
      </Typography>
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <Card.Title as="h5" className="mt-2">
            Doctor Report{' '}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="container">
              <div className="mt-3">
                <Form.Group className="mb-3" as={Row}>
                  <Col sm={5}>
                    <div className="mb-2">From Date</div>
                    <Form.Control type="date" placeholder="Enter Subject" onChange={(e) => {
                      setFromDate(e.target.value);
                      setFromDateError('');
                      setToDateError('');
                    }} />
                    <p style={{ color: 'red' }}>{from_date_error}</p>
                  </Col>
                  <Col sm={5}>
                    <div className="mb-2">To Date</div>
                    <Form.Control type="date" placeholder="Enter Subject"
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        if (!from_date) {
                          setToDateError('Please Select From Date first');
                        } else {
                          setToDate(e.target.value);
                          setFromDateError('')
                          setToDateError('');
                        }
                      }} />
                    <p style={{ color: 'red' }}>{to_date_error}</p>
                  </Col>
                  <Col sm={2}>
                    <Button type="submit" className="submit-btn" style={{ marginTop: '29px' }}>
                      View
                    </Button>
                  </Col>
                </Form.Group>


              </div>
            </div>
          </Form>

        </Card.Body>

      </Card>
      {/* <CustomerList/> */}
      <div>
        {users.length > 0 && (
          <div>
            <Button variant="success" onClick={exportToExcel} className="mb-3 btn-sm pull-right" style={{ backgroundColor: '#f68519', border: 'none' }}>
              Export to Excel
            </Button>
          </div>
        )}
      </div>
      <Card>

        <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
          <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h5" gutterBottom>
            <span style={{ color: '#000' }}>Doctor List</span>
          </Typography>
          <div className=''>
            <label htmlFor="search-input" style={{ marginRight: '5px' }}>
              Search
            </label>
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
              style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
            />
          </div>


        </Card.Header>
        <Card.Body>
          <div className="table-container">
            <Table hover className="fixed-header-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>image</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Specialization</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row" style={{ textAlign: 'center' }}>
                        {indexOfFirstUser + index + 1}
                      </th>
                      <td>
                        <div className="dropdown text-center">
                          <button
                            className="btn btn-primary dropdown-toggle action-btn"
                            type="button"
                            id={`dropdownMenuButton${user.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${user.id}`}>
                            <li>
                              <Link to={`${APP_PREFIX_PATH}/view-doctor/${base64_encode(user.doctor_id).toString()}`} className="dropdown-item">
                                <VisibilityIcon style={{ marginRight: '8px' }} /> View
                              </Link>
                            </li>

                          </ul>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <img src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                          alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                      </td>
                      <td style={{ textAlign: 'center' }}>{user.doctor_name}</td>
                      <td style={{ textAlign: 'center' }}>{user.category_name}</td>
                      <td style={{ textAlign: 'center' }}>{user.mobile}</td>
                      <td style={{ textAlign: 'center' }}>{user.email}</td>
                      <td style={{ textAlign: 'center' }}>{user.approve_status_lable}</td>
                      <td style={{ textAlign: 'center' }}>{user.createtime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                    </td>
                  </tr>
                )
                }

              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            {/* <p style={{ fontWeight: '500' }} className='pagination'>Showing 1 to {entriesCount} of {userPageCount} entries</p> */}
            <p style={{ fontWeight: '500' }} className='pagination'>
              {filteredUsers.length > 0
                ? `Showing ${indexOfFirstUser + 1} to ${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length} entries`
                : "Showing 0 to 0 of 0 entries"}
            </p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>
    </>
    // </>
  );
}

export default DoctorReport;
