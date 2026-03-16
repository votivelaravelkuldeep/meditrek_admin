import React, {  useState } from 'react';
import { Card, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from 'config/constant';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';    

function BulkUploadMedicineCategory() {
   
    const [categoryFile, setCategoryFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const symptomsPerPage = 5;
    const [category,setCategory] = useState([]);
    
    const fetchData = async () => {
        try {
    
          const response = await axios.get(`${API_URL}get_medicine_type`, );
    
          console.log(response.data);
          if (response.data.success) {
            if(response?.data?.medicine_type_arr == "NA"){
              return setCategory([]);
            }
            setCategory(response?.data?.medicine_type_arr);
            console.log(category);
          } else {
            console.log('Fetch unsuccessful', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching dashboard data', error);
        }
      };
    
      React.useEffect(() => {
        fetchData();
      }, []);

    const handleFileChange = (e) => {
        setCategoryFile(e.target.files[0]);
    };

    const handlebulkupload = () => {
        const ws = XLSX.utils.json_to_sheet(
            category.map((item, index) => ({
                'S. No.': index + 1,
                'Category Name': item.category_name,
                // 'Medicine Description': item.medicine_description,
                // 'Create Date & Time': item.createtime
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CategoryReport');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'CategoryReport.xlsx');
    };

    const UploadbulkFile = async () => {
        if (!categoryFile) {
            Swal.fire({
                title: 'Error',
                text: 'Please select a file first',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validate file type
        if (!categoryFile.name.match(/\.(xlsx|xls)$/i)) {
            Swal.fire({
                title: 'Invalid File',
                text: 'Please upload an Excel file (.xlsx, .xls)',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(categoryFile);
            });

            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length <= 1) {
                throw new Error('No data found in the Excel file');
            }

            // Remove header row
            const dataRows = jsonData.slice(1);

            // console.log("Abhish<<<", dataRows);
            

            const response = await axios.post(`${API_URL}bulk_upload_type`, { 
                symptoms: dataRows 
            });

            console.log(response.data.success)

            Swal.fire({
                title: 'Success',
                text: 'File uploaded successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            getsymptom();
        } catch (error) {
            console.error('Error uploading file:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to upload file',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <span style={{ color: '#1ddec4' }}>Dashboard</span> / Bulk Upload Category
            </Typography>

            <Card>
                <Card.Header className="bg-white">
                    <h5>Bulk Category Management</h5>
                </Card.Header>

                <Card.Body>
                    <div className="card p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="mb-1">Excel File Operations</h5>
                                <p className="text-muted small mb-0">
                                    Download template or upload bulk data
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <Button
                            className="btn btn-primary  action-btn"
                                variant="contained"
                                color="primary"
                                onClick={handlebulkupload}
                                // className="me-2"
                                disabled={isLoading}
                            >
                                <FileDownloadIcon className="me-2" />
                                Download Template
                            </Button>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="file-upload" className="form-label">
                                Upload Excel File
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="file-upload"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            <div className="text-muted small mt-2">
                                {categoryFile ? `Selected file: ${categoryFile.category_name}` : 'No file selected'}
                            </div>
                        </div>

                        <Button
                        className="btn btn-primary  action-btn"
                        variant="contained"
                        color="primary"
                            onClick={UploadbulkFile}
                            disabled={!categoryFile || isLoading}
                            style={{width:'200px'}}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CloudUploadIcon className="me-2" />
                                    Upload Data
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Symptom List Table */}
                    {/* {medicineData.length > 0 && (
                        <div className="mt-4">
                            <h5>Existing Medicine</h5>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Medicine Name</th>
                                            <th>Description</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicineData
                                            .slice((currentPage - 1) * symptomsPerPage, currentPage * symptomsPerPage)
                                            .map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * symptomsPerPage + index + 1}</td>
                                                    <td>{item.medicine_name}</td>
                                                    <td>{item.medicine_description}</td>
                                                    <td>{item.createtime}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination
                                    count={Math.ceil(medicineData.length / symptomsPerPage)}
                                    page={currentPage}
                                    onChange={(event, value) => setCurrentPage(value)}
                                    color="primary"
                                />
                            </div>
                        </div>
                    )} */}
                </Card.Body>
            </Card>
        </>
    );
}

export default BulkUploadMedicineCategory;