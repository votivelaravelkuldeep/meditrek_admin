import React from 'react';

function DoctorStatus({ active_flag }) {
  const isActive = active_flag === 1;

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        background: isActive ? '#dcfce7' : '#fee2e2',
        color: isActive ? '#16a34a' : '#dc2626',
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }}
    >
      {isActive ? 'Active' : 'Deactive'}
    </span>
  );
}

export default DoctorStatus;