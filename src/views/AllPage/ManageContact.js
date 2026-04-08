import React, { useEffect, useState } from 'react';
// import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { Base_Url } from '../../config';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import CustomTable from 'component/common/CustomTable';
import ReplyIcon from '@mui/icons-material/Reply';
import Heading from 'component/common/Heading';

function ManageUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [contact, setContact] = useState([]);
//   const usersPerPage = 50;
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState(null);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFullMessage = (messages) => {
    setMessages(messages);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessages(null);
  };

  const filteredUsers = contact.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.user_type_label && user.user_type_label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.replied_date_time && user.replied_date_time.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (searchQuery.toLowerCase().includes('pending') && user.status === 0) ||
      (searchQuery.toLowerCase().includes('replied') && user.status === 1) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );

//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  //   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

  const fetchData = async () => {
    try {
      // const token = sessionStorage.getItem('token');

      const response = await axios.get(`${API_URL}get_help_and_support`);

      if (response.data.success) {
        if (response?.data?.ContactUs == 'NA') {
          return;
        } else {
          setContact(response.data.data);
        }
      } else {
        console.log('Fetch unsuccessful', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },
  
    { label: 'User Type', key: 'user_type_label', sortable: true },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },

    {
      label: 'Message',
      key: 'message',
      render: (user) => (
        <button
          onClick={() => handleFullMessage(user.message)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1ddec4',
            cursor: 'pointer',
            fontSize: '12px',
            textAlign:'left'
          }}
        >
          {user.message?.length > 25 ? `${user.message.substring(0, 22)}...` : user.message}
        </button>
      )
    },

    {
      label: 'Reply Date',
      key: 'reply_datetime',
      render: (user) => (user.reply_datetime === 'Invalid date' ? '-' : user.reply_datetime)
    },

  

    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (user) => <span style={{ whiteSpace: 'nowrap' }}>{user.createtime}</span>
    },
      {
      label: 'Status',
      key: 'status',
      render: (user) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: user.status === 0 ? '#ea580c2e' : '#dcfce7',
            color: user.status === 0 ? '#ea580c' : '#16a34a',
            fontWeight: 600,
          }}
        >
          {user.status === 0 ? 'Pending' : 'Replied'}
        </span>
      )
    },
      {
      label: 'Action',
      key: 'action',
      render: (user) => (
        <div className="text-center">
          <Link
            to={APP_PREFIX_PATH + `/send-reply?contact_id=${user.contact_id}`}
             title="Reply" 
            style={{
              background: 'rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 222, 196, 0.25)',
            //   fontSize: '12px',
              textDecoration: 'none',
              display:'inline-flex'
            }}
          >
            {/* Reply */}
            <ReplyIcon style={{fontSize:'16px'}} />
          </Link>
        </div>
      )
    },
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Contact Us
      </Typography> */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          padding: '16px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <Heading heading='Manage Contact Us' />
          <input
            className="custom-search form-control"
            style={{ width: '250px', fontSize: '13px' }}
            placeholder="Search..."
            onChange={handleSearchChange}
          />
        </div>
        {/* Table */}
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

      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
        <Modal.Header closeButton>
          <Modal.Title>Full Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messages}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageUser;
