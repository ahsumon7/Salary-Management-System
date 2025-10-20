import React from 'react';
import Button from './Button';

const Table = ({ data = [], onEdit, onDelete }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className='table'>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
            {(onEdit || onDelete) && (
              <td>
                {onEdit && <Button onClick={() => onEdit(row)}>Edit</Button>}
                {onDelete && (
                  <Button onClick={() => onDelete(row.id)}>Delete</Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
