import React, { useState } from 'react';
import { Card, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import { API_URL,  } from 'config/constant';
import axios from 'axios';
// import Swal from 'sweetalert2';

function ManageCompliance() {
    const [selectedActions, setSelectedActions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [complianceList, setComplianceList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 50;
    const [triggerFetch, setTriggerFetch] = useState(false);

    console.log(setTriggerFetch);

    // Function to truncate text with ellipsis
    const truncateText = (text, maxLength = 30) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const handleActionChange = (index, action) => {
        setSelectedActions({ ...selectedActions, [index]: action });
        if (action === 'View') {
            setSelectedActions({ ...selectedActions, [index]: null });
        }
    };
    console.log(handleActionChange);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}get_all_compliance`);
                console.log(response.data);

                if (response.data.success) {
                    setComplianceList(response.data.result);
                } else {
                    console.log('Fetch unsuccessful', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching compliance data', error);
            }
        };

        fetchData();
    }, [triggerFetch]);

    const filteredCompliance = complianceList?.filter(
        (compliance) =>
            (compliance.name && compliance.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (compliance.medicine_name && compliance.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (compliance.schedule && compliance.schedule.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (compliance.schedule_date && compliance.schedule_date.includes(searchQuery)) ||
            (compliance.createtime && compliance.createtime.includes(searchQuery)) ||
            (compliance.instruction && compliance.instruction.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCompliance?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCompliance?.length / itemsPerPage);

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <span style={{ color: '#1ddec4' }}>Dashboard</span> / Compliance List
            </Typography>
            <Card>
                <Card.Header className="bg-white ">
                    <div className="">
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
                </Card.Header>
                <Card.Body>
                    <div style={{ minWidth: '100%' }}>
                        <Table responsive hover style={{ overflowX: 'auto' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '80px' }}>S. No</th>
                                    {/* <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '120px' }}>Action</th> */}
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '150px' }}>Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '150px' }}>Medicine Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '100px' }}>Dosage</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '120px' }}>Schedule</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '150px' }}>Date</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '100px' }}>Status</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '200px' }}>Instruction</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500', minWidth: '180px' }}>Create Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.map((compliance, index) => (
                                    <tr key={index}>
                                        <th scope="row" style={{ textAlign: 'center' }}>
                                            {indexOfFirstItem + index + 1}
                                        </th>
                                        {/* <td>
                                            <div className="dropdown text-center">
                                                <button
                                                    className="btn btn-primary dropdown-toggle action-btn"
                                                    type="button"
                                                    id={`dropdownMenuButton${compliance.medication_id}`}
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    Action
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${compliance.medication_id}`}>
                                                    <li key="view">
                                                        <Link
                                                            to={APP_PREFIX_PATH + `/manage-compliance/compliancelist/view_compliance/${compliance.medication_id}`}
                                                            className="dropdown-item"
                                                        >
                                                            <VisibilityIcon style={{ marginRight: '8px' }} /> View
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td> */}
                                        <td style={{ textAlign: 'center' }}>{compliance.name}</td>
                                        <td style={{ textAlign: 'center' }}>{compliance.medicine_name}</td>
                                        <td style={{ textAlign: 'center' }}>{compliance.type}</td>
                                        <td style={{ textAlign: 'center' }}>{compliance.schedule}</td>
                                        <td style={{ textAlign: 'center' }}>{compliance.schedule_date === 'NA' ? 'NA' : compliance.schedule_date}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {compliance.taken_status === 0 ? (
                                                <p
                                                    style={{
                                                        borderRadius: '25px',
                                                        background: '#28c76f',
                                                        padding: '0px 15px',
                                                        width: '100px',
                                                        color: '#fff',
                                                        margin: 'auto'
                                                    }}
                                                >
                                                    Not Taken
                                                </p>
                                            ) : (
                                                <p
                                                    style={{
                                                        borderRadius: '25px',
                                                        background: '#28c76f',
                                                        padding: '0px 15px',
                                                        width: 'fit-content',
                                                        color: '#fff',
                                                        margin: 'auto'
                                                    }}
                                                >
                                                    Taken
                                                </p>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {compliance.instruction && compliance.instruction.length > 30 ? (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-${compliance.medication_id}`}>{compliance.instruction}</Tooltip>}
                                                >
                                                    <span>{truncateText(compliance.instruction, 30)}</span>
                                                </OverlayTrigger>
                                            ) : (
                                                compliance.instruction || '-'
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{compliance.createtime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: '500' }} className="pagination">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCompliance?.length)} of {filteredCompliance?.length} entries
                        </p>
                        <Stack spacing={2} alignItems="right">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                        </Stack>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default ManageCompliance;