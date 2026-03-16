// import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
// import Typography from '@mui/material/Typography';
// // import VisibilityIcon from '@mui/icons-material/Visibility';
// import { Link } from 'react-router-dom';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { API_URL,  } from '../../config/constant';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// // import { encode as base64_encode } from 'base-64';

// function MedicationReport() {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [medications, setMedicationData] = useState([])
//     const [from_date, setFromDate] = useState('')
//     const [to_date, setToDate] = useState('')
//     const [from_date_error, setFromDateError] = React.useState('');
//     const [to_date_error, setToDateError] = React.useState('');
//     const [medicationPageCount, setMedicationPageCount] = useState('')
//     const [searchQuery, setSearchQuery] = React.useState('');

//     const usersPerPage = 10;
//     console.log(medicationPageCount)

//     const handleSearch = (event) => {
//         setSearchQuery(event.target.value);
//     };

//     const filteredMedications = medications.filter((med) => {
//         const lowercasedTerm = searchQuery.toLowerCase();
//         const nameMatch = med.medicine_name?.toLowerCase().includes(lowercasedTerm);
//         const dosageMatch = med.dosage?.toString().includes(lowercasedTerm);
//         const instructionMatch = med.instruction?.toLowerCase().includes(lowercasedTerm);
//         const statusMatch = lowercasedTerm === 'active' ? med.status === 1 :
//             lowercasedTerm === 'inactive' ? med.status === 0 : false;

//         return nameMatch || dosageMatch || instructionMatch || statusMatch;
//     });

//     const indexOfLastMed = currentPage * usersPerPage;
//     const indexOfFirstMed = indexOfLastMed - usersPerPage;
//     const currentMeds = filteredMedications.slice(indexOfFirstMed, indexOfLastMed);
//     const totalPages = Math.ceil(filteredMedications.length / usersPerPage);

//     const handlePageChange = (event, value) => {
//         setCurrentPage(value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         let hasError = false;

//         if (!from_date) {
//             setFromDateError('Please Enter From Date.');
//             hasError = true;
//         } else {
//             setFromDateError('');
//         }

//         if (!to_date) {
//             setToDateError('Please Enter To Date');
//             hasError = true;
//         } else if (to_date < from_date) {
//             setToDateError('To Date Must Be Greater Than from date');
//             hasError = true;
//         } else {
//             setToDateError('');
//         }

//         if (hasError) {
//             return;
//         }

//         axios.get(`${API_URL}get_medication_tabular?from_date=${from_date}&to_date=${to_date}`)
//             .then((response) => {
//                 if (response.data.success && Array.isArray(response.data.medication_arr)) {
//                     setMedicationData(response.data.medication_arr);
//                     setMedicationPageCount(response.data.medication_arr.length)
//                 } else {
//                     setMedicationData([])
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error fetching medication data:', error);
//                 setMedicationData([])
//             })
//     };

//     const exportToExcel = () => {
//         const ws = XLSX.utils.json_to_sheet(
//             medications.map((med, index) => ({
//                 'S. No.': index + 1,
//                 'Medicine Name': med.medicine_name,
//                 'Patient Name': med.patient_name,
//                 'Dosage': med.dosage,
//                 'Type': med.type_label,
//                 'Schedule': med.schedule_label,
//                 'Instruction': med.instruction,
//                 'Reminder Time': med.reminder_time,
//                 'Pause Status': med.pause_status_label,
//                 'Status': med.taken_status_label,
//                 'Create Date & Time': med.createtime
//             }))
//         );
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'MedicationReport');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//         saveAs(blob, 'MedicationReport.xlsx');
//     };

