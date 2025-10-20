import React from 'react';

const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  required = false,
  label,
  error,
}) => {
  return (
    <div className='input-container'>
      {label && (
        <label>
          {label} {required && <span className='required'>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${error ? 'input-error' : ''}`}
      />
      {error && <span className='error-message'>{error}</span>}
    </div>
  );
};

export default Input;
