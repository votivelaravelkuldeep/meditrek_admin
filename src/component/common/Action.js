import React from 'react';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { APP_PREFIX_PATH } from 'config/constant';

function DoctorActions({
  doctor,
  index,
  handleActionChange,
  handleActiveDeactive,
  handleDeleteDoctor
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
            className="dropdown-item"
          >
            <VisibilityIcon style={{ fontSize: '16px' }} /> View
          </Link>
        </li>

        {doctor.approve_status === 0 && (
          <>
            <li>
              <button
                className="dropdown-item"
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
                ✅ Approve
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  handleActionChange(index, 'Reject', doctor.doctor_id)
                }
              >
                ❌ Reject
              </button>
            </li>
          </>
        )}

        {doctor.approve_status === 1 && (
          <li>
            <button
              className="dropdown-item"
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
            className="dropdown-item text-danger"
            onClick={() => handleDeleteDoctor(doctor.doctor_id)}
          >
            🗑 Delete
          </button>
        </li>
      </ul>
    </div>
  );
}

export default DoctorActions;