//     return (
//         <>
//             <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
//                 <Link to={'/'} style={{ textDecoration: 'none' }}><span style={{ color: '#0ccfb5' }}>Dashboard</span></Link> / Medication Report
//             </Typography>
//             <Card className="mb-4">
//                 <Card.Header className="bg-white">
//                     <Card.Title as="h5" className="mt-2">
//                         Medication Report{' '}
//                     </Card.Title>
//                 </Card.Header>
//                 <Card.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <div className="container">
//                             <div className="mt-3">
//                                 <Form.Group className="mb-3" as={Row}>
//                                     <Col sm={5}>
//                                         <div className="mb-2">From Date</div>
//                                         <Form.Control type="date" placeholder="Enter Subject" onChange={(e) => {
//                                             setFromDate(e.target.value);
//                                             setFromDateError('');
//                                             setToDateError('');
//                                         }} />
//                                         <p style={{ color: 'red' }}>{from_date_error}</p>
//                                     </Col>
//                                     <Col sm={5}>
//                                         <div className="mb-2">To Date</div>
//                                         <Form.Control type="date" placeholder="Enter Subject"
//                                             max={new Date().toISOString().split("T")[0]}
//                                             onChange={(e) => {
//                                                 if (!from_date) {
//                                                     setToDateError('Please Select From Date first');
//                                                 } else {
//                                                     setToDate(e.target.value);
//                                                     setFromDateError('')
//                                                     setToDateError('');
//                                                 }
//                                             }} />
//                                         <p style={{ color: 'red' }}>{to_date_error}</p>
//                                     </Col>
//                                     <Col sm={2}>
//                                         <Button type="submit" className="submit-btn" style={{ marginTop: '29px' }}>
//                                             View
//                                         </Button>
//                                     </Col>
//                                 </Form.Group>
//                             </div>
//                         </div>
//                     </Form>
//                 </Card.Body>
//             </Card>

//             <div>
//                 {medications.length > 0 && (
//                     <div>
//                         <Button variant="success" onClick={exportToExcel} className="mb-3 btn-sm pull-right" style={{ backgroundColor: '#0ccfb5', border: 'none' }}>
//                             Export to Excel
//                         </Button>
//                     </div>
//                 )}
//             </div>
//             <Card>
//                 <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
//                     <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h5" gutterBottom>
//                         <span style={{ color: '#000' }}>Medication List</span>
//                     </Typography>
//                     <div className=''>
//                         <label htmlFor="search-input" style={{ marginRight: '5px' }}>
//                             Search
//                         </label>
//                         <input
//                             className="search-input"
//                             type="text"
//                             placeholder="Search..."
//                             onChange={handleSearch}
//                             style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
//                         />
//                     </div>
//                 </Card.Header>
//                 <Card.Body>
//                     {/* Add horizontal scroll container */}
//                     <div className="table-container">
//                         <Table hover className="fixed-header-table">
//                             <thead>
//                                 <tr>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Name</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
//                                     {/* <th style={{ textAlign: 'center', fontWeight: '500' }}>Description</th> */}
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Type</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Pause Status</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
//                                     <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {currentMeds.length > 0 ? (
//                                     currentMeds.map((med, index) => (
//                                         <tr key={med.medication_id}>
//                                             <th scope="row" style={{ textAlign: 'center' }}>
//                                                 {indexOfFirstMed + index + 1}
//                                             </th>
//                                             <td style={{ textAlign: 'center' }}>{med.patient_name}</td>
//                                             <td style={{ textAlign: 'center' }}>{med.medicine_name}</td>
//                                             {/* <td style={{ textAlign: 'center' }}>{med.medicine_description}</td> */}
//                                             <td style={{ textAlign: 'center' }}>{med.dosage}</td>
//                                             <td style={{ textAlign: 'center' }}>{med.type == 1 ? "Pill" : "Syrup"}</td>
//                                             <td style={{ textAlign: 'center' }}>{med.schedule == 0 ? "Daily" : med.schedule == 1 ? "Weekly" : "Monthly"}</td>
//                                             <td style={{ textAlign: 'center' }}>{med.instruction}</td>
//                                             <td style={{ textAlign: 'center' }}>{med.reminder_time}</td>
//                                             <td

//                                             >
//                                                 <div style={{
//                                                     textAlign: 'center',
//                                                     backgroundColor: med?.pause_status === 1 ? '#f8d7da' : med?.pause_status === 0 ? '#d4edda' : 'transparent',
//                                                     color: med?.pause_status === 1 ? '#721c24' : med?.pause_status === 0 ? '#155724' : '#000',
//                                                     fontWeight: 'bold',
//                                                     borderRadius: '35px',
//                                                 }}>
//                                                     {med?.pause_status === 1 ? 'Pause' : med?.pause_status === 0 ? 'Resume' : 'NA'}
//                                                 </div>
//                                             </td>
//                                             <td

