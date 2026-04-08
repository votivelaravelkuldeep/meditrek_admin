import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
// import Typography from '@mui/material/Typography';
// import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/constant';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomTable from 'component/common/CustomTable';
import ImportExportIcon from '@mui/icons-material/ImportExport';

function MedicationReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [medications, setMedicationData] = useState([]);
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  const [from_date_error, setFromDateError] = React.useState('');
  const [to_date_error, setToDateError] = React.useState('');
  const [medicationPageCount, setMedicationPageCount] = useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
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

  //   const usersPerPage = 10;

  const handleViewClick = (medication) => {
    setSelectedMedication(medication);
    setShowModal(true);
  };

  console.log(medicationPageCount);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMedications = medications.filter((med) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const nameMatch = med.medicine_name?.toLowerCase().includes(lowercasedTerm);
    const dosageMatch = med.dosage?.toString().includes(lowercasedTerm);
    const instructionMatch = med.instruction?.toLowerCase().includes(lowercasedTerm);
    const statusMatch = lowercasedTerm === 'active' ? med.status === 1 : lowercasedTerm === 'inactive' ? med.status === 0 : false;

    return nameMatch || dosageMatch || instructionMatch || statusMatch;
  });

  //   const indexOfLastMed = currentPage * usersPerPage;
  //   const indexOfFirstMed = indexOfLastMed - usersPerPage;
  //   const currentMeds = filteredMedications.slice(indexOfFirstMed, indexOfLastMed);
  //   const totalPages = Math.ceil(filteredMedications.length / usersPerPage);

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!from_date) {
      setFromDateError('Please Enter From Date.');
      hasError = true;
    } else {
      setFromDateError('');
    }

    if (!to_date) {
      setToDateError('Please Enter To Date');
      hasError = true;
    } else if (to_date < from_date) {
      setToDateError('To Date Must Be Greater Than from date');
      hasError = true;
    } else {
      setToDateError('');
    }

    if (hasError) {
      return;
    }

    axios
      .get(`${API_URL}get_medication_tabular?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.medication_arr)) {
          setMedicationData(response.data.medication_arr);
          setMedicationPageCount(response.data.medication_arr.length);
        } else {
          setMedicationData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication data:', error);
        setMedicationData([]);
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      medications.map((med, index) => ({
        'S. No.': index + 1,
        'Medicine Name': med.medicine_name,
        'Patient Name': med.patient_name,
        Dosage: med.dosage,
        Type: med.type_label,
        Schedule: med.schedule_label,
        Instruction: med.instruction,
        'Reminder Time': med.reminder_time,
        'Pause Status': med.pause_status_label,
        Status: med.taken_status_label,
        'Medicine Late Taken': med.not_taken_count || 'N/A',
        'Not Taken': med.not_taken_count || 'N/A',
        'On Time Taken': med.ontime_count || 'N/A',
        'Create Date & Time': med.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UsermedicationReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MedicationReport.xlsx');
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Action',
      key: 'action',
      render: (med) => (
        <div className="text-center">
          <Button
            size="sm"
            onClick={() => handleViewClick(med)}
            style={{
              background: 'rgba(29, 222, 196, 0.13)',
              color: '#1ddec4',
              border: '1px solid rgba(29, 222, 196, 0.25)',
              padding: '2px 8px'
            }}
          >
            View
          </Button>
        </div>
      )
    },

    { label: 'Name', key: 'patient_name', sortable: true },
    { label: 'Medicine Name', key: 'medicine_name', sortable: true },
    { label: 'Dosage', key: 'dosage', sortable: true },

    {
      label: 'Type',
      key: 'type',
      render: (med) => (med.type == 1 ? 'Pill' : 'Syrup')
    },

    {
      label: 'Schedule',
      key: 'schedule',
      render: (med) => (med.schedule == 0 ? 'Daily' : med.schedule == 1 ? 'Weekly' : 'Monthly')
    },

    { label: 'Instruction', key: 'instruction' },
    { label: 'Reminder Time', key: 'reminder_time' },

    {
      label: 'Pause Status',
      key: 'pause_status',
      render: (med) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: med.pause_status === 1 ? '#fee2e2' : '#dcfce7',
            color: med.pause_status === 1 ? '#dc2626' : '#16a34a',
            fontWeight: 600
          }}
        >
          {med.pause_status === 1 ? 'Pause' : 'Resume'}
        </span>
      )
    },

    {
      label: 'Status',
      key: 'taken_status',
      render: (med) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            background: med.taken_status === 0 ? '#fee2e2' : '#dcfce7',
            color: med.taken_status === 0 ? '#dc2626' : '#16a34a',
            fontWeight: 600
          }}
        >
          {med.taken_status === 0 ? 'Not Taken' : 'Taken'}
        </span>
      )
    },

    {
      label: 'Created At',
      key: 'createtime',
      sortable: true,
      render: (med) => <span style={{ whiteSpace: 'nowrap' }}>{med.createtime}</span>
    }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <span style={{ color: '#0ccfb5' }}>Dashboard</span>
        </Link>{' '}
        / User Medication Report
      </Typography> */}
      <div
        className="mb-4"
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          padding: '16px'
        }}
      >
        <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
          User Medication Report
        </h5>
        <Form onSubmit={handleSubmit}>
          <div className="mt-3">
            <Form.Group style={{ display: 'flex', alignItems: 'center' }} as={Row}>
              <Col sm={3}>
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>From Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Subject"
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setFromDateError('');
                    setToDateError('');
                  }}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <p style={{ color: 'red', fontSize: '12px' }}>{from_date_error}</p>
              </Col>
              <Col sm={3}>
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>To Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Subject"
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (!from_date) {
                      setToDateError('Please Select From Date first');
                    } else {
                      setToDate(e.target.value);
                      setFromDateError('');
                      setToDateError('');
                    }
                  }}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <p style={{ color: 'red', fontSize: '12px' }}>{to_date_error}</p>
              </Col>
              <Col sm={2} style={{ marginTop: '15px' }}>
                <Button variant="primary" type="submit" style={{ fontSize: '12px', height: 'fit-content' }}>
                  View
                </Button>
              </Col>
            </Form.Group>
          </div>
        </Form>
      </div>

      {/* <div>
        {medications.length > 0 && (
          <div>
            <Button
              variant="success"
              onClick={exportToExcel}
              className="mb-3 btn-sm pull-right"
              style={{ backgroundColor: '#0ccfb5', border: 'none' }}
            >
              Export to Excel
            </Button>
          </div>
        )}
      </div> */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          padding: '16px'
        }}
      >
        <div className="d-flex justify-content-between flex-wrap">
          <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
            User Medication List
          </h5>

          <div className="d-flex gap-2">
            <input
              className="custom-search form-control"
              style={{ width: '250px', fontSize: '13px' }}
              placeholder="Search..."
              onChange={handleSearch}
            />

            {/* {medications.length > 0 && (
              <Button
                onClick={exportToExcel}
                style={{
                  fontSize: '12px',
                  background: '#1ddec4',
                  border: 'none'
                }}
              >
                <ImportExportIcon style={{ fontSize: '16px' }} />
                Export
              </Button>
            )} */}
            <div>
              {medications.length > 0 && (
                <div>
                  <Button
                    variant="success"
                    onClick={exportToExcel}
                    className="mb-3 btn-sm pull-right"
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    <ImportExportIcon style={{ fontSize: '16px' }} />
                    Export to Excel
                  </Button>
                </div>
              )}
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
            data={filteredMedications}
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

      {/* View Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" style={{ marginTop: '50px' }}>
        <Modal.Header closeButton>
          <Modal.Title>User Medication Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedication && (
            <div className="container-fluid">
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <strong>Medicine Name:</strong> {selectedMedication.medicine_name}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Type:</strong> {selectedMedication.type == 1 ? 'Pill' : 'Syrup'}
                  </p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <p>
                    <strong>Medicine Late Taken:</strong> {selectedMedication.late_count || '0'}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>Not Taken:</strong> {selectedMedication.not_taken_count || '0'}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>On Time Taken:</strong> {selectedMedication.ontime_count || '0'}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MedicationReport;
