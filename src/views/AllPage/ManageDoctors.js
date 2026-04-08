import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ToggleOffIcon from '@mui/icons-material/ToggleOff';
// import ToggleOnIcon from '@mui/icons-material/ToggleOn';
// import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { encode as base64_encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';

import CustomTable from 'component/common/CustomTable';
// import { Link } from 'react-router-dom';
import DoctorStatus from 'component/common/Status';
import DoctorActions from 'component/common/Action';
import Heading from 'component/common/Heading';

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

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  // const doctorsPerPage = 50;

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

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
      title: 'Are you sure?',
      text: 'You want to delete this doctor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_URL}delete_doctor`, {
            doctor_id: doctor_id
          });

          if (response.data.success) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Doctor deleted successfully',
              icon: 'success',
              timer: 2000
            });

            // setTriggerFetch(!triggerFetch); // table refresh
            getDoctors();
          } else {
            Swal.fire('Error', response.data.msg, 'error');
          }
        } catch (error) {
          console.error('Delete error', error);
        }
      }
    });
  };

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

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
  // const indexOfLastDoctor = currentPage * doctorsPerPage;
  // const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  // const currentDoctors = filteredUsers.slice(indexOfFirstDoctor, indexOfLastDoctor);
  // const totalPages = Math.ceil(filteredUsers.length / doctorsPerPage);

  // const handlePageChange = (event, value) => {
  //   setCurrentPage(value);
  // };

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

  const doctorColumns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Image',
      key: 'image',
      render: (doctor) => (
        <img
          src={doctor.image ? `${IMAGE_PATH}${doctor.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
          alt=""
          style={{
            width: '40px',
            height: '40px',
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
      label: 'Approve Status',
      key: 'approve_status',
      render: (doctor) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: doctor.approve_status === 1 ? '#dcfce7' : '#ea580c2e',
            color: doctor.approve_status === 1 ? '#16a34a' : '#ea580c',
            fontWeight: 600
          }}
        >
          {doctor.approve_status_lable}
        </span>
      )
    },

    {
      label: 'Status',
      key: 'active_flag',
      render: (doctor) => <DoctorStatus active_flag={doctor.active_flag} />
      // render: (doctor) => (
      //   <span
      //     style={{
      //       padding: '4px 8px',
      //       borderRadius: '6px',
      //       fontSize: '11px',
      //       background: doctor.active_flag === 1 ? '#dcfce7' : '#fee2e2',
      //       color: doctor.active_flag === 1 ? '#16a34a' : '#dc2626',
      //       fontWeight: 600
      //     }}
      //   >
      //     {doctor.active_flag === 1 ? 'Active' : 'Deactive'}
      //   </span>
      // )
    },

    {
      label: 'Action',
      key: 'action',
      // render: (doctor, index) => (
      //   <div className="dropdown text-center">
      //     <button
      //       className="btn btn-primary dropdown-toggle action-btn"
      //       data-bs-toggle="dropdown"
      //       style={{ fontSize: '12px', padding: '4px 10px' }}
      //     >
      //       Action
      //     </button>

      //     <ul className="dropdown-menu" style={{ fontSize: '12px' }}>
      //       <li>
      //         <Link to={`${APP_PREFIX_PATH}/view-doctor/${btoa(doctor.doctor_id)}`} className="dropdown-item">
      //           <VisibilityIcon style={{ fontSize: '16px' }} /> View
      //         </Link>
      //       </li>

      //       {doctor.approve_status === 0 && (
      //         <>
      //           <li>
      //             <button
      //               className="dropdown-item"
      //               onClick={() =>
      //                 handleActionChange(
      //                   index,
      //                   'Approve',
      //                   doctor.doctor_id,
      //                   doctor.doctor_name,
      //                   doctor.doctor_category_id,
      //                   doctor.mobile,
      //                   doctor.email
      //                 )
      //               }
      //             >
      //               ✅ Approve
      //             </button>
      //           </li>

      //           <li>
      //             <button className="dropdown-item" onClick={() => handleActionChange(index, 'Reject', doctor.doctor_id)}>
      //               ❌ Reject
      //             </button>
      //           </li>
      //         </>
      //       )}

      //       {doctor.approve_status === 1 && (
      //         <li>
      //           <button className="dropdown-item" onClick={() => handleActiveDeactive(doctor.doctor_id, doctor.active_flag)}>
      //             <ToggleOnIcon style={{fontSize:'16px'}} />
      //              Activate/Deactivate
      //           </button>
      //         </li>
      //       )}

      //       <li>
      //         <button className="dropdown-item text-danger" onClick={() => handleDeleteDoctor(doctor.doctor_id)}>
      //           🗑 Delete
      //         </button>
      //       </li>
      //     </ul>
      //   </div>
      // )
      render: (doctor, index) => (
        <DoctorActions
          doctor={doctor}
          index={index}
          handleActionChange={handleActionChange}
          handleActiveDeactive={handleActiveDeactive}
          handleDeleteDoctor={handleDeleteDoctor}
        />
      )
    },
    { label: 'Created At', key: 'createtime', sortable: true }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Doctor
      </Typography> */}

      {/* <Card> */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* Search */}
        <div className="d-flex justify-content-between gap-2 flex-wrap align-items-center">
          {/* <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
            Manage Doctor
          </h5> */}
          <Heading heading='Manage Doctor' />

          <input
            className="custom-search form-control"
            style={{ width: '250px', fontSize: '13px' }}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
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
            columns={doctorColumns}
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
        {/* </Card> */}
      </div>
    </>
  );
}

export default ManageDoctors;
