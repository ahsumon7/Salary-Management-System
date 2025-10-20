import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className='stat-card-icon'>{icon}</div>
      <div className='stat-card-content'>
        <h3>{title}</h3>
        <p>{Number(value).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatCard;
