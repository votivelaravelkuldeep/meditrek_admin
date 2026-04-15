import { Row, Col, Form, Button } from 'react-bootstrap';
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

function MeasurementReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [measurements, setMeasurementData] = useState([]);
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  const [from_date_error, setFromDateError] = useState('');
  const [to_date_error, setToDateError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  // const itemsPerPage = 10;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMeasurements = measurements.filter((measurement) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    return (
      measurement.patient_name?.toLowerCase().includes(lowercasedTerm) ||
      measurement.systolic_bp?.toString().includes(lowercasedTerm) ||
      measurement.diastolic_bp?.toString().includes(lowercasedTerm) ||
      measurement.type?.toString().includes(lowercasedTerm)
    );
  });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredMeasurements.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredMeasurements.length / itemsPerPage);

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

    if (hasError) return;

    axios
      .get(`${API_URL}get_measurement_tabular?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.measurement_arr)) {
          setMeasurementData(response.data.measurement_arr);
        } else {
          setMeasurementData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching measurement data:', error);
        setMeasurementData([]);
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      measurements.map((measurement, index) => ({
        'S. No.': index + 1,
        // 'Patient Name': measurement.patient_name,
        Type: measurement.type === 0 ? 'Blood Pressure' : measurement.type === 1 ? 'Glucose' : 'Weight',
        'Systolic BP': measurement.systolic_bp,
        'Diastolic BP': measurement.diastolic_bp,
        Pulse: measurement.pulse,
        Weight: measurement.weight,
        'Fasting Glucose': measurement.fasting_glucose,
        Temperature: measurement.temperature,
        PPBGS: measurement.ppbgs,
        Date: measurement.date,
        Time: measurement.time,
        Symptom: measurement.symptom,
        Range: measurement.symptom_range,
        'Created Date': measurement.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MeasurementReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MeasurementReport.xlsx');
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    // { label: 'Patient Name', key: 'patient_name', sortable: true },

    {
      label: 'Type',
      key: 'type',
      render: (m) => (m.type === 0 ? 'Blood Pressure' : m.type === 1 ? 'Glucose' : 'Weight')
    },

    { label: 'Systolic BP', key: 'systolic_bp' },
    { label: 'Diastolic BP', key: 'diastolic_bp' },
    { label: 'Pulse', key: 'pulse' },

    {
      label: 'Weight',
      key: 'weight',
      render: (m) => (m.weight ? `${m.weight} KG` : '-')
    },

    {
      label: 'Fasting Glucose',
      key: 'fasting_glucose',
      render: (m) => (m.fasting_glucose ? `${m.fasting_glucose} mg/dl` : '-')
    },

    {
      label: 'PPBGS',
      key: 'ppbgs',
      render: (m) => (m.ppbgs ? `${m.ppbgs} mg/dl` : '-')
    },

    {
      label: 'Temperature',
      key: 'temperature',
      render: (m) => (m.temperature ? `${m.temperature}°C` : '-')
    },

    { label: 'Symptom', key: 'symptom' },
    { label: 'Range', key: 'symptom_range' },
    { label: 'Date', key: 'date' },
    { label: 'Time', key: 'time' }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#1DDEC4' }}>Dashboard</span>
                </Link> / Measurement Report
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
          Measurement Report
        </h5>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={3}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>From Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setFromDateError('');
                  }}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <p style={{ color: 'red', fontSize: '12px' }}>{from_date_error}</p>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '13px', fontWeight: 500 }}>To Date</Form.Label>
                <Form.Control
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (!from_date) {
                      setToDateError('Please Select From Date first');
                    } else {
                      setToDate(e.target.value);
                      setToDateError('');
                    }
                  }}
                  className="custom-input custom-search"
                  style={{ fontSize: '13px' }}
                />
                <p style={{ color: 'red', fontSize: '12px' }}>{to_date_error}</p>
              </Form.Group>
            </Col>
            <Col sm={2} className="d-flex align-items-center justify-content-start" style={{ marginTop: '15px' }}>
              <Button type="submit" variant="primary" style={{ fontSize: '12px' }}>
                View
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* {measurements.length > 0 && (
        <div className="mb-3 text-end">
          <Button variant="success" onClick={exportToExcel} style={{ backgroundColor: '#1DDEC4', border: 'none' }}>
            Export to Excel
          </Button>
        </div>
      )} */}

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
            Measurement List
          </h5>

          <div className="d-flex gap-2">
            <input
              className="custom-search form-control"
              style={{ width: '250px', fontSize: '13px' }}
              placeholder="Search..."
              onChange={handleSearch}
            />

            {/* {measurements.length > 0 && (
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

            {measurements.length > 0 && (
                <Button variant="success" onClick={exportToExcel} style={{ fontSize: '12px', backgroundColor: '#1DDEC4', border: 'none' }}>
                  <ImportExportIcon style={{ fontSize: '16px' }} />
                  Export to Excel
                </Button>
            
            )}
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
            data={filteredMeasurements}
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
    </>
  );
}

export default MeasurementReport;
