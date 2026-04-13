import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
import Typography from '@mui/material/Typography';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

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
  const [about, setAbout] = useState('');
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [android, setAndroid] = useState('');
  const [ios, setIos] = useState('');
  const [share, setShare] = useState('')
  const [activeButton, setActiveButton] = useState('about');
  const [contentUpdated, setContentUpdated] = useState(false)

  const handleShowContentUpdated = () => setContentUpdated(true)
  const handleCloseContentUpdated = () => setContentUpdated(false)
  
  const contentTypes = {
    about: 0,
    terms: 1,
    privacy: 2,
    android: 3,
    ios: 4,
    share: 5
  };

  useEffect(() => {
    fetchContent('about', setAbout);
    fetchContent('terms', setTerms);
    fetchContent('privacy', setPrivacy);
    fetchContent('android', setAndroid);
    fetchContent('ios', setIos);
    fetchContent('share', setShare)
  }, []);

  const fetchContent = (contentType, setter) => {
    axios
      .get(`${API_URL}get_all_content_url?content_type=${contentTypes[contentType]}`)
      .then((response) => {
        setter(response.data.result[0].content);
        
      })
      .catch((error) => {
        console.log(error);
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
      toolbarAdaptive: false
    }),
    []
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
        contentStateToUpdate = about;
        break;
      case 'terms':
        contentStateToUpdate = terms;
        break;
      case 'privacy':
        contentStateToUpdate = privacy;
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
    axios
      .post(`${API_URL}update_content`, {
        contentType: contentTypes[contentType],
        content: contentStateToUpdate
      })
      .then(() => {
        console.log(`${contentType} updated successfully`);
        handleShowContentUpdated()
      })
      .catch((error) => {
        console.log(error);
        console.log('Error updating content');
      });
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
      <Link to={APP_PREFIX_PATH + '/'} style={{textDecoration: 'none'}}><span style={{ color: '#f68519' }}>Dashboard</span></Link> / Manage Content
      </Typography>
      {/* <Typography variant="h4" gutterBottom>
        Manage Content
      </Typography> */}

      <div className="container-fluid bg-white" style={{ borderRadius: '8px', paddingBottom: '20px' }}>
        <div className="row justify-content-center" style={{ marginTop: '2rem' }}>
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg navbar-light  navBar mt-3 ">
              <div className="container-fluid navbar-responsive">
                <button
                  className={`btn me-2 mb-2 btn-content ${activeButton === 'about' ? 'active' : ''}`}
                  style={{ width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('about')}
                >
                  ABOUT US
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'terms' ? 'active' : ''}`}
                  style={{width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('terms')}
                  id="termss"
                >
                  TERMS AND CONDITIONS
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'privacy' ? 'active' : ''}`}
                  style={{ width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('privacy')}
                >
                  PRIVACY POLICY
                </button>
                <button
                  className={`btn  me-2 mb-2  btn-content ${activeButton === 'android' ? 'active' : ''}`}
                  style={{ width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('android')}
                >
                  ANDROID APP URL
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'ios' ? 'active' : ''}`}
                  style={{ width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('ios')}
                >
                  IOS APP URL
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'share' ? 'active' : ''}`}
                  style={{ width: 'fit-content', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('share')}
                >
                  Share Message
                </button>
              </div>
            </nav>
            <br />
            <div className="user-details">
              {content === 0 && (
                <div>
                  <span className="mb-2" style={{ fontSize: '15px' }}>
                    About us
                  </span>
                  <div>
                    <JoditEditor value={about} config={config1} onBlur={(htmlString) => setAbout(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('about')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 1 && (
                <div>
                  <span>Terms And Conditions</span>
                  <div>
                    <JoditEditor value={terms} config={config1} onBlur={(htmlString) => setTerms(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('terms')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 2 && (
                <div>
                  <span>Privacy Policy</span>
                  <div>
                    <JoditEditor value={privacy} config={config1} onBlur={(htmlString) => setPrivacy(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('privacy')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 3 && (
                <div>
                  <span>Android App Url</span>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={android}
                      onChange={(e) => setAndroid(e.target.value)}
                      placeholder="Enter android app url"
                    />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('android')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 4 && (
                <div>
                  <span>IOS App Url</span>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={ios}
                      onChange={(e) => setIos(e.target.value)}
                      placeholder="Enter ios app url"
                    />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('ios')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 5 && (
                <div>
                  <span>Share Message</span>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={share}
                      onChange={(e) => setShare(e.target.value)}
                      placeholder="Enter share message"
                    />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('share')}>
                    Update
                  </button>{' '}
                </div>
              )}
            </div>
          </div>
        </div>
      <Modal show={contentUpdated} onHide={handleCloseContentUpdated} style={{ marginTop: '107px' }}>
          <Modal.Header>
            <Modal.Title>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Content Updated Successfully
          </Modal.Body>
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