//                                             >
//                                                 <div style={{
//                                                     textAlign: 'center',
//                                                     backgroundColor: med?.taken_status === 0 ? '#f8d7da' : med?.taken_status === 1 ? '#d4edda' : 'transparent',
//                                                     color: med?.taken_status === 0 ? '#721c24' : med?.taken_status === 1 ? '#155724' : '#000',
//                                                     fontWeight: 'bold',
//                                                     borderRadius: '35px',
//                                                 }}>
//                                                     {med?.taken_status === 0 ? 'Not taken' : med?.taken_status === 1 ? 'Taken' : 'NA'}
//                                                 </div>
//                                             </td>

//                                             <td style={{ textAlign: 'center' }}>{med.createtime}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={9}>
//                                             <p style={{ marginBottom: '0px', textAlign: 'center' }}>No Data Found</p>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     </div>
//                     <div className="d-flex justify-content-between">
//                         <p style={{ fontWeight: '500' }} className='pagination'>
//                             {filteredMedications.length > 0
//                                 ? `Showing ${indexOfFirstMed + 1} to ${Math.min(indexOfLastMed, filteredMedications.length)} of ${filteredMedications.length} entries`
//                                 : "Showing 0 to 0 of 0 entries"}
//                         </p>
//                         <Stack spacing={2} alignItems="right">
//                             <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
//                         </Stack>
//                     </div>
//                 </Card.Body>
//             </Card>
//         </>
//     );
// }

// export default MedicationReport;

