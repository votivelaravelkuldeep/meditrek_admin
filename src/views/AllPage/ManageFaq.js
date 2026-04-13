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
import VisibilityIcon from '@mui/icons-material/Visibility';
// import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL } from 'config/constant';
import Swal from 'sweetalert2';
import Heading from 'component/common/Heading';
import CustomTable from 'component/common/CustomTable';

function ManageFaq() {
  const [selectedActions, setSelectedActions] = useState({});
  const [faqData, setFaqData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  // const [question, setQuestion] = useState('');
  // const [answer, setAnswer] = useState('');
  const [userType, setUserType] = useState('');
  const [faqId, setFaqId] = useState('');
  const [errors, setErrors] = useState({});
  // const [viewData, setViewData] = useState({});
  //   const usersPerPage = 50;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);
  const [activeLang, setActiveLang] = useState('en');

  const [viewLang, setViewLang] = useState('en');
  const [viewFaqData, setViewFaqData] = useState({});
  // const [viewFaqId, setViewFaqId] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  const deleteFaq = (faq_id) => {
    Swal.fire({
      title: 'Delete FAQ',
      text: 'Are you sure you want to delete this FAQ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_URL}delete_faq`, { faq_id: faq_id })
          .then((response) => {
            if (response.data.success) {
              getFaqs();
              Swal.fire({
                title: '',
                text: 'FAQ deleted successfully',
                icon: 'success',
                timer: 2000
              });
            }
          })
          .catch((error) => {
            console.error('Error deleting FAQ:', error);
          });
      }
    });
  };

  // const handleActionChange = (index, action, faq_id, faqItem) => {
  //   setSelectedActions({ ...selectedActions, [index]: action });
  //   if (action === 'Delete') {
  //     deleteFaq(faq_id);
  //     setSelectedActions({ ...selectedActions, [index]: null });
  //   } else if (action === 'Edit') {
  //     setQuestion(faqItem.question);
  //     setAnswer(faqItem.answer);
  //     setFaqId(faq_id);
  //     setUserType(faqItem.user_type);
  //     handleShowEditModal();
  //     setSelectedActions({ ...selectedActions, [index]: null });
  //   } else if (action === 'View') {
  //     setViewData(faqItem);
  //     handleShowViewModal();
  //     setSelectedActions({ ...selectedActions, [index]: null });
  //   }
  // };
  const handleActionChange = (index, action, faq_id, faqItem) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteFaq(faq_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Edit') {
      // if (faqItem.translations) {
      //   setFaqDataqa(faqItem.translations);
      // }
      if (faqItem.translations) {
        setFaqDataqa(faqItem.translations);
      } else {
        setFaqDataqa({
          en: {
            question: faqItem.question || '',
            answer: faqItem.answer || ''
          },
          fr: { question: '', answer: '' },
          es: { question: '', answer: '' },
          ar: { question: '', answer: '' },
          it: { question: '', answer: '' },
          de: { question: '', answer: '' },
          pt: { question: '', answer: '' }
        });
      }

      // else {
      //   setFaqDataqa({
      //     ...faqDataqa,
      //     [activeLang]: {
      //       question: faqItem.question,
      //       answer: faqItem.answer
      //     }
      //   });
      // }

      setFaqId(faq_id);
      setUserType(faqItem.user_type);
      handleShowEditModal();
      setSelectedActions({ ...selectedActions, [index]: null });
    }
    // else if (action === 'View') {
    //   setViewData(faqItem);
    //   handleShowViewModal();
    //   setSelectedActions({ ...selectedActions, [index]: null });
    // }
  else if (action === 'View') {
  setViewFaqData(faqItem);   // ✅ store full object
  setViewLang('en');         // default tab
  handleShowViewModal();
}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFaqs = faqData.filter(
    (faq) =>
      (faq.question && faq.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.user_type_label && faq.user_type_label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.answer && faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.createtime && faq.createtime.includes(searchQuery))
  );

  // Pagination logic
  //   const indexOfLastUser = currentPage * usersPerPage;
  //   const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //   const currentFaqs = filteredFaqs.slice(indexOfFirstUser, indexOfLastUser);
  //   const totalPages = Math.ceil(filteredFaqs.length / usersPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  // const getFaqs = async () => {
  //   axios
  //     .get(`${API_URL}get_faq`)
  //     .then((response) => {
  //       setFaqData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error getting FAQs:', error);
  //     });
  // };

  // 13/04/26

  const getFaqs = async () => {
    try {
      const response = await axios.get(`${API_URL}get_faq`, {
        params: {
          language_code: activeLang // 🔥 key change
        }
      });

      setFaqData(response.data.data);
    } catch (error) {
      console.error('Error getting FAQs:', error);
    }
  };

  // ==============

  useEffect(() => {
    getFaqs();
  }, [activeLang]);

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const options = {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
  //   };
  //   const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');
  //   return formattedDate;
  // };

  // const addFaq = async (e) => {
  //   e.preventDefault();
  //   let validationErrors = {};

  //   if (!question) {
  //     validationErrors.question = 'Please enter question';
  //   }
  //   if (!answer) {
  //     validationErrors.answer = 'Please enter answer';
  //   }

  //   if (!userType) {
  //     validationErrors.userType = 'Please select a user type.';
  //   }

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   setErrors({});

  //   // let faqData = {
  //   //   question: question,
  //   //   answer: answer,
  //   //   userType: userType
  //   // };
  //   let faqData = {
  //     question: faqDataqa[activeLang].question,
  //     answer: faqDataqa[activeLang].answer,
  //     userType: userType
  //   };

  //   axios
  //     .post(`${API_URL}add_faq`, faqData)
  //     .then((response) => {
  //       if (response.data.key === 'exists') {
  //         setErrors({ general: 'Faq already exist' });
  //       } else if (response.data.success) {
  //         Swal.fire({
  //           title: '',
  //           text: 'FAQ added successfully',
  //           icon: 'success',
  //           timer: 3000
  //         });
  //         setFaqDataqa({
  //           en: { question: '', answer: '' },
  //           fr: { question: '', answer: '' },
  //           es: { question: '', answer: '' },
  //           ar: { question: '', answer: '' },
  //           it: { question: '', answer: '' },
  //           de: { question: '', answer: '' },
  //           pt: { question: '', answer: '' }
  //         });
  //         // optional: reset active language
  //         setActiveLang('en');

  //         handleCloseAddModal();
  //         setQuestion('');
  //         setAnswer('');
  //         getFaqs();
  //       } else {
  //         setQuestion('');
  //         setAnswer('');
  //         setUserType('');
  //         handleCloseAddModal();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding new FAQ', error);
  //     });
  // };

  // const addFaq = async (e) => {
  //   e.preventDefault();
  //   let validationErrors = {};

  //   // Fix: Check the correct data source
  //   if (!faqDataqa[activeLang].question) {
  //     validationErrors.question = 'Please enter question';
  //   }
  //   if (!faqDataqa[activeLang].answer) {
  //     validationErrors.answer = 'Please enter answer';
  //   }
  //   if (!userType) {
  //     validationErrors.userType = 'Please select a user type.';
  //   }

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   setErrors({});

  //   // Fix: Use a different variable name (not faqData to avoid conflict)
  //   const submitData = {
  //     question: faqDataqa[activeLang].question,
  //     answer: faqDataqa[activeLang].answer,
  //     userType: userType,
  //     // If you need to send all language versions
  //     translations: faqDataqa // Send all language data to backend
  //   };

  //   axios
  //     .post(`${API_URL}add_faq`, submitData) // Changed variable name
  //     .then((response) => {
  //       if (response.data.key === 'exists') {
  //         setErrors({ general: 'Faq already exist' });
  //       } else if (response.data.success) {
  //         Swal.fire({
  //           title: '',
  //           text: 'FAQ added successfully',
  //           icon: 'success',
  //           timer: 3000
  //         });

  //         // Reset all form data
  //         setFaqDataqa({
  //           en: { question: '', answer: '' },
  //           fr: { question: '', answer: '' },
  //           es: { question: '', answer: '' },
  //           ar: { question: '', answer: '' },
  //           it: { question: '', answer: '' },
  //           de: { question: '', answer: '' },
  //           pt: { question: '', answer: '' }
  //         });

  //         setActiveLang('en');
  //         setUserType(''); // Reset user type
  //         handleCloseAddModal();
  //         getFaqs(); // Refresh the table
  //       } else {
  //         setUserType('');
  //         handleCloseAddModal();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding new FAQ', error);
  //     });
  // };

  // 13/04/26

const addFaq = async (e) => {
  e.preventDefault();

  let validationErrors = {};

  if (!faqDataqa.en.question || !faqDataqa.en.answer) {
  setActiveLang('en'); 

  if (!faqDataqa.en.question) {
    validationErrors.question = 'English question required';
  }

  if (!faqDataqa.en.answer) {
    validationErrors.answer = 'English answer required';
  }
}

  if (!userType) {
    validationErrors.userType = 'Please select user type';
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});

  const submitData = {
    userType: Number(userType),
    translations: faqDataqa
  };

  try {
    const response = await axios.post(`${API_URL}add_faq`, submitData);

    if (response.data.success) {
      Swal.fire({
        text: 'FAQ added successfully',
        icon: 'success',
        timer: 2000
      });

      setFaqDataqa({
        en: { question: '', answer: '' },
        fr: { question: '', answer: '' },
        es: { question: '', answer: '' },
        ar: { question: '', answer: '' },
        it: { question: '', answer: '' },
        de: { question: '', answer: '' },
        pt: { question: '', answer: '' }
      });

      setActiveLang('en');
      setUserType('');
      handleCloseAddModal();
      getFaqs();
    }
  } catch (error) {
    console.error('Error adding FAQ:', error);
  }
};

  // ===============

  // const editFaq = async (e) => {
  //   e.preventDefault();
  //   let validationErrors = {};

  //   // if (!question) {
  //   //   validationErrors.question = 'Please enter question';
  //   // }
  //   // if (!answer) {
  //   //   validationErrors.answer = 'Please enter answer';
  //   // }
  //   if (!faqDataqa[activeLang].question) {
  //     validationErrors.question = 'Please enter question';
  //   }

  //   if (!faqDataqa[activeLang].answer) {
  //     validationErrors.answer = 'Please enter answer';
  //   }
  //   if (!userType) {
  //     validationErrors.userType = 'Please select a user type.';
  //   }

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   setErrors({});

  //   let faqData = {
  //     question: question,
  //     answer: answer,
  //     faq_id: faqId,
  //     userType: userType
  //   };

  //   axios
  //     .post(`${API_URL}edit_faq`, faqData)
  //     .then((response) => {
  //       if (response.data.key) {
  //         setErrors({ general: response.data.msg });
  //       } else if (response.data.success) {
  //         Swal.fire({
  //           title: '',
  //           text: 'FAQ updated successfully',
  //           icon: 'success',
  //           timer: 2000
  //         });
  //         handleCloseEditModal();
  //         setQuestion('');
  //         setAnswer('');
  //         getFaqs();
  //       } else {
  //         setQuestion('');
  //         setAnswer('');
  //         handleCloseEditModal();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error updating FAQ', error);
  //     });
  // };

  const editFaq = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!faqDataqa[activeLang].question) {
      validationErrors.question = 'Please enter question';
    }
    if (!faqDataqa[activeLang].answer) {
      validationErrors.answer = 'Please enter answer';
    }
    if (!userType) {
      validationErrors.userType = 'Please select a user type.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const submitData = {
      question: faqDataqa[activeLang].question,
      answer: faqDataqa[activeLang].answer,
      faq_id: faqId,
      userType: userType,
      translations: faqDataqa // Send all language versions
    };

    axios
      .post(`${API_URL}edit_faq`, submitData)
      .then((response) => {
        if (response.data.key) {
          setErrors({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'FAQ updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseEditModal();

          // Reset form data
          setFaqDataqa({
            en: { question: '', answer: '' },
            fr: { question: '', answer: '' },
            es: { question: '', answer: '' },
            ar: { question: '', answer: '' },
            it: { question: '', answer: '' },
            de: { question: '', answer: '' },
            pt: { question: '', answer: '' }
          });
          setActiveLang('en');
          setUserType('');
          getFaqs();
        } else {
          handleCloseEditModal();
        }
      })
      .catch((error) => {
        console.error('Error updating FAQ', error);
      });
  };

  const handleShowAddModal = () => setShowAddModal(true);
  // const handleCloseAddModal = () => {
  //   setShowAddModal(false);
  //   setQuestion('');
  //   setAnswer('');
  //   setUserType('');
  //   setErrors({});
  // };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setUserType('');
    setErrors({});
    setActiveLang('en');

    setFaqDataqa({
      en: { question: '', answer: '' },
      fr: { question: '', answer: '' },
      es: { question: '', answer: '' },
      ar: { question: '', answer: '' },
      it: { question: '', answer: '' },
      de: { question: '', answer: '' },
      pt: { question: '', answer: '' }
    });
  };

  const handleShowEditModal = () => setShowEditModal(true);
  // const handleCloseEditModal = () => {
  //   setShowEditModal(false);
  //   setQuestion('');
  //   setAnswer('');
  //   setErrors({});
  // };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setErrors({});
    setActiveLang('en');

    setFaqDataqa({
      en: { question: '', answer: '' },
      fr: { question: '', answer: '' },
      es: { question: '', answer: '' },
      ar: { question: '', answer: '' },
      it: { question: '', answer: '' },
      de: { question: '', answer: '' },
      pt: { question: '', answer: '' }
    });
  };

  const handleShowViewModal = () => setShowViewModal(true);
  const handleCloseViewModal = () => setShowViewModal(false);

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },
    {
      label: 'User Type',
      sortable: true,
      key: 'user_type_label'
    },
    {
      label: 'Question',
      key: 'question',
      sortable: true,
      render: (faq) => truncateText(faq.question, 35)
    },
    {
      label: 'Answer',
      key: 'answer',
      sortable: true,
      render: (faq) => truncateText(faq.answer, 35)
    },
    {
      label: 'Created At',
      key: 'createtime',
      render: (faq) => <span style={{ whiteSpace: 'nowrap' }}>{faq.createtime}</span>
    },

    // ✅ ACTION LAST COLUMN
    {
      label: 'Action',
      key: 'action',
      render: (faq, index) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* VIEW */}
          <button
            onClick={() => handleActionChange(index, 'View', faq.faq_id, faq)}
            style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '3px 6px',
              borderRadius: '6px',
              border: '1px solid #0284c733',
              display: 'inline-flex'
            }}
          >
            <VisibilityIcon style={{ fontSize: '14px' }} />
          </button>

          {/* EDIT */}
          <button
            onClick={() => handleActionChange(index, 'Edit', faq.faq_id, faq)}
            style={{
              background: 'rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              padding: '3px 6px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 222, 196, 0.25)',
              display: 'inline-flex'
            }}
          >
            <EditIcon style={{ fontSize: '14px' }} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => handleActionChange(index, 'Delete', faq.faq_id)}
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '3px 6px',
              borderRadius: '6px',
              border: '1px solid #dc262654',
              display: 'inline-flex'
            }}
          >
            <DeleteIcon style={{ fontSize: '14px' }} />
          </button>
        </div>
      )
    }
  ];

  //   add modal faq languages

  const languages = [
    { id: 'en', name: 'English', default: true },
    { id: 'fr', name: 'Français' },
    { id: 'es', name: 'Español' },
    { id: 'ar', name: 'العربية' },
    { id: 'it', name: 'Italiano' },
    { id: 'de', name: 'Deutsch' },
    { id: 'pt', name: 'Português' }
  ];

  // const [activeLang, setActiveLang] = useState('en');

  const [faqDataqa, setFaqDataqa] = useState({
    en: { question: '', answer: '' },
    fr: { question: '', answer: '' },
    es: { question: '', answer: '' },
    ar: { question: '', answer: '' },
    it: { question: '', answer: '' },
    de: { question: '', answer: '' },
    pt: { question: '', answer: '' }
  });

  //   const handleLangToggle = (langId) => {
  //     if (langId === 'en') return; // English always enabled

  //     setActiveLangs((prev) => (prev.includes(langId) ? prev.filter((l) => l !== langId) : [...prev, langId]));
  //   };

  const handleLangChange = (field, value) => {
    setFaqDataqa((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  // const fetchFaqByLanguage = async (faqId, lang) => {
  //   try {
  //     const response = await axios.get(`${API_URL}get_faq`, {
  //       params: { language_code: lang }
  //     });

  //     const allFaqs = response.data.data;

  //     const selectedFaq = allFaqs.find((item) => Number(item.faq_id) === Number(faqId));

  //     if (selectedFaq) {
  //       setViewFaqData(selectedFaq);
  //     } else {
  //       // 🔥 No translation case
  //       setViewFaqData({
  //         question: null,
  //         answer: null
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   console.log('LANG CLICKED:', lang);
  //   console.log('FAQ ID:', faqId);
  //   // console.log("API DATA:", response.data.data);
  // };
const question =
  viewFaqData.translations?.[viewLang]?.question
    ? viewFaqData.translations[viewLang].question
    : viewLang === "en"
    ? viewFaqData.question || "N/A"
    : "N/A";

const answer =
  viewFaqData.translations?.[viewLang]?.answer
    ? viewFaqData.translations[viewLang].answer
    : viewLang === "en"
    ? viewFaqData.answer || "N/A"
    : "N/A";
  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage FAQs
      </Typography> */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px 24px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <Heading heading="Manage FAQs" />
          <div className="d-flex gap-2 justify-content-between flex-wrap">
            <div>
              <input
                className="search-input custom-search form-control"
                style={{ width: '250px', fontSize: '13px' }}
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <Button className="btn btn-primary" onClick={handleShowAddModal} style={{ fontSize: '12px', borderRadius: '10px' }}>
                <AddIcon /> Add FAQ
              </Button>
            </div>
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
            data={filteredFaqs}
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

        {/* Add FAQ Modal */}
        <Modal show={showAddModal} centered onHide={handleCloseAddModal} style={{ zIndex: '99999' }} dialogClassName="custom-modal-width">
          <Modal.Header closeButton style={{ borderBottom: 0, paddingBottom: 0 }}>
            <Modal.Title style={{ fontSize: '17px' }}>Add FAQ</Modal.Title>
          </Modal.Header>
          <form onSubmit={addFaq}>
            <Modal.Body>
              <div className="mb-1">
                <label htmlFor="userType" className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Select User Type
                </label>
                <Form.Select
                  id="userType"
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setErrors((prev) => ({ ...prev, userType: '' }));
                  }}
                  isInvalid={errors.userType}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Select User Type </option>
                  <option value="1">User</option>
                  <option value="2">Doctor</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userType}</Form.Control.Feedback>
              </div>

              {/* <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors((prev) => ({ ...prev, question: '' }));
                  }}
                  isInvalid={errors.question}
                />
                <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
              </div>
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Answer
                </label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setErrors((prev) => ({ ...prev, answer: '' }));
                  }}
                  isInvalid={errors.answer}
                />
                <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
              </div> */}
              {errors.general && <span className="text-danger">{errors.general}</span>}

              <div className="mb-1">
                <label htmlFor="language" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Languages
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
              </div>

              {/* LANGUAGE FIELDS */}
              <div className="mb-1 mt-2">
                <label htmlFor="question" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Question ({languages.find((l) => l.id === activeLang)?.name})
                </label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  value={faqDataqa[activeLang].question}
                  onChange={(e) => {
    handleLangChange('question', e.target.value);

    // clear error when typing
    if (activeLang === 'en') {
      setErrors((prev) => ({ ...prev, question: '' }));
    }
  }}
  isInvalid={activeLang === 'en' && errors.question}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div className="mt-2">
                <label htmlFor="answer" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Answer ({languages.find((l) => l.id === activeLang)?.name})
                </label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter answer"
                  value={faqDataqa[activeLang].answer}
                  onChange={(e) => {
    handleLangChange('answer', e.target.value);

    if (activeLang === 'en') {
      setErrors((prev) => ({ ...prev, answer: '' }));
    }
  }}
  isInvalid={activeLang === 'en' && errors.answer}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
              </div>
              <Form.Control.Feedback type="invalid">
  {errors.answer}
