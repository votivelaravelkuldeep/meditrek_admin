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
  // const [selectedActions, setSelectedActions] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState('');
  // const [description, setDescription] = useState('');
  const [syptomId, setsymptomId] = useState('');
  const [error, setError] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [translations, setTranslations] = useState({
    en: { symptom_name: "", description: "" }
  });

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  useEffect(() => {
    if (!translations[activeLang]) {
      setTranslations(prev => ({
        ...prev,
        [activeLang]: { symptom_name: "", description: "" }
      }));
    }
  }, [activeLang]);
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  const handleActionChange = (index, action, symptom_id, name, description, translationsData) => {
    if (action === "Delete") {
      deletesymptom(symptom_id);
      return;
    }

    if (action === "Edit") {
      setsymptomId(symptom_id);

      setTranslations({
        en: { symptom_name: name, description: description },
        ...translationsData
      });

      setName(name);
      handleShowModal();
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
  const handleCloseModal = () => {
    setShowModal(false);

    setTranslations({
      en: { symptom_name: "", description: "" }
    });
    setName("");
    setsymptomId("");
    setError({});
    setActiveLang("en");
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);

    setTranslations({
      en: { symptom_name: "", description: "" }
    });
    setName("");
    setError({});
    setActiveLang("en");
  };

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

    if (!translations.en?.symptom_name) {
  setActiveLang('en');

  errors.name = 'English name required';
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
      symptom_name: translations.en?.symptom_name,
      translations: translations
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
          setTranslations({
            en: { symptom_name: "", description: "" }
          });
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

    if (!translations.en?.symptom_name) {
  setActiveLang('en');

  errors.name = 'English name required';
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
      symptom_name: translations.en?.symptom_name,
      translations: translations
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
            onClick={() =>
              handleActionChange(
                index,
                'Edit',
                symptom.symptom_id,
                symptom.symptom_name,
                symptom.description,
                symptom.translations
              )
            }
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
        <Modal show={showModal2} centered onHide={handleCloseModal2} style={{ zIndex: '99999' }} className="custom-modal" dialogClassName="custom-modal-width">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Symptom</Modal.Title>
          </Modal.Header>
          <form onSubmit={addSymptom}>
            <Modal.Body style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: 0, paddingBottom: 0 }}>
              {/* Add your form fields here */}
              {/* <div className="mb-3"> */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
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
                {/* <label htmlFor="categoryDescription" className="form-label">
                  Symptom Name
                </label> */}
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>Symptom Name
                  ({languages.find((l) => l.id === activeLang)?.name})
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder={`Enter name (${activeLang})`}
                  className="custom-input custom-search"
                  value={translations[activeLang]?.symptom_name || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setTranslations(prev => ({
                      ...prev,
                      [activeLang]: {
                        ...prev[activeLang],
                        symptom_name: value
                      }
                    }));

                    if (activeLang === "en") {
                      setName(value);
                    }

                    if (activeLang === 'en') {
  setError((prev) => ({ ...prev, name: '' }));
}
                  }}
                  isInvalid={activeLang === 'en' && error.name}
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
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0, marginTop: "10px" }}>
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
        <Modal show={showModal} centered onHide={handleCloseModal} style={{ zIndex: '99999' }} className="custom-modal" dialogClassName="custom-modal-width">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Symptom</Modal.Title>
          </Modal.Header>
          <form onSubmit={editSymptom}>
            <Modal.Body style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: 0, paddingBottom: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
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
              {/* Add your form fields here */}
              <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <label htmlFor="categoryDescription" className="form-label">
                  Symptom Name
                </label> */}
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}> Symptom Name
                  ({languages.find((l) => l.id === activeLang)?.name})
                </Form.Label>

                <Form.Control
                  type="text"
                  value={translations[activeLang]?.symptom_name || ""}
                  placeholder={`Enter name (${activeLang})`}
                  className="custom-input custom-search"
                  onChange={(e) => {
                    const value = e.target.value;

                    setTranslations(prev => ({
                      ...prev,
                      [activeLang]: {
                        ...prev[activeLang],
                        symptom_name: value
                      }
                    }));

                    if (activeLang === "en") {
                      setName(value);
                    }

                    if (activeLang === 'en') {
  setError((prev) => ({ ...prev, name: '' }));
}
                  }}
                  isInvalid={activeLang === 'en' && error.name}
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
            <Modal.Footer style={{ borderTop: 'none', paddingTop: 0, paddingRight: 0, marginTop: "10px" }}>
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
