import { useEffect, useState } from "react";
import "./JobdetailsSideFilder.css";
import { Select } from "antd";
import { FaFilter, FaTimes } from "react-icons/fa";
import { getIndustryDetailbyid } from "../service/industryType";
import { getStates, getDistricts } from "../objects/IndiaLocations";

const { Option } = Select;

const JobdetailsSideFilder = ({ industryId, onFilter }) => {
  // Single source of truth for form state
  const [formData, setFormData] = useState({
    company_state: "",
    company_district: "",
    student_education: "",
    field_of_study: "",
  });

  const [getDetail, setGetDetail] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [uniqueDistricts, setUniqueDistricts] = useState([]);
  const [uniqueEduaction, setUniqueEducation] = useState([]);
  const [uniqueFieldOfStudy, setUniqueFieldOfStudy] = useState([]);
  const [uniqueStipends, setUniqueStipends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Handle all input changes
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission
  // const handleSubmit = async (e) => {
  //     if (e) e.preventDefault();
  //     setLoading(true);

  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) throw new Error('Authentication required');

  //       const payload = Object.fromEntries(
  //         Object.entries(formData).filter(([_, value]) => value !== '')
  //       );

  //       const response = await axios.post(
  //         `${baseurl}/filterInternIndustryPost/${industryId}`,
  //         payload,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //           timeout: 10000
  //         }
  //       );

  //       if (!response.data?.data) throw new Error('Invalid response');

  //       if (onFilter) {
  //         onFilter(
  //           formData,
  //           Object.keys(payload).length === 0 ? null : response.data.data
  //         );
  //       }

  //       // Close mobile filter after submission
  //       if (window.innerWidth < 992) {
  //         setIsMobileFilterOpen(false);
  //       }

  //     } catch (error) {
  //       console.error('Filtering failed:', error);
  //       // message.error('Failed to apply filters');
  //       if (onFilter) onFilter(formData, null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //node summit api
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const filters = {
        companystate: formData.company_state,
        companycity: formData.company_district,
        studentqualification: formData.student_education,
        fieldofstudy: formData.field_of_study,
      };
      const response = await getIndustryDetailbyid(industryId, filters);
      console.log("filtered job list detail", response);
      console.log("Applied filters:", filters);

      // Always call onFilter with the response (even if empty array)
      if (onFilter) {
        onFilter(filters, response || []); // pass filters and filtered data back to parent
      }

      // Close mobile filter after submission
      if (window.innerWidth < 992) {
        setIsMobileFilterOpen(false);
      }
    } catch (error) {
      console.log("Error while filter job", error);
      // Even on error, call onFilter with empty array to show "no results"
      if (onFilter) {
        onFilter(
          {
            companystate: formData.company_state,
            companycity: formData.company_district,
            studentqualification: formData.student_education,
            fieldofstudy: formData.field_of_study,
          },
          []
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFilter = () => {
    setIsMobileFilterOpen(false);
  };

  // Clear all filters
  const handleClearAll = () => {
    setFormData({
      company_state: "",
      company_district: "",
      student_education: "",
      field_of_study: "",
    });

    // Immediately trigger showing all jobs
    if (onFilter) onFilter({}, null); // Clear filters, show all jobs
  };

  //get posted jobs locations and other detail for filter from node
  useEffect(() => {
    const fetchfilters = async () => {
      try {
        const response = await getIndustryDetailbyid(industryId);
        const jobData = response;
        setGetDetail(response);

        setUniqueStates([
          ...new Set(jobData.map((item) => item.companystate).filter(Boolean)),
        ]);
        setUniqueDistricts([
          ...new Set(jobData.map((item) => item.companycity).filter(Boolean)),
        ]);
        setUniqueEducation([
          ...new Set(
            jobData.map((item) => item.studentqualification).filter(Boolean)
          ),
        ]);

        // Get all unique field of study values
        const allFieldsOfStudy = [
          ...new Set(jobData.map((item) => item.fieldofstudy).filter(Boolean)),
        ];
        console.log("Field of Study data from API:", allFieldsOfStudy);
        setUniqueFieldOfStudy(allFieldsOfStudy);
        setUniqueStipends(
          [
            ...new Set(
              jobData.map((item) => item.internshipstipend).filter(Boolean)
            ),
          ].sort((a, b) => a - b)
        );
      } catch {}
    };
    fetchfilters();
  }, [industryId]);

  // Format stipend display
  const formatStipend = (stipend) => {
    return typeof stipend === "number"
      ? `₹${stipend.toLocaleString()}/month`
      : stipend;
  };

  return (
    <>
      <div className="d-lg-none mb-3">
        <button
          onClick={toggleFilters}
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          style={{ height: "45px" }}
        >
          <FaFilter className="me-2" />
          {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
          {isMobileFilterOpen && <FaTimes className="ms-2" />}
        </button>
      </div>

      <div
        className={`filter-container d-flex flex-column flex-lg-row ${
          isMobileFilterOpen ? "mobile-visible" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="w-100">
          {/* All Filters Header */}
          <div className="row d-flex justify-content-center p-1">
            <div className="col-6">{/* <strong>All Filters</strong> */}</div>
            <div className="col-6 text-end">
              <button
                onClick={handleClearAll}
                className="btn btn-sm btn-outline-secondary"
              >
                Clear All
              </button>
            </div>
            <hr className="mt-2 d-lg-none" />
          </div>

          <div className="row g-3">
            {/* State Filter */}
            <div className="col-12 col-lg-2">
              <strong>State</strong>
              <div className="custom-select-wrapper">
                <Select
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select State"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleInputChange("company_state", value);
                    handleInputChange("company_district", ""); // Reset district
                  }}
                  value={formData.company_state}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="">All States</Option>
                  {getStates().map((state) => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
              </div>
              <hr className="d-lg-none" />
            </div>

            {/* District Filter */}
            <div className="col-12 col-lg-2">
              <strong>District</strong>
              <div className="custom-select-wrapper">
                <Select
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select District"
                  optionFilterProp="children"
                  onChange={(value) =>
                    handleInputChange("company_district", value)
                  }
                  value={formData.company_district}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={!formData.company_state}
                >
                  <Option value="">All Districts</Option>
                  {formData.company_state &&
                    getDistricts(formData.company_state).map((district) => (
                      <Option key={district} value={district}>
                        {district}
                      </Option>
                    ))}
                </Select>
              </div>
              <hr className="d-lg-none" />
            </div>

            {/* Qualification Filter */}
            <div className="col-12 col-lg-3">
              <strong>Degree</strong>
              <div className="custom-select-wrapper">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Degree"
                  optionFilterProp="children"
                  value={formData.student_education}
                  onChange={(value) => {
                    handleInputChange("student_education", value);
                    handleInputChange("field_of_study", ""); // Reset field of study
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                >
                  <Option value="">All Degrees</Option>
                  {uniqueEduaction.map((qualification) => (
                    <Option key={qualification} value={qualification}>
                      {qualification}
                    </Option>
                  ))}
                </Select>
              </div>
              <hr className="d-lg-none" />
            </div>

            {/* Field of Study Filter */}
            <div className="col-12 col-lg-3">
              <strong>Field of Study</strong>
              <div className="custom-select-wrapper">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Field"
                  optionFilterProp="children"
                  value={formData.field_of_study}
                  onChange={(value) =>
                    handleInputChange("field_of_study", value)
                  }
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                >
                  <Option value="">All Fields</Option>
                  {uniqueFieldOfStudy.length > 0 ? (
                    uniqueFieldOfStudy.map((field) => (
                      <Option key={field} value={field}>
                        {field}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No fields available</Option>
                  )}
                </Select>
              </div>
              <hr className="d-lg-none" />
            </div>

            {/* Submit Button */}
            <div className="col-12 col-lg-2 d-flex align-items-end">
              <button
                type="submit"
                className="btn w-100 filterjob"
                disabled={isLoading}
              >
                {isLoading ? "Applying..." : "Filter Job"}
              </button>
            </div>
          </div>

          {/* Close Button for Mobile */}
          <div className="row d-flex d-lg-none mt-2 justify-content-center">
            <button
              type="button"
              className="btn btn-danger w-50"
              onClick={handleCloseFilter}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobdetailsSideFilder;
