import React, { useState } from "react";
import { Select, Button } from "antd";

const FilderStudent = ({ allStudents, setFilteredStudents }) => {
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Extract state and district from address (format: "Street, District, State" or "District, State")
  const extractLocation = (address) => {
    if (!address) return { state: null, district: null };
    const parts = address.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      return {
        state: parts[parts.length - 1], // Last part is state
        district: parts[parts.length - 2], // Second last is district
      };
    }
    return { state: null, district: null };
  };

  // Derive unique options
  const educationOptions = [
    ...new Set(allStudents?.map((s) => s.studentdegree).filter(Boolean)),
  ];
  const fieldOfStudyOptions = selectedEducation
    ? [
        ...new Set(
          allStudents
            ?.filter((s) => s.studentdegree === selectedEducation)
            .map((s) => s.studentfieldofstudy)
            .filter(Boolean)
        ),
      ].sort()
    : [];
  const collegeOptions = [
    ...new Set(allStudents?.map((s) => s.studentcollegename).filter(Boolean)),
  ];

  // Extract unique states and districts
  const stateOptions = [
    ...new Set(
      allStudents
        ?.map((s) => extractLocation(s.studentaddress).state)
        .filter(Boolean)
    ),
  ].sort();
  const districtOptions = selectedState
    ? [
        ...new Set(
          allStudents
            ?.filter(
              (s) => extractLocation(s.studentaddress).state === selectedState
            )
            .map((s) => extractLocation(s.studentaddress).district)
            .filter(Boolean)
        ),
      ].sort()
    : [];

  const handleSearch = () => {
    const filtered = allStudents.filter((student) => {
      const location = extractLocation(student.studentaddress);
      return (
        (!selectedEducation || student.studentdegree === selectedEducation) &&
        (!selectedFieldOfStudy ||
          student.studentfieldofstudy === selectedFieldOfStudy) &&
        (!selectedCollege || student.studentcollegename === selectedCollege) &&
        (!selectedState || location.state === selectedState) &&
        (!selectedDistrict || location.district === selectedDistrict)
      );
    });
    setFilteredStudents(filtered);
  };

  const handleClearFilters = () => {
    setSelectedEducation(null);
    setSelectedFieldOfStudy(null);
    setSelectedCollege(null);
    setSelectedState(null);
    setSelectedDistrict(null);
    setFilteredStudents(allStudents);
  };

  return (
    <>
      <div className="row">
        <div className="col-6 h6">Filter Student</div>
        <div className="col-6 text-end">
          <Button size="small" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </div>
      <div className="row g-2 mt-2">
        <div className="col-lg-2 d-flex flex-column">
          <label className="form-label h6">Degree</label>
          <Select
            className="custom-ant-select"
            placeholder="Select Degree"
            style={{ width: "100%" }}
            value={selectedEducation}
            onChange={(value) => {
              setSelectedEducation(value);
              setSelectedFieldOfStudy(null); // Reset field of study when degree changes
            }}
            options={educationOptions.map((item) => ({
              value: item,
              label: item,
            }))}
            allowClear
            showSearch
          />
        </div>
        <div className="col-lg-2 d-flex flex-column">
          <label className="form-label h6">Field of Study</label>
          <Select
            className="custom-ant-select"
            placeholder="Select Field"
            style={{ width: "100%" }}
            value={selectedFieldOfStudy}
            onChange={(value) => setSelectedFieldOfStudy(value)}
            options={fieldOfStudyOptions.map((item) => ({
              value: item,
              label: item,
            }))}
            allowClear
            showSearch
            disabled={!selectedEducation}
          />
        </div>
        <div className="col-lg-2 d-flex flex-column">
          <label className="form-label h6">College</label>
          <Select
            className="custom-ant-select"
            placeholder="Select College"
            style={{ width: "100%" }}
            value={selectedCollege}
            onChange={(value) => setSelectedCollege(value)}
            options={collegeOptions.map((item) => ({
              value: item,
              label: item,
            }))}
            allowClear
            showSearch
          />
        </div>
        <div className="col-lg-2 d-flex flex-column">
          <label className="form-label h6">State</label>
          <Select
            className="custom-ant-select"
            placeholder="Select State"
            style={{ width: "100%" }}
            value={selectedState}
            onChange={(value) => {
              setSelectedState(value);
              setSelectedDistrict(null); // Reset district when state changes
            }}
            options={stateOptions.map((item) => ({
              value: item,
              label: item,
            }))}
            allowClear
            showSearch
          />
        </div>
        <div className="col-lg-1 d-flex flex-column">
          <label className="form-label h6">District</label>
          <Select
            className="custom-ant-select"
            placeholder="Select District"
            style={{ width: "100%" }}
            value={selectedDistrict}
            onChange={(value) => setSelectedDistrict(value)}
            options={districtOptions.map((item) => ({
              value: item,
              label: item,
            }))}
            allowClear
            showSearch
            disabled={!selectedState}
          />
        </div>
        <div className="col-lg-1 d-flex align-items-end justify-content-center mt-lg-0 mt-3">
          <Button type="primary" block onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilderStudent;
