/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Pagination, Stack, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router';
// import { decode as base64_decode } from 'base-64';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// import VerifiedIcon from '@mui/icons-material/Verified';
// import { encode as base64_encode } from 'base-64';

// import './viewVendor.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';
import { FadeLoader } from 'react-spinners';
// import { Link } from 'react-router-dom';
function ViewUser() {
  const [user_data, setUserDetails] = React.useState([]);
  // const [salesmanData, setSalesmanData] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [enlargedImage, setEnlargedImage] = React.useState(null);
  const [showImagePopup, setShowImagePopup] = React.useState(false);
  // const [conatctUsers, conatctUsersData] = React.useState([]);
  const [content, setContent] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [user_report_data, setReportUsersData] = React.useState([]);
  // const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryGroup, setSearchQuerygroup] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [doctor_data, setDoctordata] = React.useState([]);
  const [adverse_data, setAdversedata] = React.useState([]);
  const [report, setReport] = React.useState([]);
  const [medication, setMedication] = React.useState([]);
  const [complianceData, setComplianceData] = React.useState([]);
  const [userMedicine, setUserMedicine] = React.useState([]);
  const [measurement, setMeasurement] = React.useState([])

  const usersPerPage = 50;
  const { user_id } = useParams();
  var navigate = useNavigate();
  var token = sessionStorage.getItem('token');

  const contentTypes = {
    Salesman: 0,
    doctor_list: 1,
    adverse_list: 2,
    measurement: 3,
    report: 4,
    compliance: 5,
    user_medicine: 6
  };

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_user_data/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
          setLoading(false);
        }
        if (response.data.success) {
          setUserDetails(response.data.res[0]);
          console.log('setTransaction', response.data.res[0]);
          setLoading(false);
        } else {
          console.error('Error fetching user details:', response.data.msg);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setLoading(false);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}fetchdoctorby_user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setDoctordata(response.data.doctor_arr);
          console.log('salesman_arr ', response.data.doctor_arr);
        } else {
          console.error('Error fetching salesman_arr details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching salesman_arr details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}fetchadverseof_user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setAdversedata(response.data.adverse_arr);
          console.log('adverser_arr ', response.data.adverse_arr);
        } else {
          console.error('Error fetching salesman_arr details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching salesman_arr details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_measurements?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setMeasurement(response.data.measurements || []);
          console.log('adverser_arr ', response.data.measurements);
        } else {
          console.error('Error fetching salesman_arr details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching salesman_arr details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_reports?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != "NA") {
            setReport(response.data.list || []);
          }
          console.log('reports ', report, response.data.list);
        } else {
          console.error('Error fetching medication list details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication list details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_medication?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != "NA") {
            setMedication(response.data.list || []);
          }
          console.log('medication ', medication, response.data.list);
        } else {
          console.error('Error fetching medication list details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication list details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}view_compliance?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != "NA") {
            setComplianceData(response.data.list || []);
          }
        } else {
          console.error('Error fetching medication list details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication list details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_user_medicine?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != "NA") {
            setUserMedicine(response.data.result || []);
          }
        } else {
          console.error('Error fetching medication list details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication list details:', error);
      });
  }, [user_id]);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  // handleShow()

  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchgroup = (event) => {
    setSearchQuerygroup(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  // for salesman
  const [searchQuery, setSearchQuery] = React.useState('');
  const filterSalesmanData = medication?.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const nameMatch = user.medicine_name ? String(user.medicine_name).toLowerCase().includes(lowercasedTerm) : false;
    const descriptionMatch = user.description ? String(user.description).toLowerCase().includes(lowercasedTerm) : false;
    const dosageMatch = user.dosage ? String(user.dosage).toLowerCase().includes(lowercasedTerm) : false;
    const quantityMatch = user.current_quantity ? String(user.current_quantity).toLowerCase().includes(lowercasedTerm) : false;
    const instructionMatch = user.instruction ? String(user.instruction).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.updatetime ? String(user.updatetime).toLowerCase().includes(lowercasedTerm) : false;
    const remindMatch = user.reminder_time ? String(user.reminder_time).toLowerCase().includes(lowercasedTerm) : false;
    return nameMatch || descriptionMatch || instructionMatch || dateMatch || dosageMatch || quantityMatch || remindMatch;
  });

  const filterComplianceData = complianceData?.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const nameMatch = user.medicine_name ? String(user.medicine_name).toLowerCase().includes(lowercasedTerm) : false;
    const descriptionMatch = user.description ? String(user.description).toLowerCase().includes(lowercasedTerm) : false;
    const dosageMatch = user.dosage ? String(user.dosage).toLowerCase().includes(lowercasedTerm) : false;
    const quantityMatch = user.current_quantity ? String(user.current_quantity).toLowerCase().includes(lowercasedTerm) : false;
    const instructionMatch = user.instruction ? String(user.instruction).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.updatetime ? String(user.updatetime).toLowerCase().includes(lowercasedTerm) : false;
    const remindMatch = user.reminder_time ? String(user.reminder_time).toLowerCase().includes(lowercasedTerm) : false;
    return nameMatch || descriptionMatch || instructionMatch || dateMatch || dosageMatch || quantityMatch || remindMatch;
  });

  const indexOfLastUser5 = currentPage * usersPerPage;
  const indexOfFirstUser5 = indexOfLastUser5 - usersPerPage;
  const currentComplianceData = filterComplianceData.slice(indexOfFirstUser5, indexOfLastUser5);
  // const totalPages5 = Math.ceil(filterComplianceData.length / usersPerPage);

  const indexOfLastUser1 = currentPage * usersPerPage;
  const indexOfFirstUser1 = indexOfLastUser1 - usersPerPage;
  const currantSalesmanData = filterSalesmanData.slice(indexOfFirstUser1, indexOfLastUser1);
  const totalPages1 = Math.ceil(filterSalesmanData.length / usersPerPage);

  const filteredDoctor = doctor_data.filter((doctor) => {
    const lowercasedTerm = searchQueryGroup.toLowerCase();
    const nameMatch = doctor.doctor_name ? String(doctor.doctor_name).toLowerCase().includes(lowercasedTerm) : false;
    const mobileMatch = doctor.mobile ? String(doctor.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const categoryMatch = doctor.category_name ? String(doctor.category_name).toLowerCase().includes(lowercasedTerm) : false;
    const emailMatch = doctor.email ? String(doctor.email).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = doctor.createtime ? String(doctor.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return nameMatch || mobileMatch || categoryMatch || emailMatch || dateMatch;
  });
  const indexOfLastDoctor = currentPage * usersPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - usersPerPage;
  const currentShops = filteredDoctor.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages3 = Math.ceil(filteredDoctor.length / usersPerPage);

  const filteredAdverse = adverse_data.filter((adverse) => {
    const lowercasedTerm = searchQueryGroup.toLowerCase();
    const medicinenameMatch = adverse.medicine_name ? String(adverse.medicine_name).toLowerCase().includes(lowercasedTerm) : false;
    const categoryMatch = adverse.category_name ? String(adverse.category_name).toLowerCase().includes(lowercasedTerm) : false;
    const symptomMatch = adverse.symptom_name ? String(adverse.symptom_name).toLowerCase().includes(lowercasedTerm) : false;
    const instructionMatch = adverse.instruction ? String(adverse.instruction).toLowerCase().includes(lowercasedTerm) : false;
    const reactiondateMatch = adverse.reaction_date ? String(adverse.reaction_date).toLowerCase().includes(lowercasedTerm) : false;
    const createdatematch = adverse.createtime ? String(adverse.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return medicinenameMatch || categoryMatch || symptomMatch || instructionMatch || reactiondateMatch || createdatematch;
  });
  const indexOfLastAdverse = currentPage * usersPerPage;
  const indexOfFirstAdverse = indexOfLastAdverse - usersPerPage;
  const currentAdverse = filteredAdverse.slice(indexOfFirstAdverse, indexOfLastAdverse);
  const totalPages4 = Math.ceil(filteredAdverse.length / usersPerPage);

  const filteredReports = report?.filter((adverse) => {
    const lowercasedTerm = searchQueryGroup.toLowerCase();
    const medicinenameMatch = adverse.medicine_name ? String(adverse.medicine_name).toLowerCase().includes(lowercasedTerm) : false;
    const categoryMatch = adverse.category_name ? String(adverse.category_name).toLowerCase().includes(lowercasedTerm) : false;

    const createdatematch = adverse.createtime ? String(adverse.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return medicinenameMatch || categoryMatch || createdatematch;
  });
  const indexOfLastReports = currentPage * usersPerPage;
  const indexOfFirstReports = indexOfLastReports - usersPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReports, indexOfLastReports);
  const totalReports = Math.ceil(filteredReports.length / usersPerPage);

  const filteruserMedicine = userMedicine?.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const nameMatch = user.medicine_name ? String(user.medicine_name).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return nameMatch || dateMatch
  });


  const indexOfLastUser6 = currentPage * usersPerPage;
  const indexOfFirstUser6 = indexOfLastUser6 - usersPerPage;
  const currentfilterMedicine = filteruserMedicine.slice(indexOfFirstUser6, indexOfLastUser6);
  // const totalPages6 = Math.ceil(filteruserMedicine.length / usersPerPage);

  return (
    <>
      {loading ? (
        <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
          <FadeLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
            <span style={{ color: '#238BF0' }}>Dashboard</span> / View User
          </Typography>
          <Card className="mb-5">
            <Card.Body>
              <div className="view-user-content row mt-2">
                <div className="col-lg-4">
                  <div className="d-flex flex-column flex-wrap justify-content-center text-center">
                    <span
                      onClick={handleShow}
                      onKeyDown={(e) => e.key === 'Enter' && handleShow()}
                      className="profile-div"
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={user_data?.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.jpg`}
                        alt="User"
                        className="user-image"
                      />
                    </span>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="mobile-view ms-3 ">
                    <h6>User Detail</h6>
                    <div className="user-detail row " style={{ marginTop: '20px' }}>
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Name :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data.name}</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Mobile Number : </p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                              {'+ ' + user_data?.phone_code || '-'} {' ' + user_data?.mobile || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>DOB :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.dob || '-'}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Age :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.age + ' years' || '-'}</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Gender : </p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.gender_lable || '-'}</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Height :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.height + ' cm' || '-'}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Weight :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.weight + ' kg' || '-'}</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Disease :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500' }}>
                              {(() => {
                                const rawString = user_data?.diseaseName || '';
                                const matches = [...rawString.matchAll(/name:\s*([\w\s]+)/g)];
                                const names = matches.map((m) => m[1].trim());
                                return names.length > 0 ? names.join(', ') : '-';
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Status :</p>
                          </div>
                          <div className="col-lg-8 responsive-btn">
                            <p
                              style={{
                                borderRadius: '25px',
                                backgroundColor:
                                  user_data.delete_flag === 1
                                    ? '#FF2222' // always red if deleted
                                    : user_data.active_flag === 1
                                      ? '#009640' // green for active
                                      : '#FF2222', // red for inactive
                                padding: '0px 15px',
                                width: '109px',
                                color: '#fff',
                                fontWeight: '500',
                                textAlign: 'center'
                              }}
                            >
                              {user_data.delete_flag === 1 && 'Deleted'}
                              {user_data.delete_flag === 0 &&
                                (user_data.active_flag === 1 ? 'Active' : 'Deactive')}
                            </p>
                          </div>

                        </div>

                        <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>Create Date & Time :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data?.createtime || '-'} </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showImagePopup && (
                <div
                  className="enlarged-image-overlay"
                  onClick={handleCloseImage}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
                  }} // Add keyboard interaction
                >
                  <span
                    className="close-button"
                    onClick={handleCloseImage}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
                    }} // Add keyboard interaction
                  >
                    &times;
                  </span>
                  <img
                    src={enlargedImage}
                    alt="Enlarged view" // Updated alt attribute
                    className="enlarged-image"
                    style={{ width: '20rem', height: '20rem', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Card.Body>
            <Modal show={show} onHide={handleClose} className="d-flex justify-content-center align-items-center mt-5">
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <img
                  src={user_data.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.png`}
                  alt="Preview"
                  style={{ width: '100%', height: '356px', margin: 'auto', display: 'flex', objectFit: 'cover' }}
                />
              </Modal.Body>
            </Modal>
          </Card>
          <nav className="col-xl-10 navbar navbar-expand-lg navbar-light">
            <div className="container-fluid tabs justify-content-start" style={{ marginBottom: '41px' }}>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 0 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.Salesman)}
              >
                Medication
              </button>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 1 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.doctor_list)}
              >
                Doctor List
              </button>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 2 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.adverse_list)}
              >
                Report Health
              </button>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 3 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.measurement)}
              >
                Measurement
              </button>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 5 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.compliance)}
              >
                Compliance
              </button>
              <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === 6 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.user_medicine)}
              >
                Medicine List
              </button>
            </div>
          </nav>

          {content == 0 ? (
            <>
              {' '}
              <Card>
                {/* view Document details end  */}
                <Card.Header className=" bg-white">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                        Search
                      </label>
                      <input
                        className="search-input"
                        type="text"
                        onChange={handleSearch}
                        placeholder="Search..."
                        style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
                      />
                    </div>
                  </div>
                </Card.Header>
                {
                  <Card.Body>
                    {currantSalesmanData.length > 0 ? (
                      <>
                        <div className="table-container">
                          <Table hover className="fixed-header-table">
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Added By</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Date</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Pause Status</th>
                                <th style={{ textAlign: 'center', fontWeight: '500', width: '100px' }}>Status</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {' '}
                              {currantSalesmanData.map((user, index) => (
                                <tr key={user.user_id}>
                                  <th scope="row" style={{ textAlign: 'center' }}>
                                    {index + 1}
                                  </th>
                                  <td style={{ textAlign: 'center' }}>{user?.medicine_name}</td>
                                  <td style={{ textAlign: 'center' }}>{user?.added_by}</td>
                                  {/* <td style={{ textAlign: 'center' }}>{user?.description}</td> */}
                                  <td style={{ textAlign: 'center' }}>{user?.instruction || '-'}</td>
                                  <td
                                    style={{
                                      textAlign: 'center',
                                      // fontWeight: '500',
                                      maxWidth: '250px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                    title={user?.dosage}
                                  >
                                    {user?.dosage}
                                  </td>

                                  <td style={{ textAlign: 'center' }}>{user?.schedule || '-'}</td>
                                  <td style={{ textAlign: 'center' }}>{user?.schedule_date || '-'}</td>
                                  <td>
                                    <div
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor:
                                          user?.pause_status === 1 ? '#f8d7da' : user?.pause_status === 0 ? '#d4edda' : 'transparent',
                                        color: user?.pause_status === 1 ? '#721c24' : user?.pause_status === 0 ? '#155724' : '#000',
                                        fontWeight: 'bold',
                                        borderRadius: '35px'
                                      }}
                                    >
                                      {user?.pause_status === 1 ? 'Pause' : '-'}
                                    </div>
                                  </td>

                                  <td>
                                    <div
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor:
                                          user?.taken_status === 0 ? '#f8d7da' : user?.taken_status === 1 ? '#d4edda' : 'transparent',
                                        color: user?.taken_status === 0 ? '#721c24' : user?.taken_status === 1 ? '#155724' : '#000',
                                        fontWeight: 'bold',
                                        borderRadius: '35px'
                                      }}
                                    >
                                      {user?.taken_status === 0 ? 'Not taken' : user?.taken_status === 1 ? 'Taken' : '-'}
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{user?.time || '-'} </td>
                                  <td style={{ textAlign: 'center' }}>{user?.updatetime || '-'} </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p style={{ fontWeight: '500' }} className="pagination">
                            {currantSalesmanData.length > 0
                              ? `Showing ${indexOfFirstUser1 + 1} to ${Math.min(indexOfLastUser1, currantSalesmanData.length)} of ${currantSalesmanData.length} entries`
                              : 'No entries to show'}
                          </p>
                          <Stack spacing={2} alignItems="right">
                            <Pagination count={totalPages1} page={currentPage} onChange={handlePageChange} />
                          </Stack>
                        </div>
                      </>
                    ) : (
                      <>
                        <Table>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Added By</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Date</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
                              {/* <th style={{ textAlign: 'center', fontWeight: '500' }}>Current Quantity</th> */}
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <td colSpan="6" style={{ marginTop: '5px', borderBottom: '1px solid #e9ecef' }}>
                              <p style={{ textAlign: 'center', marginBottom: '0px' }}> No Data Found</p>
                            </td>
                          </tbody>
                        </Table>
                      </>
                    )}
                  </Card.Body>
                }
              </Card>
            </>
          ) : (
            <></>
          )}

          {content == 1 ? (
            <>
              <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
                <span style={{ color: '#238BF0' }}>Dashboard</span> / Doctor List
              </Typography>
              <Card style={{ overflow: 'hidden' }}>
                <Card.Header className="bg-white ">
                  <div className="">
                    <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                      Search
                    </label>
                    <input
                      className="search-input"
                      type="text"
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      style={{
                        marginTop: '8px',
                        marginBottom: '5px',
                        padding: '5px',
                        width: '200px',
                        border: '1px solid #f2f2f2',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </Card.Header>
                <Card.Body>
                  {filteredDoctor.length > 0 ? (
                    <>
                      <div className="table-container">
                        <Table hover className="fixed-header-table">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Doctor Name</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Category Name</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDoctor.map((doctor, index) => (
                              <tr key={doctor.doctor_id}>
                                <th scope="row" style={{ textAlign: 'center' }}>
                                  {index + 1}
                                </th>

                                <td style={{ textAlign: 'center' }}>
                                  <img
                                    src={
                                      doctor.image ? `${IMAGE_PATH}${doctor.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`
                                    }
                                    alt="Logo"
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                  ></img>
                                </td>
                                <td style={{ textAlign: 'center' }}>{doctor?.doctor_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{doctor?.category_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{doctor?.mobile || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{doctor?.email || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{doctor?.createtime || '-'} </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className="pagination">
                          {filteredDoctor.length > 0
                            ? `Showing ${indexOfFirstDoctor + 1} to ${Math.min(indexOfLastDoctor, filteredDoctor.length)} of ${filteredDoctor.length} entries`
                            : 'No entries to show'}
                        </p>
                        <Stack spacing={2} alignItems="right">
                          <Pagination count={totalPages3} page={currentShops} onChange={handlePageChange} />
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Doctor Name</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Category Name</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Mobile</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Email</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={7}>
                              <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
            </>
          ) : (
            <></>
          )}
          {content == 2 ? (
            <>
              <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
                <span style={{ color: '#238BF0' }}>Dashboard</span> / Adverse List
              </Typography>
              <Card style={{ overflow: 'hidden' }}>
                <Card.Header className="bg-white ">
                  <div className="">
                    <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                      Search
                    </label>
                    <input
                      className="search-input"
                      type="text"
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      style={{
                        marginTop: '8px',
                        marginBottom: '5px',
                        padding: '5px',
                        width: '200px',
                        border: '1px solid #f2f2f2',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </Card.Header>
                <Card.Body>
                  {filteredAdverse.length > 0 ? (
                    <>
                      <div className="table-container">
                        <Table hover className="fixed-header-table">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Type</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Symptom</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medication Start Date</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Reaction Date</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAdverse.map((adverse, index) => (
                              <tr key={adverse.adverse_reaction_id}>
                                <th scope="row" style={{ textAlign: 'center' }}>
                                  {index + 1}
                                </th>

                                <td style={{ textAlign: 'center' }}>{adverse?.medicine_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.dosage || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.category_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.symptom_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.instruction || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.medication_start_date || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.reaction_date || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.createtime || '-'} </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className="pagination">
                          {filteredAdverse.length > 0
                            ? `Showing ${indexOfFirstDoctor + 1} to ${Math.min(indexOfLastDoctor, filteredAdverse.length)} of ${filteredAdverse.length} entries`
                            : 'No entries to show'}
                        </p>
                        <Stack spacing={2} alignItems="right">
                          <Pagination count={totalPages4} page={currentAdverse} onChange={handlePageChange} />
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Type</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Symptom</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Medication Start Date</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Reaction Date</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={7}>
                              <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
              {/* <Modal show={showActiveModal} onHide={() => setShowActiveModal(false)} style={{ marginTop: '107px' }}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete </Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this Post?</Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleDeletePost}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal> */}
            </>
          ) : (
            <></>
          )}
          {content == 3 ? (
            <>
              <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
                <span style={{ color: '#238BF0' }}>Dashboard</span> / Measurement Details
              </Typography>
              <Card style={{ overflow: 'hidden' }}>
                <Card.Header className="bg-white ">
                  <div className="">
                    <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                      Search
                    </label>
                    <input
                      className="search-input"
                      type="text"
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      style={{
                        marginTop: '8px',
                        marginBottom: '5px',
                        padding: '5px',
                        width: '200px',
                        border: '1px solid #f2f2f2',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </Card.Header>
                <Card.Body>
                  {measurement.length > 0 ? (
                    <>
                      <div className="table-container">
                        <Table hover className="fixed-header-table">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>BP</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Fasting Glucose</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>PPBGS</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Weight Measurement</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Tempreture Measurement</th>

                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {measurement.map((item, index) => (
                              <tr key={item.measurement_id}>
                                <th scope="row" style={{ textAlign: 'center' }}>
                                  {index + 1}
                                </th>
                                <td style={{ textAlign: 'center' }}>
                                  {item.systolic_bp && item.diastolic_bp ? `${item.systolic_bp}/${item.diastolic_bp}` : '-'}
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.fasting_glucose || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{item.ppbgs || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{item.weight || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{item.temperature || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{item.createtime || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className="pagination">
                          {measurement.length > 0
                            ? `Showing ${indexOfFirstDoctor + 1} to ${Math.min(indexOfLastDoctor, measurement.length)} of ${measurement.length} entries`
                            : 'No entries to show'}
                        </p>
                        <Stack spacing={2} alignItems="right">
                          <Pagination count={totalPages4} page={currentAdverse} onChange={handlePageChange} />
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>BP</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Fasting Glucose</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>PPBGS</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Weight Measurement</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={7}>
                              <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
            </>
          ) : (
            <></>
          )}
          {content == 4 ? (
            <>
              <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
                <span style={{ color: '#238BF0' }}>Dashboard</span> / Reports
              </Typography>
              <Card style={{ overflow: 'hidden' }}>
                <Card.Header className="bg-white ">
                  <div className="">
                    <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                      Search
                    </label>
                    <input
                      className="search-input"
                      type="text"
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      style={{
                        marginTop: '8px',
                        marginBottom: '5px',
                        padding: '5px',
                        width: '200px',
                        border: '1px solid #f2f2f2',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </Card.Header>
                <Card.Body>
                  {filteredReports.length > 0 ? (
                    <>
                      <div className="table-container">
                        <Table hover className="fixed-header-table">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Category Name</th>

                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredReports.map((adverse, index) => (
                              <tr key={adverse.adverse_reaction_id}>
                                <th scope="row" style={{ textAlign: 'center' }}>
                                  {index + 1}
                                </th>

                                <td style={{ textAlign: 'center' }}>
                                  <div className="dropdown text-center">
                                    <button
                                      className="btn btn-primary dropdown-toggle action-btn"
                                      type="button"
                                      id={`dropdownMenuButton${adverse.user_id}`}
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      Action
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${adverse.user_id}`}>
                                      <li key="view">
                                        <a
                                          href={
                                            adverse.file
                                              ? `${IMAGE_PATH}${adverse.file}?${new Date().getTime()}`
                                              : `${IMAGE_PATH}placeholder.jpg`
                                          }
                                          className="dropdown-item"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <VisibilityIcon style={{ marginRight: '8px' }} /> View
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>{adverse?.category_name || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{adverse?.updatetime || '-'} </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className="pagination">
                          {filteredReports.length > 0
                            ? `Showing ${indexOfFirstDoctor + 1} to ${Math.min(indexOfLastDoctor, filteredReports.length)} of ${filteredReports.length} entries`
                            : 'No entries to show'}
                        </p>
                        <Stack spacing={2} alignItems="right">
                          <Pagination count={totalReports} page={currentReports} onChange={handlePageChange} />
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Category Name</th>

                            <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={7}>
                              <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
            </>
          ) : (
            <></>
          )}
          {/* //======================================  */}
          {content == 5 ? (
            <>
              {' '}
              <Card>
                {/* view Document details end  */}
                <Card.Header className=" bg-white">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                        Search
                      </label>
                      <input
                        className="search-input"
                        type="text"
                        onChange={handleSearch}
                        placeholder="Search..."
                        style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
                      />
                    </div>
                  </div>
                </Card.Header>
                {
                  <Card.Body>
                    {currentComplianceData.length > 0 ? (
                      <>
                        <div className="table-container">
                          <Table hover className="fixed-header-table">
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Date</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Pause Status</th>
                                <th style={{ textAlign: 'center', fontWeight: '500', width: '100px' }}>Status</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Taken Date & Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {' '}
                              {currentComplianceData.map((user, index) => (
                                <tr key={user.user_id}>
                                  <th scope="row" style={{ textAlign: 'center' }}>
                                    {index + 1}
                                  </th>
                                  <td style={{ textAlign: 'center' }}>{user?.medicine_name}</td>
                                  {/* <td style={{ textAlign: 'center' }}>{user?.description}</td> */}
                                  <td style={{ textAlign: 'center' }}>{user?.instruction || '-'}</td>
                                  <td
                                    style={{
                                      textAlign: 'center',
                                      // fontWeight: '500',
                                      maxWidth: '250px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                    title={user?.dosage}
                                  >
                                    {user?.dosage}
                                  </td>

                                  <td style={{ textAlign: 'center' }}>{user?.schedule || '-'}</td>
                                  <td style={{ textAlign: 'center' }}>{user?.schedule_date || '-'}</td>
                                  <td>
                                    <div
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor:
                                          user?.pause_status === 1 ? '#f8d7da' : user?.pause_status === 0 ? '#d4edda' : 'transparent',
                                        color: user?.pause_status === 1 ? '#721c24' : user?.pause_status === 0 ? '#155724' : '#000',
                                        fontWeight: 'bold',
                                        borderRadius: '35px'
                                      }}
                                    >
                                      {user?.pause_status === 1 ? 'Pause' : '-'}
                                    </div>
                                  </td>

                                  <td>
                                    <div
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor:
                                          user?.taken_status === 0 ? '#f8d7da' : user?.taken_status === 1 ? '#d4edda' : 'transparent',
                                        color: user?.taken_status === 0 ? '#721c24' : user?.taken_status === 1 ? '#155724' : '#000',
                                        fontWeight: 'bold',
                                        borderRadius: '35px'
                                      }}
                                    >
                                      {user?.taken_status === 0 ? 'Not taken' : user?.taken_status === 1 ? 'Taken' : '-'}
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{user?.time || '-'} </td>
                                  <td style={{ textAlign: 'center' }}>{user?.updatetime || '-'} </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p style={{ fontWeight: '500' }} className="pagination">
                            {currantSalesmanData.length > 0
                              ? `Showing ${indexOfFirstUser1 + 1} to ${Math.min(indexOfLastUser1, currantSalesmanData.length)} of ${currantSalesmanData.length} entries`
                              : 'No entries to show'}
                          </p>
                          <Stack spacing={2} alignItems="right">
                            <Pagination count={totalPages1} page={currentPage} onChange={handlePageChange} />
                          </Stack>
                        </div>
                      </>
                    ) : (
                      <>
                        <Table>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                              {/* <th style={{ textAlign: 'center', fontWeight: '500' }}>Description</th> */}
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Date</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
                              {/* <th style={{ textAlign: 'center', fontWeight: '500' }}>Current Quantity</th> */}
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Taken Date & Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <td colSpan="9" style={{ marginTop: '5px', borderBottom: '1px solid #e9ecef' }}>
                              <p style={{ textAlign: 'center', marginBottom: '0px' }}> No Data Found</p>
                            </td>
                          </tbody>
                        </Table>
                      </>
                    )}
                  </Card.Body>
                }
              </Card>
            </>
          ) : (
            <></>
          )}

          {content == 6 ? (
            <>
              {' '}
              <Card>
                {/* view Document details end  */}
                <Card.Header className=" bg-white">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                        Search
                      </label>
                      <input
                        className="search-input"
                        type="text"
                        onChange={handleSearch}
                        placeholder="Search..."
                        style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
                      />
                    </div>
                  </div>
                </Card.Header>
                {
                  <Card.Body>
                    {currentfilterMedicine.length > 0 ? (
                      <>
                        <div className="table-container">
                          <Table hover className="fixed-header-table">
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                                <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {' '}
                              {currentfilterMedicine.map((user, index) => (
                                <tr key={user.medicine_id}>
                                  <th scope="row" style={{ textAlign: 'center' }}>
                                    {index + 1}
                                  </th>
                                  <td style={{ textAlign: 'center' }}>{user?.medicine_name}</td>
                                  <td style={{ textAlign: 'center' }}>{user?.createtime || '-'} </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p style={{ fontWeight: '500' }} className="pagination">
                            {currentfilterMedicine.length > 0
                              ? `Showing ${indexOfFirstUser6 + 1} to ${Math.min(indexOfLastUser6, currentfilterMedicine.length)} of ${currentfilterMedicine.length} entries`
                              : 'No entries to show'}
                          </p>
                          <Stack spacing={2} alignItems="right">
                            <Pagination count={totalPages1} page={currentPage} onChange={handlePageChange} />
                          </Stack>
                        </div>
                      </>
                    ) : (
                      <>
                        <Table>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                              <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <td colSpan="6" style={{ marginTop: '5px', borderBottom: '1px solid #e9ecef' }}>
                              <p style={{ textAlign: 'center', marginBottom: '0px' }}> No Data Found</p>
                            </td>
                          </tbody>
                        </Table>
                      </>
                    )}
                  </Card.Body>
                }
              </Card>
            </>
          ) : (
            <></>
          )}

          {/* //===================  */}
        </>
      )}
    </>
  );
}

export default ViewUser;
