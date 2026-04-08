// import React, { useEffect, useState } from 'react';
// import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';

// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import Typography from '@mui/material/Typography';
// import axios from 'axios';
// import { API_URL } from 'config/constant';
// import Swal from 'sweetalert2';

// function ManageReportCategory() {
//   const [selectedActions, setSelectedActions] = useState({});
//   const [reportData, setReportData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showModal, setShowModal] = useState(false);
//   const [showModal2, setShowModal2] = useState(false);
//   const [categoryName, setCategoryName] = useState('')
//   const [nameError, setNameError] = useState('')
//   const [reportId, setReportId] = useState('')
//   const usersPerPage = 50; // Show 5 rows per page


//   const deleteReportCategory = (report_category_id) => {
//     Swal.fire({
//       title: 'Delete doctor',
//       text: 'Are you sure you want to delete this Category?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes!'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         axios.post(`${API_URL}delete_report_category`, { report_category_id: report_category_id })
//           .then((response) => {
//             if (response.data.success) {

//               getreportCategory()
//               console.log("deleted");
//               Swal.fire({
//                 title: '',
//                 text: 'Category deleted successfully',
//                 icon: 'success',
//                 timer: 2000
//               });
//             }
//             // setUserPageCount(response.data.users.length)
//           })
//           .catch((error) => {
//             console.error('Error get_all_user_data details:', error);
//           })
//       }
//     })
//     console.log(`Delete user with ID: ${report_category_id}`);

//     // Add your delete logic here
//   };

//   const handleActionChange = (index, action, report_category_id, name) => {
//     setSelectedActions({ ...selectedActions, [index]: action });
//     if (action === 'Delete') {
//       console.log("id", report_category_id)
//       deleteReportCategory(report_category_id);
//       setSelectedActions({ ...selectedActions, [index]: null });
//     } else if (action === 'Edit') {
//       setCategoryName(name)
//       setReportId(report_category_id)
//       handleShowModal2()
//       setSelectedActions({ ...selectedActions, [index]: null });
//     }
//   };

//   const [searchQuery, setSearchQuery] = useState('');
//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredUsers = reportData.filter(
//     (user) =>
//       (user.category_name && user.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (user.createtime && user.createtime.includes(searchQuery))
//   );

