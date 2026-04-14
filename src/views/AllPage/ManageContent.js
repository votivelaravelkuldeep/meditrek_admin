import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
// import Typography from '@mui/material/Typography';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { API_URL } from 'config/constant';
// import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

// import 'jodit/build/jodit.min.css';
// Import Jodit language files
import 'jodit/esm/langs/fr';
import 'jodit/esm/langs/es';
import 'jodit/esm/langs/ar';
import 'jodit/esm/langs/de';
import 'jodit/esm/langs/it';
import 'jodit/esm/langs/pt_br';

function Managecontent() {
  const options = [
    'bold',
    'italic',
    '|',
    'ul',
    'ol',
    '|',
    'font',
    'fontsize',
    '|',
    'outdent',
    'indent',
    'align',
    '|',
    'hr',
    '|',
    'fullsize',
    'brush',
    '|',
    'table',
    'link',
    '|',
    'undo',
    'redo'
  ];

  const [content, setContent] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [about, setAbout] = useState('');
  //   const [terms, setTerms] = useState('');
  // const [privacy, setPrivacy] = useState('');
  const [android, setAndroid] = useState('');
  const [ios, setIos] = useState('');
  const [share, setShare] = useState('');
  const [activeButton, setActiveButton] = useState('about');
  const [contentUpdated, setContentUpdated] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [about, setAbout] = useState({ en: '', fr: '', es: '', ar: '', it: '', de: '', pt: '' });
  const [terms, setTerms] = useState({ en: '', fr: '', es: '', ar: '', it: '', de: '', pt: '' });
  const [privacy, setPrivacy] = useState({ en: '', fr: '', es: '', ar: '', it: '', de: '', pt: '' });

  const joditLangMap = {
    en: 'en',
    fr: 'fr',
    es: 'es',
    ar: 'ar',
    it: 'it',
    de: 'de',
    pt: 'pt_br'
  };

  const handleShowContentUpdated = () => setContentUpdated(true);
  const handleCloseContentUpdated = () => setContentUpdated(false);

  const contentTypes = {
    about: 0,
    terms: 1,
    privacy: 2,
    android: 3,
    ios: 4,
    share: 5
  };

  // useEffect(() => {
  //   fetchContent('about', setAbout, activeLang);
  //   fetchContent('terms', setTerms, activeLang);
  //   fetchContent('privacy', setPrivacy);
  //   fetchContent('android', setAndroid);
  //   fetchContent('ios', setIos);
  //   fetchContent('share', setShare);
  // }, [activeLang]);

  //   const fetchContent = (contentType, setter) => {
  //     axios
  //       .get(`${API_URL}get_all_content_url?content_type=${contentTypes[contentType]}`)
  //       .then((response) => {
  //         setter(response.data.result[0].content);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  // const fetchContent = (contentType, setter, lang) => {
  //   axios
  //     .get(`${API_URL}get_all_content_url`, {
  //       params: {
  //         content_type: contentTypes[contentType],
  //         language_code: lang // 🔥 ADD THIS
  //       }
  //     })
  //     .then((response) => {
  //       setter((prev) => ({
  //         ...prev,
  //         [lang]: response.data.result[0]?.content || ''
  //       }));
  //     });
  // };

const fetchContent = (contentType, setter, lang) => {
  setLoading(true);
  axios
    .get(`${API_URL}get_all_content_url`, {
      params: {
        content_type: contentTypes[contentType]
      }
    })
    .then((response) => {
      const translations = response.data.result?.translations || {};

      setter((prev) => ({
        ...prev,
        [lang]: translations[lang] || ''
      }));
    })
    .catch(console.error)
    .finally(() => {
      setLoading(false);
    });
};

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: '',
      defaultActionOnPaste: 'insert_as_html',
      defaultLineHeight: 1.2,
      enter: 'div',
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false,

      // ✅ ADD THIS
      language: joditLangMap[activeLang] || 'en', // ✅ Jodit UI language
      direction: activeLang === 'ar' ? 'rtl' : 'ltr' // ✅ RTL for Arabic
    }),
    [activeLang]
  );

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
    console.log(contentType);
  };

  const handleBanner = (contentType) => {
    let contentStateToUpdate;
    switch (contentType) {
      case 'about':
        contentStateToUpdate = about[activeLang];
        break;
      //   case 'terms':
      //     contentStateToUpdate = terms;
      //     break;
      case 'terms':
        contentStateToUpdate = terms[activeLang];
        break;
      case 'privacy':
        contentStateToUpdate = privacy[activeLang];
        break;
      case 'android':
        contentStateToUpdate = android;
        break;
      case 'ios':
        contentStateToUpdate = ios;
        break;
      case 'share':
        contentStateToUpdate = share;
        break;
      default:
        contentStateToUpdate = '';
    }
    axios.post(`${API_URL}update_content`, {
  contentType: contentTypes[contentType],
  content: contentStateToUpdate,
  lang: activeLang
})
      .then(() => {
        console.log(`${contentType} updated successfully`);
        handleShowContentUpdated();
      })
      .catch((error) => {
        console.log(error);
        console.log('Error updating content');
      });
  };

  const languages = [
    { id: 'en', name: 'English', default: true },
    { id: 'fr', name: 'Français' },
    { id: 'es', name: 'Español' },
    { id: 'ar', name: 'العربية' },
    { id: 'it', name: 'Italiano' },
    { id: 'de', name: 'Deutsch' },
    { id: 'pt', name: 'Português' }
  ];

  useEffect(() => {
    fetchContent('about', setAbout, activeLang);
    fetchContent('terms', setTerms, activeLang);
    fetchContent('privacy', setPrivacy, activeLang);

    // These are NOT language-based — call once only
    if (activeLang === 'en') {
      fetchSingleContent('android', setAndroid);
      fetchSingleContent('ios', setIos);
      fetchSingleContent('share', setShare);
    }
  }, [activeLang]);

  // Separate fetch for non-multilingual fields
 const fetchSingleContent = (contentType, setter) => {
  axios
    .get(`${API_URL}get_all_content_url`, {
      params: { content_type: contentTypes[contentType] }
    })
    .then((response) => {
      const translations = response.data.result?.translations || {};

      // single content → always use EN
      setter(translations.en || '');
    })
    .catch(console.error);
};

  return (
    <>
      {/* <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
      <Link to={APP_PREFIX_PATH + '/'} style={{textDecoration: 'none'}}><span style={{ color: '#f68519' }}>Dashboard</span></Link> / Manage Content
      </Typography> */}
      {/* <Typography variant="h4" gutterBottom>
        Manage Content
      </Typography> */}

      <div className="container-fluid" style={{ borderRadius: '8px', paddingBottom: '20px' }}>
        <div className="row">
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg navbar-light  navBar">
              <div className="d-flex gap-2 mb-2 flex-wrap">
                <button
                  className={`btn ${activeButton === 'about' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'about' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'about' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                  type="button"
                  onClick={() => handleButtonClick('about')}
                >
                  About Us
                </button>
                <button
                  className={`btn ${activeButton === 'terms' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'terms' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'terms' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500
                  }}
                  type="button"
                  onClick={() => handleButtonClick('terms')}
                  id="termss"
                >
                  {/* TERMS AND CONDITIONS */}
                  Terms And Conditions
                </button>
                <button
                  className={`btn ${activeButton === 'privacy' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'privacy' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'privacy' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500
                  }}
                  type="button"
                  onClick={() => handleButtonClick('privacy')}
                >
                  {/* PRIVACY POLICY */}
                  Privacy Policy
                </button>
                <button
                  className={`btn ${activeButton === 'android' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'android' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'android' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500
                  }}
                  type="button"
                  onClick={() => handleButtonClick('android')}
                >
                  {/* ANDROID APP URL */}
                  Android App URL
                </button>
                <button
                  className={`btn ${activeButton === 'ios' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'ios' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'ios' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500
                  }}
                  type="button"
                  onClick={() => handleButtonClick('ios')}
                >
                  {/* IOS APP URL */}
                  IOS App URL
                </button>
                <button
                  className={`btn ${activeButton === 'share' ? 'btn-content-active' : ''}`}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontSize: '13px',
                    background: activeButton === 'share' ? '#1ddec4' : '#eef2f7',
                    color: activeButton === 'share' ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    fontWeight: 500
                  }}
                  type="button"
                  onClick={() => handleButtonClick('share')}
                >
                  Share Message
                </button>
              </div>
            </nav>
            {/* <br /> */}
            <div className="">
              {content === 0 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  {/* <span className="mb-2" style={{ fontSize: '15px' }}>
                    About us
                  </span> */}
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setActiveLang(lang.id)}
                        style={{
                          //   borderRadius: '999px',
                          padding: '2px 12px',
                          fontSize: '12px',
                          border: activeLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                          background: activeLang === lang.id ? '#1ddec4' : '#f8fafc',
                          color: activeLang === lang.id ? '#fff' : '#64748b',
                          fontWeight: activeLang === lang.id ? '500' : '400',
                          transition: '0.2s'
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                  <div>
                    {/* <JoditEditor value={about} config={config1} onBlur={(htmlString) => setAbout(htmlString)} /> */}
                    {loading ? (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <span>Loading content...</span>
  </div>
) : (
                    <JoditEditor
                      key={activeLang}
                      value={about[activeLang]}
                      config={config1}
                      onBlur={(htmlString) => {
                        setAbout((prev) => ({
                          ...prev,
                          [activeLang]: htmlString
                        }));
                      }}
                    />
                    )}
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('about')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 1 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  {/* <span>Terms And Conditions</span> */}
                  <div>
                    {/* ✅ Add language tabs — same as About Us */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {languages.map((lang) => (
                        <button
                          type="button"
                          key={lang.id}
                          onClick={() => setActiveLang(lang.id)}
                          style={{
                            padding: '2px 12px',
                            fontSize: '12px',
                            border: activeLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                            background: activeLang === lang.id ? '#1ddec4' : '#f8fafc',
                            color: activeLang === lang.id ? '#fff' : '#64748b',
                            fontWeight: activeLang === lang.id ? '500' : '400',
                            transition: '0.2s'
                          }}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                    {/* <JoditEditor value={terms} config={config1} onBlur={(htmlString) => setTerms(htmlString)} /> */}
                  {loading ? (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <span>Loading content...</span>
  </div>
) : (
                    <JoditEditor
                      key={activeLang}
                      value={terms[activeLang]}
                      config={config1}
                      onBlur={(htmlString) => {
                        setTerms((prev) => ({
                          ...prev,
                          [activeLang]: htmlString
                        }));
                      }}
                    />
                    )}
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('terms')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 2 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  {/* <span>Privacy Policy</span> */}
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {languages.map((lang) => (
                        <button
                          type="button"
                          key={lang.id}
                          onClick={() => setActiveLang(lang.id)}
                          style={{
                            padding: '2px 12px',
                            fontSize: '12px',
                            border: activeLang === lang.id ? '1px solid #1ddec4' : '1px solid #e5e7eb',
                            background: activeLang === lang.id ? '#1ddec4' : '#f8fafc',
                            color: activeLang === lang.id ? '#fff' : '#64748b',
                            fontWeight: activeLang === lang.id ? '500' : '400',
                            transition: '0.2s'
                          }}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                    {/* <JoditEditor value={privacy} config={config1} onBlur={(htmlString) => setPrivacy(htmlString)} /> */}
               {loading ? (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <span>Loading content...</span>
  </div>
) : (
                    <JoditEditor
                      key={activeLang}
                      value={privacy[activeLang]}
                      config={config1}
                      onBlur={(htmlString) => {
                        setPrivacy((prev) => ({
                          ...prev,
                          [activeLang]: htmlString
                        }));
                      }}
                    />
)}
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('privacy')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 3 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Android App Url</span>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={android}
                      onChange={(e) => setAndroid(e.target.value)}
                      placeholder="Enter android app url"
                      className="custom-input custom-search form-control"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <button
                    className="btn mt-3 btn btn-primary action-btn"
                    style={{ fontSize: '12px', borderRadius: '10px' }}
                    onClick={() => handleBanner('android')}
                  >
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 4 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>IOS App Url</span>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={ios}
                      onChange={(e) => setIos(e.target.value)}
                      placeholder="Enter ios app url"
                      className="custom-input custom-search form-control"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <button className="btn mt-3 btn btn-primary action-btn" style={{ fontSize: '12px' }} onClick={() => handleBanner('ios')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 5 && (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    padding: '24px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Share Message</span>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={share}
                      onChange={(e) => setShare(e.target.value)}
                      placeholder="Enter share message"
                      className="custom-input custom-search form-control"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <button
                    className="btn mt-3 btn btn-primary action-btn"
                    style={{ fontSize: '12px' }}
                    onClick={() => handleBanner('share')}
                  >
                    Update
                  </button>{' '}
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal show={contentUpdated} onHide={handleCloseContentUpdated} style={{ marginTop: '107px' }}>
          <Modal.Header>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>Content Updated Successfully</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseContentUpdated}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Managecontent;
