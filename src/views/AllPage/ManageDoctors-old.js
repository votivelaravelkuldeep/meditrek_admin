import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { encode as base64_encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';

function ManageDoctors() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [doctorData, setDoctorData] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [doctor_category_id, DoctorcategoryId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const doctorsPerPage = 50;

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_URL}get_doctor_specialization`);
      if (response.data.success) {
        const result = response.data.DoctorSpecialization_arr.map((res) => ({
          value: res.doctor_specialization_id,
          label: res.doctor_specialization_name
        }));
        setSpecializations(result);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  useEffect(() => {
    getDoctors();
    fetchSpecializations();
  }, []);

  const handleActionChange = (index, action, doctor_id, name, doctor_category_id, mobile, email) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteDoctor(doctor_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'View') {
      var encoded_doctor_id = base64_encode(doctor_id).toString();
      navigate(`${APP_PREFIX_PATH}/view-doctor/${encoded_doctor_id}`);
    } else if (action === 'Edit') {
      setDoctorId(doctor_id);
      setName(name);
      setMobile(mobile);
      setEmail(email);
      DoctorcategoryId(doctor_category_id);
      setShowEditModal(true);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Approve') {
      Swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to Approve this Doctor?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          setDoctorId(doctor_id);
          setName(name);
          setMobile(mobile);
          setEmail(email);
          DoctorcategoryId(doctor_category_id);
          // Resolve doctor_category_id from category_name if not present in the list payload
          const currentDoctor = doctorData.find((d) => d.doctor_id === doctor_id);
          let resolvedDoctorCategoryId = doctor_category_id || currentDoctor?.doctor_category_id;
          if (!resolvedDoctorCategoryId && currentDoctor?.category_name && specializations?.length) {
            const matchedSpec = specializations.find((s) => s.label === currentDoctor.category_name);
            resolvedDoctorCategoryId = matchedSpec?.value;
          }
          if (!resolvedDoctorCategoryId) {
            Swal.fire({
              title: 'Error',
              text: 'Could not resolve specialization for this doctor. Please try again.',
              icon: 'error'
            });
            return;
          }
          let edit_data = {
            doctor_id: doctor_id,
            doctor_name: name,
            doctor_category_id: resolvedDoctorCategoryId,
            mobile: mobile,
            email: email
          };
          axios
            .post(`${API_URL}approve_doctor`, edit_data)
            .then((response) => {
              if (response.data.key) {
                setError({ general: response.data.msg });
              } else if (response.data.success) {
                Swal.fire({
                  title: '',
                  text: 'Doctor Approved successfully',
                  icon: 'success',
                  timer: 2000
                });
                handleCloseEditModal();
                getDoctors();
              }
            })
            .catch((error) => {
              console.error('Error updating doctor', error);
            });
        }
      });
    } else if (action === 'Reject') {
      Swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to Reject this Doctor?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(`${API_URL}reject_doctor`, { doctor_id });
            if (response.data && response.data.success) {
              Swal.fire({
                title: '',
                text: 'Doctor Rejected successfully',
                icon: 'success',
                timer: 2000
              });
              getDoctors();
            } else {
              Swal.fire({
                title: 'Error',
                text: response?.data?.msg || 'Failed to reject doctor',
                icon: 'error'
              });
            }
          } catch (error) {
            console.error('Error rejecting doctor', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to reject doctor',
              icon: 'error'
            });
          }
        }
      });
    }
  };

  const handleActiveDeactive = (doctor_id, currentStatus) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to ${currentStatus === 1 ? 'Deactivate' : 'Activate'} this Doctor?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_URL}doctor_active_deactive_user`, { doctor_id })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: '',
                text: `Doctor ${response.data.newStatusMsg} successfully`,
                icon: 'success',
                timer: 2000
              });
              getDoctors();
            } else {
              Swal.fire({
                title: 'Error',
                text: response.data.msg || 'Failed to update status',
                icon: 'error'
              });
            }
          })
          .catch((error) => {
            console.error('Error updating doctor status', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to update status',
              icon: 'error'
            });
          });
      }
    });
  };
  const handleDeleteDoctor = async (doctor_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this doctor?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {

    if (result.isConfirmed) {
      try {

        const response = await axios.post(`${API_URL}delete_doctor`, {
          doctor_id: doctor_id
        });

        if (response.data.success) {

          Swal.fire({
            title: "Deleted!",
            text: "Doctor deleted successfully",
            icon: "success",
            timer: 2000
          });

          // setTriggerFetch(!triggerFetch); // table refresh
          getDoctors();

        } else {
          Swal.fire("Error", response.data.msg, "error");
        }

      } catch (error) {
        console.error("Delete error", error);
      }
    }

  });
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = doctorData.filter(
    (user) =>
      (user.doctor_name && user.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.approve_status_lable && user.approve_status_lable.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.category_name && user.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchQuery)) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredUsers.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredUsers.length / doctorsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setName('');
    setMobile('');
    setEmail('');
    DoctorcategoryId('');
    setError({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setName('');
    setMobile('');
    setEmail('');
    DoctorcategoryId('');
    setError({});
  };

  const getDoctors = async () => {
    axios
      .get(`${API_URL}get_all_doctor`)
      .then((response) => {
        setDoctorData(response.data.data);
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
      });
  };

  const deleteDoctor = (doctor_id) => {
    axios
      .post(`${API_URL}delete_doctor`, { doctor_id: doctor_id })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Doctor deleted successfully',
            icon: 'success',
            timer: 2000
          });
          getDoctors();
        }
      })
      .catch((error) => {
        console.error('Error deleting doctor:', error);
      });
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!name) {
      errors.name = 'Please enter name';
    }
    if (!doctor_category_id) {
      errors.specialization = 'Please select specialization';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setError({});

    let add_data = {
      doctor_name: name,
      doctor_category_id: doctor_category_id,
      mobile: mobile,
      email: email
    };
    axios
      .post(`${API_URL}add_doctor`, add_data)
      .then((response) => {
        if (response.data.key) {
          setError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Doctor added successfully',
            icon: 'success',
            timer: 3000
          });
          handleCloseAddModal();
          getDoctors();
        }
      })
      .catch((error) => {
        console.error('Error adding new doctor', error);
      });
  };

  const editDoctor = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!name) {
      errors.name = 'Please enter name';
    }
    if (!doctor_category_id) {
      errors.specialization = 'Please select specialization';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setError({});

    let edit_data = {
      doctor_id: doctorId,
      doctor_name: name,
      doctor_category_id: doctor_category_id,
      mobile: mobile,
      email: email
    };
    axios
      .post(`${API_URL}edit_doctor`, edit_data)
      .then((response) => {
        if (response.data.key) {
          setError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Doctor updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseEditModal();
          getDoctors();
        }
      })
      .catch((error) => {
        console.error('Error updating doctor', error);
      });
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Doctor 
      </Typography>

      <Card>
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between flex-wrap">
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
          </div>
        </Card.Header>

        <Card.Body>
          <div className="table-container">
            <Table hover className="fixed-header-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Specialization</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Approve Status</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Active Status</th>
                  
                  <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '200px' }}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.map((doctor, index) => (
                  <tr key={doctor.doctor_id}>
                    <th scope="row" style={{ textAlign: 'center' }}>
                      {indexOfFirstDoctor + index + 1}
                    </th>
                    <td>
                      <div className="dropdown text-center">
                        <button
                          className="btn btn-primary dropdown-toggle action-btn"
                          type="button"
                          id={`dropdownMenuButton${doctor.doctor_id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${doctor.doctor_id}`}>
                          <li>
                            <button className="dropdown-item" onClick={() => handleActionChange(index, 'View', doctor.doctor_id)}>
                              <VisibilityIcon style={{ marginRight: '8px' }} /> View
                            </button>
                          </li>
                          {doctor.approve_status === 0 && (
                            <>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleActionChange(index, 'Approve', doctor.doctor_id, doctor.doctor_name, doctor.doctor_category_id, doctor.mobile, doctor.email)}
                                >
                                  <CheckCircleOutlineIcon style={{ marginRight: '8px' }} /> Approve
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={() => handleActionChange(index, 'Reject', doctor.doctor_id)}>
                                  <ToggleOffIcon style={{ marginRight: '8px' }} /> Reject
                                </button>
                              </li>
                            </>
                          )}
                          {doctor.approve_status === 1 && (
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleActiveDeactive(doctor.doctor_id, doctor.active_flag)}
                              >
                                {doctor.active_flag === 1 ? (
                                  <ToggleOffIcon style={{ marginRight: '8px' }} />
                                ) : (
                                  <ToggleOnIcon style={{ marginRight: '8px' }} />
                                )}
                                Activate/Deactivate
                              </button>
                            </li>

                          )}
                           <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                              style={{ color: "red" }}
                            >
                              🗑 Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <img
                        src={doctor.image ? `${IMAGE_PATH}${doctor.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                        alt="Doctor"
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{doctor.doctor_name}</td>
                    <td style={{ textAlign: 'center' }}>{doctor.category_name}</td>
                    <td style={{ textAlign: 'center' }}>{doctor.mobile}</td>
                    <td style={{ textAlign: 'center' }}>{doctor.email}</td>
                    <td
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      <p
                        style={{
                          textAlign: 'center',
                          height: '40px',
                          width: '90px',
                          borderRadius: '5px',
                          backgroundColor: doctor.approve_status === 0 ? 'orange' : 'green',
                          color: 'white',
                          padding: '8px',
                          margin:'0 auto'
                        }}
                      >
                        {' '}
                        {doctor.approve_status_lable}
                      </p>
                    </td>



{/* Actvie Status */}
                    <td
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      <p
                        style={{
                          textAlign: 'center',
                          height: '40px',
                          width: '90px',
                          borderRadius: '5px',
                          backgroundColor: doctor.active_flag === 1 ? 'green' : 'red',
                          color: 'white',
                          padding: '8px',
                          margin:'0 auto'
                        }}
                      >
                        {' '}
                        {doctor.active_flag === 1 ? 'Active' : 'Deactive'}
                      </p>
                    </td>



                    <td style={{ textAlign: 'center' }}>{doctor.createtime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className="pagination">
              Showing {indexOfFirstDoctor + 1} to {Math.min(indexOfLastDoctor, currentDoctors.length)} of {currentDoctors.length} entries
            </p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>

        {/* Add Doctor Modal */}
        <Modal show={showAddModal} onHide={handleCloseAddModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Doctor</Modal.Title>
          </Modal.Header>
          <form onSubmit={addDoctor}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Doctor Name
                </label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError((prev) => ({ ...prev, name: '' }));
                  }}
                  isInvalid={error.name}
                />
                <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Mobile
                </label>
                <Form.Control
                  type="number"
                  placeholder="Enter mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setError((prev) => ({ ...prev, mobile: '' }));
                  }}
                  isInvalid={error.mobile}
                />
                <Form.Control.Feedback type="invalid">{error.mobile}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError((prev) => ({ ...prev, email: '' }));
                  }}
                  isInvalid={error.email}
                />
                <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <Form.Select
                  value={doctor_category_id}
                  onChange={(e) => {
                    DoctorcategoryId(e.target.value);
                    setError((prev) => ({ ...prev, specialization: '' }));
                  }}
                  isInvalid={error.specialization}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.label} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{error.specialization}</Form.Control.Feedback>
              </div>
              {error.general && <span className="text-danger">{error.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Edit Doctor Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Doctor</Modal.Title>
          </Modal.Header>
          <form onSubmit={editDoctor}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Doctor Name
                </label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError((prev) => ({ ...prev, name: '' }));
                  }}
                  isInvalid={error.name}
                />
                <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Mobile
                </label>
                <Form.Control
                  type="number"
                  placeholder="Enter mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setError((prev) => ({ ...prev, mobile: '' }));
                  }}
                  isInvalid={error.mobile}
                />
                <Form.Control.Feedback type="invalid">{error.mobile}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError((prev) => ({ ...prev, email: '' }));
                  }}
                  isInvalid={error.email}
                />
                <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <Form.Select
                  value={doctor_category_id}
                  onChange={(e) => {
                    DoctorcategoryId(e.target.value);
                    setError((prev) => ({ ...prev, specialization: '' }));
                  }}
                  isInvalid={error.specialization}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.label} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{error.specialization}</Form.Control.Feedback>
              </div>
              {error.general && <span className="text-danger">{error.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </Card>
    </>
  );
}

export default ManageDoctors;