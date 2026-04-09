// import React, { useState } from 'react';
// import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
// import Typography from '@mui/material/Typography';
// import './managecontent.css';

// function Managebroadcast() {
//   const [content, setContent] = useState(0);
//   const [activeButton, setActiveButton] = useState('all');
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [errors, setErrors] = useState({});

//   const contentTypes = {
//     all: 0,
//     specific: 1
//   };

//   const handleButtonClick = (contentType) => {
//     setContent(contentTypes[contentType]);
//     setActiveButton(contentType);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let errors = {};
//     if (!title) errors.title = 'Title is required';
//     if (!message) errors.message = 'Message is required';
//     if (content === 1 && !selectedCustomer) errors.selectedCustomer = 'Please select a customer';

//     setErrors(errors);

//     if (Object.keys(errors).length === 0) {
//       setShowPopup(true);
//     }
//   };

//   return (
//     <>
//       <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
//         <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Broadcast
//       </Typography>
//       <Card>
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <nav className="">
//               <div className="container" id="container-div">
//                 <button
//                   className={`btn me-2 mb-2 btn-content ${activeButton === 'all' ? 'active' : ''}`}
//                   style={{ width: '11rem', fontSize: '16px' }}
//                   type="button"
//                   onClick={() => handleButtonClick('all')}
//                 >
//                   All Customer
//                 </button>
//                 <button
//                   className={`btn me-2 mb-2 btn-content ${activeButton === 'specific' ? 'active' : ''}`}
//                   style={{ width: '13rem', fontSize: '16px' }}
//                   type="button"
//                   onClick={() => handleButtonClick('specific')}
//                 >
//                   Select Customer
//                 </button>
//               </div>
//             </nav>

//             {content === 0 && (
//               <div className="container">
//                 <div className="mt-3">
//                   <Form.Group className="mb-3" as={Row}>
//                     <div>Title</div>
//                     <Col sm={12}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                       />
//                       {errors.title && <span className="error-text">{errors.title}</span>}
//                     </Col>
//                   </Form.Group>

//                   <Form.Group className="mb-3" as={Row}>
//                     <div>Message</div>
//                     <Col sm={12}>
//                       <Form.Control
//                         as="textarea"
//                         placeholder="Enter your message"
//                         rows={3}
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                       />
//                       {errors.message && <span className="error-text">{errors.message}</span>}
//                     </Col>
//                   </Form.Group>

//                   <Form.Group className="mb-3" as={Row}>
//                     <Col sm={{ span: 10 }}>
//                       <Button type="submit" className="mt-2 submit-btn">
//                         Submit
//                       </Button>
//                     </Col>
//                   </Form.Group>
//                 </div>
//               </div>
//             )}

//             {content === 1 && (
//               <div className="container">
//                 <div className="mt-3">
//                   <Form.Group className="mb-3" as={Row}>
//                     <Col sm={6}>
//                       <div>Select Customers</div>
//                       <Form.Control as="select" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
//                         <option value="">Select</option>
//                         <option>Lisa</option>
//                         <option>John</option>
//                         <option>Mark</option>
//                         <option>Arika</option>
//                         <option>Andrew</option>
//                       </Form.Control>
//                       {errors.selectedCustomer && <span className="error-text">{errors.selectedCustomer}</span>}
//                     </Col>

//                     <Col sm={6}>
//                       <div>Title</div>
//                       <Form.Control
//                         type="text"
//                         placeholder="Title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                       />
//                       {errors.title && <span className="error-text">{errors.title}</span>}
//                     </Col>
//                   </Form.Group>

//                   <Form.Group className="mb-3" as={Row}>
//                     <div>Message</div>
//                     <Col sm={12}>
//                       <Form.Control
//                         as="textarea"
//                         placeholder="Enter your message"
//                         rows={3}
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                       />
//                       {errors.message && <span className="error-text">{errors.message}</span>}
//                     </Col>
//                   </Form.Group>

//                   <Form.Group className="mb-3" as={Row}>
//                     <Col sm={{ span: 10 }}>
//                       <Button type="submit" className="mt-2 submit-btn">
//                         Submit
//                       </Button>
//                     </Col>
//                   </Form.Group>
//                 </div>
//               </div>
//             )}
//           </Form>
//         </Card.Body>
//       </Card>

//       <Modal show={showPopup} className='mt-5' onHide={() => setShowPopup(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Broadcast Sent</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Broadcast sent successfully!</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPopup(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default Managebroadcast;
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import './managecontent.css';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import Select from 'react-select';
import { useNavigate } from 'react-router';
// import Loader from 'views/AllPage/loaderComponent';
import { FadeLoader } from 'react-spinners';

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
          <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
            <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Broadcast
          </Typography>
          <Card>
            <Card.Body>
              <Form>
                <nav className="container">
                  <button
                    className={`btn me-2 mb-2 btn-content ${activeButton === 'all' ? 'active' : ''}`}
                    style={{ width: '11rem', fontSize: '16px' }}
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
                    className={`btn me-2 mb-2 btn-content ${activeButton === 'specific' ? 'active' : ''}`}
                    style={{ width: '13rem', fontSize: '16px' }}
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
                </nav>

                {content === 0 && (
                  <div className="container">
                    <div className="mt-3">
                      <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                        <div>Title</div>
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
                          />
                          {errors.title && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.title}</div>}
                        </Col>
                        {/* {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>} */}
                      </Form.Group>

                      <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                        <div>Message</div>
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
                          />
                          {errors.message && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.message}</div>}
                        </Col>
                      </Form.Group>

                      <Form.Group className="mb-3" as={Row}>
                        <Col sm={{ span: 10 }}>
                          <Button type="submit" onClick={SendBroadcastAllUser} className="mt-2 submit-btn">
                            Submit
                          </Button>
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                )}

                {content === 1 && (
                  <div className="container">
                    <div className="mt-3">
                      <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                        <Col sm={6}>
                          <div>Select User</div>
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
                          />
                          {errors.selectedUsers && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.selectedUsers}</div>}
                        </Col>

                        <Col sm={6}>
                          <div>Title</div>
                          <Form.Control
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => {
                              setTitle(e.target.value);
                              setErrors({ ...errors, title: '' });
                            }}
                            isInvalid={!!errors.title}
                          />
                          {errors.title && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.title}</div>}
                        </Col>
                      </Form.Group>

                      <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                        <div>Message</div>
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
                          />
                          {errors.message && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.message}</div>}
                        </Col>
                      </Form.Group>

                      <Form.Group className="mb-3" as={Row}>
                        <Col sm={{ span: 10 }}>
                          <Button type="submit" onClick={SendBroadcastAllUser} className="mt-2 submit-btn">
                            Submit
                          </Button>
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                )}
              </Form>
            </Card.Body>

            <Modal show={modalShow} onHide={() => setModalShow(false)} style={{ marginTop: '108px' }}>
              <Modal.Header>
                <Modal.Title>{modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalMessage}</Modal.Body>
              <Modal.Footer>{/* <Button onClick={() => setModalShow(false)}>Close</Button> */}</Modal.Footer>
            </Modal>
          </Card>
        </>
      )}
    </>
  );
}

export default Managebroadcast;
