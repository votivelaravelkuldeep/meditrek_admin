import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
// import BackupTableIcon from '@mui/icons-material/BackupTable';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupIcon from '@mui/icons-material/Group';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DifferenceIcon from '@mui/icons-material/Difference';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MedicationIcon from '@mui/icons-material/Medication';
import SickIcon from '@mui/icons-material/Sick';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import { APP_PREFIX_PATH } from 'config/constant';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// import { APP_PREFIX_PATH } from 'config/constant';
const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  StarPurple500Icon: StarPurple500Icon,
  CategoryIcon: CategoryIcon,
  GroupIcon: GroupIcon,
  DifferenceIcon: DifferenceIcon,
  PhotoLibraryIcon: PhotoLibraryIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  ContactPhoneIcon: ContactPhoneIcon,
  BroadcastOnHomeIcon: BroadcastOnHomeIcon,
  BackupTableIcon: BackupTableIcon,
  AutoGraphIcon: AutoGraphIcon,
  PersonRemoveIcon: PersonRemoveIcon,
  CollectionsBookmarkIcon: CollectionsBookmarkIcon,
  LocalPharmacyIcon: LocalPharmacyIcon,
  SummarizeIcon: SummarizeIcon,
  SickIcon: SickIcon,
  MedicationIcon: MedicationIcon,
  CoronavirusIcon: CoronavirusIcon,
  PersonAddAltIcon: PersonAddAltIcon,
  // BackupTableIcon: BackupTableIcon
};

