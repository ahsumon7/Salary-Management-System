import React from 'react';
import Button from './Button';

const Table = ({ data = [], onEdit, onDelete }) => {
  if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;

  // Headers: flatten nested objects if needed
  const flattenRow = (row) => {
    const result = {};
    Object.keys(row).forEach((key) => {
      if (typeof row[key] === 'object' && row[key] !== null) {
        // Flatten nested object (e.g., bankAccount)
        Object.keys(row[key]).forEach((nestedKey) => {
          result[`${key}.${nestedKey}`] = row[key][nestedKey];
        });
      } else {
        result[key] = row[key];
      }
    });
    return result;
  };

  const headers = Object.keys(flattenRow(data[0]));

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => {
          const flatRow = flattenRow(row);
          return (
            <tr key={row.employeeId || row.id || rowIndex}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex}>{flatRow[header]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && <Button onClick={() => onEdit(row)}>Edit</Button>}
                  {onDelete && <Button onClick={() => onDelete(row.employeeId || row.id)} style={{ marginLeft: '10px' }}>Delete</Button>}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