</Form.Control.Feedback>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 0, paddingTop: 0 }}>
              <Button variant="secondary" onClick={handleCloseAddModal} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Add
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Edit FAQ Modal */}
        <Modal show={showEditModal} centered onHide={handleCloseEditModal} style={{ zIndex: '99999' }} dialogClassName="custom-modal-width">
          <Modal.Header closeButton style={{ borderBottom: 0, paddingBottom: 0 }}>
            <Modal.Title style={{ fontSize: '17px' }}>Edit FAQ</Modal.Title>
          </Modal.Header>
          <form onSubmit={editFaq}>
            <Modal.Body>
              <div className="mb-2">
                <label htmlFor="userType" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Select User Type
                </label>
                <Form.Select
                  id="userType"
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setErrors((prev) => ({ ...prev, userType: '' }));
                  }}
                  isInvalid={errors.userType}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Select User Type </option>
                  <option value="1">User</option>
                  <option value="2">Doctor</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userType}</Form.Control.Feedback>
              </div>
              {/* <div className="mb-1">
                <label htmlFor="question" className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Question
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors((prev) => ({ ...prev, question: '' }));
                  }}
                  isInvalid={errors.question}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
              </div>
              <div className="mb-1">
                <label htmlFor="answer" className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Answer
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setErrors((prev) => ({ ...prev, answer: '' }));
                  }}
                  isInvalid={errors.answer}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
                <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
              </div> */}
              {/* {errors.general && <span className="text-danger">{errors.general}</span>} */}

              <div className="mb-2">
                <label htmlFor="language" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Languages
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
              </div>

              {/* LANGUAGE FIELDS */}
              <div className="mb-2">
                <label htmlFor="question" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Question ({languages.find((l) => l.id === activeLang)?.name})
                </label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  // value={question}
                  // onChange={(e) => {
                  //   setQuestion(e.target.value);
                  //   setErrors((prev) => ({ ...prev, question: '' }));
                  // }}
                  value={faqDataqa[activeLang].question}
                  onChange={(e) => handleLangChange('question', e.target.value)}
                  isInvalid={errors.question}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label htmlFor="answer" className="form-label" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                  Answer ({languages.find((l) => l.id === activeLang)?.name})
                </label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter answer"
                  //  value={answer}
                  // onChange={(e) => {
                  //   setAnswer(e.target.value);
                  //   setErrors((prev) => ({ ...prev, answer: '' }));
                  // }}
                  value={faqDataqa[activeLang].answer}
                  onChange={(e) => handleLangChange('answer', e.target.value)}
                  isInvalid={errors.answer}
                  className="custom-search form-control"
                  style={{ fontSize: '13px' }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 0, paddingTop: 0 }}>
              <Button variant="secondary" onClick={handleCloseEditModal} style={{ fontSize: '12px' }}>
                Close
              </Button>
              <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* View FAQ Modal */}
        <Modal show={showViewModal} centered onHide={handleCloseViewModal} style={{ zIndex: '99999' }} dialogClassName="custom-modal-width">
          <Modal.Header style={{ borderBottom: 0, paddingBottom: 0 }}>
            <Modal.Title style={{ fontSize: '17px' }}>FAQ Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingBottom: 0 }}>
            <div className="mb-3">
              <h6 className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                User Type:
              </h6>
              <p style={{ whiteSpace: 'pre-line', fontSize: '13px', fontWeight: 700 }}>{viewFaqData.user_type_label}</p>
            {/*   <h6 className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                Question:
              </h6>
              <p style={{ whiteSpace: 'pre-line', fontSize: '13px', fontWeight: 700 }}>{viewData.question}</p> */}
            </div>
            {/* <div className="mb-3">
              <h6 className="form-label" style={{ fontSize: '13px', fontWeight: 500 }}>
                Answer:
              </h6>
              <p style={{ whiteSpace: 'pre-line', fontSize: '13px', fontWeight: 700 }}>{viewData.answer}</p>
            </div> */}

            {/* Language Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
  setViewLang(lang.id);
}}
                  style={{
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    border: viewLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                    background: viewLang === lang.id ? '#1ddec4' : '#f8fafc',
                    color: viewLang === lang.id ? '#fff' : '#64748b'
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            <div className="mt-3">
              {/* Question */}
              <h6 style={{ fontSize: '13px', fontWeight: 500 }}>Question ({languages.find((l) => l.id === viewLang)?.name})</h6>
              <p>{question}</p>


              {/* Answer */}
              <h6 style={{ fontSize: '13px', fontWeight: 500 }}>Answer ({languages.find((l) => l.id === viewLang)?.name})</h6>
              <p>{answer}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: 0, paddingTop: 0 }}>
            <Button variant="secondary" onClick={handleCloseViewModal} style={{ fontSize: '12px' }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ManageFaq;
