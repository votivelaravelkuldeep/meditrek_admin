import React from "react";

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required,
  rows = 4,
}) => {
  return (
    <div className="w-100">
      {/* Label */}
      {label && (
        <label className="block font-medium mb-1" style={{fontSize:'13px',}}>
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`form-control
          w-100 rounded-[10px] px-[14px] py-[10px] text-[13px]
          border 
          ${error && touched ? "border-red-600" : "border-gray-200"}
          focus:border-[#1ddec4] focus:outline-none
          transition-all resize-none
        `}
        style={{fontSize:'13px'}}
      />

      {error && touched && (
        <p className="text-red-600 text-[12px] mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormTextarea;