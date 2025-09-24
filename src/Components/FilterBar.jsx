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
    <div className="filter-bar">
      <div className="filter-content">
        <div className="filter-section">
          <h3 className="filter-title">Filter by Vote Status</h3>
          <div className="filter-options">
            {Object.entries(filters.status).map(([status, checked]) => (
              <label key={status} className="filter-option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleStatusChange(status)}
                  className="filter-checkbox"
                />
                <span className="filter-label capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;