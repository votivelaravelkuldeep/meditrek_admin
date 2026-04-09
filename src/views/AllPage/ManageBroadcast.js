import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
// import Typography from '@mui/material/Typography';
import './managecontent.css';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import Select from 'react-select';
import { useNavigate } from 'react-router';
// import Loader from 'views/AllPage/loaderComponent';
import { FadeLoader } from 'react-spinners';
import './managecontent.css';

function Managebroadcast() {
  const [content, setContent] = useState(0);
  const [activeButton, setActiveButton] = useState('all');
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = React.useState(true);

  var navigate = useNavigate();
  var token = sessionStorage.getItem('token');
  const contentTypes = {
    all: 0,
    specific: 1
  };

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
  };

  const validateFields = () => {
    const newErrors = {};

    if (content === contentTypes.specific && selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Select users';
    }

    if (!title.trim()) {
      newErrors.title = 'Enter title';
    }

    if (!message.trim()) {
      newErrors.message = 'Enter message';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    axios
      .get(`${API_URL}Users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          const userOptions = response.data.res.map((user) => ({
            value: user.user_id,
            label: user.name
          }));
          setUsers(userOptions);
          setLoading(false);
        } else {
          console.log('error finding users');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error);
      });
  }, [activeButton]);

  const SendBroadcastAllUser = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const data = {
      title_user: title,
      message_user: message,
      userType: content == contentTypes.all ? 'all' : 'user',
      select_arr: content == contentTypes.specific ? selectedUsers.map((user) => user.value) : []
    };
    setLoading(true);
    axios
      .post(`${API_URL}send_broadcast_all_user`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setModalShow(true);
          setTimeout(() => {
            setModalShow(false);
          }, 2000);
          setLoading(false);
          setModalMessage('Broadcast Message Sent successfully');
          setModalTitle('Success');
          setSelectedUsers([]);
          setMessage('');
          setTitle('');
          setErrors({});
        } else {
          setModalShow(true);
          setLoading(false);
          setModalMessage('Error sending Broadcast Message');
          setModalTitle('Error');
          setErrors({});
        }
      })
      .catch(() => {
        setModalShow(true);
        setLoading(false);
        setModalMessage('Error sending Broadcast Message');
        setModalTitle('Error');
        setErrors({});
      });
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <>
      {loading ? (
        <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
          <FadeLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
            <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Broadcast
          </Typography> */}
          <div>
            <div>
              <Form>
                <div className="d-flex gap-2 mb-4 flex-wrap">
                  <button
                    className={`btn ${activeButton === 'all' ? 'btn-content-active' : ''}`}
                    style={{
                      borderRadius: '999px',
                      padding: '8px 24px',
                      fontSize: '13px',
                      background: activeButton === 'all' ? '#1ddec4' : '#eef2f7',
                      color: activeButton === 'all' ? '#fff' : '#64748b',
                      cursor: 'pointer',
                      border: 0,
                      fontWeight: 500
                    }}
                    type="button"
                    onClick={() => {
                      handleButtonClick('all');
                      setTitle('');
                      setMessage('');
                      setErrors({ title: '' });
                      setErrors({ message: '' });
                      setErrors({ selectedUsers: '' });
                    }}
                  >
                    All User
                  </button>
                  <button
                    className={`btn ${activeButton === 'specific' ? 'btn-content-active' : ''}`}
                    style={{
                      borderRadius: '999px',
                      padding: '8px 24px',
                      fontSize: '13px',
                      background: activeButton === 'specific' ? '#1ddec4' : '#eef2f7',
                      color: activeButton === 'specific' ? '#fff' : '#64748b',
                      cursor: 'pointer',
                      border: 0,
                      fontWeight: 500
                    }}
                    type="button"
                    onClick={() => {
                      handleButtonClick('specific');
                      setTitle('');
                      setMessage('');
                      setErrors({ title: '' });
                      setErrors({ message: '' });
                      setErrors({ selectedUsers: '' });
                    }}
                  >
                    Select User
                  </button>
                </div>

                {content === 0 && (
                  <div
                    className="mt-3"
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                      padding: '24px'
                    }}
                  >
                    <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                      {/* <div>Title</div> */}
                      <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Title</Form.Label>
                      <Col sm={12}>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors((prevErrors) => ({ ...prevErrors, title: '' }));
                          }}
                          isInvalid={!!errors.title}
                          className="custom-input custom-search"
                          style={{ fontSize: '13px' }}
                        />
                        {errors.title && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.title}</div>}
                      </Col>
                      {/* {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>} */}
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                      <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Message</Form.Label>
                      <Col sm={12}>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter your message"
                          rows={3}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            setErrors((prevErrors) => ({ ...prevErrors, message: '' }));
                          }}
                          isInvalid={!!errors.message}
                          className="custom-input custom-search"
                          style={{ fontSize: '13px' }}
                        />
                        {errors.message && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.message}</div>}
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row}>
                      <Col sm={{ span: 10 }}>
                        <Button
                          variant="primary"
                          type="submit"
                          onClick={SendBroadcastAllUser}
                          className="mt-1"
                          style={{ fontSize: '12px' }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
                )}

                {content === 1 && (
                  <div
                    className="mt-3"
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                      padding: '24px'
                    }}
                  >
                    <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                      <Col sm={6}>
                        <Form.Label style={{ fontSize: '13px', fontWeight: 500,marginBottom:'4px' }}>
                          Select User
                        </Form.Label>
                        <Select
                          isMulti
                          options={users}
                          value={selectedUsers}
                          onChange={(selectedOptions) => {
                            setSelectedUsers(selectedOptions || []);
                            setErrors({ ...errors, selectedUsers: '' });
                          }}
                          placeholder="Select users"
                          isInvalid={!!errors.selectedUsers}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: '10px',
                              border: state.isFocused ? '1.5px solid #1ddec4' : '1px solid #e5e7eb',
                              boxShadow: 'none',
                            //   minHeight: '40px',
                              fontSize: '13px'
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: '#e6f9f6',
                              borderRadius: '6px'
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: '#1ddec4',
                              fontSize: '12px'
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: '#1ddec4',
                              ':hover': {
                                backgroundColor: '#1ddec4',
                                color: '#fff'
                              }
                            })
                          }}
                        />
                        {errors.selectedUsers && <div style={{ color: 'red', marginTop: '0.25rem', fontSize: '12px', }}>{errors.selectedUsers}</div>}
                      </Col>

                      <Col sm={6}>
                        {/* <div>Title</div> */}
                        <Form.Label style={{ fontSize: '13px', fontWeight: 500,marginBottom:'4px' }}>
                         Title
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors({ ...errors, title: '' });
                          }}
                          isInvalid={!!errors.title}
                          className="custom-input custom-search"
                          style={{ fontSize: '13px',padding:'8px 10px' }}
                        />
                        {errors.title && <div style={{ color: 'red', marginTop: '0.25rem', fontSize: '12px', }}>{errors.title}</div>}
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                      {/* <div>Message</div> */}
                      <Form.Label style={{ fontSize: '13px', fontWeight: 500,marginBottom:'4px' }}>
                         Message
                        </Form.Label>
                      <Col sm={12}>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter your message"
                          rows={3}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            setErrors({ ...errors, message: '' });
                          }}
                          isInvalid={!!errors.message}
                          className="custom-input custom-search"
                          style={{ fontSize: '13px' }}
                        />
                        {errors.message && <div style={{ color: 'red', marginTop: '0.25rem', fontSize: '12px', }}>{errors.message}</div>}
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row}>
                      <Col sm={{ span: 10 }}>
                        <Button variant='primary' type="submit" onClick={SendBroadcastAllUser} className="mt-2" style={{ fontSize: '12px' }}>
                          Submit
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
                )}
              </Form>
            </div>

            <Modal show={modalShow} centered onHide={() => setModalShow(false)}>
              <Modal.Header style={{borderBottom:'0',margin:0,padding:'12px 15px 0'}}>
                <Modal.Title style={{ fontSize: '17px' }}>{modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{fontSize:'13px',borderTop:'0'}}>{modalMessage}</Modal.Body>
              {/* <Modal.Footer style={{borderTop:'0'}}> */}
                {/* <Button onClick={() => setModalShow(false)}>Close</Button> */}
                {/* </Modal.Footer> */}
            </Modal>
          </div>
        </>
      )}
    </>
  );
}

export default Managebroadcast;
