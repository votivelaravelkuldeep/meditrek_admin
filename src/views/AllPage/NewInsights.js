import React, { useEffect, useState, useRef } from "react";
import { Menu, MenuItem, Pagination } from "@mui/material";
import axios from "axios";
import { API_URL } from "config/constant";
import FormInput from "component/common/formElements/FormInput";
import FormTextarea from "component/common/formElements/FormTextarea";
import CustomTable from "component/common/CustomTable";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FadeLoader } from "react-spinners";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import './managecontent.css';

const NewInsights = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [insightsEnabled, setInsightsEnabled] = useState(true);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const modalRef = useRef(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev) return { key, direction: "asc" };
      return {
        key,
        direction:
          prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const columns = [
    {
      label: "S.No",
      key: "sr_no",
      sortable: true,
      render: (_, index) => index + 1,
    },
    {
      label: "Title",
      key: "title",
      sortable: true,
    },
    {
      label: "Status",
      key: "is_visible",
      sortable: true,
      render: (row) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            background: row.is_visible ? "#dcfce7" : "#fee2e2",
            color: row.is_visible ? "#16a34a" : "#dc2626",
            fontWeight: 600,
          }}
        >
          {row.is_visible ? "Visible" : "Hidden"}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (row) => (
        <button
          onClick={(e) => handleMenuOpen(e, row)}
          type="button"
          style={{
            background: "#e6f9f6",
            color: "#1ddec4",
            border: "none",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Action ▼
        </button>
      ),
    },
  ];

  const admin_id = 1;

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}get-all-insights-posts`);
      if (res.data.success) setPosts(res.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    axios.get(`${API_URL}get-settings`).then((res) => {
      if (res.data.success) {
        setInsightsEnabled(res.data.data.insights == 1);
      }
    });
  }, []);

  const handleToggleInsights = async () => {
    const newValue = insightsEnabled ? 0 : 1;

    try {
      const res = await axios.post(`${API_URL}update-setting`, {
        key: "insights",
        value: newValue,
      });

      if (res.data.success) {
        setInsightsEnabled(!insightsEnabled);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Insights ${newValue ? "Enabled" : "Disabled"}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (item = null) => {
    setOpen(true);
    setErrors({});
    setTouched({});

    if (item) {
      setEditId(item.id);
      setTitle(item.title);
      setDescription(item.description);
      setUrl(item.url);
      setIsVisible(item.is_visible === 1);
    } else {
      setEditId(null);
      setTitle("");
      setDescription("");
      setUrl("");
      setImage(null);
      setIsVisible(false);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("admin_id", admin_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    if (image) formData.append("image", image);
    formData.append("is_visible", isVisible ? 1 : 0);

    let api = "new-insights-create-post";

    if (editId) {
      formData.append("id", editId);
      api = "update-insights-post";
    }

    try {
      const res = await axios.post(`${API_URL}${api}`, formData);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: editId ? "Updated!" : "Created!",
          text: editId ? "Post updated successfully" : "Post created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        handleClose();
        fetchPosts();
      }
    } catch (error) {
      console.error("Error saving post:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_URL}delete-insights-post`, { id });

        if (res.data.success) {
          Swal.fire("Deleted!", "Post has been deleted.", "success");
          fetchPosts();
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete post",
        });
      }
    }
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                Insights List
              </h5>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={insightsEnabled}
                  onChange={handleToggleInsights}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "#475569" }}>
                  {insightsEnabled ? "Insights Enabled" : "Insights Disabled"}
                </span>
              </div>
            </div>
            <Button
              onClick={() => handleOpen()}
              style={{
                background: "#1ddec4",
                border: "none",
                borderRadius: "999px",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <AddIcon sx={{ fontSize: 18, mr: 0.5 }} /> Add Post
            </Button>
          </div>

          <div className="mb-3 d-flex justify-content-end">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "250px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
                padding: "8px 12px",
              }}
            />
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <FadeLoader color="#1ddec4" />
            </div>
          ) : (
            <>
              <CustomTable
                columns={columns}
                data={currentPosts}
                sortConfig={sortConfig}
                onSort={handleSort}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onRowsPerPageChange={(size) => {
                  setRowsPerPage(size);
                  setCurrentPage(1);
                }}
                hideRowsPerPage={true}
              />

              {filteredPosts.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <p className="text-muted small mb-0">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredPosts.length)} of{" "}
                    {filteredPosts.length} entries
                  </p>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#1ddec4",
                        color: "#fff",
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleOpen(selectedItem); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedItem?.id); handleMenuClose(); }} sx={{ color: "red" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Modal - Fixed accessibility issues */}
      {open && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            style={{
              width: "500px",
              maxWidth: "90%",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 style={{ margin: 0, fontWeight: 600, fontSize: "16px", color: "#1e293b" }}>
                {editId ? "Edit Post" : "Add New Post"}
              </h6>
              <button
                onClick={handleClose}
                aria-label="Close"
                type="button"
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#9ca3af",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "20px", width: '100%' }}>
              <div style={{ marginBottom: "10px", width: '100%' }}>
                <FormInput
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur("title")}
                  placeholder="Enter title"
                  error={errors.title}
                  touched={touched.title}
                  required
                  style={{ width: '100%' }}
                  className="custom-input custom-search"
                />
              </div>

              <div style={{ marginBottom: "10px", width: '100%' }}>
                <FormTextarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleBlur("description")}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>

              <div style={{ marginBottom: "10px", width: '100%' }}>
                <FormInput
                  label="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={() => handleBlur("url")}
                  placeholder="Enter URL"
                />
              </div>

              <div style={{ marginBottom: "10px", width: '100%' }}>
                <FormInput
                  label="Upload Image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  id="visibleCheck"
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor="visibleCheck"
                  style={{ fontSize: "13px", color: "#374151", margin: 0, cursor: "pointer" }}
                >
                  Visible
                </label>
              </div>
            </div>

            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handleClose}
                type="button"
                style={{
                  padding: "6px 16px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                style={{
                  padding: "6px 20px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#1ddec4",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewInsights;