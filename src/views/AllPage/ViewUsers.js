import { Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';
import { FadeLoader } from 'react-spinners';
import CustomTable from 'component/common/CustomTable';
import { useState } from 'react';
// import Heading from 'component/common/Heading';

function ViewUser() {
  const [user_data, setUserDetails] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [enlargedImage, setEnlargedImage] = React.useState(null);
  const [showImagePopup, setShowImagePopup] = React.useState(false);
  const [content, setContent] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQueryGroup, setSearchQuerygroup] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [doctor_data, setDoctordata] = React.useState([]);
  const [adverse_data, setAdversedata] = React.useState([]);
  //   const [report, setReport] = React.useState([]);
  const [medication, setMedication] = React.useState([]);
  const [complianceData, setComplianceData] = React.useState([]);
  const [userMedicine, setUserMedicine] = React.useState([]);
  const [measurement, setMeasurement] = React.useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const usersPerPage = 50;
  const { user_id } = useParams();
  var navigate = useNavigate();
  var token = sessionStorage.getItem('token');

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) {
        return { key, direction: 'asc' };
      }
      return {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  //   const contentTypes = {
  //     Salesman: 0,
  //     doctor_list: 1,
  //     adverse_list: 2,
  //     measurement: 3,
  //     report: 4,
  //     compliance: 5,
  //     user_medicine: 6
  //   };

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_user_data/${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
          setLoading(false);
        }
        if (response.data.success) {
          setUserDetails(response.data.res[0]);
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
      .get(`${API_URL}fetchdoctorby_user/${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setDoctordata(response.data.doctor_arr);
        } else {
          console.error('Error fetching doctor details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}fetchadverseof_user/${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setAdversedata(response.data.adverse_arr);
        } else {
          console.error('Error fetching adverse details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching adverse details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_measurements?user_id=${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setMeasurement(response.data.measurements || []);
        } else {
          console.error('Error fetching measurement details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching measurement details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_reports?user_id=${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != 'NA') {
            setReport(response.data.list || []);
          }
        } else {
          console.error('Error fetching reports:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_medication?user_id=${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != 'NA') {
            setMedication(response.data.list || []);
          }
        } else {
          console.error('Error fetching medication:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}view_compliance?user_id=${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != 'NA') {
            setComplianceData(response.data.list || []);
          }
        } else {
          console.error('Error fetching compliance:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching compliance:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_user_medicine?user_id=${user_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != 'NA') {
            setUserMedicine(response.data.result || []);
          }
        } else {
          console.error('Error fetching user medicine:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching user medicine:', error);
      });
  }, [user_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
  };
  const [searchQuery, setSearchQuery] = React.useState('');
  const handleSearch = (event) => setSearchQuery(event.target.value);
  const handleSearchgroup = (event) => setSearchQuerygroup(event.target.value);
  //   const handlePageChange = (event, value) => setCurrentPage(value);

  // --- Filter logic (unchanged) ---
  const filterSalesmanData = medication?.filter((user) => {
    const t = searchQuery.toLowerCase();
    return ['medicine_name', 'description', 'instruction', 'updatetime', 'dosage', 'current_quantity', 'reminder_time'].some(
      (k) => user[k] && String(user[k]).toLowerCase().includes(t)
    );
  });
  const filterComplianceData = complianceData?.filter((user) => {
    const t = searchQuery.toLowerCase();
    return ['medicine_name', 'description', 'instruction', 'updatetime', 'dosage', 'current_quantity', 'reminder_time'].some(
      (k) => user[k] && String(user[k]).toLowerCase().includes(t)
    );
  });

  const indexOfLastUser1 = currentPage * usersPerPage;
  const indexOfFirstUser1 = indexOfLastUser1 - usersPerPage;
  //   const currantSalesmanData = filterSalesmanData.slice(indexOfFirstUser1, indexOfLastUser1);
  //   const totalPages1 = Math.ceil(filterSalesmanData.length / usersPerPage);

  const indexOfLastUser5 = currentPage * usersPerPage;
  const indexOfFirstUser5 = indexOfLastUser5 - usersPerPage;
  //   const currentComplianceData = filterComplianceData.slice(indexOfFirstUser5, indexOfLastUser5);

  const filteredDoctor = doctor_data.filter((doctor) => {
    const t = searchQueryGroup.toLowerCase();
    return ['doctor_name', 'mobile', 'category_name', 'email', 'createtime'].some(
      (k) => doctor[k] && String(doctor[k]).toLowerCase().includes(t)
    );
  });
  const indexOfLastDoctor = currentPage * usersPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - usersPerPage;
  //   const currentShops = filteredDoctor.slice(indexOfFirstDoctor, indexOfLastDoctor);
  //   const totalPages3 = Math.ceil(filteredDoctor.length / usersPerPage);

  const filteredAdverse = adverse_data.filter((adverse) => {
    const t = searchQueryGroup.toLowerCase();
    return ['medicine_name', 'category_name', 'symptom_name', 'instruction', 'reaction_date', 'createtime'].some(
      (k) => adverse[k] && String(adverse[k]).toLowerCase().includes(t)
    );
  });
  const indexOfLastAdverse = currentPage * usersPerPage;
  const indexOfFirstAdverse = indexOfLastAdverse - usersPerPage;
  //   const currentAdverse = filteredAdverse.slice(indexOfFirstAdverse, indexOfLastAdverse);
  //   const totalPages4 = Math.ceil(filteredAdverse.length / usersPerPage);

  //   const filteredReports = report?.filter((item) => {
  //     const t = searchQueryGroup.toLowerCase();
  //     return ['medicine_name','category_name','createtime'].some(k => item[k] && String(item[k]).toLowerCase().includes(t));
  //   });
  //   const indexOfLastReports = currentPage * usersPerPage;
  //   const indexOfFirstReports = indexOfLastReports - usersPerPage;
  // //   const currentReports = filteredReports.slice(indexOfFirstReports, indexOfLastReports);
  //   const totalReports = Math.ceil(filteredReports.length / usersPerPage);

  const filteruserMedicine = userMedicine?.filter((user) => {
    const t = searchQuery.toLowerCase();
    return ['medicine_name', 'createtime'].some((k) => user[k] && String(user[k]).toLowerCase().includes(t));
  });
  const indexOfLastUser6 = currentPage * usersPerPage;
  const indexOfFirstUser6 = indexOfLastUser6 - usersPerPage;
  //   const currentfilterMedicine = filteruserMedicine.slice(indexOfFirstUser6, indexOfLastUser6);

  // --- Helpers ---
  //   const getGenderLabel = (gender) => {
  //     const map = { Male: 'Male', Female: 'Female', Other: 'Other' };
  //     return user_data?.gender_lable || '-';
  //   };

  const getDiseaseNames = (rawString) => {
    if (!rawString) return '-';
    const matches = [...rawString.matchAll(/name:\s*([\w\s]+)/g)];
    const names = matches.map((m) => m[1].trim());
    return names.length > 0 ? names.join(', ') : '-';
  };

  // --- Shared search bar style ---
  //   const searchStyle = {
  //     padding: '6px 12px',
  //     fontSize: '13px',
  //     border: '1px solid #e5e7eb',
  //     borderRadius: '8px',
  //     outline: 'none',
  //     width: '220px'
  //   };

  // --- Tab definitions ---
  const tabs = [
    { label: 'Medication', value: 0 },
    { label: 'Doctor List', value: 1 },
    { label: 'Report Health', value: 2 },
    { label: 'Measurement', value: 3 },
    { label: 'Compliance', value: 5 },
    { label: 'Medicine List', value: 6 }
  ];

  // --- Empty table renderer ---
  //   const EmptyRow = ({ cols }) => (
  //     <tr>
  //       <td colSpan={cols} style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>
  //         No Data Found
  //       </td>
  //     </tr>
  //   );

  const medicationColumns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => indexOfFirstUser1 + index + 1
    },
    { label: 'Medicine Name', sortable: true, key: 'medicine_name' },
    { label: 'Added By', sortable: true, key: 'added_by' },
    { label: 'Instruction', sortable: true, key: 'instruction' },
    { label: 'Dosage', sortable: true, key: 'dosage' },
    { label: 'Schedule', sortable: true, key: 'schedule' },
    { label: 'Date', sortable: true, key: 'schedule_date' },
    {
      label: 'Pause Status',
      sortable: true,
      key: 'pause_status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 600,
            background: row.pause_status === 1 ? '#fee2e2' : '#dcfce7',
            color: row.pause_status === 1 ? '#dc2626' : '#16a34a',
            whiteSpace: 'nowrap'
          }}
        >
          {row.pause_status === 1 ? 'Paused' : 'Active'}
        </span>
      )
    },
    {
      label: 'Status',
      sortable: true,
      key: 'taken_status',
      render: (row) => (
        <span
          style={{
            padding: '2px 6px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 600,
            background: row.taken_status === 1 ? '#dcfce7' : '#fee2e2',
            color: row.taken_status === 1 ? '#16a34a' : '#dc2626',
            whiteSpace: 'nowrap'
          }}
        >
          {row.taken_status === 1 ? 'Taken' : 'Not Taken'}
        </span>
      )
    },
    { label: 'Reminder Time', sortable: true, key: 'time' },
    { label: 'Create Date & Time', sortable: true, key: 'updatetime' }
  ];

  const doctorColumns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, i) => indexOfFirstDoctor + i + 1
    },
    {
      label: 'Image',
      sortable: true,
      key: 'image',
      render: (row) => (
        <img
          src={row.image ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholder.jpg`}
          alt=""
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      )
    }
  ];

  const adverseColumns = [
    { label: 'S. No', key: 'sr_no', render: (_, i) => indexOfFirstAdverse + i + 1 },
    { label: 'Medicine', sortable: true, key: 'medicine_name' },
    { label: 'Dosage', sortable: true, key: 'dosage' },
    { label: 'Medicine Type', sortable: true, key: 'category_name' },
    { label: 'Symptom', key: 'symptom_name' },
    { label: 'Instruction', sortable: true, key: 'instruction' },
    { label: 'Start Date', sortable: true, key: 'medication_start_date' },
    { label: 'Reaction Date', sortable: true, key: 'reaction_date' },
    { label: 'Create Time', sortable: true, key: 'createtime' }
  ];

  const measurementColumns = [
    { label: 'S. No', key: 'sr_no', render: (_, i) => i + 1 },
    {
      label: 'BP',
      sortable: true,
      key: 'bp',
      render: (row) => (row.systolic_bp && row.diastolic_bp ? `${row.systolic_bp}/${row.diastolic_bp}` : '-')
    },
    { label: 'Fasting', sortable: true, key: 'fasting_glucose' },
    { label: 'PPBGS', sortable: true, key: 'ppbgs' },
    { label: 'Weight', sortable: true, key: 'weight' },
    { label: 'Temp', sortable: true, key: 'temperature' },
    { label: 'Create Time', sortable: true, key: 'createtime' }
  ];

  const complianceColumns = [
    { label: 'S. No', key: 'sr_no', render: (_, i) => indexOfFirstUser5 + i + 1 },
    { label: 'Medicine Name', sortable: true, key: 'medicine_name' },
    { label: 'Instruction', sortable: true, key: 'instruction' },
    { label: 'Dosage', sortable: true, key: 'dosage' },
    { label: 'Schedule', sortable: true, key: 'schedule' },
    { label: 'Date', sortable: true, key: 'schedule_date' },
    {
      label: 'Status',
      sortable: true,
      key: 'taken_status',
      render: (row) => (
        <span
          style={{
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            background: row.taken_status === 1 ? '#dcfce7' : '#fee2e2',
            color: row.taken_status === 1 ? '#16a34a' : '#dc2626'
          }}
        >
          {row.taken_status === 1 ? 'Taken' : 'Not Taken'}
        </span>
      )
    },
    { label: 'Reminder Time', sortable: true, key: 'time' },
    { label: 'Create Time', sortable: true, key: 'updatetime' }
  ];

  const medicineListColumns = [
    { label: 'S. No', key: 'sr_no', render: (_, i) => indexOfFirstUser6 + i + 1 },
    { label: 'Medicine Name', sortable: true, key: 'medicine_name' },
    { label: 'Create Time', sortable: true, key: 'createtime' }
  ];

  return (
    <>
      {loading ? (
        <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
          <FadeLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
            <span style={{ color: '#238BF0' }}>Dashboard</span> / View User
          </Typography> */}

          {/* ── Profile Card (ViewPatient style) ── */}
          <Card className="border-0 shadow-lg rounded-4 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-4">
                {/* Avatar */}
                <div
                  onClick={handleShow}
                  onKeyDown={(e) => e.key === 'Enter' && handleShow()}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer', flexShrink: 0 }}
                >
                  <img
                    src={user_data?.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.jpg`}
                    alt="User"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #1ddec4'
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1">{user_data.name || '-'}</h5>

                  <div className="d-flex gap-3 flex-wrap">
                    {user_data?.email && (
                      <small className="text-muted">
                        Email ID:{' '}
                        <a href={`mailto:${user_data.email}`} style={{ color: '#1ddec4', textDecoration: 'underline' }}>
                          {user_data.email}
                        </a>
                      </small>
                    )}
                    <small className="text-muted">
                      Mobile: {user_data?.phone_code ? `+${user_data.phone_code} ` : ''}
                      {user_data?.mobile || '-'}
                    </small>
                    {user_data?.dob && <small className="text-muted">DOB: {user_data.dob}</small>}
                  </div>

                  {/* Inline stats row */}
                  <div className="d-flex gap-4 mt-3 flex-wrap">
                    {[
                      { label: 'Age', value: user_data?.age ? `${user_data.age} yrs` : '-' },
                      { label: 'Height', value: user_data?.height ? `${user_data.height} cm` : '-' },
                      { label: 'Weight', value: user_data?.weight ? `${user_data.weight} kg` : '-' },
                      { label: 'Sex', value: user_data?.gender_lable || '-' },
                      { label: 'Diseases', value: getDiseaseNames(user_data?.diseaseName) },
                      { label: 'Created', value: user_data?.createtime || '-' }
                    ].map((item, i) => (
                      <div key={i}>
                        <small className="text-muted d-block">{item.label}</small>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: user_data.delete_flag === 1 ? '#fee2e2' : user_data.active_flag === 1 ? '#e6f9f6' : '#fee2e2',
                      color: user_data.delete_flag === 1 ? '#dc2626' : user_data.active_flag === 1 ? '#1ddec4' : '#dc2626',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                  >
                    {user_data.delete_flag === 1 ? 'Deleted' : user_data.active_flag === 1 ? 'Active' : 'Deactive'}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Image enlarged overlay (unchanged logic) */}
          {showImagePopup && (
            <div
              className="enlarged-image-overlay"
              onClick={handleCloseImage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
              }}
            >
              <span
                className="close-button"
                onClick={handleCloseImage}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
                }}
              >
                &times;
              </span>
              <img
                src={enlargedImage}
                alt="Enlarged view"
                className="enlarged-image"
                style={{ width: '20rem', height: '20rem', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Image modal (unchanged) */}
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

          {/* ── Tabs (ViewPatient pill style) ── */}
          <div className="d-flex gap-2 flex-wrap mb-3">
            {tabs.map((tab) => {
              const active = content === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setContent(tab.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    borderRadius: '999px',
                    padding: '6px 18px',
                    fontSize: '13px',
                    background: active ? '#1ddec4' : '#eef2f7',
                    color: active ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: active ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab Content Card (ViewPatient style) ── */}
          <Card className="border-0 shadow-lg rounded-4">
            <Card.Body className="p-0">
              {/* ── Medication (content == 0) ── */}
              {content === 0 && (
                <div className="p-3">
                  <div className="mb-3 d-flex justify-content-end w-100">
                    <input
                      type="text"
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={medicationColumns}
                    data={filterSalesmanData}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* ── Doctor List (content == 1) ── */}
              {content === 1 && (
                <div className="p-3">
                  <div className="mb-3 d-flex justify-content-end w-100">
                    <input
                      type="text"
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={doctorColumns}
                    data={filteredDoctor}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* ── Report Health / Adverse (content == 2) ── */}
              {content === 2 && (
                <div className="p-3">
                  <div className="mb-3 d-flex justify-content-end">
                    <input
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={adverseColumns}
                    data={filteredAdverse}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* ── Measurement (content == 3) ── */}
              {content === 3 && (
                <div className="p-3">
                  <div className="mb-3 d-flex justify-content-end">
                    <input
                      onChange={handleSearchgroup}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={measurementColumns}
                    data={measurement}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* ── Compliance (content == 5) ── */}
              {content === 5 && (
                <div className="p-3">
                  <div className="mb-3 d-flex justify-content-end">
                    <input
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={complianceColumns}
                    data={filterComplianceData}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* ── Medicine List (content == 6) ── */}
              {content === 6 && (
                <div className="p-3 ">
                  <div className="d-flex justify-content-end mb-3">
                    <input
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="custom-search form-control"
                      style={{ width: '250px', fontSize: '13px' }}
                    />
                  </div>

                  <CustomTable
                    columns={medicineListColumns}
                    data={filteruserMedicine}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => {
                      setRowsPerPage(size);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}

export default ViewUser;
