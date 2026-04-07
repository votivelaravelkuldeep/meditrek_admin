import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
// import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { API_URL } from 'config/constant';
// import {useNavigate} from 'react-router-dom';

import { APP_PREFIX_PATH } from 'config/constant';
import CustomTable from 'component/common/CustomTable';

function ManageDisease() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [disease, setDisease] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

  //   const diseasesPerPage = 5; // Show 5 rows per page

  const deletedisease = (disease, index) => {
    console.log(`Delete disease with ID: ${disease}`);
    Swal.fire({
      title: 'Delete doctor',
      text: 'Are you sure you want to delete this Disease?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_URL}delete_disease`, { disease_id: disease.disease_id });

          console.log(response.data);
          if (response.data.success) {
            fetchData();
            Swal.fire({
              title: '',
              text: response.data.msg,
              icon: 'success',
              timer: 2000
            });
          } else {
            console.log('Update unsuccessful', response.data.message);
            Swal.fire({
              title: '',
              text: response.data.msg,
              icon: 'error',
              timer: 2000
            });
          }
        } catch (error) {
          console.error('Error updating category', error);
        }
      } else {
        setSelectedActions({ ...selectedActions, [index]: null });
      }
    });
  };

  const handleActionChange = (index, action, disease) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deletedisease(disease, index);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'View') {
      // Add your view logic here, e.g., navigate to the disease's profile page
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };

  const filteredUsers = disease.filter(
    (user) =>
      (user.disease_name && user.disease_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.description && user.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.updatetime && user.updatetime.includes(searchQuery))
  );

  // Pagination logic
  //   const indexOfLastdisease = currentPage * diseasesPerPage;
  //   const indexOfFirstdisease = indexOfLastdisease - diseasesPerPage;
  //   const currentdiseases = filteredUsers.slice(indexOfFirstdisease, indexOfLastdisease);
  //   const totalPages = Math.ceil(filteredUsers.length / diseasesPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  const handleShowModal = (disease) => {
    setEditingFaq(disease);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}get_disease`);

      console.log(response.data);
      if (response.data.success) {
        if (response?.data?.data == 'NA') {
          return setDisease([]);
        }
        setDisease(response?.data.data);
        console.log(disease);
      } else {
        console.log('Fetch unsuccessful', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(50, 'Disease name cannot be more than 50 characters').required('Please enter Disease name'),
    description: Yup.string().max(500, 'Description cannot be more than 500 characters').required('Please enter Description')
  });

  const handleSubmitAddDisease = async (values) => {
    console.log(values);
    try {
      const response = await axios.post(`${API_URL}add_disease`, {
        disease_name: values.name,
        description: values.description
      });

      if (response.data.success) {
        handleCloseModal2();
        fetchData();
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'success',
          timer: 2000
        });

        // Handle successful response here (e.g., show a success message, reset form, etc.)
      } else {
        console.log('Failed to add video:', response.data);
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'error',
          timer: 2000
        });
        // Handle unsuccessful response here (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const handleSubmitEditDisease = async (values) => {
    console.log(values);
    try {
      const response = await axios.post(`${API_URL}edit_disease`, {
        disease_id: editingFaq.disease_id,
        disease_name: values.name,
        description: values.description
      });

      if (response.data.success) {
        fetchData();
        handleCloseModal();
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'success',
          timer: 2000
        });
        // Handle successful response here (e.g., show a success message, reset form, etc.)
      } else {
        console.log('Failed to add disease:', response.data);
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'error',
          timer: 1000
        });
        // Handle unsuccessful response here (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const handleFullMessage = (messages) => {
    Swal.fire({
      title: '<h4 style="font-size: 18px;">Full Description</h4>',
      text: messages,
      confirmButtonText: 'OK'
    });
  };

  const handleBulkUpload = () => {
    navigate(APP_PREFIX_PATH + '/bulk-upload-desease');
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Disease Name',
      key: 'disease_name',
      sortable: true
    },

    {
      label: 'Description',
      key: 'description',
      render: (disease) => (
        <button
          onClick={() => handleFullMessage(disease.description)}
          style={{
            background: 'none',
            border: 'none',
            // color: '#2563eb',
            color:'#1DDEC4',
            cursor: 'pointer'
          }}
        >
          {disease.description?.length > 25 ? `${disease.description.substring(0, 22)}...` : disease.description}
        </button>
      )
    },

    {
      label: 'Created At',
      key: 'updatetime',
      sortable: true,
      render: (d) => <span style={{ whiteSpace: 'nowrap' }}>{d.updatetime}</span>
    },

    {
      label: 'Action',
      key: 'action',
      render: (disease, index) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* EDIT */}
          <button
            onClick={() => handleShowModal(disease)}
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
            onClick={() => handleActionChange(index, 'Delete', disease)}
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
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Disease
      </Typography> */}

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex gap-2">
            <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={handleShowModal2}>
              <AddIcon /> Add Disease
            </Button>

            <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={handleBulkUpload}>
              <CloudUploadIcon /> Bulk Upload
            </Button>
          </div>

          <input
            className="custom-search form-control"
            style={{ width: '250px', fontSize: '13px' }}
            placeholder="Search..."
            onChange={handleSearchChange}
          />
        </div>

        {/* TABLE */}
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
        {/* <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Disease</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik initialValues={{ name: '', description: '' }} validationSchema={validationSchema} onSubmit={handleSubmitAddDisease}>
              {({ handleSubmit, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formCategoryName">
                    <Form.Label>Disease Name</Form.Label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter name"
                      className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                    />
                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                    <Form.Label>Description</Form.Label>
                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Enter Description"
                      className={`form-control${errors.description && touched.description ? ' is-invalid' : ''}`}
                    />
                    {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="primary" type="submit">
                      Add Disease
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal> */}
        <Modal show={showModal2} centered onHide={handleCloseModal2} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Add Disease</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ paddingTop: 0 }}>
            <Formik initialValues={{ name: '', description: '' }} validationSchema={validationSchema} onSubmit={handleSubmitAddDisease}>
              {({ handleSubmit, errors, touched }) => (
                <FormikForm onSubmit={handleSubmit}>
                  {/* Disease Name */}
                  <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Disease Name</Form.Label>

                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter Disease Name"
                      className={`custom-input custom-search form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px' }}
                    />

                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                  </Form.Group>

                  {/* Description */}
                  <div className="mb-3 mt-2">
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Description</Form.Label>

                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Enter Description"
                      className={`custom-input custom-search form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px' }}
                    />

                    {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
                    <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                      Add Disease 
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* Modal Component */}
        {/* <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Disease</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ name: editingFaq?.disease_name, description: editingFaq?.description }}
              validationSchema={validationSchema}
              onSubmit={handleSubmitEditDisease}
            >
              {({ handleSubmit, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formCategoryName">
                    <Form.Label>Disease Name</Form.Label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter name"
                      className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                    />
                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                    <Form.Label>Description</Form.Label>
                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Enter description"
                      className={`form-control${errors.description && touched.description ? ' is-invalid' : ''}`}
                    />
                    {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal> */}
        <Modal show={showModal} centered onHide={handleCloseModal} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Disease</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ paddingTop: 0 }}>
            <Formik
              initialValues={{
                name: editingFaq?.disease_name,
                description: editingFaq?.description
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmitEditDisease}
              enableReinitialize
            >
              {({ handleSubmit, errors, touched }) => (
                <FormikForm onSubmit={handleSubmit}>
                  {/* Disease Name */}
                  <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Disease Name</Form.Label>

                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter Disease Name"
                      className={`custom-input custom-search form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px' }}
                    />

                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                  </Form.Group>

                  {/* Description */}
                  <div className="mb-3 mt-2">
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Description</Form.Label>

                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Enter Description"
                      className={`custom-input custom-search form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                      style={{ fontSize: '13px' }}
                    />

                    {errors.description && touched.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
                    <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default ManageDisease;
