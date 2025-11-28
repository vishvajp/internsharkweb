import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import "./JobFullDetailPage.css";
import { CiLocationOn } from "react-icons/ci";
import { TiTime } from "react-icons/ti";
import { FaGraduationCap } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import ApplicationStatusModal from "./ApplicationStatusModal";
import { getjobdetailbyid, applyjobbyid } from "../service/job";
import { FaFilePdf } from "react-icons/fa";
const JobFullDetailPage = () => {
  const { internship_id } = useParams();

  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);

  //php
  // useEffect(() => {

  //   if (state?.job) {
  //     setJobDetail(state.job);
  //     setLoading(false);
  //     return;
  //   }

  //   if (internship_id) {
  //     const fetchJob = async () => {
  //       setLoading(true);
  //       setError(null);
  //       try {
  //         const token = localStorage.getItem('token');
  //         if (!token) {
  //           throw new Error('No authentication token found');
  //         }

  //         const response = await axios.post(
  //           `${baseurl}/getInternPostById/${internship_id}`,
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               'Content-Type': 'application/json'
  //             }
  //           }
  //         );

  //         console.log('API Response:', response.data);

  //         if (response.data?.data) {
  //           setJobDetail(response.data.data);
  //         } else {
  //           setError('Job not found');
  //         }
  //       } catch (err) {
  //         console.error('Error fetching job:', err);
  //         setError(err.response?.data?.message || err.message || 'Failed to load job details');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchJob();
  //   } else {
  //     setError('No internship ID provided');
  //     setLoading(false);
  //   }
  // }, [internship_id, state, baseurl]);

  // Fetch job data from the backend
  useEffect(() => {
    const getjobdetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getjobdetailbyid(internship_id);
        if (response) {
          setJobDetail(response);
          console.log("Job Detail Response:", response);
        } else {
          setError("Job not found");
        }
      } catch (error) {
        console.error("Error while fetching job data:", error);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (internship_id) {
      getjobdetail();
    } else {
      setError("No job ID provided");
      setLoading(false);
    }
  }, [internship_id]);

  //applyjob api

  //  const handleApply = async (internshipId) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Please log in to apply.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${baseurl}/applyIntenship/${internshipId}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     const resData = response.data;

  //     if (resData.success) {
  //       alert("Application submitted successfully!");
  //       window.location.reload();

  //     } else {
  //       alert(resData.message || "Failed to apply.");
  //     }

  //   } catch (error) {
  //     console.error("Error applying:", error);

  //     if (error.response && error.response.data) {
  //       const resData = error.response.data;
  //       alert(resData.message || "Failed to apply.");
  //     } else {
  //       alert("Server error occurred. Please try again.");
  //     }
  //   }
  // };

  const handleApply = async (internshipId) => {
    setApplying(true);
    try {
      const response = await applyjobbyid(internshipId);
      console.log("Apply response:", response);

      if (
        response &&
        response.message === "Application submitted successfully"
      ) {
        alert("Application submitted successfully!");
        // Refresh job details to update application status
        const updatedJob = await getjobdetailbyid(internship_id);
        if (updatedJob) {
          setJobDetail(updatedJob);
        }
      } else {
        alert(response?.message || "Failed to apply. Please try again.");
      }
    } catch (error) {
      console.error("Error applying:", error);
      alert(
        error.message || "An error occurred while applying. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  console.log("Course PDF:", jobDetail?.coursePdf);

  return (
    <div>
      <Header />
      <div className="container-fluid p-0">
        {loading ? (
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading job details...</h5>
                <p className="text-muted">
                  Please wait while we fetch the job information.
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : jobDetail ? (
          <div className="container-fluid w-100 jobdetailpagebackground py-4">
            <div className="container pb-0">
              <div className="row jobdetailheaderbox p-4 align-items-center">
                {/* Left Content */}
                <div className="col-md-8">
                  <div className="d-flex flex-column justify-content-start">
                    <h4 className="mb-2">{jobDetail.title}</h4>
                    <p className="mb-1">{jobDetail.companyname}</p>
                    <div className="d-flex row ">
                      <div className="col-lg-3">
                        <p className="d-flex align-items-center mb-0">
                          <span className="me-2">₹</span>
                          <span>{jobDetail.internshipstipend}</span>
                        </p>
                      </div>
                      <div className="col-lg-3">
                        <p className="d-flex align-items-center mb-0">
                          <FaGraduationCap className="me-2" />
                          <span>{jobDetail.studentqualification}</span>
                        </p>
                      </div>
                      <div className="col-lg-4">
                        <p className="d-flex align-items-center mb-0">
                          <FaGraduationCap className="me-2" />
                          <span>
                            {jobDetail.fieldofstudy || "Not specified"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="d-flex row mt-2">
                      <div className="col-lg-3">
                        <p className="d-flex align-items-center mb-0">
                          <CiLocationOn className="me-2" />
                          <span>{jobDetail.companycity}</span>
                        </p>
                      </div>

                      <div className="col-lg-3">
                        <p className="d-flex align-items-center mb-0">
                          <TiTime className="me-2" />
                          <span>{jobDetail.internshipduration}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Logo */}
                <div className="col-md-4 jobdetailfulllogoimage d-flex justify-content-end align-items-center">
                  <img
                    src={`${imgurl}/${jobDetail.companylogo}`}
                    alt="Company Logo"
                    className="img-fluid company-logo"
                  />
                </div>
                <hr className="mt-3"></hr>
                <div className="row">
                  <div className="col-6">
                    <p className="d-flex align-items-center gap-2">
                      <span className="text-muted">
                        <FaRegCalendarAlt />
                      </span>
                      {jobDetail.updatedAt &&
                        new Date(jobDetail.updatedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                    </p>
                  </div>
                  <div className="col-6 d-flex justify-content-end align-items-center">
                    {jobDetail.status === null && (
                      <button
                        className="btn btn-primary px-4 py-2 rounded-5"
                        onClick={() => handleApply(jobDetail._id)}
                        disabled={applying}
                      >
                        {applying ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Applying...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Apply
                          </>
                        )}
                      </button>
                    )}

                    {(jobDetail.status === "Applied" ||
                      jobDetail.status === "Shortlisted" ||
                      jobDetail.status === "Rejected" ||
                      jobDetail.status === "Selected") && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary px-4 py-2 rounded-5"
                          disabled
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          {jobDetail.status}
                        </button>

                        <button
                          className="btn btn-success px-4 py-2 rounded-5"
                          onClick={() => setShowStatusModal(true)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Status
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="container pb-0">
              <div className="row jobdetailheaderbox p-4 align-items-center">
                <strong>Description</strong>
                <div className="col-12">{jobDetail.intershipdescription}</div>
                <div className="col-12 mt-2">
                  <span className="fw-bold">Location :</span>{" "}
                  {jobDetail.companycity}
                </div>

                <strong className="mt-2">Skills Required</strong>
                <div className="col-12 mt-2">
                  <span className="text-muted">Skill :</span>{" "}
                  {jobDetail.requiredskills}
                </div>
              </div>
            </div>

            <div className="container ">
              <div className="row jobdetailheaderbox p-4 align-items-center">
                <strong>About Intership</strong>
                <div className="col-12">{jobDetail.aboutinternship}</div>

                <strong className="mt-2">Qualification Required</strong>
                <div className="col-12 mt-2">
                  <span className="text-muted">Degree:</span>{" "}
                  {jobDetail.studentqualification}
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted">Field of Study:</span>{" "}
                  {jobDetail.fieldofstudy || "Not specified"}
                </div>

                <strong className="mt-2">Who is eligible to apply</strong>
                <div className="col-12">{jobDetail.eligibilitycriteria}</div>

                <strong className="mt-2">Location Detail</strong>
                <div className="col-12 mt-2">
                  Location:{" "}
                  <a
                    href={jobDetail.locationlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
            {jobDetail?.coursePdf && jobDetail.coursePdf.length > 0 && (
              <div className="container pt-0">
                <div className="row jobdetailheaderbox p-4">
                  <strong className="mb-3">Course Materials</strong>
                  <ul className="list-unstyled">
                    {jobDetail.coursePdf.map((link, index) => (
                      <li key={index} className="mb-2">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center gap-2 text-decoration-none"
                        >
                          <FaFilePdf className="text-danger fs-5" />
                          <span className="fw-medium">
                            Week {index + 1} PDF
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  No job details found.
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => window.history.back()}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ApplicationStatusModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        // internshipId={jobDetail.internship_id}
        jobDetail={jobDetail}
      />
      <Footer />
    </div>
  );
};

export default JobFullDetailPage;
