import React from 'react';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { APP_PREFIX_PATH } from 'config/constant';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function DoctorActions({
  doctor,
  index,
  handleActionChange,
  handleActiveDeactive,
  handleDeleteDoctor,
  handleEditEmail 
}) {
  return (
    <div className="dropdown text-center">
      <button
        className="btn btn-primary dropdown-toggle action-btn"
        data-bs-toggle="dropdown"
         style={{
              display: 'inline-block',
              padding: '2px 8px',
              fontSize: '11px'
            }}
      >
        Action
      </button>

      <ul className="dropdown-menu" style={{ fontSize: '12px' }}>
        <li>
          <Link
            to={`${APP_PREFIX_PATH}/view-doctor/${btoa(doctor.doctor_id)}`}
            className="dropdown-item d-flex align-items-center"
          >
            <VisibilityIcon style={{ fontSize: '16px' }} className='me-1' /> View
          </Link>
        </li>

        {doctor.approve_status === 0 && (
          <>
            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() =>
                  handleActionChange(
                    index,
                    'Approve',
                    doctor.doctor_id,
                    doctor.doctor_name,
                    doctor.doctor_category_id,
                    doctor.mobile,
                    doctor.email
                  )
                }
              >
                <AddTaskIcon style={{fontSize:'16px'}} className='me-1' /> Approve
              </button>
            </li>

            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() =>
                  handleActionChange(index, 'Reject', doctor.doctor_id)
                }
              >
                <CancelIcon style={{fontSize:'16px'}} className='me-1' /> Reject
              </button>
            </li>
          </>
        )}

        {doctor.approve_status === 1 && (
          <li>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={() =>
                handleActiveDeactive(
                  doctor.doctor_id,
                  doctor.active_flag
                )
              }
            >
              <ToggleOnIcon style={{ fontSize: '16px' }} />
              Activate/Deactivate
            </button>
          </li>
        )}

   <li>
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleEditEmail(doctor.doctor_id, doctor.email)}
          // ✅ just call the prop
      >
        <EditIcon style={{ fontSize: '16px' }} className="me-1" /> Edit Email
      </button>
    </li>

        <li>  
          <button
            className="dropdown-item text-danger d-flex align-items-center"
            onClick={() => handleDeleteDoctor(doctor.doctor_id)}
          >
            <DeleteIcon style={{fontSize:'16px'}} className='me-1' /> Delete
          </button>
        </li>
      </ul>
    </div>
  );
}

export default DoctorActions;