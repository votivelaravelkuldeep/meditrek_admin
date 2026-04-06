import React, { useState, useEffect } from 'react';
// import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import { Button } from 'react-bootstrap';
import './managecontent.css';

// import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

import CustomTable from 'component/common/CustomTable';

import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';

import axios from 'axios';
import Swal from 'sweetalert2';

function ManageUser() {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);

  // ================= ACTION HANDLERS =================

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) {
        return { key, direction: 'asc' };
      }
      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  const handleActionChange = async (index, action, user) => {
    if (action === 'Activate/Deactivate') {
      Swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to ${user.active_flag === 1 ? 'deactivate' : 'activate'} this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(`${API_URL}active_deactive_user`, { user_id: user.user_id });

            if (response.data.success) {
              setTriggerFetch(!triggerFetch);
              Swal.fire({
                text: `Account ${response.data.newStatusMsg} successfully`,
                icon: 'success',
                timer: 2000
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  const handleDeleteUser = async (user_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_URL}delete_user`, {
            user_id
          });

          if (response.data.success) {
            Swal.fire({
              text: 'User deleted successfully',
              icon: 'success',
              timer: 2000
            });

            setTriggerFetch(!triggerFetch);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  // ================= FETCH USERS =================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}get_all_users`);

        if (res.data.success && res.data.users !== 'NA') {
          setUserList(res.data.users);
        } else {
          setUserList([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [triggerFetch]);

  // ================= SEARCH =================

  const filteredUsers = userList.filter((user) => {
    return (
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchQuery)) ||
      (searchQuery.toLowerCase().includes('active') && user.active_flag === 1) ||
      (searchQuery.toLowerCase().includes('deactive') && user.active_flag === 0) ||
      (user.createtime && user.createtime.includes(searchQuery))
    );
  });

  // ================= COLUMNS =================

  const userColumns = [
    {
      label: 'S. No',
      key: 'sr_no',
      sortable: true,
      render: (_, index) => index + 1
    },
   
    {
      label: 'Image',
      key: 'image',
      sortable: true,
      render: (user) => (
        <img
          src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
          alt=""
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid rgb(29, 222, 196)'
          }}
        />
      )
    },
    { label: 'User Id', sortable: true, key: 'user_unique_id' },
    { label: 'Full Name', sortable: true, key: 'name' },
    { label: 'Mobile No.', sortable: true, key: 'mobile' },
    { label: 'Email', sortable: true, key: 'email' },
       {
      label: 'Action',
      sortable: true,
      key: 'action',
      render: (user, index) => (
        <div className="dropdown text-center">
          <Button
            className="btn btn-primary dropdown-toggle action-btn"
            type="button"
            data-bs-toggle="dropdown"
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              fontSize: '11px'
            }}
          >
            Action
          </Button>

          <ul className="dropdown-menu" style={{fontSize:'12px'}}>
            <li>
              <Link to={`${APP_PREFIX_PATH}/manage-user/userlist/view_user/${user.user_id}/${user.user_id}`} className="dropdown-item">
                <VisibilityIcon style={{marginRight:"2px"}} /> View
              </Link>
            </li>

            <li>
              <Link className="dropdown-item" onClick={() => handleActionChange(index, 'Activate/Deactivate', user)}>
                {user.active_flag == 1 ? <ToggleOffIcon style={{marginRight:"2px"}} /> : <ToggleOnIcon style={{marginRight:"2px"}} />}
                Activate/Deactivate
              </Link>
            </li>

            <li>
              <Link className="dropdown-item" onClick={() => handleDeleteUser(user.user_id)} style={{ color: 'red' }}>
                🗑 Delete
              </Link>
            </li>
          </ul>
        </div>
      )
    },
    {
      label: 'Status',
      key: 'active_flag',
      sortable: true,
      render: (user) => (
        <p
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: user.active_flag === 1 ? '#dcfce7' : '#fee2e2',
            color: user.active_flag === 1 ? '#16a34a' : '#dc2626',
            fontWeight: 600,
            marginBottom: 0,
            display: 'inline'
          }}
        >
          {user.active_flag == 1 ? 'Active' : 'Deactive'}
        </p>
      )
    },
  
    { label: 'Create Date & Time', sortable: true, key: 'createtime' }
  ];

  // ================= UI =================

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4">
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Users List
      </Typography> */}

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.05)', padding: '16px' }}>
        <div className="d-flex justify-content-end w-100">
          <input
            className="custom-search form-control"
            style={{ width: '250px', fontSize: '13px' }}
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden', // ⭐ IMPORTANT
            marginTop:'16px'
          }}
        >
          <CustomTable
            columns={userColumns}
            data={filteredUsers}
            currentPage={currentPage}
            sortConfig={sortConfig}
            onSort={handleSort}
            rowsPerPage={rowsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onRowsPerPageChange={(size) => {
              setRowsPerPage(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* </Card.Body>
      </Card> */}
    </>
  );
}

export default ManageUser;
