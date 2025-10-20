import React from 'react';

const StatCard = ({ title, value, icon, color = '' }) => {
  return (
    <div className={`stat-card ${color}`}>
      {icon && <div className='stat-card-icon'>{icon}</div>}
      <div className='stat-card-content'>
        <h3>{title}</h3>
        <p>{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatCard;