// eslint-disable-next-line
export default {
  items: [
    {
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: APP_PREFIX_PATH + '/'
        },
        {
          id: 'manageUser',
          title: 'Manage User',
          type: 'collapse',
          icon: icons['GroupIcon'],
          children: [
            {
              id: 'userList',
              title: 'User List',
              type: 'item',
              url: APP_PREFIX_PATH + '/manage-user/userlist',
              icon: icons['PersonAddAltIcon']
            },
            {
              id: 'deleteUserList',
              title: 'Deleted User List',
              type: 'item',
              url: APP_PREFIX_PATH + '/manage-user/deleteuser',
              icon: icons['PersonRemoveIcon']
            }
          ]
        },
        {
          id: 'managedoctorCategory',
          title: 'Manage Doctor Category',
          type: 'item',
          icon: icons['CategoryIcon'],
          url: APP_PREFIX_PATH + '/manage-category'
        },
        //    {
        //   id: 'manageCompliance',
        //   title: 'Manage Compliance',
        //   type: 'item',
        //   icon: icons['MedicationIcon'],
        //   url: APP_PREFIX_PATH + '/manage-compliance'
        // },
       

        {
          id: 'manageDoctor',
          title: 'Manage Doctor',
          type: 'collapse',
          icon: icons['GroupIcon'],
          children: [
             {
          id: 'doctorList',
          title: 'Doctor List',
          type: 'item',
          icon: icons['MedicationIcon'],
          url: APP_PREFIX_PATH + '/manage-doctor'
        },
            {
              id: 'deleteDoctorList',
              title: 'Deleted Doctor List',
              type: 'item',
              url: APP_PREFIX_PATH + '/manage-user/deletedoctor',
              icon: icons['PersonRemoveIcon']
            }
          ]
        },
        // {
        //   id: 'manageMedicine',
        //   title: 'Manage Medicine',
        //   type: 'collapse',
        //   icon: icons['GroupIcon'],
        //   children: [
        //     {
        //       id: 'medicineType',
        //       title: 'Medicine Type',
        //       type: 'item',
        //       url: APP_PREFIX_PATH + '/manage-medicine/manage-medicine-type',
        //       icon: icons['LocalPharmacyIcon']
        //     },
        //     {
        //       id: 'manageMedicine',
        //       title: 'Manage Medicine',
        //       type: 'item',
        //       icon: icons['LocalPharmacyIcon'],
        //       url: APP_PREFIX_PATH + '/manage-medicine'
        //     }
        //   ]
        // },
        {
          id: 'manageMedicine',
          title: 'Manage Medicine',
          type: 'item',
          icon: icons['LocalPharmacyIcon'],
          url: APP_PREFIX_PATH + '/manage-medicine'
        },

        // {
        //   id: 'manageAdverse',
        //   title: 'Manage Adverse',
        //   type: 'item',
        //   icon: icons['CategoryIcon'],
        //   url: '/manage-adverse'
        // },
        {
          id: 'manageDisease',
          title: 'Manage Disease',
          type: 'item',
          icon: icons['CoronavirusIcon'],
          url: APP_PREFIX_PATH + '/manage-disease'
        },
        {
          id: 'manageSymptom',
          title: 'Manage Symptom',
          type: 'item',
          icon: icons['SickIcon'],
          url: APP_PREFIX_PATH + '/manage-symptom'
        },
        {
          id: 'manageReportCategory',
          title: 'Manage Report Category',
          type: 'item',
          icon: icons['SummarizeIcon'],
          url: APP_PREFIX_PATH + '/manage-report-category'
        },
          {
          id: 'manageFaq',
          title: 'Manage FAQ',
          type: 'item',
          icon: icons['SummarizeIcon'],
          url: APP_PREFIX_PATH + '/manage-faq'
        },
        // {
        //   id: 'manageBanner',
        //   title: 'Manage Banner',
        //   type: 'item',
        //   icon: icons['PhotoLibraryIcon'],
        //   url: '/manage-banner'
        // },

        {
          id: 'manageContents',
          title: 'Manage Contents',
          type: 'item',
          icon: icons['DifferenceIcon'],
          url: APP_PREFIX_PATH + '/manage-contents'
        },
        // {
        //   id: 'manageBooking',
        //   title: 'Manage Booking',
        //   type: 'item',
        //   icon: icons['CollectionsBookmarkIcon'],
        //   url: '/manage-booking'
        // },

        {
          id: 'manageContactUs',
          title: 'Manage Help & Support',
          type: 'item',
          icon: icons['ContactPhoneIcon'],
          url: APP_PREFIX_PATH + '/manage-contact-us'
        },

        {
          id: 'manageBroadcast',
          title: 'Manage Broadcast',
          type: 'item',
          icon: icons['BroadcastOnHomeIcon'],
          url: APP_PREFIX_PATH + '/manage-broadcast'
        },

        {
          id: 'tabularReport',
          title: 'Tabular Report',
          type: 'collapse',
          icon: icons['BackupTableIcon'],
          children: [
            {
              id: 'userReport',
              title: 'User Report',
              type: 'item',
              url: APP_PREFIX_PATH + '/tabular-report/user-report',
              icon: icons['BackupTableIcon']
            },
            {
              id: 'doctorReport',
              title: 'Doctor Report',
              type: 'item',
              icon: icons['BackupTableIcon'],
              url: APP_PREFIX_PATH + '/tabular-report/doctor-report'
            },
            {
              id: 'medicationReport',
              title: ' User Medication Report',
              type: 'item',
              icon: icons['BackupTableIcon'],
              url: APP_PREFIX_PATH + '/tabular-report/medication-report'
            },
            {
              id: 'adverseReport',
              title: 'Health Report',
              type: 'item',
              icon: icons['BackupTableIcon'],
              url: APP_PREFIX_PATH + '/tabular-report/health-report'
            },
            {
              id: 'measurementReport',
              title: 'Measurement Report',
              type: 'item',
              icon: icons['BackupTableIcon'],
              url: APP_PREFIX_PATH + '/tabular-report/measurement-report'
            },
            // {
            //   id: 'labReport',
            //   title: 'Lab Report',
            //   type: 'item',
            //   icon: icons['BackupTableIcon'],
            //   url: APP_PREFIX_PATH + '/tabular-report/lab-report'
            // },
            // {
            //   id: 'sharedReport',
            //   title: 'Shared Information',
            //   type: 'item',
            //   icon: icons['BackupTableIcon'],
            //   url: APP_PREFIX_PATH + '/tabular-report/shared-report'
            // },
          ]
        },

        {
          id: 'analytical Report',
          title: 'Analytical Report',
          type: 'collapse',
          icon: icons['AutoGraphIcon'],
          children: [
            {
              id: 'userAnalyticalReport',
              title: 'User Analytical Report',
              type: 'item',
              url: APP_PREFIX_PATH + '/analytic-report/user-ana-report',
              icon: icons['PersonAddAltIcon']
            }, {
              id: 'doctorAnalyticalReport',
              title: 'Doctor Analytical Report',
              type: 'item',
              icon: icons['MedicationIcon'],
              url: APP_PREFIX_PATH + '/analytic-report/doctor-ana-report'
            },
          ]
        }
      ]
    }
  ]
};
