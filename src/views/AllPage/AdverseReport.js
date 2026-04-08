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

function AdverseReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [adverseReactions, setAdverseReactionData] = useState([]);
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

  //   const itemsPerPage = 10;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredReactions = adverseReactions.filter((reaction) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    return (
      reaction.patient_name?.toLowerCase().includes(lowercasedTerm) ||
      reaction.medicine_name?.toLowerCase().includes(lowercasedTerm) ||
      reaction.symptom_name?.toLowerCase().includes(lowercasedTerm) ||
      reaction.instruction?.toLowerCase().includes(lowercasedTerm)
    );
  });

  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = filteredReactions.slice(indexOfFirstItem, indexOfLastItem);
  //   const totalPages = Math.ceil(filteredReactions.length / itemsPerPage);

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
      .get(`${API_URL}get_adverse_tabular?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.adverse_arr)) {
          setAdverseReactionData(response.data.adverse_arr);
        } else {
          setAdverseReactionData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching adverse reaction data:', error);
        setAdverseReactionData([]);
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      adverseReactions.map((reaction, index) => ({
        'S. No.': index + 1,
        'Patient Name': reaction.patient_name,
        'Medicine Name': reaction.medicine_name,
        Dosage: reaction.dosage,
        'Medicine Category': reaction.medicine_category,
        Symptom: reaction.symptom_name,
        'Medication Start Date': reaction.medication_start_date,
        'Reaction Date': reaction.reaction_date,
        Instruction: reaction.instruction,
        'Created Date': reaction.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AdverseReactionReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'AdverseReactionReport.xlsx');
  };

  const columns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    { label: 'Patient Name', key: 'patient_name', sortable: true },
    { label: 'Medicine Name', key: 'medicine_name', sortable: true },
    { label: 'Dosage', key: 'dosage', sortable: true },
    { label: 'Medicine Category', key: 'medicine_category', sortable: true },
    { label: 'Symptom', key: 'symptom_name', sortable: true },
    { label: 'Medication Start Date', key: 'medication_start_date' },
    { label: 'Reaction Date', key: 'reaction_date' },
    { label: 'Description', key: 'instruction' },

    {
      label: 'Created Date',
      key: 'createtime',
      sortable: true,
      render: (item) => <span style={{ whiteSpace: 'nowrap' }}>{item.createtime}</span>
    }
  ];

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <span style={{ color: '#0ccfb5' }}>Dashboard</span>
        </Link>{' '}
        / Health Report
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
          Health Report
        </h5>
        <div className="mt-3">
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
                <Button variant="primary" type="submit" style={{ fontSize: '12px' }}>
                  View
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      {/* {adverseReactions.length > 0 && (
        <div className="mb-3 text-end">
          <Button variant="success" onClick={exportToExcel} style={{ backgroundColor: '#0ccfb5', border: 'none' }}>
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
            Health List
          </h5>

          <div className="d-flex gap-2">
            <input
              className="custom-search form-control"
              style={{ width: '250px', fontSize: '13px' }}
              placeholder="Search..."
              onChange={handleSearch}
            />
            <div>
              {adverseReactions.length > 0 && (
           
                  <Button variant="primary" onClick={exportToExcel} style={{ fontSize: '12px' }}>
                    <ImportExportIcon style={{ fontSize: '16px' }} />
                    Export to Excel
                  </Button>
              
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
            data={filteredReactions}
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

export default AdverseReport;
