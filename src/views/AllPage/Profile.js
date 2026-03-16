import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  API_URL, IMAGE_PATH,
  // APP_PREFIX_PATH 
} from 'config/constant';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Profile = () => {
  const theme = useTheme();
  const [content, setContent] = useState(0);
  const [activeButton, setActiveButton] = useState('profile');
  const [userDetails, setUserDetails] = useState([]);
  const [preview, setPreview] = useState(userDetails.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  const contentTypes = {
    profile: 0,
    password: 1
  };

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
  };


  const fetchUserDetails = async () => {
    try {
      let response;
      response = await axios.get(`${API_URL}get_admin_data`,);
      console.log(response.data)

      if (response.data.success) {
        setUserDetails(response.data.info[0]);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    setPreview(userDetails.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`);
  }, []);

  const handleImageUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    setFieldValue('image', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(userDetails.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`);
      setFieldValue('image', null);
    }
  };

  const FILE_SIZE = 50 * 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png",];

  const profileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter Name'),
    email: Yup.string().email('Invalid email').required('Please enter Email'),
    image: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileSize",
        "Image size is too large",
        value => !value || (value && value.size <= FILE_SIZE)
      )
      .test(
        "fileFormat",
        "Unsupported format. Supported formats: jpg, jpeg, gif, png",
        value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  });


  const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Please enter Current password'),
    newPassword: Yup.string().required('Please enter New password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please enter Confirm password')
  });

  const getValidationSchema = (content) => {
    if (content === 0) {
      return profileValidationSchema;
    } else if (content === 1) {
      return passwordValidationSchema;
    }
    return Yup.object();
  };


  const handleSubmit = async (values) => {

    try {
      let response;
      console.log(values.image);
      if (content === 0) {
        response = await axios.post(`${API_URL}edit_admin_profile`, {
          name: values.name,
          email: values.email,
          image: values.image
        }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else if (content === 1) {
        response = await axios.post(`${API_URL}update_password`, {
          oldpassword: values.oldPassword,
          newPassword: values.newPassword
        },);
      }

      if (response.data.success) {
        if (content === 0) {
          Swal.fire({
            title: '',
            text: "Profile updated successfully",
            icon: 'success',
            timer: 2000
          });
        } else if (content === 1) {
          Swal.fire({
            title: '',
            text: "Password updated successfully",
            icon: 'success',
            timer: 2000
          });
        }
        values.oldPassword = "";
        values.newPassword = "";
        values.confirmPassword = "";
        values.name = "";
        fetchUserDetails()

      } else {
        console.log('Profile update failed', response.data.msg);
        Swal.fire({
          title: '',
          text: response.data.msg,
          icon: 'error',
          timer: 1000
        });
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <>
      <Card className="mb-5">
        <Card.Header className="bg-white">
          <Card.Title as="h5">Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="view-user-content row">
            <div className="col-lg-5">
              <div className="d-flex flex-wrap">
                <div className="img-div">
                  <img alt="Sepha Wilon"
                    src={userDetails.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`} className="profile-img2" />
                </div>
                <div className="mobile-view ms-3" style={{ marginTop: '30px' }}>
                  <h6>{userDetails?.name}</h6>
                  <h6>{userDetails?.email}</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-9 content"></div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          {userDetails && (
            <Formik
              initialValues={{
                name: userDetails?.name,
                email: userDetails?.email,
                image: null,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={getValidationSchema(content)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <nav>
                    <div className="container mb-2 mt-2" id="container-div">
                      <button
                        className={`btn me-2 mb-2 btn-content ${activeButton === 'profile' ? 'active-btns' : ''}`}
                        style={{ width: '11rem', fontSize: '14px', marginRight: '10px' }}
                        type="button"
                        onClick={() => handleButtonClick('profile')}
                      >
                        Edit Profile
                      </button>
                      <button
                        className={`btn me-2 mb-2 btn-content ${activeButton === 'password' ? 'active-btns' : ''}`}
                        style={{ width: '13rem', fontSize: '14px' }}
                        type="button"
                        onClick={() => handleButtonClick('password')}
                      >
                        Change Password
                      </button>
                    </div>
                  </nav>

                  {content === 0 && (
                    <div className="container">
                      <div className="mt-3">
                        <Form.Group className="mb-3" as={Row} controlId="formHorizontalName">
                          <Col sm={6} className="mb-3">
                            <div>Name</div>
                            <Form.Control
                              type="text"
                              placeholder="Enter Name"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.name && !!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Col>

                          <Col sm={6} className="mb-3">
                            <div>Email</div>
                            <Form.Control
                              type="text"
                              placeholder="Enter Email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.email && !!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Col>

                          <Col sm={12}>
                            <img src={preview} alt="Profile" className="profile-img mb-2 mt-1" />

                          </Col>
                          <Col sm={12}>
                            <div>Upload Image</div>
                            <Form.Control type="file" name='image' onChange={(event) => handleImageUpload(event, setFieldValue)} onBlur={handleBlur}
                              isInvalid={touched.image && !!errors.image} />
                            <Form.Control.Feedback type="invalid">
                              {errors.image}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" as={Row}>
                          <Col sm={{ span: 10 }}>
                            <Button type="submit" className="mt-2 submit-btn">
                              Submit
                            </Button>
                          </Col>
                        </Form.Group>
                      </div>
                    </div>
                  )}

                  {content === 1 && (
                    <div className="container">
                      <div className="mt-3">
                        <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                          <Col sm={6} className="mb-3">
                            <FormControl fullWidth error={Boolean(touched.oldPassword && errors.oldPassword)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
                              <InputLabel htmlFor="outlined-adornment-old-password">Current Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-old-password"
                                type={showOldPassword ? 'text' : 'password'}
                                value={values.oldPassword}
                                name="oldPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Current Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle old password visibility"
                                      onClick={handleClickShowOldPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.oldPassword && errors.oldPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.oldPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                          <Col sm={6} className="mb-3">
                            <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
                              <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={values.newPassword}
                                name="newPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="New Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle new password visibility"
                                      onClick={handleClickShowNewPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.newPassword && errors.newPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.newPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                          <Col sm={6} className="mb-3">
                            <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
                              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Confirm Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle confirm password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.confirmPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" as={Row}>
                          <Col sm={{ span: 10 }}>
                            <Button type="submit" className="mt-1 submit-btn">
                              Submit
                            </Button>
                          </Col>
                        </Form.Group>
                      </div>
                    </div>
                  )}

                </Form>
              )}
            </Formik>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Profile;
