import React, { useEffect, useState } from "react";
import "./AllAppliedjobsByStudent.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { getappliedjobs } from "../service/job";

const AllAppliedjobsByStudent = () => {
  // const baseurl = process.env.REACT_APP_API_BASE_URL;
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [appliedJobList, setAppliedJobList] = useState(null);

  const handleClick = (id) => {
    if (id) {
      window.open(`${process.env.PUBLIC_URL}/company/${id}`, "_blank");
    }
  };

  // useEffect(() => {
  //     const getAppliedJob = async () => {
  //       const token = localStorage.getItem("token");
  //       try {
  //         const response = await axios.post(
  //           `${baseurl}/getStudentAppliedInternships`,
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         console.log("FetchApplied Jobs", response.data);
  //         setAppliedJobList(response.data.data);
  //       } catch (err) {
  //         console.error("Error fetching applied job:", err);
  //       }
  //     };
  //     getAppliedJob();
  //   }, [baseurl]);

  //node backend data
  useEffect(() => {
    const getappliedlist = async () => {
      try {
        const response = await getappliedjobs();
        console.log("13232323232", response);
        setAppliedJobList(response);
      } catch (error) {
        console.log("Error while fetch data", error);
        setAppliedJobList([]);
      }
    };
    getappliedlist();
  }, []);

  return (
    <>
      <Header></Header>

      <div className="container my-navigation d-flex justify-content-center gap-3 flex-wrap py-3">
        <NavLink
          to="/appliedjobs"
          className={({ isActive }) =>
            "nav-link-box" + (isActive ? " active" : "")
          }
        >
          <i className="bi bi-briefcase me-2"></i>
          All Applied Jobs
        </NavLink>
        <NavLink
          to="/recruiter-actions"
          className={({ isActive }) =>
            "nav-link-box" + (isActive ? " active" : "")
          }
        >
          <i className="bi bi-gear me-2"></i>
          Recruiter Actions
        </NavLink>
      </div>
      <div className="container py-4">
        {!appliedJobList ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div>Loading applied jobs...</div>
          </div>
        ) : appliedJobList.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <p className="text-muted">No applied jobs found.</p>
          </div>
        ) : (
          <div className="row">
            {appliedJobList.map((item) =>
              item?.job ? (
                <div
                  key={item._id}
                  className="col-12 col-md-6 mb-4"
                  onClick={() => handleClick(item.job._id)}
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
                      <div className="col-12 col-lg-7">
                        <div className="d-flex gap-2 mb-2 flex-wrap">
                          <div className="py-1 px-2 rounded bg-light text-dark">
                            {(() => {
                              const appliedDate = new Date(item.createdAt);
                              const today = new Date();
                              appliedDate.setHours(0, 0, 0, 0);
                              today.setHours(0, 0, 0, 0);
                              const diffTime = today - appliedDate;
                              const diffDays = Math.floor(
                                diffTime / (1000 * 60 * 60 * 24)
                              );
                              if (diffDays === 0) return "Applied Today";
                              if (diffDays === 1) return "Applied 1 Day Ago";
                              return `Applied ${diffDays} Days Ago`;
                            })()}
                          </div>
                          <div
                            className="py-1 px-2 rounded text-white small fw-semibold"
                            style={{
                              backgroundColor:
                                item.status === "Selected"
                                  ? "#28a745"
                                  : item.status === "Shortlisted"
                                  ? "#17a2b8"
                                  : item.status === "Rejected"
                                  ? "#dc3545"
                                  : "#6c757d",
                            }}
                          >
                            {item.status || "Applied"}
                          </div>
                        </div>

                        <div className="h5">{item.job.title}</div>
                        <div className="text-muted">{item.job.companyname}</div>
                      </div>

                      <div className="col-12 col-lg-5 d-flex align-items-center justify-content-lg-end justify-content-start">
                        <img
                          src={`${imgurl}/${item.job.companylogo}`}
                          alt="Company Logo"
                          className="img-fluid"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-logo.png";
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 small text-muted">
                      <FaLocationDot className="me-1" /> {item.job.companycity}
                    </div>

                    <div
                      className="mt-2 text-truncate"
                      style={{ maxHeight: "3.2em" }}
                    >
                      {item.job.intershipdescription
                        ?.split(" ")
                        .slice(0, 20)
                        .join(" ") +
                        (item.job.intershipdescription?.split(" ").length > 20
                          ? "..."
                          : "")}
                    </div>

                    <div className="row mt-3">
                      <div className="col-12 col-sm-6 mb-2">
                        <div
                          className="py-1 px-2 rounded small w-100 text-center"
                          style={{ backgroundColor: "#fff3cd" }}
                        >
                          <IoTimeOutline className="me-1" />
                          Duration: {item.job.internshipduration}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 mb-2">
                        <div
                          className="py-1 px-2 rounded small w-100 text-center"
                          style={{ backgroundColor: "#e9ecef" }}
                        >
                          <GiMoneyStack className="me-1" />
                          Stipend: {item.job.internshipstipend}
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-6 mb-1">
                        <span className="fw-bold" style={{ color: "#01cdcd" }}>
                          Education:
                        </span>{" "}
                        {item.job.studentqualification}
                      </div>
                      <div className="col-12 col-sm-6 mb-1">
                        <span className="fw-bold" style={{ color: "#01cdcd" }}>
                          Available:
                        </span>{" "}
                        {item.job.requiredskills}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default AllAppliedjobsByStudent;