//   // Pagination logic 
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const getreportCategory = async () => {
//     axios.get(`${API_URL}get_report_category`)
//       .then((response) => {
//         setReportData(response.data.data)
//         // setUserPageCount(response.data.users.length)
//       })
//       .catch((error) => {
//         console.error('Error get_all_user_data details:', error);
//       })
//   };

//   useEffect(() => {
//     getreportCategory();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);

//     const options = {
//       day: '2-digit',
//       month: '2-digit',
//       year: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     };

//     const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

//     return formattedDate;
//   };



//   const addReportCategory = async (e) => {
//     e.preventDefault()
//     let errors = {}

//     if (!categoryName) {
//       errors.categoryName = 'Please enter category name'
//     }

//     if (Object.keys(errors).length > 0) {
//       setNameError(errors)
//       return
//     }
//     setNameError({})

//     let category_data = {
//       category_name: categoryName
//     }
//     axios.post(`${API_URL}add_report_category`, category_data)
//       .then((response) => {
//         if (response.data.key) {
//           setSubCategoryError({ general: response.data.msg })
//         } else if (response.data.success) {
//           Swal.fire({
//             title: '',
//             text: 'Category added successfully',
//             icon: 'success',
//             timer: 3000
//           });
//           handleCloseModal()
//           setCategoryName('')
//           getreportCategory()
//         } else {
//           setCategoryName('')
//           handleCloseModal()
//         }
//       })

//       .catch((error) => {
//         console.error('Error adding new sub category', error)
//       })
//   }

//   //edit category starts here 
//   const editReportCategory = async (e) => {
//     e.preventDefault()
//     let errors = {}

//     if (!categoryName) {
//       errors.categoryName = 'Please enter category name'
//     }


//     if (Object.keys(errors).length > 0) {
//       setNameError(errors)
//       return
//     }
//     setNameError({})

//     let category_data = {
//       category_name: categoryName,
//       report_category_id: reportId
//     }
//     axios.post(`${API_URL}edit_report_category`, category_data)
//       .then((response) => {
//         if (response.data.key) {
//           setSubCategoryError({ general: response.data.msg })
//         } else if (response.data.success) {
//           Swal.fire({
//             title: '',
//             text: 'Category updated successfully',
//             icon: 'success',
//             timer: 2000
//           });
//           handleCloseModal2()
//           setCategoryName('')
//           getreportCategory()
//         } else {
//           setCategoryName('')
//           handleCloseModal2()
//         }
//       })

//       .catch((error) => {
//         console.error('Error adding new sub category', error)
//       })
//   }


//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   const handleShowModal2 = () => setShowModal2(true);
//   const handleCloseModal2 = () => setShowModal2(false);
//   return (
//     <>
//       <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
//         <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Report Category
//       </Typography>
//       <Card>
//         <Card.Header className=" bg-white">
//           <div className="d-flex justify-content-between flex-wrap">
//             <div>
//               <Button className="btn btn-primary mt-2 mb-2" onClick={handleShowModal}>
//                 <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add Report Category
//               </Button>
//             </div>

//             <div>
//               <label htmlFor="search-input" style={{ marginRight: '5px' }}>
//                 Search
//               </label>
//               <input
//                 className="search-input"
//                 type="text"
//                 placeholder="Search..."
//                 onChange={handleSearchChange}
//                 style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
//               />
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body>
//           <div className="table-container">
//             <Table hover className="fixed-header-table">
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
//                   <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
//                   <th style={{ textAlign: 'center', fontWeight: '500' }}> Category Name</th>
//                   <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((user, index) => (
//                   <tr key={user.id}>
//                     <th scope="row" style={{ textAlign: 'center' }}>
//                       {indexOfFirstUser + index + 1}
//                     </th>
//                     <td>
//                       <div className="dropdown text-center">
//                         <button
//                           className="btn btn-primary dropdown-toggle action-btn"
//                           type="button"
//                           id={`dropdownMenuButton${user.id}`}
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           Action
//                         </button>
//                         <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${user.id}`}>
//                           <li>
//                             <Link className="dropdown-item" onClick={() => handleActionChange(index, 'Edit', user.report_category_id, user.category_name)}>
//                               <EditIcon style={{ marginRight: '8px' }} /> Edit
//                             </Link>
//                           </li>
//                           <li>
//                             <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', user.report_category_id)}>
//                               <DeleteIcon style={{ marginRight: '8px' }} /> Delete
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </td>
//                     <td style={{ textAlign: 'center' }}>{user.category_name}</td>

//                     <td style={{ textAlign: 'center' }}>{formatDate(user.createtime)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           <div className="d-flex justify-content-between">
//             <p style={{ fontWeight: '500' }} className='pagination'>Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, currentUsers.length)} of {currentUsers.length} entries</p>
//             <Stack spacing={2} alignItems="right">
//               <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
//             </Stack>
//           </div>
//         </Card.Body>

//         {/* Modal Component */}
//         <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
//           <Modal.Header closeButton>
//             <Modal.Title style={{ fontSize: '17px' }}>Add Category </Modal.Title>
//           </Modal.Header>
//           <form onSubmit={addReportCategory}>
//             <Modal.Body>
//               {/* Add your form fields here */}
//               <div className="mb-3">
//                 <label htmlFor="categoryDescription" className="form-label">
//                   Category Name
//                 </label>

//                 <Form.Control type="text"
//                   placeholder='Enter name'
//                   onChange={(e) => {
//                     setCategoryName(e.target.value)
//                     setNameError((prev) => ({ ...prev, categoryName: '' }));
//                   }}
//                   isInvalid={nameError.categoryName} />
//                 <Form.Control.Feedback type="invalid">
//                   {nameError.categoryName}
//                 </Form.Control.Feedback>
//               </div>
//               {nameError.general && <span className="text-danger">{nameError.general}</span>}

//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCloseModal}>
//                 Close
//               </Button>
//               <Button variant="primary" type="submit">
//                 Add
//               </Button>
//             </Modal.Footer>
//           </form>
//         </Modal>


//         {/* edit modal */}
//         <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
//           <Modal.Header closeButton>
//             <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
//           </Modal.Header>
//           <form onSubmit={editReportCategory}>
//             <Modal.Body>
//               {/* Add your form fields here */}
//               <div className="mb-3">
//                 <label htmlFor="categoryDescription" className="form-label">
//                   Category Name
//                 </label>

//                 <Form.Control type="text"
//                   placeholder='Enter name'
//                   value={categoryName}
//                   onChange={(e) => {
//                     setCategoryName(e.target.value)
//                     setNameError((prev) => ({ ...prev, categoryName: '' }));
//                   }}
//                   isInvalid={nameError.categoryName} />
//                 <Form.Control.Feedback type="invalid">
//                   {nameError.categoryName}
//                 </Form.Control.Feedback>
//               </div>
//               {nameError.general && <span className="text-danger">{nameError.general}</span>}

//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCloseModal2}>
//                 Close
//               </Button>
//               <Button variant="primary" type="submit">
//                 Save Changes
//               </Button>
//             </Modal.Footer>
//           </form>
//         </Modal>
//       </Card>
//     </>
//   );
// }

// export default ManageReportCategory;



import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
import Swal from 'sweetalert2';

function ManageReportCategory() {
  const [selectedActions, setSelectedActions] = useState({});
  const [reportData, setReportData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [categoryName, setCategoryName] = useState('')
  const [nameError, setNameError] = useState('')
  const [reportId, setReportId] = useState('')
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const usersPerPage = 50; // Show 5 rows per page

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
        axios.post(`${API_URL}delete_report_category`, { report_category_id: report_category_id })
          .then((response) => {
            if (response.data.success) {
              getreportCategory()
              console.log("deleted");
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
          })
      }
    })
    console.log(`Delete user with ID: ${report_category_id}`);
  };

  const handleActionChange = (index, action, report_category_id, name, image) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteReportCategory(report_category_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Edit') {
      setCategoryName(name)
      setReportId(report_category_id)
      setEditImagePreview(image ? `${API_URL}uploads/report_category/${image}` : null)
      handleShowModal2()
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
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getreportCategory = async () => {
    axios.get(`${API_URL}get_report_category`)
      .then((response) => {
        setReportData(response.data.data)
      })
      .catch((error) => {
        console.error('Error get_all_user_data details:', error);
      })
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
    e.preventDefault()
    let errors = {}

    if (!categoryName) {
      errors.categoryName = 'Please enter category name'
    }

    if (Object.keys(errors).length > 0) {
      setNameError(errors)
      return
    }
    setNameError({})

    const formData = new FormData();
    formData.append('category_name', categoryName);
    if (image) {
      formData.append('image', image);
    }

    axios.post(`${API_URL}add_report_category`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (response.data.key) {
          setNameError({ general: response.data.msg })
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Category added successfully',
            icon: 'success',
            timer: 3000
          });
          handleCloseModal()
          setCategoryName('')
          setImage(null)
          setImagePreview(null)
          getreportCategory()
        } else {
          setCategoryName('')
          handleCloseModal()
        }
      })
      .catch((error) => {
        console.error('Error adding new category', error)
      })
  }

  const editReportCategory = async (e) => {
    e.preventDefault()
    let errors = {}

    if (!categoryName) {
      errors.categoryName = 'Please enter category name'
    }

    if (Object.keys(errors).length > 0) {
      setNameError(errors)
      return
    }
    setNameError({})

    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('report_category_id', reportId);
    if (image) {
      formData.append('image', image);
    }

    axios.post(`${API_URL}edit_report_category`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (response.data.key) {
          setNameError({ general: response.data.msg })
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'Category updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseModal2()
          setCategoryName('')
          setImage(null)
          setEditImagePreview(null)
          getreportCategory()
        } else {
          setCategoryName('')
          handleCloseModal2()
        }
      })
      .catch((error) => {
        console.error('Error updating category', error)
      })
  }

  const handleShowModal = () => {
    setShowModal(true);
    setImage(null);
    setImagePreview(null);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName('');
    setImage(null);
    setImagePreview(null);
    setNameError({});
  }

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setCategoryName('');
    setImage(null);
    setEditImagePreview(null);
    setNameError({});
  }

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Report Category
      </Typography>
      <Card>
        <Card.Header className=" bg-white">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <Button className="btn btn-primary mt-2 mb-2" onClick={handleShowModal}>
                <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add Report Category
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
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> Category Name</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id}>
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
                            <Link className="dropdown-item" onClick={() => handleActionChange(index, 'Edit', user.report_category_id, user.category_name, user.image)}>
                              <EditIcon style={{ marginRight: '8px' }} /> Edit
                            </Link>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', user.report_category_id)}>
                              <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{user.category_name}</td>
                    <td style={{ textAlign: 'center' }}>
                      {user.image && (
                        <img 
                          src={`${IMAGE_PATH}${user.image}`} 
                          alt="Category" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>{formatDate(user.createtime)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className='pagination'>Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, currentUsers.length)} of {currentUsers.length} entries</p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>

        {/* Add Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Category </Modal.Title>
          </Modal.Header>
          <form onSubmit={addReportCategory}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Category Name
                </label>
                <Form.Control 
                  type="text"
                  placeholder='Enter name'
                  onChange={(e) => {
                    setCategoryName(e.target.value)
                    setNameError((prev) => ({ ...prev, categoryName: '' }));
                  }}
                  isInvalid={nameError.categoryName} 
                />
                <Form.Control.Feedback type="invalid">
                  {nameError.categoryName}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="categoryImage" className="form-label">
                  Category Image
                </label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
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
              </div>

              <span style={{color: "red"}}>Image size must be 1200x1200 px</span>

              {nameError.general && <span className="text-danger">{nameError.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
          </Modal.Header>
          <form onSubmit={editReportCategory}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Category Name
                </label>
                <Form.Control 
                  type="text"
                  placeholder='Enter name'
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value)
                    setNameError((prev) => ({ ...prev, categoryName: '' }));
                  }}
                  isInvalid={nameError.categoryName} 
                />
                <Form.Control.Feedback type="invalid">
                  {nameError.categoryName}
                </Form.Control.Feedback>
              </div>

              <div className="mb-3">
                <label htmlFor="categoryImage" className="form-label">
                  Category Image
                </label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
                {editImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={editImagePreview} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                    />
                  </div>
                )}
              </div>
                <span style={{color: "red"}}>Image size must be 1200x1200 px</span>
              {nameError.general && <span className="text-danger">{nameError.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal2}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </Card>
    </>
  );
}

export default ManageReportCategory;