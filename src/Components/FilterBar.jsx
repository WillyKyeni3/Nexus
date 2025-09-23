import React, { useState } from 'react';

const FilterBar = () => {
  const [filters, setFilters] = useState({
    status: {
      approved: false,
      declined: false,
    },
  });

  const handleStatusChange = (status) => {
    const newFilters = {
      status: {
        ...filters.status,
        [status]: !filters.status[status],
      },
    };
    setFilters(newFilters);
    console.log('Vote filters updated:', newFilters);
  };

  return (
    <div className="filter-bar p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center">
        {/* Status Checkboxes */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Vote Status
          </label>
          <div className="flex gap-4">
            {Object.entries(filters.status).map(([status, checked]) => (
              <label key={status} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleStatusChange(status)}
                  className="rounded text-blue-600"
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;