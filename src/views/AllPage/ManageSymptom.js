import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import CustomTable from 'component/common/CustomTable';
import Heading from 'component/common/Heading';
// import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
function ManageSymptom() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [symptomData, setsymptomData] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [syptomId, setsymptomId] = useState('');
  const [error, setError] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

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

  //   const symptomsPerPage = 5; // Show 5 rows per page
  //   console.log(description);

  //   const handleActionChange = (index, action, symptom_id, name, description) => {
  const handleActionChange = (index, action, symptom_id, name) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deletesymptom(symptom_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Edit') {
      setsymptomId(symptom_id);
      setName(name);
      setDescription(description);
      handleShowModal();
      // Add your view logic here, e.g., navigate to the symptom's profile page
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = symptomData.filter(
    (user) =>
      (user.symptom_name && user.symptom_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.description && user.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );

  // Pagination logic
  //   const indexOfLastsymptom = currentPage * symptomsPerPage;
  //   const indexOfFirstsymptom = indexOfLastsymptom - symptomsPerPage;
  //   const currentsymptoms = filteredUsers.slice(indexOfFirstsymptom, indexOfLastsymptom);
  //   const totalPages = Math.ceil(filteredUsers.length / symptomsPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const getsymptom = async () => {
    axios
      .get(`${API_URL}get_all_symptoms`)
      .then((response) => {
        setsymptomData(response.data.data);
        // setUserPageCount(response.data.users.length)
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
      });
  };

  useEffect(() => {
    getsymptom();
  }, []);

  const deletesymptom = (symptom_id) => {
    Swal.fire({
      title: 'Delete doctor',
      text: 'Are you sure you want to delete this Symptom?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_URL}delete_symptom`, { symptom_id: symptom_id })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: '',
                text: 'Symptom deleted successfully',
                icon: 'success',
                timer: 2000
              });
              getsymptom();
              console.log('deleted');
            }
            // setUserPageCount(response.data.users.length)
          })
          .catch((error) => {
            console.error('Error get_all_user_data details:', error);
          });
      }
    });

    // Add your delete logic here
  };

  const handlebulkupload = () => {
    navigate(APP_PREFIX_PATH + '/bulk-upload-symptom');

    //   <Link
    //   to={APP_PREFIX_PATH + `/manage-user/userlist/view_user/${user.user_id}/${user.user_id}`}
    // >
    // </Link>
  };

  const addSymptom = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!name) {
      errors.name = 'Please enter name';
    }
    // if (!description) {
    //   errors.description = 'Please enter description'
    // }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setError({});

    let add_data = {
      symptom_name: name
    };
    axios
      .post(`${API_URL}add_symptom`, add_data)
      .then((response) => {
        if (response.data.key) {
          setError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Symptom added successfully',
            icon: 'success',
            timer: 3000
          });
          handleCloseModal2();
          setName('');
          getsymptom();
        } else {
          setName('');
          handleCloseModal();
        }
      })

      .catch((error) => {
        console.error('Error adding new sub category', error);
      });
  };

  //edit starts from here
  const editSymptom = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!name) {
      errors.name = 'Please enter name';
    }
    // if (!description) {
    //   errors.description = 'Please enter description'
    // }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setError({});

    let add_data = {
      symptom_id: syptomId,
      symptom_name: name
    };
    axios
      .post(`${API_URL}edit_symptom`, add_data)
      .then((response) => {
        if (response.data.key) {
          setError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Symptom updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseModal();
          setName('');
          getsymptom();
        } else {
          setName('');
          handleCloseModal();
        }
      })

      .catch((error) => {
        console.error('Error adding new sub category', error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

    return formattedDate;
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },
    {
      label: 'Symptom Name',
      key: 'symptom_name',
      sortable: true
    },
    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (s) => formatDate(s.createtime)
    },
    {
      label: 'Action',
      key: 'action',
      render: (symptom, index) => (
        <div className="d-flex gap-2">
          {/* EDIT */}
          <button
            onClick={() => handleActionChange(index, 'Edit', symptom.symptom_id, symptom.symptom_name, symptom.description)}
            style={{
              background: 'rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 222, 196, 0.25)'
            }}
          >
            <EditIcon style={{ fontSize: '16px' }} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => handleActionChange(index, 'Delete', symptom.symptom_id)}
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid #dc262654'
            }}
          >
            <DeleteIcon style={{ fontSize: '16px' }} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Symptom
      </Typography> */}

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <Heading heading='Manage Symptom' />
          <div className="d-flex gap-2 flex-wrap">
             <div>
            <input
              className="search-input custom-search form-control"
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              //   className="custom-search form-control"
              style={{ width: '250px', fontSize: '13px' }}
            />
          </div>
            <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={handleShowModal2}>
              <AddIcon style={{ fontSize: '16px' }} /> Add Symptom
            </Button>

            <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={handlebulkupload}>
              <CloudUploadIcon style={{ fontSize: '16px' }} /> Bulk Upload
            </Button>
          </div>

         
        </div>

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

        {/* Modal Component */}
        <Modal show={showModal2} centered onHide={handleCloseModal2} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Symptom</Modal.Title>
          </Modal.Header>
          <form onSubmit={addSymptom}>
            <Modal.Body style={{ paddingTop: 0 }}>
              {/* Add your form fields here */}
              {/* <div className="mb-3"> */}
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <label htmlFor="categoryDescription" className="form-label">
                  Symptom Name
                </label> */}
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Symptom Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(e) => {
                    setName(e.target.value);
                    setError((prev) => ({ ...prev, name: '' }));
                  }}
                  isInvalid={error.name}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
              </Form.Group>

              {/* <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Description
                </label>

                <Form.Control type="text" as="textarea"
                placeholder='Enter description'
                onChange={(e) => {
                  setDescription(e.target.value)
                  setError((prev) => ({ ...prev, description: '' }));
                }}
                  isInvalid={error.description} />
                <Form.Control.Feedback type="invalid">
                  {error.description}
                </Form.Control.Feedback>
              </div> */}
              {error.general && <span className="text-danger">{error.general}</span>}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
              <Button variant="secondary" onClick={handleCloseModal2} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Modal Component */}
        <Modal show={showModal} centered onHide={handleCloseModal} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Symptom</Modal.Title>
          </Modal.Header>
          <form onSubmit={editSymptom}>
            <Modal.Body style={{ paddingTop: 0 }}>
              {/* Add your form fields here */}
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <label htmlFor="categoryDescription" className="form-label">
                  Symptom Name
                </label> */}
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}> Symptom Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Please enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError((prev) => ({ ...prev, name: '' }));
                  }}
                  isInvalid={error.name}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
              </Form.Group>

              {/* <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Description
                </label>

                <Form.Control type="text" as="textarea"
                placeholder='Please enter description'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setError((prev) => ({ ...prev, description: '' }));
                }}
                  isInvalid={error.description} />
                <Form.Control.Feedback type="invalid">
                  {error.description}
                </Form.Control.Feedback>
              </div> */}
              {error.general && <span className="text-danger">{error.general}</span>}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
              <Button variant="secondary" onClick={handleCloseModal} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default ManageSymptom;
