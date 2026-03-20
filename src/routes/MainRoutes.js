import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ManageUser from '../views/AllPage/ManageUser';
import Managecontent from 'views/AllPage/ManageContent';
import Managebroadcast from 'views/AllPage/ManageBroadcast';
import AdminLanguage from 'views/AllPage/AdminLanguage';
import ManageCategory from 'views/AllPage/ManageCategory';
import ManageContact from 'views/AllPage/ManageContact';
import Reply from 'views/AllPage/SendReply';
import Report from 'views/AllPage/CustomerReport';
import UserAnaReport from 'views/AllPage/UserAnalyticalReport';
import Profile from 'views/AllPage/Profile';
import ManageDisease from 'views/AllPage/ManageDisease';
import ManageMedicine from 'views/AllPage/ManageMedicine';
import ManageReportCategory from 'views/AllPage/ManageReportCategory';
import ManageSymptom from 'views/AllPage/ManageSymptom';
import ViewUser from 'views/AllPage/ViewUsers';
import DeleteUser from 'views/AllPage/DeletedUsers';
import ManageMedicinetype from 'views/AllPage/ManageMedicinetype';
import ManageDoctors from 'views/AllPage/ManageDoctors';
import { APP_PREFIX_PATH } from 'config/constant';
import ViewDoctor from 'views/AllPage/ViewDoctor';
import DoctorReport from 'views/AllPage/DoctorReport';
import DoctorAnaReport from 'views/AllPage/DoctorAnalyticalReport';
import SharedTabularData from 'views/AllPage/SharedTabularData';
import MedicationReport from 'views/AllPage/MedicationReport';
import AdverseReport from 'views/AllPage/AdverseReport';
import MeasurementReport from 'views/AllPage/MeasurementReport';
import LabReportTabular from 'views/AllPage/LabReportTabular';
import BulkUploadSymptom from 'views/AllPage/BulkUploadSymptom';
import BulkUploadDesease from 'views/AllPage/BulkUploadDesease';
import BulkUploadMadicine from 'views/AllPage/BulkUploadMadicine';
import BulkUploadMedicineCategory from 'views/AllPage/BulkUploadMedicineCategory';
import ManageCompliance from 'views/AllPage/ManageCompliance';
import ManageFaq from 'views/AllPage/ManageFaq';
import DeleteDoctor from 'views/AllPage/DeleteDoctor';
// import AdminAnalytics from 'views/AllPage/AdminAnalytics';
import NewInsights from 'views/AllPage/NewInsights';

const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard')));
const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: APP_PREFIX_PATH,          // BASE PATH: /meditrek/admin
  element: <MainLayout />,
  children: [

    /** Dashboard */
    { index: true, element: <DashboardDefault /> },
    { path: 'dashboard', element: <DashboardDefault /> },

    /** Manage User */
    { path: 'manage-user/userlist', element: <ManageUser /> },
    { path: 'manage-user/userlist/view_user/:user_id/:user_id', element: <ViewUser /> },
    { path: 'manage-user/deleteuser', element: <DeleteUser /> },
    { path: 'manage-user/deletedoctor', element: <DeleteDoctor /> },

    /** Compliance */
    { path: 'manage-compliance', element: <ManageCompliance /> },

    /** Reply */
    { path: 'send-reply', element: <Reply /> },

    /** Doctor Category */
    { path: 'manage-category', element: <ManageCategory /> },

    /** FAQ */
    { path: 'manage-faq', element: <ManageFaq /> },

    /** Report Category */
    { path: 'manage-report-category', element: <ManageReportCategory /> },

    /** Symptom */
    { path: 'manage-symptom', element: <ManageSymptom /> },

    /** Medicine */
    { path: 'manage-medicine', element: <ManageMedicine /> },
    { path: 'manage-medicine/manage-medicine-type', element: <ManageMedicinetype /> },

    /** View Doctor */
    { path: 'view-doctor/:doctor_id', element: <ViewDoctor /> },

    /** Disease */
    { path: 'manage-disease', element: <ManageDisease /> },

    /** Doctors */
    { path: 'manage-doctor', element: <ManageDoctors /> },

    /** Contact */
    { path: 'manage-contact-us', element: <ManageContact /> },
    { path: 'manage-contact-usr/send-reply', element: <Reply /> },

    /** CMS Content */
    { path: 'manage-contents', element: <Managecontent /> },

    /** Broadcast */
    { path: 'manage-broadcast', element: <Managebroadcast /> },

    /** Utils */
    { path: 'utils/util-typography', element: <UtilsTypography /> },

    /** Sample Page */
    { path: 'sample-page', element: <SamplePage /> },

    /** Profile */
    { path: 'profile', element: <Profile /> },

    /** Tabular Reports */
    { path: 'tabular-report/user-report', element: <Report /> },
    { path: 'tabular-report/doctor-report', element: <DoctorReport /> },
    { path: 'tabular-report/medication-report', element: <MedicationReport /> },
    { path: 'tabular-report/health-report', element: <AdverseReport /> },
    { path: 'tabular-report/measurement-report', element: <MeasurementReport /> },
    { path: 'tabular-report/lab-report', element: <LabReportTabular /> },
    { path: 'tabular-report/shared-report', element: <SharedTabularData /> },

    /** Analytical Reports */
    { path: 'analytic-report/user-ana-report', element: <UserAnaReport /> },
    { path: 'analytic-report/doctor-ana-report', element: <DoctorAnaReport /> },
    // {  path: 'analytic-report/admin-analytics', element: <AdminAnalytics /> },
    {  path: 'insights/new-insights',  element: <NewInsights /> },

    /** Bulk Upload */
    { path: 'bulk-upload-symptom', element: <BulkUploadSymptom /> },
    { path: 'bulk-upload-desease', element: <BulkUploadDesease /> },
    { path: 'bulk_upload_medicine', element: <BulkUploadMadicine /> },
    { path: 'bulk_upload_category', element: <BulkUploadMedicineCategory /> },

    { path: '/admin/languages', element: <AdminLanguage /> }
  ]
};

export default MainRoutes;
