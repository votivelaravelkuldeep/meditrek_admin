import React, { useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Typography from '@mui/material/Typography';
import {
  API_URL,
  APP_PREFIX_PATH,
  //  APP_PREFIX_PATH,
  IMAGE_PATH
} from 'config/constant';
import axios from 'axios';
// import User4 from 'assets/images/users/avatar-4.avif';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import toast from 'react-hot-toast';

function ManageUser() {
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const usersPerPage = 50;
  const [triggerFetch, setTriggerFetch] = useState(false);

  const handleActionChange = async (index, action, user) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'View') {
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Activate/Deactivate') {
      Swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to ${user.active_flag === 1 ? 'deactivate' : 'activate'} this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(`${API_URL}active_deactive_user`, {
              user_id: user.user_id
            });

            if (response.data.success) {
              setTriggerFetch(!triggerFetch);
              Swal.fire({
                title: '',
                text: `Account ${response.data.newStatusMsg} successfully`,
                icon: 'success',
                timer: 2000
              });
            } else {
              console.log('Action unsuccessful', response.data);
            }
          } catch (error) {
            console.error('Error updating user status', error);
          }
        } else {
          setSelectedActions({ ...selectedActions, [index]: null });
        }
      });
    }
  };
  const handleDeleteUser = async (user_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const response = await axios.post(`${API_URL}delete_user`, {
            user_id: user_id
          });

          if (response.data.success) {

            Swal.fire({
              title: "Deleted!",
              text: "User deleted successfully",
              icon: "success",
              timer: 2000
            });

            setTriggerFetch(!triggerFetch); // table refresh

          } else {
            Swal.fire("Error", response.data.msg, "error");
          }

        } catch (error) {
          console.error("Delete error", error);
        }
      }
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}get_all_users`);
        console.log(response.data);

        if (response.data.success) {
          if (response?.data?.activeUser == 'NA') {
            return;
          } else {
            setUserList(response?.data?.users);
          }
        } else {
          console.log('Fetch unsuccessful', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchData();
  }, [triggerFetch]);

  const filteredUsers = userList?.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchQuery)) ||
      (searchQuery.toLowerCase().includes('active') && user.active_flag === 1) ||
      (searchQuery.toLowerCase().includes('deactive') && user.active_flag === 0) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Users List
      </Typography>
      <Card>
        <Card.Header className="bg-white ">
          <div className="">
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
        </Card.Header>
        <Card.Body>
          <div className="table-container">
            <Table hover className="fixed-header-table">
              <thead>
                <tr>
                  <th> S. No</th>
                  <th>Action</th>
                  <th>Image</th>
                  <th>User Id</th>
                  <th>Full Name</th>
                  <th>Mobile No.</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Create Date & Time</th>
                </tr>
              </thead>
                <tbody>
                  {currentUsers?.map((user, index) => (
                    <tr key={index}>
                      <th scope="row" style={{ textAlign: 'center' }}>
                        {indexOfFirstUser + index + 1}
                      </th>
                      <td>
                        <div className="dropdown text-center">
                          <button
                            className="btn btn-primary dropdown-toggle action-btn"
                            type="button"
                            id={`dropdownMenuButton${user.user_id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${user.user_id}`}>
                            <li key="view">
                              <Link
                                to={APP_PREFIX_PATH + `/manage-user/userlist/view_user/${user.user_id}/${user.user_id}`}
                                className="dropdown-item"
                              >
                                <VisibilityIcon style={{ marginRight: '8px' }} /> View
                              </Link>
                            </li>
                            <li key="active">
                              <Link className="dropdown-item" onClick={() => handleActionChange(index, 'Activate/Deactivate', user)}>
                                {user.active_flag == 1 ? (
                                  <ToggleOffIcon style={{ marginRight: '8px' }} />
                                ) : (
                                  <ToggleOnIcon style={{ marginRight: '8px' }} />
                                )}
                                Activate/Deactivate
                              </Link>
                            </li>
                            <li key="delete">
                              <Link
                                className="dropdown-item"
                                onClick={() => handleDeleteUser(user.user_id)}
                                style={{ color: "red" }}
                              >
                                🗑 Delete
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <img
                          src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                          alt="Logo"
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        ></img>
                      </td>
                      <td style={{ textAlign: 'center' }}>#{user.user_unique_id || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{user.name || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{user.mobile || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{user.email || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        {user?.active_flag == 1 ? (
                          <p
                            style={{
                              borderRadius: '25px',
                              background: '#28c76f',
                              padding: '0px 15px',
                              width: '80px',
                              color: '#fff',
                              margin: 'auto'
                            }}
                          >
                            Active
                          </p>
                        ) : (
                          <p
                            style={{
                              borderRadius: '25px',
                              background: 'red',
                              padding: '0px 15px',
                              width: '100px',
                              color: '#fff',
                              margin: 'auto'
                            }}
                          >
                            Deactive
                          </p>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>{user.createtime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className="pagination">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers?.length)} of {filteredUsers?.length} entries
            </p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default ManageUser;
