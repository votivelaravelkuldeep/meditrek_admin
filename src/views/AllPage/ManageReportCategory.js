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
// import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
import Swal from 'sweetalert2';
import CustomTable from 'component/common/CustomTable';
import Heading from 'component/common/Heading';

function ManageReportCategory() {
  const [selectedActions, setSelectedActions] = useState({});
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [nameError, setNameError] = useState('');
  const [reportId, setReportId] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  //   const usersPerPage = 50; // Show 5 rows per page
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

  const deleteReportCategory = (report_category_id) => {
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
        axios
          .post(`${API_URL}delete_report_category`, { report_category_id: report_category_id })
          .then((response) => {
            if (response.data.success) {
              getreportCategory();
              console.log('deleted');
              Swal.fire({
                title: '',
                text: 'Category deleted successfully',
                icon: 'success',
                timer: 2000
              });
            }
          })
          .catch((error) => {
            console.error('Error get_all_user_data details:', error);
          });
      }
    });
    console.log(`Delete user with ID: ${report_category_id}`);
  };

  const handleActionChange = (index, action, report_category_id, name, image) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteReportCategory(report_category_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Edit') {
      setCategoryName(name);
      setReportId(report_category_id);
      //   setEditImagePreview(image ? `${API_URL}uploads/report_category/${image}` : null);
      setEditImagePreview(image ? `${IMAGE_PATH}${image}` : null);
      handleShowModal2();
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = reportData.filter(
    (user) =>
      (user.category_name && user.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );

  // Pagination logic
  //   const indexOfLastUser = currentPage * usersPerPage;
  //   const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  //   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  const getreportCategory = async () => {
    axios
      .get(`${API_URL}get_report_category`)
      .then((response) => {
        setReportData(response.data.data);
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
      });
  };

  useEffect(() => {
    getreportCategory();
  }, []);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const addReportCategory = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!categoryName) {
      errors.categoryName = 'Please enter category name';
    }

    if (Object.keys(errors).length > 0) {
      setNameError(errors);
      return;
    }
    setNameError({});

    const formData = new FormData();
    formData.append('category_name', categoryName);
    if (image) {
      formData.append('image', image);
    }

    axios
      .post(`${API_URL}add_report_category`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.key) {
          setNameError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Category added successfully',
            icon: 'success',
            timer: 3000
          });
          handleCloseModal();
          setCategoryName('');
          setImage(null);
          setImagePreview(null);
          getreportCategory();
        } else {
          setCategoryName('');
          handleCloseModal();
        }
      })
      .catch((error) => {
        console.error('Error adding new category', error);
      });
  };

  const editReportCategory = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!categoryName) {
      errors.categoryName = 'Please enter category name';
    }

    if (Object.keys(errors).length > 0) {
      setNameError(errors);
      return;
    }
    setNameError({});

    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('report_category_id', reportId);
    if (image) {
      formData.append('image', image);
    }

    axios
      .post(`${API_URL}edit_report_category`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.key) {
          setNameError({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Category updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseModal2();
          setCategoryName('');
          setImage(null);
          setEditImagePreview(null);
          getreportCategory();
        } else {
          setCategoryName('');
          handleCloseModal2();
        }
      })
      .catch((error) => {
        console.error('Error updating category', error);
      });
  };

  const handleShowModal = () => {
    setShowModal(true);
    setImage(null);
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName('');
    setImage(null);
    setImagePreview(null);
    setNameError({});
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setCategoryName('');
    setImage(null);
    setEditImagePreview(null);
    setNameError({});
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },
    {
      label: 'Category Name',
      key: 'category_name',
      sortable: true
    },
    {
      label: 'Image',
      key: 'image',
      render: (user) =>
        user.image ? (
          <img
            src={`${IMAGE_PATH}${user.image}`}
            alt="Category"
            // style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid rgb(29, 222, 196)'
            }}
          />
        ) : (
          'NA'
        )
    },
    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (u) => formatDate(u.createtime)
    },
    {
      label: 'Action',
      key: 'action',
      render: (user, index) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* EDIT */}
          <button
            onClick={() => handleActionChange(index, 'Edit', user.report_category_id, user.category_name, user.image)}
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
            onClick={() => handleActionChange(index, 'Delete', user.report_category_id)}
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
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Report Category
      </Typography> */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        <div className="d-flex justify-content-between flex-wrap align-items-center">
          <Heading heading='Manage Report Category' />
          <div className='d-flex gap-2 flex-wrap'>
            <div>
            <input
              className="search-input custom-search form-control"
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              style={{ width: '250px', fontSize: '13px' }}
            />
          </div>
            <Button className="btn btn-primary" style={{ fontSize: '12px', borderRadius: '10px' }} onClick={handleShowModal}>
              <AddIcon style={{ fontSize: '16px' }} /> Add Report Category
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

        {/* Add Modal */}
        <Modal show={showModal} centered onHide={handleCloseModal} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Category </Modal.Title>
          </Modal.Header>
          <form onSubmit={addReportCategory}>
            <Modal.Body style={{ paddingTop: 0 }}>
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setNameError((prev) => ({ ...prev, categoryName: '' }));
                  }}
                  isInvalid={nameError.categoryName}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{nameError.categoryName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                {/* <label htmlFor="categoryImage" className="form-label">
                  Category Image
                </label> */}
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}> Category Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                )}
              </Form.Group>

              <span style={{ color: 'red', fontSize: '12px' }}>Image size must be 1200x1200 px</span>

              {nameError.general && <span className="text-danger">{nameError.general}</span>}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
              <Button variant="secondary" onClick={handleCloseModal} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Add
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal2} centered onHide={handleCloseModal2} style={{ zIndex: '99999' }} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
          </Modal.Header>
          <form onSubmit={editReportCategory}>
            <Modal.Body style={{ paddingTop: 0 }}>
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setNameError((prev) => ({ ...prev, categoryName: '' }));
                  }}
                  isInvalid={nameError.categoryName}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{nameError.categoryName}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Category Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                {editImagePreview && (
                  <div className="mt-2">
                    <img src={editImagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                )}
              </Form.Group>
              <span style={{ color: 'red', fontSize: '12px' }}>Image size must be 1200x1200 px</span>
              {nameError.general && <span className="text-danger">{nameError.general}</span>}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0 }}>
              <Button variant="secondary" onClick={handleCloseModal2} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default ManageReportCategory;
