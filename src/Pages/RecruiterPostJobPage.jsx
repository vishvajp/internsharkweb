import React, { useEffect, useState } from "react";
import "./RecruiterPostJobPage.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import axios from "axios";
import EditJobModal from "../Pages/EditJobModal";
import { useNavigate } from "react-router-dom";
import StudentappliedlistModal from "./StudentappliedlistModal";
import { getrecruiterpostedjob } from "../service/postjob";

const RecruiterPostJobPage = () => {
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [showModal, setShowModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const navigate = useNavigate();

  const handleStudentList = (internshipId) => {
    console.log("Open student list for internship:", internshipId);
    setSelectedInternshipId(internshipId);
    setShowStudentListModal(true);
  };

  const handleEditClick = (id) => {
    setSelectedInternshipId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const [getRecruiterPostedJobs, setGetRecruiterPostedJobs] = useState([]);

  //apis

  //   useEffect(() => {
  //   const getPostedJobList = async () => {
  //     try {
  //       const recruiter_token = localStorage.getItem('recruiter_token');

  //       if (!recruiter_token) {
  //         throw new Error('No recruiter token found');
  //       }

  //       const response = await axios.post(
  //         `${baseurl}/getAllRecruiterInternPost`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${recruiter_token}`,
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       );

  //       if (response.data) {
  //         console.log('Posted jobs:', response.data.data);
  //         setGetRecruiterPostedJobs(response.data.data);

  //       } else {
  //         throw new Error('No data received');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching posted jobs:', error);

  //     }
  //   };

  //   getPostedJobList();

  // }, [baseurl]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getrecruiterpostedjob();
        // setJobs(response.data); // example state update
        console.log("sssssssssssssssss", response);
        setGetRecruiterPostedJobs(response);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    console.log("Current posted jobs:", getRecruiterPostedJobs);

    // Optional: Add detailed logging for debugging
    if (getRecruiterPostedJobs?.length > 0) {
      console.table(
        getRecruiterPostedJobs.map((job) => ({
          id: job.id,
          company: job.company_name,
          role: job.company_role_name,
          location: job.company_district,
          posted: job.intern_post_date,
        }))
      );
    }
  }, [getRecruiterPostedJobs]);

  return (
    <>
      <Header></Header>
      <div className="container-fluid p-3 p-md-5">
        <div className="container recruiterpostedjobsouterbox p-3 p-md-5 rounded-4 shadow-sm">
          {/* Loading state */}
          {!getRecruiterPostedJobs && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading job listings...</p>
            </div>
          )}

          {/* Empty state */}
          {getRecruiterPostedJobs?.length === 0 && (
            <div className="text-center py-5">
              <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-inbox fs-1 text-primary"></i>
              </div>
              <h4 className="mb-2">No jobs posted yet</h4>
              <p className="text-muted mb-4">
                When you post jobs, they'll appear here
              </p>
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/postjob")}
              >
                <i className="bi bi-plus-circle me-2"></i>Post a Job
              </button>
            </div>
          )}

          {/* Data display */}
          {getRecruiterPostedJobs?.length > 0 && (
            <div className="row g-4">
              {getRecruiterPostedJobs.map((job, index) => (
                <div key={job._id || index} className="col-12">
                  <div className="card border-0 shadow-sm hover-shadow transition-all h-100">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* Company Logo Column */}
                        <div className="col-md-2 col-12 text-center mb-3 mb-md-0">
                          <div className="d-flex justify-content-center">
                            {job.companylogo ? (
                              <div
                                className="bg-white p-2 rounded-3 border"
                                style={{ width: "100px", height: "100px" }}
                              >
                                <img
                                  src={`${imgurl}/${job.companylogo}`}
                                  alt={`${job.companyname || "Company"} logo`}
                                  className="img-fluid h-100 w-auto"
                                  style={{ objectFit: "contain" }}
                                  // onError={(e) => {
                                  //   e.target.onerror = null;
                                  //   e.target.src = '/default-company-logo.png';
                                  // }}
                                />
                              </div>
                            ) : (
                              <div
                                className="bg-light p-3 rounded-3 d-flex flex-column justify-content-center align-items-center"
                                style={{ width: "100px", height: "100px" }}
                              >
                                <i className="bi bi-building fs-3 text-muted"></i>
                                <small className="mt-1 text-muted">
                                  No Logo
                                </small>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Job Details Column */}
                        <div className="col-md-8 col-12">
                          <h5 className="mb-1 fw-bold">
                            {job.companyname || "Company Name Not Available"}
                          </h5>
                          <h6 className="text-primary mb-2">
                            {job.title || "Role Not Specified"}
                          </h6>

                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-geo-alt me-1"></i>
                              {job.companycity || "Location Not Specified"}
                            </span>
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-clock me-1"></i>
                              Duration: {job.internshipduration}
                            </span>
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-cash me-1"></i>
                              Stipend: {job.internshipstipend}
                            </span>
                          </div>

                          {job.aboutinternship && (
                            <p className="text-muted mb-2 small">
                              {job.aboutinternship.length > 150
                                ? `${job.aboutinternship}`
                                : job.aboutinternship}
                            </p>
                          )}
                          {job.intershipdescription && (
                            <p className="text-muted mb-2 small">
                              {job.intershipdescription.length > 150
                                ? `${job.intershipdescription}`
                                : job.intershipdescription}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons Column */}
                        <div className="col-md-2 col-12">
                          <div className="d-flex flex-column gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleStudentList(job._id)}
                            >
                              <i className="bi bi-eye me-1"></i> View
                              Applications
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleEditClick(job._id)}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>
                            {/* delete button */}
                            {/* <button className="btn btn-outline-danger btn-sm">
                        <i className="bi bi-trash me-1"></i> Delete
                      </button> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer with additional info */}
                    <div className="card-footer bg-transparent border-top px-4 py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          Posted Date{" "}
                          {job.updatedAt
                            ? new Date(job.updatedAt).toLocaleDateString(
                                "en-GB"
                              ) // DD/MM/YYYY
                            : "-"}
                        </small>
                        {/* <small className="text-muted">
                    <i className="bi bi-people me-1"></i> 12 applicants
                  </small> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <EditJobModal
        show={showModal}
        onClose={handleCloseModal}
        internshipId={selectedInternshipId}
      />
      <StudentappliedlistModal
        show={showStudentListModal} // boolean
        onClose={() => setShowStudentListModal(false)} // function to close
        internshipId={selectedInternshipId}
      />
      <Footer></Footer>
    </>
  );
};

export default RecruiterPostJobPage;
