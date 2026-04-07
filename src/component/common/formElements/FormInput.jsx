import React from "react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
  touched,
  required,
  disabled = false,
  readOnly = false,
  rightIcon,
  onIconClick,
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-[13px] font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full rounded-[10px] px-[14px] py-[10px] text-[13px]
            border 
            ${error && touched ? "border-red-600" : "border-gray-200"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            focus:border-[#1ddec4] focus:outline-none focus:ring-0
            transition-all
          `}
        />

        {/* Right Icon (for password etc.) */}
        {rightIcon && (
          <button
            type="button"
            onClick={onIconClick}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0
            }}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {/* Error */}
      {error && touched && (
        <p className="text-red-600 text-[12px] mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;

{/* <FormInput
  label="Mobile Number"
  name="mobile"
  value={values.mobile}
  onChange={handleChange}
  onBlur={handleBlur}
  placeholder="Enter Mobile Number"
  error={errors.mobile}
  touched={touched.mobile}
  required
/> */}

// password with icon 
{/* <FormInput
  label="New Password"
  name="newPassword"
  type={showNewPassword ? "text" : "password"}
  value={values.newPassword}
  onChange={handleChange}
  onBlur={handleBlur}
  placeholder="Enter New Password"
  error={errors.newPassword}
  touched={touched.newPassword}
  required
  rightIcon={
    showNewPassword ? <VisibilityOff size={18} /> : <Visibility size={18} />
  }
  onIconClick={handleClickShowNewPassword}
/> */}


// disable field
{/* <FormInput
  label="Full Name"
  name="name"
  value={values.name}
  disabled
/> */}