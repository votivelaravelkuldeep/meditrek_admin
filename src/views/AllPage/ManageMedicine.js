import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
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
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import CustomTable from 'component/common/CustomTable';

function ManageMedicine() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  //   const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState({});

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  //   const medicinesPerPage = 50;

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  // single checkbox
  const handleSelectMedicine = (medicine_id) => {
    setSelectedMedicines((prev) => (prev.includes(medicine_id) ? prev.filter((id) => id !== medicine_id) : [...prev, medicine_id]));
  };

  // select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMedicines([]);
    } else {
      //   const allIds = currentmedicines.map((m) => m.medicine_id);
      const allIds = filteredUsers.map((m) => m.medicine_id);
      setSelectedMedicines(allIds);
    }
    setSelectAll(!selectAll);
  };

    const deleteSelectedMedicines = () => {
      if (selectedMedicines.length === 0) {
        Swal.fire('Please select at least one medicine');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete selected medicines?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!'
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
              Swal.fire('Deleted!', response.data.msg, 'success');
              setSelectedMedicines([]);
              setSelectAll(false);
              fetchData();
            } else {
              Swal.fire('Error', response.data.msg, 'error');
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
          const response = await axios.post(`${API_URL}delete_medicine`, { medicine_id: medicine.medicine_id });
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

  //   const handleActionChange = (index, action, medicine) => {
  //     setSelectedActions({ ...selectedActions, [index]: action });
  //     if (action === 'Delete') {
  //       deletemedicine(medicine);
  //       setSelectedActions({ ...selectedActions, [index]: null });
  //     } else if (action === 'View') {
  //       setSelectedActions({ ...selectedActions, [index]: null });
  //     }
  //   };

  const filteredUsers = pdf.filter(
    (user) =>
      (user.medicine_name && user.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.updatetime && user.updatetime.includes(searchQuery))
  );

  //   const indexOfLastmedicine = currentPage * medicinesPerPage;
  //   const indexOfFirstmedicine = indexOfLastmedicine - medicinesPerPage;
  //   const currentmedicines = filteredUsers.slice(indexOfFirstmedicine, indexOfLastmedicine);
  //   const totalPages = Math.ceil(filteredUsers.length / medicinesPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

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
        if (response?.data?.data == 'NA') {
          setPdf([]);
        } else {
          setPdf(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const initialValues2 = {
    title: editingVideo ? editingVideo?.medicine_name : '',
    description: editingVideo ? editingVideo?.medicine_description : ''
  };

  const columns = [
    {
      label: <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />,
      key: 'checkbox',
      render: (medicine) => (
        <input
          className="custom-checkbox"
          type="checkbox"
          checked={selectedMedicines.includes(medicine.medicine_id)}
          onChange={() => handleSelectMedicine(medicine.medicine_id)}
        />
      )
    },

    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Patient Name',
      key: 'patient_name',
      sortable: true
    },

    {
      label: 'Medicine Name',
      key: 'medicine_name',
      sortable: true
    },

    {
      label: 'Description',
      key: 'medicine_description',
      render: (m) => m.medicine_description || 'NA'
    },

    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (m) => <span style={{ whiteSpace: 'nowrap' }}>{m.createtime}</span>
    },

    {
      label: 'Action',
      key: 'action',
      render: (medicine) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* EDIT */}
          <button
            onClick={() => handleShowModal(medicine)}
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
            onClick={() => deletemedicine(medicine)}
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
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Medicine
      </Typography> */}
      <div>
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
                <AddIcon style={{fontSize:'16px'}} /> Add Medicine
              </Button>

              <Button
                className="btn btn-primary"
                style={{ fontSize: '12px', borderRadius: '10px' }}
                onClick={() => navigate(APP_PREFIX_PATH + '/bulk_upload_medicine')}
              >
                <CloudUploadIcon style={{fontSize:'16px'}} /> Bulk Upload
              </Button>

              <Button className="btn btn-danger" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={deleteSelectedMedicines}>
                <DeleteIcon style={{fontSize:'16px'}} /> Delete Selected
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
        </div>

        {/* Add Modal */}
        <Modal show={showModal2} centered onHide={handleCloseModal2} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add medicine</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{paddingTop:0}}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitAddVideo}>
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                     <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Medicine Name</Form.Label>
                    <Field
                      type="text"
                      name="title"
                      className={`custom-input custom-search form-control${errors.title && touched.title ? ' is-invalid' : ''}`}
                      placeholder="Enter medicine"
                      style={{ fontSize: '13px' }}
                    />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group >
                     <div className="mb-3 mt-2" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Description</Form.Label>
                    <Field
                      type="text"
                      name="description"
                      className={`custom-input custom-search form-control${errors.description && touched.description ? ' is-invalid' : ''}`}
                      placeholder="Enter description"
                       style={{ fontSize: '13px' }}
                    />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>
                  <Modal.Footer style={{ borderTop: 'none',paddingTop:0,paddingRight:0 }}>
                    <Button variant="primary" type="submit" disabled={isSubmitting} style={{ fontSize: '12px' }}>
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal} centered onHide={handleCloseModal} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Medicine</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{paddingTop:0}}>
            <Formik
              initialValues={initialValues2}
              validationSchema={validationSchema}
              onSubmit={handleSubmitEditVideo}
              enableReinitialize={true}
            >
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Medicine Name</Form.Label>
                    <Field
                      type="text"
                      name="title"
                      className={`custom-input custom-search form-control${errors.title && touched.title ? ' is-invalid' : ''}`}
                      style={{ fontSize: '13px' }}
                      placeholder="Enter medicine"
                    />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>
                  {/* </div> */}
                  <div className="mb-3 mt-2">
                    <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Description</Form.Label>

                    <Field
                      type="text"
                      name="description"
                      className={`custom-input custom-search form-control${errors.description && touched.description ? ' is-invalid' : ''}`}
                      placeholder="Enter description"
                      style={{ fontSize: '13px' }}
                    />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>
                  <Modal.Footer style={{ borderTop: 'none',paddingTop:0,paddingRight:0 }}>
                    <Button variant="primary" type="submit" disabled={isSubmitting} style={{ fontSize: '12px' }}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default ManageMedicine;
