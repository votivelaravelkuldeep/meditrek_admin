import React, { useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Product from 'assets/images/product.jpg';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';


import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { API_URL } from 'config/constant';

function ManageCategory() {
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const usersPerPage = 50; // Show 5 rows per page
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [editingCategory, setEditingCategory] = useState(null); // State for the category being edited


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const deleteUser = (user) => {
    console.log(`Delete user with ID: ${user.doctor_specialization_id}`);
    Swal.fire({
      title: 'Delete doctor',
      text: 'Are you sure you want to delete this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_URL}delete_doctor_specialization`, { doctor_specialization_id: user.doctor_specialization_id });

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
      }
    });
  };

  const handleActionChange = (index, action, user) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteUser(user);
      setSelectedActions({ ...selectedActions, [index]: null });

    } else if (action === 'View') {
      // Add your view logic here, e.g., navigate to the user's profile page
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };


  const handleAddCategorySubmit = async (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
    try {
      const response = await axios.post(`${API_URL}add_doctor_specialization`, {
        category_name: values.categoryName,  // No category_id needed for adding
      });

      if (response.data.success) {
        // Add the new category to the state
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'success',
          timer: 2000
        });
        fetchData();
        console.log('Add successfully', response.data.msg);
        // toast.success(response.data.message);
        setShowModal(false);
      } else {
        console.log('Add unsuccessful', response.data.msg);
        setShowModal(false);
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'error',
          timer: 2000
        });
        // toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding category', error);
    } finally {
      setSubmitting(false);
    }
  };


  const filteredUsers = category.filter(
    (user) =>
      (user.doctor_specialization_name && user.doctor_specialization_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.updatetime && user.updatetime.includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal2 = (category) => {
    console.log(category)
    setEditingCategory(category);
    setShowModal2(true);
  };
  const handleCloseModal2 = () => setShowModal2(false);

  const fetchData = async () => {
    try {

      const response = await axios.get(`${API_URL}get_doctor_specialization`,);

      console.log(response.data);
      if (response.data.success) {
        if (response?.data?.DoctorSpecialization_arr == "NA") {
          return setCategory([]);
        }
        setCategory(response?.data?.DoctorSpecialization_arr);
        console.log(category);
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    try {
      const response = await axios.post(`${API_URL}edit_doctor_specialization`, {
        doctor_specialization_id: editingCategory.doctor_specialization_id,
        category_name: values.categoryName,
      },);

      if (response.data.success) {
        setShowModal2(false);
        fetchData();
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'success',
          timer: 2000
        });
      } else {
        console.log('Update unsuccessful', response.data.message);
        setShowModal2(false);
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'error',
          timer: 2000
        });
      }
    } catch (error) {
      console.error('Error updating category', error);
    } finally {
      setSubmitting(false);
    }
  };


  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required('Please enter Specialization name'),
  });
  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Specialization
      </Typography>
      <Card>
        <Card.Header className=" bg-white">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <Button className="btn btn-primary mt-2 mb-2" onClick={handleShowModal}>
                <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add Specialization
              </Button>
            </div>

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
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> Specialization Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <th scope="row" style={{ textAlign: 'center' }}>
                      {indexOfFirstUser + index + 1}
                    </th>
                    <td>
                      <div className="dropdown text-center">
                        <button
                          className="btn btn-primary dropdown-toggle action-btn"
                          type="button"
                          id={`dropdownMenuButton${user.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${user.id}`}>
                          <li>
                            <Link className="dropdown-item" onClick={() => handleShowModal2(user)}>
                              <EditIcon style={{ marginRight: '8px' }} /> Edit
                            </Link>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', user)}>
                              <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{user.doctor_specialization_name}</td>

                    <td style={{ textAlign: 'center' }}>{user.updatetime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className='pagination'>Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries</p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
        {/* Modal Component */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Doctor Specialization</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add your form fields here */}
            <Formik
              initialValues={{ categoryName: '' }}  // Empty initially for adding
              validationSchema={validationSchema}
              onSubmit={handleAddCategorySubmit} // Call the add category submit function
            >
              {({ handleSubmit, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formCategoryName">
                    <Form.Label>Specialization Name</Form.Label>
                    <Field
                      name="categoryName"
                      type="text"
                      placeholder="Enter Specialization Name"
                      className={`form-control${errors.categoryName && touched.categoryName ? ' is-invalid' : ''}`}
                    />
                    {errors.categoryName && touched.categoryName ? (
                      <div className="invalid-feedback">{errors.categoryName}</div>
                    ) : null}
                  </Form.Group>
                  <Modal.Footer>

                    <Button variant="primary" type="submit">
                      Add Specialization
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>

          </Modal.Body>

        </Modal>

        {/* edit modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Specialization</Modal.Title>
          </Modal.Header>
            <Formik
                    enableReinitialize
                    initialValues={{
                      categoryName: editingCategory?.doctor_specialization_name || ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleEdit}
                  >
                    {({ handleSubmit, errors, touched }) => (
                          <FormikForm noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formCategoryName">
                              <Form.Label>Specialization Name</Form.Label>
                              <Field name="categoryName" type="text" className={`form-control${errors.categoryName && touched.categoryName ? ' is-invalid' : ''}`} />
                              {errors.categoryName && touched.categoryName ? (
                                <div className="invalid-feedback">{errors.categoryName}</div>
                              ) : null}
                            </Form.Group>
                            <Modal.Footer>
          
                              <Button variant="primary" type="submit">
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </FormikForm>
                        )}
                  </Formik>

        </Modal>
      </Card>
    </>
  );
}

export default ManageCategory;