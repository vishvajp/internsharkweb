import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUniversity,
  FaMapMarkerAlt,
  FaLanguage,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
} from "react-icons/fa";
import "./StudentFullDetail.css"; // Create this CSS file for styling
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import sample from "../Images/noImage.jpg";
import { FaUser, FaCalendarAlt, FaSchool } from "react-icons/fa";
import { MdFileCopy } from "react-icons/md";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineDomainVerification } from "react-icons/md";
import { Button, Divider, Flex, Radio } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { getstudentdetail } from "../service/student";

// Utility function to format date to DD-MM-YY
const formatDateToDDMMYY = (dateString) => {
  if (!dateString) return "Not specified";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  } catch (error) {
    return "Invalid date";
  }
};

const StudentFullDetail = () => {
  const [size, setSize] = useState("large");
  const { studentId } = useParams();
  const navigate = useNavigate();
  const baseurl = process.env.REACT_APP_API_BASE_URL_MONGO;
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //     const fetchStudent = async () => {
  //       try {
  //         setLoading(true);
  //         setError(null);

  //         const recruiter_token = localStorage.getItem("recruiter_token");
  //         if (!recruiter_token) {
  //           throw new Error("Authentication required. Please login again.");
  //         }

  //         const response = await axios.post(
  //           `${baseurl}/getStudentProfileId/${studentId}`,{},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${recruiter_token}`,
  //             },
  //           }
  //         );

  //         if (!response.data) {
  //           throw new Error("No data received from server");
  //         }

  //         if (response.data.success === false) {
  //           throw new Error(response.data.message || "Student not found");
  //         }

  //         if (!response.data.data) {
  //           throw new Error("Student data is missing in response");
  //         }
  //         console.log('studentfulldetail',response.data.data);
  //         setStudent(response.data.data);
  //       } catch (err) {
  //         console.error("Error fetching student:", err);
  //         setError(err.message || "Failed to fetch student profile");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchStudent();
  //   }, [studentId, baseurl]);

  //get student detail by id

  useEffect(() => {
    const fetchstudentdetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getstudentdetail(studentId);
        console.log("studentttt fdetaillll", response);
        setStudent(response);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.message || "Failed to fetch student profile");
      } finally {
        setLoading(false);
      }
    };
    fetchstudentdetail();
  }, [studentId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student profile...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="studentdetailbackground">
        <div className="container border mt-4 mb-4 rounded-5 py-4 student-detail-container">
          {/* Profile Section */}
          <div className="row student-section justify-content-center">
            <div className="col-12 col-md-3 text-center mb-4">
              <img
                src={`${imgurl}/${student.studprofile}` || sample}
                alt={student.studname || "Profile"}
                className="img-fluid rounded-circle shadow"
                style={{ width: "180px", height: "180px", objectFit: "cover" }}
                // onError={(e) => {
                //   e.target.src = sample;
                // }}
              />
              <h3 className="mt-3 fw-semibold">
                {student.studname || "Not specified"}
              </h3>
              <p className="text-muted mb-0">
                {student.studentcollegename || "No college specified"}
              </p>
            </div>
          </div>

          {/* Main Details */}
          <section className="student-section">
            <h4 className="section-title text-center">
              <FaUniversity className="me-2" /> Student Details
            </h4>
            <div className="d-flex justify-content-center">
              <div className="row w-100" style={{ maxWidth: "800px" }}>
                <div className="col-md-6">
                  <DetailItem
                    icon={<FaGraduationCap />}
                    label="Degree"
                    value={student.studentdegree}
                  />
                  <DetailItem
                    icon={<FaGraduationCap />}
                    label="Field of Study"
                    value={student.studentfieldofstudy}
                  />
                  <DetailItem
                    icon={<FaUser />}
                    label="Gender"
                    value={student.studgender}
                  />
                  <DetailItem
                    icon={<FaUniversity />}
                    label="Address"
                    value={student.studentaddress}
                  />
                  <DetailItem
                    icon={<FaPhone />}
                    label="Contact Number"
                    value={student.studmobileno}
                  />
                  <DetailItem
                    icon={<MdOutlineDateRange />}
                    label="Date Of Birth"
                    value={formatDateToDDMMYY(student.studdob)}
                  />
                </div>
                <div className="col-md-6">
                  <DetailItem
                    icon={<FaUniversity />}
                    label="College"
                    value={student.studentcollegename}
                  />
                  <DetailItem
                    icon={<FaMapMarkerAlt />}
                    label="College Location"
                    value={student.studcollegelocation}
                  />
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="Start Year"
                    value={student.studcollegestartyear}
                  />
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="End Year"
                    value={student.studcollegeendyear}
                  />
                  <DetailItem
                    icon={<MdOutlineDomainVerification />}
                    label="Skills"
                    value={student.language}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* School Details */}
          <section className="student-section">
            <h4 className="section-title text-center">
              <FaSchool className="me-2" /> School Details
            </h4>
            <div className="d-flex justify-content-center">
              <div className="row w-100" style={{ maxWidth: "800px" }}>
                {/* HSC */}
                <div className="col-md-6">
                  <h5 className="section-title" style={{ color: "#01cdcd" }}>
                    Higher Secondary School
                  </h5>
                  <DetailItem
                    icon={<FaSchool />}
                    label="School Name"
                    value={student.studhighschollname}
                  />
                  <DetailItem
                    icon={<FaMapMarkerAlt />}
                    label="Location"
                    value={student.studhighschoollocation}
                  />
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="Percentage"
                    value={student.studhighschoolpercentage}
                  />
                </div>
                {/* SSLC */}
                <div className="col-md-6">
                  <h5 className="section-title" style={{ color: "#01cdcd" }}>
                    Secondary School
                  </h5>
                  <DetailItem
                    icon={<FaSchool />}
                    label="School Name"
                    value={student.studentsecondaryschoolname}
                  />
                  <DetailItem
                    icon={<FaMapMarkerAlt />}
                    label="Location"
                    value={student.studsecondaryschoollocation}
                  />
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="Percentage"
                    value={student.studentsecondaryschoolpercentage}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Files Row */}
          <section className="student-section">
            <h4 className="section-title text-center">
              <MdFileCopy className="me-2" /> Files
            </h4>
            <div className="row justify-content-center text-center">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Resume</label>
                <br />
                {student.studentresume ? (
                  <a
                    href={`${imgurl}/${student.studentresume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      icon={<DownloadOutlined />}
                      size="middle"
                    >
                      View Resume
                    </Button>
                  </a>
                ) : (
                  <span className="text-muted">No Resume Uploaded</span>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Certificate</label>
                <br />
                {student.studentcertificate ? (
                  <a
                    // href={student.studentcertificate}
                    href={`${imgurl}/${student.studentcertificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      icon={<DownloadOutlined />}
                      size="middle"
                    >
                      View Certificate
                    </Button>
                  </a>
                ) : (
                  <span className="text-muted">No Certificate Uploaded</span>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Cover Letter</label>
                <br />
                {student.studentcoverletter ? (
                  <a
                    //  href={student.studentcoverletter}
                    href={`${imgurl}/${student.studentcoverletter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      icon={<DownloadOutlined />}
                      size="middle"
                    >
                      View Cover Letter
                    </Button>
                  </a>
                ) : (
                  <span className="text-muted">No Cover Letter Uploaded</span>
                )}
              </div>
            </div>
          </section>

          {/* Project */}
          <section className="student-section">
            <h4 className="section-title text-center">
              <MdFileCopy className="me-2" /> Project Details
            </h4>
            <div className="text-center text-muted">
              {student.studprojectdecription ||
                "No project description available."}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};
const DetailItem = ({ icon, label, value }) => (
  <p className="mb-3">
    <span className="me-2 text-primary">{icon}</span>
    <strong>{label}:</strong> {value || "Not specified"}
  </p>
);
export default StudentFullDetail;
