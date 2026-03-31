import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from 'react-router-dom';

function ManageMedicine() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState({});

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const medicinesPerPage = 50;
  // single checkbox
  const handleSelectMedicine = (medicine_id) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicine_id)
        ? prev.filter((id) => id !== medicine_id)
        : [...prev, medicine_id]
    );
  };

  // select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMedicines([]);
    } else {
      const allIds = currentmedicines.map((m) => m.medicine_id);
      setSelectedMedicines(allIds);
    }
    setSelectAll(!selectAll);
  };

    const deleteSelectedMedicines = () => {
    if (selectedMedicines.length === 0) {
      Swal.fire("Please select at least one medicine");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete selected medicines?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_URL}delete_medicine_bulk`, {
            medicine_ids: selectedMedicines
          });
          // const response = await axios.post("http://localhost:3001/meditrek/server/adminAPI/delete_medicine_bulk", {
          //   medicine_ids: selectedMedicines
          // });

          if (response.data.success) {
            Swal.fire("Deleted!", response.data.msg, "success");
            setSelectedMedicines([]);
            setSelectAll(false);
            fetchData();
          } else {
            Swal.fire("Error", response.data.msg, "error");
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const deletemedicine = (medicine) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete this Medicine?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_URL}delete_medicine`,
            { medicine_id: medicine.medicine_id }
          );
          if (response.data.success) {
            Swal.fire({ title: '', text: response.data.msg, icon: 'success', timer: 2000 });
            fetchData();
          } else {
            fetchData();
            Swal.fire({ title: '', text: response.data.msg, icon: 'error', timer: 2000 });
          }
        } catch (error) {
          console.error('Error updating user status', error);
        }
      }
    });
  };

  const handleActionChange = (index, action, medicine) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deletemedicine(medicine);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'View') {
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };

  const filteredUsers = pdf.filter(
    (user) =>
      (user.medicine_name && user.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.updatetime && user.updatetime.includes(searchQuery))
  );

  const indexOfLastmedicine = currentPage * medicinesPerPage;
  const indexOfFirstmedicine = indexOfLastmedicine - medicinesPerPage;
  const currentmedicines = filteredUsers.slice(indexOfFirstmedicine, indexOfLastmedicine);
  const totalPages = Math.ceil(filteredUsers.length / medicinesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleShowModal = (user) => {
    setShowModal(true);
    setEditingVideo(user);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}get_all_medicine`);
      if (response.data.success) {
        if (response?.data?.data == "NA") {
          setPdf([]);
        } else {
          setPdf(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmitAddVideo = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('medicine_name', values.title);
      formData.append('description', values.description || '-');
      const response = await axios.post(`${API_URL}add_medicine`, formData);
      if (response.data.success) {
        setSubmitting(false);
        values.title = '';
        values.description = '';
        fetchData();
        Swal.fire({ title: '', text: response.data.msg, icon: 'success', timer: 2000 });
        handleCloseModal2();
      } else {
        setSubmitting(false);
        handleCloseModal2();
        Swal.fire({ title: '', text: response.data.msg, icon: 'error', timer: 2000 });
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().max(50, 'Title cannot be more than 50 characters').required('Please enter Medicine Name'),
    description: Yup.string().max(200, 'Description cannot be more than 200 characters').required('Please enter Description')
  });

  const initialValues = { title: '', description: '' };

  const handleSubmitEditVideo = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('medicine_id', editingVideo.medicine_id);
      formData.append('medicine_name', values.title);
      formData.append('description', values.description || '');
      const response = await axios.post(`${API_URL}edit_medicine`, formData);
      if (response.data.success) {
        setSubmitting(false);
        values.title = '';
        values.description = '';
        Swal.fire({ title: '', text: response.data.msg, icon: 'success', timer: 2000 });
        fetchData();
        handleCloseModal();
      } else {
        setSubmitting(false);
        handleCloseModal();
        Swal.fire({ title: '', text: response.data.msg, icon: 'error', timer: 2000 });
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const initialValues2 = { title: editingVideo ? editingVideo?.medicine_name : '', description: editingVideo ? editingVideo?.medicine_description : '' };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Medicine
      </Typography>
      <Card>
        <Card.Header className=" bg-white ">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <Button className="btn btn-primary mt-2 mb-2" style={{ marginRight: '10px' }} onClick={handleShowModal2}>
                <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add Medicine
              </Button>
              <Button className="btn btn-primary mt-2 mb-2" onClick={() => { navigate(APP_PREFIX_PATH + '/bulk_upload_medicine') }}>
                <CloudUploadIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Bulk Upload
              </Button>
              <Button
                className="btn btn-danger mt-2 mb-2"
                style={{ marginLeft: '10px' }}
                onClick={deleteSelectedMedicines}
              >
                <DeleteIcon style={{ marginRight: '5px' }} />
                Delete Selected
              </Button>
            </div>
            <div>
              <label htmlFor="search-input" style={{ marginRight: '5px' }}>Search</label>
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
                  <th style={{ textAlign: 'center' }}><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /> </th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Patient Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Description</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentmedicines.map((medicine, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedMedicines.includes(medicine.medicine_id)}
                        onChange={() => handleSelectMedicine(medicine.medicine_id)}
                      />
                    </td>
                    <th scope="row" style={{ textAlign: 'center' }}>{indexOfFirstmedicine + index + 1}</th>
                    <td>
                      <div className="dropdown text-center">
                        <button
                          className="btn btn-primary dropdown-toggle action-btn"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <Link className="dropdown-item" onClick={() => handleShowModal(medicine)}>
                              <EditIcon style={{ marginRight: '8px' }} /> Edit
                            </Link>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', medicine)}>
                              <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  <td style={{ textAlign: 'center' }}>{medicine.patient_name || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{medicine.medicine_name || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{medicine.medicine_description || "NA"}</td>
                    <td style={{ textAlign: 'center' }}>{medicine.createtime || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className='pagination'>
              Showing {indexOfFirstmedicine + 1} to {Math.min(indexOfLastmedicine, filteredUsers.length)} of {filteredUsers.length} entries
            </p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>

        {/* Add Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add medicine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitAddVideo}>
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Medicine Name</label>
                    <Field type="text" name="title" className={`form-control${errors.title && touched.title ? ' is-invalid' : ''}`} placeholder="Enter medicine" />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <Field type="text" name="description" className={`form-control${errors.description && touched.description ? ' is-invalid' : ''}`} placeholder="Enter description" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>
                  <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Medicine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik initialValues={initialValues2} validationSchema={validationSchema} onSubmit={handleSubmitEditVideo} enableReinitialize={true}>
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Medicine Name</label>
                    <Field type="text" name="title" className={`form-control${errors.title && touched.title ? ' is-invalid' : ''}`} placeholder="Enter medicine" />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </div>
                    <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <Field type="text" name="description" className={`form-control${errors.description && touched.description ? ' is-invalid' : ''}`} placeholder="Enter description" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </Card>
    </>
  );
}

export default ManageMedicine;
