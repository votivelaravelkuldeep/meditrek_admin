import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button
} from '@mui/material';
import axios from 'axios';

const AdminLanguage = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const admin_id = 1; // change dynamic later

  // ================= GET ALL LANGUAGES =================
  // const fetchLanguages = async () => {
  //   try {
  //     const res = await axios.get(
  //       'http://localhost:3001/meditrek/server/adminAPI/languages'
  //     );

  //     if (res.data.success) {
  //       setLanguages(res.data.data);

  //       // Default English select
  //       const defaultLang = res.data.data
  //         .filter((l) => l.is_default === 1)
  //         .map((l) => l.id);

  //       setSelectedLanguages(defaultLang);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const fetchLanguages = async () => {
  try {
    const res = await axios.get(
      'http://localhost:3001/meditrek/server/adminAPI/languages',
      { params: { admin_id } } // 👈 ye add kar
    );

    if (res.data.success) {
      setLanguages(res.data.data);

      // agar db me saved hai to wahi set karo
      if (res.data.selectedLanguages?.length) {
        setSelectedLanguages(res.data.selectedLanguages);
      } else {
        // warna default English
        const defaultLang = res.data.data
          .filter((l) => l.is_default === 1)
          .map((l) => l.id);

        setSelectedLanguages(defaultLang);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

  // ================= HANDLE CHANGE =================
  const handleChange = (event) => {
    let value = event.target.value;

    // English always included
    const defaultLang = languages.find((l) => l.is_default === 1);

    if (!value.includes(defaultLang.id)) {
      value.push(defaultLang.id);
    }

    setSelectedLanguages(value);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3001/meditrek/server/adminAPI/admin-save-languages',
        {
          admin_id,
          languages: selectedLanguages
        }
      );

      if (res.data.success) {
        alert('Languages Saved Successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5">Language Settings</Typography>

          {/* ===== MULTI SELECT ===== */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Select Languages</InputLabel>
            <Select
              multiple
              value={selectedLanguages}
              onChange={handleChange}
              renderValue={(selected) =>
                languages
                  .filter((l) => selected.includes(l.id))
                  .map((l) => l.language_name)
                  .join(', ')
              }
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.id}
                  value={lang.id}
                  disabled={lang.is_default === 1}
                >
                  <Checkbox checked={selectedLanguages.includes(lang.id)} />
                  <ListItemText
                    primary={
                      lang.language_name +
                      (lang.is_default === 1 ? ' (Default)' : '')
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ===== SAVE BUTTON ===== */}
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSave}
          >
            Save Languages
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminLanguage;