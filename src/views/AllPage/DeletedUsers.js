import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';

import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomTable from 'component/common/CustomTable';

import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import axios from 'axios';

function DeleteUser() {
  const [users, setDeleteUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    axios
      .get(`${API_URL}get_all_deleted_users`)
      .then((res) => {
        setDeleteUsers(res.data.user_arr || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // ================= SEARCH =================
  const filteredUsers = users.filter((user) => {
    const term = searchQuery.toLowerCase();

    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.mobile?.toString().includes(term) ||
      user.createtime?.toLowerCase().includes(term)
    );
  });

  // ================= SORT =================
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: 'asc' };

      return {
        key,
        direction:
          prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  // ================= HELPER =================
  const truncateText = (text, maxLength = 20) => {
    if (!text) return '-';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  // ================= COLUMNS =================
  const userColumns = [
    {
      label: 'S. No',
      key: 'sr_no',
      render: (_, index) => index + 1
    },

    {
      label: 'Image',
      key: 'image',
      render: (user) => (
        <img
          src={
            user.image
              ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}`
              : `${IMAGE_PATH}placeholder.jpg`
          }
          alt=""
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid rgb(29, 222, 196)'
          }}
        />
      )
    },

    { label: 'Name', key: 'name', sortable: true },
    { label: 'Mobile No.', key: 'mobile', sortable: true },
    { label: 'Email', key: 'email', sortable: true },

    {
      label: 'Delete Reason',
      key: 'delete_reason',
      render: (user) => truncateText(user.delete_reason)
    },

    {
      label: 'Deleted On',
      key: 'createtime',
      sortable: true
    },

    {
      label: 'Action',
      key: 'action',
      render: (user) => (
        <div className="text-center">
          <Link
            to={`${APP_PREFIX_PATH}/manage-user/userlist/view_user/${user.user_id}/${user.user_id}`}
            // className="btn btn-sm btn-primary"
            style={{background:"  rgba(29, 222, 196, 0.13)",
                color:"#1ddec4",
                padding:'2px 8px',
                borderRadius:'6px',
                border:'1px solid rgba(29, 222, 196, 0.25)'
            }}
          >
            <VisibilityIcon style={{ fontSize: '16px' }} />
          </Link>
        </div>
      )
    }
  ];

  // ================= UI =================
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        padding: '16px'
      }}
    >
      {/* SEARCH */}
      <div className="d-flex justify-content-end">
        <input
          className="form-control"
          style={{ width: '250px', fontSize: '13px' }}
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          marginTop: '16px',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <CustomTable
          columns={userColumns}
          data={filteredUsers}
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
  );
}

export default DeleteUser;