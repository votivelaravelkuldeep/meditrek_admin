import React, { useEffect, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { API_URL } from "config/constant";
import FormInput from "component/common/formElements/FormInput";
import FormTextarea from "component/common/formElements/FormTextarea";

const NewInsights = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const admin_id = 1;

  // ================= FETCH =================
  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}get-all-insights-posts`);
    if (res.data.success) setPosts(res.data.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= OPEN MODAL =================
  const handleOpen = (item = null) => {
    setOpen(true);

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

  // ================= SAVE =================
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("admin_id", admin_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    formData.append("image", image);
    formData.append("is_visible", isVisible ? 1 : 0);

    let api = "new-insights-create-post";

    if (editId) {
      formData.append("id", editId);
      api = "update-insights-post";
    }

    const res = await axios.post(`${API_URL}${api}`, formData);

    if (res.data.success) {
      alert(editId ? "Updated" : "Created");
      handleClose();
      fetchPosts();
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    const res = await axios.post(`${API_URL}delete-insights-post`, { id });

    if (res.data.success) {
      alert("Deleted");
      fetchPosts();
    }
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      {/* CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h5 style={{ fontWeight: 600 }}>Insights List</h5>

          <button
            onClick={() => handleOpen()}
            style={{
              background: "#1ddec4",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            + Add Post
          </button>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={th}>S.No</th>
                <th style={th}>Title</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {posts.length > 0 ? (
                posts.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={td}>{i + 1}</td>

                    <td style={td}>{item.title}</td>

                    <td style={td}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          background: item.is_visible
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: item.is_visible ? "#16a34a" : "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        {item.is_visible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td style={td}>
                      <button
                        onClick={(e) => handleMenuOpen(e, item)}
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleOpen(selectedItem);
            handleMenuClose();
          }}
        >
          ✏️ Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete(selectedItem.id);
            handleMenuClose();
          }}
          sx={{ color: "red" }}
        >
          🗑 Delete
        </MenuItem>
      </Menu>

      {/* MODAL */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              width: "420px",
              maxWidth: "95%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ fontWeight: 600 }}>
              {editId ? "Edit Post" : "Add Post"}
            </h5>

            <div style={{ marginTop: "15px", display: "grid", gap: "12px" }}>
              <FormInput
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
              />

              <FormTextarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />

              <FormInput
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
              />

              <div>
                <label
                  htmlFor="imageUpload"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  Upload Image
                </label>

                <input
                  id="imageUpload"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ marginTop: "6px" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
                <span style={{ fontSize: "13px" }}>Visible</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                style={{
                  background: "#1ddec4",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const th = {
  padding: "12px",
  fontSize: "13px",
  fontWeight: 600,
  textAlign: "left",
};

const td = {
  padding: "12px",
  fontSize: "13px",
};

export default NewInsights;