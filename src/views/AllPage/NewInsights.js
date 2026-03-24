import React, { useEffect, useState } from 'react';
import {
  Menu,
  MenuItem,
  
} from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Grid,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';
import { API_URL } from 'config/constant';

const NewInsights = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const admin_id = 1;

  // ================= FETCH =================
  const fetchPosts = async () => {
    const res = await axios.get(
      `${API_URL}get-all-insights-posts`
    );
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
      setTitle('');
      setDescription('');
      setUrl('');
      setImage(null);
      setIsVisible(false);
    }
  };

  const handleClose = () => setOpen(false);

  // ================= SAVE =================
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('admin_id', admin_id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('url', url);
    formData.append('image', image);
    formData.append('is_visible', isVisible ? 1 : 0);

    let api = 'new-insights-create-post';

    if (editId) {
      formData.append('id', editId);
      api = 'update-insights-post'; // backend banayenge
    }

    const res = await axios.post(
      `${API_URL}${api}`,
      formData
    );

    if (res.data.success) {
      alert(editId ? 'Updated' : 'Created');
      handleClose();
      fetchPosts();
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;

    const res = await axios.post(
      `${API_URL}delete-insights-post`,
      { id }
    );

    if (res.data.success) {
      alert('Deleted');
      fetchPosts();
    }
  };

  const handleMenuOpen = (event, item) => {
  setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    }; 
    
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 3, borderRadius: '10px' }}>

          {/* HEADER */}
          <Grid container justifyContent="space-between">
            <Typography variant="h5">Insights List</Typography>

            <Button variant="contained" onClick={() => handleOpen()}>
              + Add Post
            </Button>
          </Grid>

         {/* TABLE */}
            <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#f5f6fa' }}>
                    <th style={th}>S.No</th>
                    <th style={th}>Title</th>
                    <th style={th}>Status</th>
                    <th style={th}>Action</th> {/* Image column hata di */}
                </tr>
                </thead>

                <tbody>
                {posts.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}>{item.title}</td>
                    <td style={td}>{item.is_visible ? 'Yes' : 'No'}</td>

                    <td style={td}>
                        <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                        sx={{
                            background: '#20c997',
                            textTransform: 'none'
                        }}
                        >
                        Action ▼
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* MENU */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                onClick={() => {
                    handleOpen(selectedItem); // modal open with data
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
                sx={{ color: 'red' }}
                >
                🗑 Delete
                </MenuItem>
            </Menu>
            </div>

            

        </Card>
      </Grid>

      {/* MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Post</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            sx={{ mt: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            sx={{ mt: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            fullWidth
            label="URL"
            sx={{ mt: 2 }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
            }
            label="Status"
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Grid>
  );
};

const th = { padding: '10px', textAlign: 'left' };
const td = { padding: '10px' };

export default NewInsights;