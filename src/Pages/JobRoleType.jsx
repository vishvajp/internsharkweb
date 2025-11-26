import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const JobRoleType = ({jobRoleTypes, formData, setFormData}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const sortedAndFilteredRoles = useMemo(() => {
    return [...jobRoleTypes]
      .sort((a, b) => a.job_role_name.localeCompare(b.job_role_name))
      .filter(role => 
        role.job_role_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [jobRoleTypes, searchTerm]);

  const handleRoleSelect = (roleId) => {
    const selectedRole = jobRoleTypes.find(role => role.job_role_id === roleId);
    setFormData({
      ...formData,
      intern_skill_id: selectedRole?.job_role_id || "",
      intern_skill_name: selectedRole?.job_role_name || "",
    });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };
  return (
    <div className="row align-items-center mb-3">
      <div className="col-md-2">
        <label className="form-label">Role Type*</label>
      </div>
      <div className="col-md-8 position-relative">
        {/* Custom dropdown implementation */}
        <div className="dropdown">
          <button
            className="form-control text-start d-flex justify-content-between align-items-center"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {formData.intern_skill_name || "Select a role"}
            <span className="ms-auto">
                <IoIosArrowDown 
            className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            size={18}
          />
            </span>
          </button>
          
          {isDropdownOpen && (
            <div 
              className="dropdown-menu show w-100 p-2"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              {/* Search input */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              
              {/* Role options */}
              {sortedAndFilteredRoles.length > 0 ? (
                sortedAndFilteredRoles.map((role) => (
                  <button
                    key={role.job_role_id}
                    className={`dropdown-item ${formData.intern_skill_id === role.job_role_id ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleRoleSelect(role.job_role_id)}
                  >
                    {role.job_role_name}
                  </button>
                ))
              ) : (
                <div className="dropdown-item text-muted">
                  No roles found
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Hidden select for form validation */}
        <select
          className="d-none"
          required
          value={formData.intern_skill_id || ""}
          name="intern_skill_id"
          onChange={() => {}}
        >
          <option value="">Select a role</option>
          {jobRoleTypes.map((role) => (
            <option key={role.job_role_id} value={role.job_role_id}>
              {role.job_role_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default JobRoleType