import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    cohort: '',
  });

  const handleStatusChange = (e) => {
    const newFilters = {
      ...filters,
      status: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCohortChange = (e) => {
    const newFilters = {
      ...filters,
      cohort: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-bar">
      <div className="filter-options">
        {/* Vote Status Dropdown */}
        <div className="filter-group">
          <label className="filter-label">Filter by Vote Status</label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="form-input"
          >
            <option value="all">All Projects</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Cohort Filter */}
        <div className="filter-group">
          <label className="filter-label">Filter by Cohort</label>
          <input
            type="text"
            value={filters.cohort}
            onChange={handleCohortChange}
            placeholder="Enter cohort name..."
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;