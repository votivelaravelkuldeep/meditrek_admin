import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { Base_Url } from '../../config';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';

function ManageUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [contact, setContact] = useState([]);
  const usersPerPage = 50;
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState(null);

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Contact Us
      </Typography>
      <Card>
        <Card.Header className="bg-white">
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
        </Card.Header>
        <Card.Body>
          <div className="table-container">
            <Table hover className="fixed-header-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '100px' }}> S. No</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>User Type</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '180px' }}> Message</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '180px' }}>Reply Date & Time</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '180px' }}> Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <th scope="row" style={{ textAlign: 'center' }}>
                      {indexOfFirstUser + index + 1}
                    </th>
                    <td>
                      <div className="text-center">
                        <Link to={APP_PREFIX_PATH + `/send-reply?contact_id=${user.contact_id}`} className="btn btn-primary action-btn">
                          Reply
                        </Link>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{user.user_type_label}</td>
                    <td style={{ textAlign: 'center' }}>{user.name}</td>
                    <td style={{ textAlign: 'center' }}>{user.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleFullMessage(user.message)}
                        style={{ background: 'none', border: 'none', padding: '0', color: 'blue', cursor: 'pointer' }}
                      >
                        {user.message.length > 25 ? `${user.message.substring(0, 22)}...` : user.message}
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>{user.reply_datetime === 'Invalid date' ? '-' : user.reply_datetime}</td>

                    <td style={{ textAlign: 'center' }}>
                      {user.status === 0 ? (
                        <p
                          style={{
                            borderRadius: '25px',
                            background: '#ffbc34',
                            padding: '2px 15px',
                            width: '90px',
                            color: '#fff',
                            margin: 'auto',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                        >
                          Pending
                        </p>
                      ) : (
                        <p
                          style={{
                            borderRadius: '25px',
                            background: 'green',
                            padding: '2px 15px',
                            width: '90px',
                            color: '#fff',
                            margin: 'auto',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                        >
                          Replied
                        </p>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>{user.createtime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }}>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
            </p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>

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
