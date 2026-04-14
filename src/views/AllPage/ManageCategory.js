import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CustomTable from 'component/common/CustomTable';

import axios from 'axios';
import Swal from 'sweetalert2';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';

import { API_URL } from 'config/constant';
import { Link } from 'react-router-dom';
import Heading from 'component/common/Heading';

function ManageCategory() {
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeLang, setActiveLang] = useState('en');

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}get_doctor_specialization`);

      if (res.data.success && res.data.DoctorSpecialization_arr !== 'NA') {
        setCategory(res.data.DoctorSpecialization_arr);
      } else {
        setCategory([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  const filteredUsers = category.filter((item) => {
    return item.doctor_specialization_name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.updatetime?.includes(searchQuery);
  });

  // ================= SORT =================
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  // ================= DELETE =================
  const handleDelete = (item) => {
    Swal.fire({
      title: 'Delete doctor',
      text: 'Are you sure you want to delete this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (res) => {
      if (res.isConfirmed) {
        const response = await axios.post(`${API_URL}delete_doctor_specialization`, {
          doctor_specialization_id: item.doctor_specialization_id
        });

        if (response.data.success) {
          fetchData();
          Swal.fire('Deleted!', '', 'success');
        }
      }
    });
  };

  // ================= FORM =================
  const validationSchema = Yup.object({
    categoryName: Yup.string().required('Required')
  });

  const handleAdd = async (values) => {
    const res = await axios.post(`${API_URL}add_doctor_specialization`, {
      category_name: values.categoryName
    });

    if (res.data.success) {
      fetchData();
      setShowModal(false);
    }
  };

  const handleEdit = async (values) => {
    const res = await axios.post(`${API_URL}edit_doctor_specialization`, {
      doctor_specialization_id: editingCategory.doctor_specialization_id,
      category_name: values.categoryName
    });

    if (res.data.success) {
      fetchData();
      setShowModal2(false);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },
    {
      label: 'Specialization Name',
      key: 'doctor_specialization_name',
      sortable: true
    },
    {
      label: 'Created At',
      key: 'updatetime',
      sortable: true
    },
    {
      label: 'Action',
      key: 'action',
      render: (item) => (
        <div className="d-flex gap-2">
          <Link
            style={{
              background: '  rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 222, 196, 0.25)',
              lineHeight: '20px'
            }}
            onClick={() => {
              setEditingCategory(item);
              setShowModal2(true);
            }}
          >
            <EditIcon style={{ fontSize: '16px' }} />
          </Link>

          <Link
            style={{
              background: '  #fee2e2',
              color: '#dc2626',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid #dc262654',
              lineHeight: '20px'
            }}
            onClick={() => handleDelete(item)}
          >
            <DeleteIcon style={{ fontSize: '16px' }} />
          </Link>
        </div>
      )
    }
  ];

  const languages = [
    { id: 'en', name: 'English', default: true },
    { id: 'fr', name: 'Français' },
    { id: 'es', name: 'Español' },
    { id: 'ar', name: 'العربية' },
    { id: 'it', name: 'Italiano' },
    { id: 'de', name: 'Deutsch' },
    { id: 'pt', name: 'Português' }
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        {/* <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
          Manage Specialization
        </h5> */}
        <Heading heading="Manage Specialization" />

        <div className="d-flex gap-2">
          <input
            className="custom-search form-control"
            style={{ width: '250px', fontSize: '13px' }}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={() => setShowModal(true)}>
            <AddIcon /> Add Specialization
          </Button>
        </div>
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

      {/* ADD MODAL */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>

        <Formik initialValues={{ categoryName: '' }} validationSchema={validationSchema} onSubmit={handleAdd}>
          {({ handleSubmit }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body>
                <Field name="categoryName" className="form-control" placeholder="Enter name" />
              </Modal.Body>

              <Modal.Footer>
                <Button type="submit">Save</Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal> */} 
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal" dialogClassName="custom-modal-width">
        <Modal.Header closeButton style={{ borderBottom: 0, paddingBottom: 0 }}>
          <Modal.Title>Add Specialization</Modal.Title>
        </Modal.Header>

        <Formik initialValues={{ categoryName: '' }} validationSchema={validationSchema} onSubmit={handleAdd}>
          {({ handleSubmit, errors, touched }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: 0, paddingBottom: 0 }}>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '16px 0' }}>
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setActiveLang(lang.id)}
                        style={{
                          borderRadius: '999px',
                          padding: '2px 12px',
                          fontSize: '12px',
                          border: activeLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                          background: activeLang === lang.id ? '#1ddec4' : '#f8fafc',
                          color: activeLang === lang.id ? '#fff' : '#64748b',
                          fontWeight: activeLang === lang.id ? '500' : '400',
                          transition: '0.2s'
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Specialization Name
                    ({languages.find((l) => l.id === activeLang)?.name})
                  </Form.Label>
                  <Field
                    name="categoryName"
                    type="text"
                    placeholder="Enter Specialization Name"
                    //  className="custom-search form-control"
                    style={{ fontSize: '13px' }}
                    className={`custom-input custom-search form-control ${errors.categoryName && touched.categoryName ? 'is-invalid' : ''}`}
                  />

                  {errors.categoryName && touched.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
                </Form.Group>
              </Modal.Body>

              <Modal.Footer style={{ borderTop: 'none' }}>
                <Button variant="light" onClick={() => setShowModal(false)} style={{ borderRadius: '10px', fontSize: '13px' }}>
                  Cancel
                </Button>

                <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} type="submit">
                  Add
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>

      {/* EDIT MODAL */}
      {/* <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Specialization</Modal.Title>
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
                <Field
                  name="categoryName"
                  type="text"
                  className={`form-control${errors.categoryName && touched.categoryName ? ' is-invalid' : ''}`}
                />
                {errors.categoryName && touched.categoryName ? <div className="invalid-feedback">{errors.categoryName}</div> : null}
              </Form.Group>
              <Modal.Footer>
                <Button className="custom-btn" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal> */}
      <Modal show={showModal2} onHide={() => setShowModal2(false)} centered className="custom-modal" dialogClassName="custom-modal-width">
        <Modal.Header closeButton style={{ borderBottom: 0, paddingBottom: 0 }}>
          <Modal.Title>Edit Specialization</Modal.Title>
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
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: 0, paddingBottom: 0 }}>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '16px 0' }}>
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setActiveLang(lang.id)}
                        style={{
                          borderRadius: '999px',
                          padding: '2px 12px',
                          fontSize: '12px',
                          border: activeLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                          background: activeLang === lang.id ? '#1ddec4' : '#f8fafc',
                          color: activeLang === lang.id ? '#fff' : '#64748b',
                          fontWeight: activeLang === lang.id ? '500' : '400',
                          transition: '0.2s'
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Specialization Name
                    ({languages.find((l) => l.id === activeLang)?.name})
                  </Form.Label>
                  <Field
                    name="categoryName"
                    type="text"
                    placeholder="Enter Specialization Name"
                    className={`custom-input custom-search form-control ${errors.categoryName && touched.categoryName ? 'is-invalid' : ''}`}
                    style={{ fontSize: '13px' }}
                  />
                  {errors.categoryName && touched.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
                </Form.Group>
              </Modal.Body>

              <Modal.Footer style={{ borderTop: 'none' }}>
                <Button variant="light" onClick={() => setShowModal2(false)} style={{ borderRadius: '10px', fontSize: '13px' }}>
                  Cancel
                </Button>

                <Button className="custom-btn" type="submit" style={{ fontSize: '12px' }}>
                  Update
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default ManageCategory;
