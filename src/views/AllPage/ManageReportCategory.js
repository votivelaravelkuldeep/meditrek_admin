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
  const [categoryData, setCategoryData] = useState({
  en: '',
  fr: '',
  es: '',
  ar: '',
  it: '',
  de: '',
  pt: ''
});
  const [nameError, setNameError] = useState('');
  const [reportId, setReportId] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  //   const usersPerPage = 50; // Show 5 rows per page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);
  const [activeLang, setActiveLang] = useState('en');

  const resetForm = () => {
  setCategoryData({
    en: '',
    fr: '',
    es: '',
    ar: '',
    it: '',
    de: '',
    pt: ''
  });

  setImage(null);
  setImagePreview(null);
  setEditImagePreview(null);
  setActiveLang('en');
  setNameError({});
};

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

    const selectedItem = reportData.find(
      (r) => r.report_category_id === report_category_id
    );

    const translationsMap = {};

    selectedItem?.translations?.forEach((t) => {
      translationsMap[t.language_code] = t.category_name;
    });

    setCategoryData({
      en: translationsMap.en || '',
      fr: translationsMap.fr || '',
      es: translationsMap.es || '',
      ar: translationsMap.ar || '',
      it: translationsMap.it || '',
      de: translationsMap.de || '',
      pt: translationsMap.pt || ''
    });

    setReportId(report_category_id);
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

  if (!categoryData.en) {
    setActiveLang('en');
    errors.categoryName = 'English category name required';
  }

  if (!image) {
    errors.image = 'Image required';
  }

  if (Object.keys(errors).length > 0) {
    setNameError(errors);
    return;
  }

  setNameError({});

  const translations = Object.entries(categoryData).map(([lang, name]) => ({
    language_code: lang,
    category_name: name
  }));

  const formData = new FormData();
  formData.append('category_name', categoryData.en);
  formData.append('translations', JSON.stringify(translations));

  if (image) formData.append('image', image);

  try {
    const response = await axios.post(`${API_URL}add_report_category`, formData);

    if (response.data.success) {
      Swal.fire({
        text: 'Category added successfully',
        icon: 'success',
        timer: 2000
      });

      resetForm();
      handleCloseModal();
      getreportCategory();
    }
  } catch (error) {
    console.error(error);
  }
};

const editReportCategory = async (e) => {
  e.preventDefault();

  let errors = {};

  if (!categoryData.en) {
    setActiveLang('en');
    errors.categoryName = 'English category name required';
  }

  if (Object.keys(errors).length > 0) {
    setNameError(errors);
    return;
  }

  setNameError({});

  const translations = Object.entries(categoryData).map(([lang, name]) => ({
    language_code: lang,
    category_name: name
  }));

  const formData = new FormData();
  formData.append('report_category_id', reportId);
  formData.append('category_name', categoryData.en);
  formData.append('translations', JSON.stringify(translations));

  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post(`${API_URL}edit_report_category`, formData);

    if (response.data.success) {
      Swal.fire({
        text: 'Category updated successfully',
        icon: 'success',
        timer: 2000
      });

      resetForm();
      handleCloseModal2();
      getreportCategory();
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleShowModal = () => {
    setShowModal(true);
    setImage(null);
    setImagePreview(null);
  };

const handleCloseModal = () => {
  setShowModal(false);
  resetForm();
};

  const handleShowModal2 = () => setShowModal2(true);
const handleCloseModal2 = () => {
  setShowModal2(false);
  resetForm();
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
  sortable: true,
  render: (user) => {
    const t = user.translations?.find(
      (t) => t.language_code === activeLang
    );

    return t?.category_name || 'N/A';
  }
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
          <Heading heading="Manage Report Category" />
          <div className="d-flex gap-2 flex-wrap">
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
        <Modal show={showModal} centered onHide={handleCloseModal} style={{ zIndex: '99999' }} className="custom-modal" dialogClassName="custom-modal-width">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Category </Modal.Title>
          </Modal.Header>
          <form onSubmit={addReportCategory}>
            <Modal.Body style={{ paddingLeft: '10px',paddingRight:'10px',paddingTop:0,paddingBottom:0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px',marginBottom:'16px' }}>
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
  <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>
    Category Name ({languages.find((l) => l.id === activeLang)?.name})
  </Form.Label>

  <Form.Control
    type="text"
    placeholder="Enter name"
    value={categoryData[activeLang] || ''}
    onChange={(e) => {
      setCategoryData((prev) => ({
        ...prev,
        [activeLang]: e.target.value
      }));

      if (activeLang === 'en') {
        setNameError((prev) => ({ ...prev, categoryName: '' }));
      }
    }}
    isInvalid={activeLang === 'en' && nameError.categoryName}
  />

  <Form.Control.Feedback type="invalid">
    {nameError.categoryName}
  </Form.Control.Feedback>
</Form.Group>

             <Form.Group style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
  <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>
    Category Image
  </Form.Label>

  <Form.Control
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="custom-input custom-search"
    style={{ fontSize: '13px' }}
  />

  {imagePreview && (
    <div className="mt-2">
      <img
        src={imagePreview}
        alt="Preview"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
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
        <Modal show={showModal2} centered onHide={handleCloseModal2} style={{ zIndex: '99999' }} className="custom-modal" dialogClassName="custom-modal-width">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
          </Modal.Header>
          <form onSubmit={editReportCategory}>
            <Modal.Body style={{ paddingLeft: '10px',paddingRight:'10px',paddingTop:0,paddingBottom:0 }}>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px',marginBottom:'16px' }}>
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
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Category Name
                   ({languages.find((l) => l.id === activeLang)?.name})
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={categoryData[activeLang] || ''}
                  onChange={(e) => {
                    setCategoryData((prev) => ({
  ...prev,
  [activeLang]: e.target.value
}));
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
