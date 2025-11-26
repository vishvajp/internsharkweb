import React, { useState, useEffect } from "react";
import "./AllIntershippage.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import JobDetailCorosol from "./JobDetailCorosol";
import JobdetailsSideFilder from "./JobdetailsSideFilder";
import JobDetailCenterData from "./JobDetailCenterData";

const AllIntershippage = () => {
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [filters, setFilters] = useState({});

  const handleFilter = (appliedFilters, filteredData) => {
    setFilters(appliedFilters);
    setFilteredJobs(filteredData);
    console.log("test one", appliedFilters);
    console.log("test two", filteredData);
  };
  // 🧹 Reset filters when changing industry
  useEffect(() => {
    console.log("🆕 Industry changed:", selectedIndustryId);
    setFilteredJobs(null);
    setFilters({});
  }, [selectedIndustryId]);
  return (
    <>
      <Header />

      <div className="container mt-4">
        {/* Companies Detail Carousel Section */}
        <JobDetailCorosol
          onIndustrySelect={setSelectedIndustryId}
          selectedIndustryId={selectedIndustryId}
        ></JobDetailCorosol>

        {/* Main Content Grid */}
        <div className="row mt-4">
          {/* Filter Sidebar - full width on mobile, 3 columns on desktop */}
          <div className="col-12 col-lg-12 mb-4 mb-lg-0">
            <div className="sidefilterouterbox p-3 shadow-sm rounded">
              <JobdetailsSideFilder
                industryId={selectedIndustryId}
                onFilter={handleFilter}
              />
            </div>
          </div>

          {/* Job Listings - full width on mobile, 9 columns on desktop */}
          <div className="col-12 col-lg-12 mt-lg-2">
            <div className="centerjobshowboxouter p-3 p-lg-5 bg-white rounded shadow-sm">
              <JobDetailCenterData
                industryId={selectedIndustryId}
                filteredJobs={filteredJobs}
                filters={filters}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllIntershippage;