import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/constant';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function MedicationReport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [medications, setMedicationData] = useState([])
    const [from_date, setFromDate] = useState('')
    const [to_date, setToDate] = useState('')
    const [from_date_error, setFromDateError] = React.useState('');
    const [to_date_error, setToDateError] = React.useState('');
    const [medicationPageCount, setMedicationPageCount] = useState('')
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);

    const usersPerPage = 10;

    const handleViewClick = (medication) => {
        setSelectedMedication(medication);
        setShowModal(true);
    };

    console.log(medicationPageCount)

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
        const statusMatch = lowercasedTerm === 'active' ? med.status === 1 :
            lowercasedTerm === 'inactive' ? med.status === 0 : false;

        return nameMatch || dosageMatch || instructionMatch || statusMatch;
    });

    const indexOfLastMed = currentPage * usersPerPage;
    const indexOfFirstMed = indexOfLastMed - usersPerPage;
    const currentMeds = filteredMedications.slice(indexOfFirstMed, indexOfLastMed);
    const totalPages = Math.ceil(filteredMedications.length / usersPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

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

        axios.get(`${API_URL}get_medication_tabular?from_date=${from_date}&to_date=${to_date}`)
            .then((response) => {
                if (response.data.success && Array.isArray(response.data.medication_arr)) {
                    setMedicationData(response.data.medication_arr);
                    setMedicationPageCount(response.data.medication_arr.length)
                } else {
                    setMedicationData([])
                }
            })
            .catch((error) => {
                console.error('Error fetching medication data:', error);
                setMedicationData([])
            })
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            medications.map((med, index) => ({
                'S. No.': index + 1,
                'Medicine Name': med.medicine_name,
                'Patient Name': med.patient_name,
                'Dosage': med.dosage,
                'Type': med.type_label,
                'Schedule': med.schedule_label,
                'Instruction': med.instruction,
                'Reminder Time': med.reminder_time,
                'Pause Status': med.pause_status_label,
                'Status': med.taken_status_label,
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

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <Link to={'/'} style={{ textDecoration: 'none' }}><span style={{ color: '#0ccfb5' }}>Dashboard</span></Link> / User Medication Report
            </Typography>
            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <Card.Title as="h5" className="mt-2">
                       User Medication Report{' '}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="container">
                            <div className="mt-3">
                                <Form.Group className="mb-3" as={Row}>
                                    <Col sm={5}>
                                        <div className="mb-2">From Date</div>
                                        <Form.Control type="date" placeholder="Enter Subject" onChange={(e) => {
                                            setFromDate(e.target.value);
                                            setFromDateError('');
                                            setToDateError('');
                                        }} />
                                        <p style={{ color: 'red' }}>{from_date_error}</p>
                                    </Col>
                                    <Col sm={5}>
                                        <div className="mb-2">To Date</div>
                                        <Form.Control type="date" placeholder="Enter Subject"
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                if (!from_date) {
                                                    setToDateError('Please Select From Date first');
                                                } else {
                                                    setToDate(e.target.value);
                                                    setFromDateError('')
                                                    setToDateError('');
                                                }
                                            }} />
                                        <p style={{ color: 'red' }}>{to_date_error}</p>
                                    </Col>
                                    <Col sm={2}>
                                        <Button type="submit" className="submit-btn" style={{ marginTop: '29px' }}>
                                            View
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <div>
                {medications.length > 0 && (
                    <div>
                        <Button variant="success" onClick={exportToExcel} className="mb-3 btn-sm pull-right" style={{ backgroundColor: '#0ccfb5', border: 'none' }}>
                            Export to Excel
                        </Button>
                    </div>
                )}
            </div>
            <Card>
                <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
                    <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h5" gutterBottom>
                        <span style={{ color: '#000' }}>User Medication List</span>
                    </Typography>
                    <div className=''>
                        <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                            Search
                        </label>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                            style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
                        />
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-container">
                        <Table hover className="fixed-header-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Type</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Schedule</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Reminder Time</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Pause Status</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Status</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMeds.length > 0 ? (
                                    currentMeds.map((med, index) => (
                                        <tr key={med.medication_id}>
                                            <th scope="row" style={{ textAlign: 'center' }}>
                                                {indexOfFirstMed + index + 1}
                                            </th>
                                            <td style={{ textAlign: 'center' }}>
                                                <Button 
                                                    variant="info" 
                                                    size="sm" 
                                                    onClick={() => handleViewClick(med)}
                                                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{med.patient_name}</td>
                                            <td style={{ textAlign: 'center' }}>{med.medicine_name}</td>
                                            <td style={{ textAlign: 'center' }}>{med.dosage}</td>
                                            <td style={{ textAlign: 'center' }}>{med.type == 1 ? "Pill" : "Syrup"}</td>
                                            <td style={{ textAlign: 'center' }}>{med.schedule == 0 ? "Daily" : med.schedule == 1 ? "Weekly" : "Monthly"}</td>
                                            <td style={{ textAlign: 'center' }}>{med.instruction}</td>
                                            <td style={{ textAlign: 'center' }}>{med.reminder_time}</td>
                                            <td>
                                                <div style={{
                                                    textAlign: 'center',
                                                    backgroundColor: med?.pause_status === 1 ? '#f8d7da' : med?.pause_status === 0 ? '#d4edda' : 'transparent',
                                                    color: med?.pause_status === 1 ? '#721c24' : med?.pause_status === 0 ? '#155724' : '#000',
                                                    fontWeight: 'bold',
                                                    borderRadius: '35px',
                                                }}>
                                                    {med?.pause_status === 1 ? 'Pause' : med?.pause_status === 0 ? 'Resume' : 'NA'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{
                                                    textAlign: 'center',
                                                    backgroundColor: med?.taken_status === 0 ? '#f8d7da' : med?.taken_status === 1 ? '#d4edda' : 'transparent',
                                                    color: med?.taken_status === 0 ? '#721c24' : med?.taken_status === 1 ? '#155724' : '#000',
                                                    fontWeight: 'bold',
                                                    borderRadius: '35px',
                                                }}>
                                                    {med?.taken_status === 0 ? 'Not taken' : med?.taken_status === 1 ? 'Taken' : 'NA'}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{med.createtime}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={12}>
                                            <p style={{ marginBottom: '0px', textAlign: 'center' }}>No Data Found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className='pagination'>
                            {filteredMedications.length > 0
                                ? `Showing ${indexOfFirstMed + 1} to ${Math.min(indexOfLastMed, filteredMedications.length)} of ${filteredMedications.length} entries`
                                : "Showing 0 to 0 of 0 entries"}
                        </p>
                        <Stack spacing={2} alignItems="right">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                        </Stack>
                    </div>
                </Card.Body>
            </Card>

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
                        <p><strong>Medicine Name:</strong> {selectedMedication.medicine_name}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Type:</strong> {selectedMedication.type == 1 ? "Pill" : "Syrup"}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <p><strong>Medicine Late Taken:</strong> {selectedMedication.late_count || '0'}</p>
                    </Col>
                    <Col md={4}>
                        <p><strong>Not Taken:</strong> {selectedMedication.not_taken_count || '0'}</p>
                    </Col>
                    <Col md={4}>
                        <p><strong>On Time Taken:</strong> {selectedMedication.ontime_count || '0'}</p>
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

export default MedicationReport