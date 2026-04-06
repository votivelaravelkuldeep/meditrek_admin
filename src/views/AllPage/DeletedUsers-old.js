import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Image from 'assets/images/img.jfif';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';

// import { encode as base64_encode } from 'base-64'

function DeleteUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setDeleteUsers] = useState([])
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userPageCount, setUserPageCount] = useState('')

  const usersPerPage = 50; // Show 5 rows per page

  //page entries logic
  let entriesCount = 5;
  if (userPageCount < 5) {
    entriesCount = userPageCount
  }


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const usernameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const statusMatch = lowercasedTerm == 'active' ? user.active_flag === 1 : lowercasedTerm == 'deactive' ? user.active_flag === 0 : false;

    return usernameMatch || mobileMatch || dateMatch || statusMatch || emailMatch;
  });

  // const deleteUser = (user_id) => {
  //   console.log(`Delete user with ID: ${user_id}`);
  //
  // };

  // const handleActionChange = (index, action, user_id) => {
  //   setSelectedActions({ ...selectedActions, [index]: action });
  //   if (action === 'Delete') {
  //     deleteUser(user_id);
  //     setSelectedActions({ ...selectedActions, [index]: null });
  //   } else if (action === 'View') {
  //     // Add your view logic here, e.g., navigate to the user's profile page
  //     setSelectedActions({ ...selectedActions, [index]: null });
  //   }
  // };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //-----------------------------------------------
  // format the date and time in the react admin application
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);  

  //   const options = {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
  //   };

  //   const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

  //   return formattedDate;
  // };

  useEffect(() => {
    axios.get(`${API_URL}get_all_deleted_users`)
      .then((response) => {
        setDeleteUsers(response.data.user_arr)
        console.log("user", response.data.user_arr)
        setUserPageCount(response.data.user_arr.length)
      })
      .catch((error) => {
        console.error('Error get_delete_user_list details:', error);
      })
  }, [])


  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };


  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={APP_PREFIX_PATH + '/'} style={{ textDecoration: 'none' }}> <span style={{ color: '#f68519' }}>Dashboard</span></Link> / <Link to={APP_PREFIX_PATH + '/manage-user/userlist'} style={{ textDecoration: 'none', color: 'black' }}>User List </Link> / Deleted User
      </Typography>
      <Card>
        <Card.Header className="d-flex justify-content-between bg-white">
          {/* <Card.Title className="mt-2 " as="h5">
            Deleted Users
          </Card.Title> */}
          <div>
            <label htmlFor="search-input" style={{ marginRight: '5px' }}>
              Search
            </label>
            <input
              className="search-input"
              type="text"
              onChange={handleSearch}
              placeholder="Search..."
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
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '200px' }}> Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> Mobile No.</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> Email</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '200px' }}> Delete Reason </th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '200px' }}>Deleted On</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
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

                            <Link to={APP_PREFIX_PATH + `/manage-user/userlist/view_user/${user.user_id}/${user.user_id}`} className="dropdown-item">
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
                    <td style={{ textAlign: 'center' }}>{user.name}</td>
                    <td style={{ textAlign: 'center' }}>{user.mobile}</td>
                    <td style={{ textAlign: 'center' }}>{user.email}</td>
                    <td style={{ textAlign: 'center' }}>{truncateText(user.delete_reason, 20)}</td>
                    <td style={{ textAlign: 'center' }}>{user.createtime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }}>Showing 1 to {entriesCount} of {userPageCount} entries</p>
            <Stack spacing={2} alignItems="right" className='pagination'>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default DeleteUser;
