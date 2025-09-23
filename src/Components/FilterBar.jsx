import React, { useState } from 'react';

// Mock data for cohorts
const mockCohorts = [
  { id: 1, name: 'FT-01' },
  { id: 2, name: 'FT-02' },
  { id: 3, name: 'PT-01' },
];

const FilterBar = () => {
  const [filters, setFilters] = useState({
    cohortId: '',
    status: {
      approved: false,
      declined: false,
      pending: false,
    },
  });

  const handleCohortChange = (e) => {
    const newFilters = {
      ...filters,
      cohortId: e.target.value,
    };
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleStatusChange = (status) => {
    const newFilters = {
      ...filters,
      status: {
        ...filters.status,
        [status]: !filters.status[status],
      },
    };
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  return (
    <div className="filter-bar p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Cohort Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Cohort
          </label>
          <select
            value={filters.cohortId}
            onChange={handleCohortChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">All Cohorts</option>
            {mockCohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Checkboxes */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
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