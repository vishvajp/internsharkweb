import { useState, useEffect } from "react";
import axios from "axios";
import "./JobDetailCenterData.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Added for prop validation
import { FaLocationDot } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { getIndustryDetailbyid } from "../service/industryType";

const JobDetailCenterData = ({ industryId, filteredJobs, filters }) => {
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [getDetail, setGetDetail] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //filter job details and initial all job detail
  //php
  //   useEffect(() => {
  //   const getjobdetail = async () => {

  //     if (filteredJobs === null) {
  //       setLoading(true);
  //       try {
  //         const token = localStorage.getItem('token');
  //         const endpoint = industryId
  //           ? `${baseurl}/getPostCompany/${industryId}`
  //           : `${baseurl}/getAllPostCompany`;

  //         const response = await axios.post(endpoint, {}, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         console.log('jobdetails',response.data.data);
  //         setGetDetail(response.data?.data || []);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //       return;
  //     }

  // if (Array.isArray(filteredJobs)) {
  //   setGetDetail(filteredJobs);
  //   return;
  // }
  //   };

  //   getjobdetail();
  // }, [baseurl, industryId, filteredJobs]);

  //get jobs by industry id node
  useEffect(() => {
    const getJobDetail = async () => {
      setLoading(true);
      setError(null);

      console.log("🧩 Props inside useEffect:");
      console.log("industryId:", industryId);
      console.log("filteredJobs:", filteredJobs);
      console.log("filters:", filters);

      try {
        // Check if we have filtered jobs from the filter component
        if (filteredJobs !== null && filteredJobs !== undefined) {
          if (Array.isArray(filteredJobs) && filteredJobs.length > 0) {
            // ✅ Use pre-filtered jobs if available
            console.log("✅ Using filteredJobs:", filteredJobs.length, "jobs");
            setGetDetail(filteredJobs);
          } else if (Array.isArray(filteredJobs) && filteredJobs.length === 0) {
            // ✅ Filter returned no results
            console.log("⚠️ Filter returned 0 jobs");
            setGetDetail([]);
          }
        } else if (industryId) {
          // ✅ Fallback to fetching all jobs by industry ID (no filter applied)
          console.log("🌐 Fetching all jobs for industryId:", industryId);
          const response = await getIndustryDetailbyid(industryId);
          console.log("📦 Response length:", response?.length || 0);
          setGetDetail(response || []);
        } else {
          console.log("⚠️ No industryId, setting empty job detail");
          setGetDetail([]);
        }
      } catch (error) {
        if (error.message === "Request failed with status code 404") {
          setGetDetail([]);
        } else if (error.message === "No jobs found for this industry") {
          setGetDetail([]);
        }
        console.error("❌ Error while fetching job details:", error);
        // setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    getJobDetail();
  }, [industryId, filteredJobs, filters]);
  console.log("Rendering JobDetailCenterData", filteredJobs);
  useEffect(() => {
    console.log("🧩 JobDetailCenterData received props:");
    console.log("industryId:", industryId);
    console.log("filteredJobs:", filteredJobs);
    console.log("filters:", filters);
  }, [industryId, filteredJobs, filters]);

  const handleClick = (id) => {
    // Pass the entire job object
    if (id) {
      // Use a proper unique ID field
      window.open(`${process.env.PUBLIC_URL}/company/${id}`, "_blank");
      // Pass data via state
      // navigate(`/company/${job.internship_id}`, { state: { job } });
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="job-detail-container"
      style={{
        height: "400px", // Fixed height for vertical scroll
        overflowY: "auto", // Enable vertical scroll
        overflowX: "hidden", // Disable horizontal scroll
        width: "100%", // Take full width of parent
        paddingRight: "10px", // Prevent content from touching scrollbar
      }}
    >
      <div
        className="row justify-content-evenly"
        style={{
          marginLeft: "0",
          marginRight: "0",
          width: "100%",
        }}
      >
        {getDetail.length > 0 ? (
          getDetail.map((item) => (
            <div
              key={item._id}
              className="col-12 col-md-6 mb-4"
              onClick={() => handleClick(item._id)}
            >
              <div
                className="job-card p-3 rounded shadow-sm h-100 d-flex flex-column"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                }}
              >
                <div className="row g-3">
                  {/* Left side: role and company */}
                  <div className="col-12 col-lg-7">
                    <div className="py-1 px-2 rounded bg-light text-dark d-inline-block mb-2">
                      {(() => {
                        const postDate = new Date(item.updatedAt);
                        const today = new Date();
                        postDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        const diffTime = today - postDate;
                        const diffDays = Math.floor(
                          diffTime / (1000 * 60 * 60 * 24)
                        );
                        if (diffDays === 0) return "Today";
                        if (diffDays === 1) return "1 Day Ago";
                        return `${diffDays} Days Ago`;
                      })()}
                    </div>

                    <div className="h5">{item.title}</div>
                    <div className="text-muted">{item.companyname}</div>
                  </div>

                  {/* Right side: logo */}
                  <div className="col-12 col-lg-5 d-flex align-items-center justify-content-lg-end justify-content-start">
                    <img
                      src={`${imgurl}/${item.companylogo}`}
                      alt="Company Logo"
                      className="img-fluid"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        objectFit: "contain",
                      }}
                      // onError={(e) => {
                      //   e.target.onerror = null;
                      //   e.target.src = "/default-logo.png";
                      // }}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 small text-muted">
                  <FaLocationDot className="me-1" /> {item.companycity}
                </div>

                {/* Description */}
                <div
                  className="mt-2 text-truncate"
                  style={{ maxHeight: "3.2em" }}
                >
                  {item.intershipdescription
                    ?.split(" ")
                    .slice(0, 20)
                    .join(" ") +
                    (item.intershipdescription?.split(" ").length > 20
                      ? "..."
                      : "")}
                </div>

                {/* Duration and Stipend */}
                <div className="row mt-3">
                  <div className="col-12 col-sm-6 mb-2">
                    <div
                      className="py-1 px-2 rounded small w-100 text-center"
                      style={{ backgroundColor: "#fff3cd" }}
                    >
                      <IoTimeOutline className="me-1" />
                      Duration: {item.internshipduration}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <div
                      className="py-1 px-2 rounded small w-100 text-center"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      <GiMoneyStack className="me-1" />
                      Stipend: {item.internshipstipend}
                    </div>
                  </div>
                </div>

                {/* Education and Availability */}
                <div className="row mt-2">
                  <div className="col-12 col-sm-6 mb-1">
                    <span className="fw-bold" style={{ color: "#01cdcd" }}>
                      Education:
                    </span>{" "}
                    {item.studentqualification}
                  </div>
                  <div className="col-12 col-sm-6 mb-1">
                    <span className="fw-bold" style={{ color: "#01cdcd" }}>
                      Available:
                    </span>{" "}
                    {item.requiredskills}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="container d-flex flex-column justify-content-center align-items-center py-5">
            <p className="text-muted">No job details available.</p>
            <p className="text-muted">Please select an Industry Type above.</p>
            <small className="text-muted">
              Examples: Information Technology (IT), Healthcare, Finance....,
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

JobDetailCenterData.propTypes = {
  industryId: PropTypes.string,
  filteredJobs: PropTypes.array,
  filters: PropTypes.object,
};

export default JobDetailCenterData;
