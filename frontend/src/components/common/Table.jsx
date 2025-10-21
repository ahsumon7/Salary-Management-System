// src/components/common/Table.jsx (or wherever it lives)

import React from 'react';
import Button from './Button';

// Utility function to format headers (e.g., 'bankAccount.accountName' -> 'Account Name')
const formatHeader = (header) => {
  // Remove object prefix (e.g., 'bankAccount.')
  let cleanHeader = header.includes('.') ? header.split('.')[1] : header;

  // Capitalize first letter and replace camelCase/kebab-case/underscores with spaces
  cleanHeader = cleanHeader.replace(/([A-Z])/g, ' $1').toLowerCase();
  cleanHeader = cleanHeader.replace(/_/g, ' ');
  cleanHeader = cleanHeader.charAt(0).toUpperCase() + cleanHeader.slice(1);
  
  // Custom overrides for specific keys from the screenshot
  if (header === 'id') return 'ID';
  if (header === 'name') return 'Name';
  if (header === 'bankAccount.accountNumber') return 'Account Number';
  if (header === 'bankAccount.bankName') return 'Bank Name';
  if (header === 'bankAccount.branchName') return 'Branch';

  return cleanHeader;
};

const Table = ({ data = [], onEdit, onDelete }) => {
  if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;

  // Function to flatten one row
  const flattenRow = (row) => {
    const result = {};
    Object.keys(row).forEach((key) => {
      if (typeof row[key] === 'object' && row[key] !== null && !Array.isArray(row[key])) {
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
  const hasActions = onEdit || onDelete;

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-indigo-600 text-white">
                <tr>
                    {headers.map((header) => (
                        <th 
                            key={header}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                            {formatHeader(header)}
                        </th>
                    ))}
                    {hasActions && (
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-32">
                            Actions
                        </th>
                    )}
                </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => {
                    const flatRow = flattenRow(row);
                    const rowId = row.employeeId || row.id || rowIndex;
                    
                    return (
                        // Apply Zebra Stripes: bg-gray-50 for odd rows
                        <tr key={rowId} className={rowIndex % 2 !== 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                            {headers.map((header, cellIndex) => (
                                <td 
                                    key={cellIndex} 
                                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                                >
                                    {/* Display only essential bank account fields to avoid clutter */}
                                    {/* This is a visual check; the flattenRow handles the data */}
                                    {flatRow[header]}
                                </td>
                            ))}
                            {hasActions && (
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                    {onEdit && (
                                        <button 
                                            onClick={() => onEdit(row)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-2 font-medium"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button 
                                            onClick={() => onDelete(rowId)}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};

export default Table;