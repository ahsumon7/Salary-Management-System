import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        {title && (
          <div className='modal-header'>
            <h2>{title}</h2>
            <button onClick={onClose} className='close-button'>
              X
            </button>
          </div>
        )}
        <div className='modal-content'>{children}</div>
        <div className='modal-footer'>
          <button onClick={onClose} className='footer-button'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
