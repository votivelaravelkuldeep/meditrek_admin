import React, { useEffect, useState } from 'react';
import {
  Grid,
  // Card,
  Typography,
  //   Select,
  //   MenuItem,
  FormControl,
  //   InputLabel,
  //   Checkbox,
  //   ListItemText,
  Button
} from '@mui/material';
import axios from 'axios';
import { API_URL } from 'config/constant';
import TagSearch from './Analytics/TagSearch';

const AdminLanguage = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const admin_id = 1; // change dynamic later

  // const languageNames = languages.map((l) => l.language_name);

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
      const res = await axios.get(`${API_URL}languages`, { params: { admin_id } });

      if (res.data.success) {
        setLanguages(res.data.data);

        // agar db me saved hai to wahi set karo
        if (res.data.selectedLanguages?.length) {
          setSelectedLanguages(res.data.selectedLanguages);
        } else {
          // warna default English
          const defaultLang = res.data.data.filter((l) => l.is_default === 1).map((l) => l.id);

          setSelectedLanguages(defaultLang);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================
  // const handleChange = (event) => {
  //   let value = event.target.value;

  //   // English always included
  //   const defaultLang = languages.find((l) => l.is_default === 1);

  //   if (!value.includes(defaultLang.id)) {
  //     value.push(defaultLang.id);
  //   }

  //   setSelectedLanguages(value);
  // };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const res = await axios.post(`${API_URL}admin-save-languages`, {
        admin_id,
        languages: selectedLanguages
      });

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

  const selectedLanguageNames = languages
    .filter((l) => selectedLanguages.includes(l.id))
    .map((l) => l.language_name)
    .join(', ');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div style={{background:'#fff', padding:'24px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)',borderRadius: 16,}}>
          <Typography variant="h5">Language Settings</Typography>

          {/* ===== MULTI SELECT ===== */}
          <div>
          <FormControl fullWidth sx={{ mt: 3 }}>
            {/* <InputLabel>Select Languages</InputLabel> */}
            {/* <Select
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
            </Select> */}
            {/* ✅ ADD THIS HERE */}
            <style>
              {`
      .tag-dropdown-menu {
        max-height: 400px !important;
        overflow: visible !important;
        z-index: 9999 !important;
        // position:relative !important;
      }

      .tag-dropdown-list {
        max-height: 300px !important;
        overflow-y: auto !important;
        display: block !important;
      }

  //      .tag-dropdown-trigger-text {
  //   display: none !important;
  // }
  .tag-dropdown-trigger-text {
  color: transparent !important;
  position: relative;
}

.tag-dropdown-trigger-text::after {
  content: "${selectedLanguageNames}";
  color: #374151;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
    `}
            </style>
            {/* <div
              style={{
                border: '1.5px solid #1ddec4',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '13px',
                background: '#fff',
                marginBottom: '6px'
              }}
            >
              {selectedLanguageNames || 'Select languages'}
            </div> */}
            {languages.length > 0 && (
              <TagSearch
                label="Languages"
                all={languages.map((l) => l.language_name)}
                // 🔥 THIS IS THE MAGIC FIX
                selected={languages.filter((l) => selectedLanguages.includes(l.id)).map((l) => l.language_name)}
                onToggle={(name) => {
                  const lang = languages.find((l) => l.language_name === name);
                  if (!lang) return;

                  let updated;

                  if (selectedLanguages.includes(lang.id)) {
                    updated = selectedLanguages.filter((id) => id !== lang.id);
                  } else {
                    updated = [...selectedLanguages, lang.id];
                  }

                  // keep default always
                  const defaultLang = languages.find((l) => l.is_default === 1);
                  if (defaultLang && !updated.includes(defaultLang.id)) {
                    updated.push(defaultLang.id);
                  }

                  setSelectedLanguages(updated);
                }}
                searchPlaceholder="Add languages..."
              />
            )}
          </FormControl>

          {/* ===== SAVE BUTTON ===== */}
          <Button variant="primary" className='btn btn-primary' style={{ fontSize: '12px',textTransform:'capitalize' }} sx={{ mt: 1 }} onClick={handleSave}>
            Save Languages
          </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default AdminLanguage;
