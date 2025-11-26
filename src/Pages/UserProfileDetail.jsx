import React, { useEffect, useState, useRef } from "react";
import "./UserProfileDetail.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import {
  FaUser,
  FaGraduationCap,
  FaUniversity,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaDownload,
  FaUserEdit,
  FaSchool,
  FaLanguage,
  FaPrint,
  FaEdit,
} from "react-icons/fa";
import {
  MdOutlineDateRange,
  MdOutlineDomainVerification,
  MdFileCopy,
  MdLocalPhone,
} from "react-icons/md";
import { IoLogoGithub, IoLogoLinkedin, IoGlobe } from "react-icons/io5";
import { BsCloudUploadFill } from "react-icons/bs";
import StudentProfileModal from "./StudentProfileModal";
import {
  getstudentdetail,
  updatestudentdetail,
} from "../service/profileupdate";
import sample from "../Images/noImage.jpg";

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

// Detail Item Component
const DetailItem = ({ icon, label, value, isLink = false, linkUrl = "" }) => (
  <div className="detail-item mb-3">
    <span className="me-2 text-primary detail-icon">{icon}</span>
    <strong className="detail-label">{label}:</strong>{" "}
    {isLink && value ? (
      <a
        href={linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none text-primary"
      >
        {value}
      </a>
    ) : (
      <span className="detail-value">{value || "Not specified"}</span>
    )}
  </div>
);

const UserProfileDetail = () => {
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [detail, setDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCVName, setSelectedCVName] = useState(null);
  const [selectedCoverLetterName, setSelectedCoverLetterName] = useState("");
  const coverLetterInputRef = useRef();
  const [selectedCertificateName, setSelectedCertificateName] = useState("");
  const certificateInputRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [formData, setFormData] = useState({
    student_image: null,
    existing_image_url: "",
    cv_path: null,
    coverletter: null,
    certificate_path: null,
  });

  // Files update functions
  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cv_path: file }));
      setSelectedCVName(file.name);
    }
  };

  // Get student detail from API
  const getdetail = async () => {
    try {
      const response = await getstudentdetail();
      console.log("student data from node", response);
      setDetail(response);
    } catch (error) {
      console.log("error message", error);
      return null;
    }
  };

  // useEffect to trigger student get detail
  useEffect(() => {
    getdetail();
  }, []);

  // Save changes
  const handleSave = async () => {
    const formDataToSend = new FormData();

    // Append all files
    if (formData.cv_path) {
      formDataToSend.append("studentresume", formData.cv_path);
    }
    if (formData.coverletter) {
      formDataToSend.append("studentcoverletter", formData.coverletter);
    }
    if (formData.certificate_path) {
      formDataToSend.append("studentcertificate", formData.certificate_path);
    }

    try {
      const response = await updatestudentdetail(formDataToSend);
      if (response.message === "Student updated successfully") {
        alert("Profile updated successfully!");
        window.location.reload();
        console.log("update the resumes", response);
      }
    } catch (error) {
      console.log("Error while update student data", error);
    }
  };

  if (!detail) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-3 text-primary">Loading Your Profile...</h4>
            <p className="text-muted">
              Please wait while we fetch your details.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="profiledetailbackground">
        <div className="container py-4">
          {/* Action Buttons */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h2 className="text-primary fw-bold mb-0">My Profile</h2>
              <div className="d-flex gap-2">
                {/* <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => window.print()}
                >
                  <FaPrint className="me-2" />
                  Print Profile
                </button> */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleIconClick}
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="profile-section mb-4">
            <div className="row align-items-center">
              <div className="col-12 col-md-3 text-center mb-4 mb-md-0">
                <img
                  src={
                    detail.studprofile
                      ? `${imgurl}/${detail.studprofile}`
                      : sample
                  }
                  alt={detail.studname || "Profile"}
                  className="profile-image rounded-circle shadow"
                  onError={(e) => {
                    e.target.src = sample;
                  }}
                />
                <h3 className="mt-3 fw-bold text-primary">
                  {detail.studname || "Not specified"}
                </h3>
                <p className="text-muted mb-2">
                  {detail.studentcollegename || "No college specified"}
                </p>
                <p className="text-secondary">
                  {detail.studentdegree && detail.studentfieldofstudy
                    ? `${detail.studentdegree} in ${detail.studentfieldofstudy}`
                    : detail.studentdegree || "Degree not specified"}
                </p>
                <small className="text-muted">
                  Last updated: {formatDateToDDMMYY(detail.updatedAt)}
                </small>
              </div>

              <div className="col-12 col-md-9">
                {/* Quick Summary Cards */}
                <div className="row text-center mb-4">
                  <div className="col-md-3 col-6 mb-3">
                    <div className="summary-card p-3">
                      <FaGraduationCap
                        className="text-primary mb-2"
                        size={24}
                      />
                      <h6 className="fw-semibold">Education</h6>
                      <small className="text-muted">
                        {detail.studentdegree || "Not specified"}
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="summary-card p-3">
                      <FaUniversity className="text-success mb-2" size={24} />
                      <h6 className="fw-semibold">College</h6>
                      <small className="text-muted">
                        {detail.studentcollegename
                          ? detail.studentcollegename.length > 15
                            ? `${detail.studentcollegename.substring(0, 15)}...`
                            : detail.studentcollegename
                          : "Not specified"}
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="summary-card p-3">
                      <FaMapMarkerAlt className="text-info mb-2" size={24} />
                      <h6 className="fw-semibold">Location</h6>
                      <small className="text-muted">
                        {detail.studentaddress || "Not specified"}
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="summary-card p-3">
                      <FaLanguage className="text-warning mb-2" size={24} />
                      <h6 className="fw-semibold">Skills</h6>
                      <small className="text-muted">
                        {detail.studprogramminglang || "Not specified"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <FaUser className="me-2" /> Personal Information
            </h4>
            <div className="row">
              <div className="col-md-6">
                <DetailItem
                  icon={<FaUser />}
                  label="Full Name"
                  value={detail.studname}
                />
                <DetailItem
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={detail.studemail}
                />
                <DetailItem
                  icon={<FaPhone />}
                  label="Mobile Number"
                  value={detail.studmobileno}
                />
              </div>
              <div className="col-md-6">
                <DetailItem
                  icon={<MdOutlineDateRange />}
                  label="Date of Birth"
                  value={formatDateToDDMMYY(detail.studdob)}
                />
                <DetailItem
                  icon={<FaUser />}
                  label="Gender"
                  value={detail.studgender}
                />
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label="Address"
                  value={detail.studentaddress}
                />
              </div>
            </div>
          </div>

          {/* Educational Details */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <FaGraduationCap className="me-2" /> Educational Details
            </h4>
            <div className="row">
              <div className="col-md-6">
                <DetailItem
                  icon={<FaGraduationCap />}
                  label="Degree"
                  value={detail.studentdegree}
                />
                <DetailItem
                  icon={<FaGraduationCap />}
                  label="Field of Study"
                  value={detail.studentfieldofstudy}
                />
                <DetailItem
                  icon={<FaUniversity />}
                  label="College Name"
                  value={detail.studentcollegename}
                />
              </div>
              <div className="col-md-6">
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label="College Location"
                  value={detail.studcollegelocation}
                />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Start Year"
                  value={detail.studcollegestartyear}
                />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="End Year"
                  value={detail.studcollegeendyear}
                />
              </div>
            </div>
          </div>

          {/* Skills & Programming Languages */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <MdOutlineDomainVerification className="me-2" /> Skills &
              Programming Languages
            </h4>
            <div className="row">
              <div className="col-12">
                <DetailItem
                  icon={<FaLanguage />}
                  label="Programming Languages & Skills"
                  value={detail.studprogramminglang}
                />
              </div>
            </div>
          </div>

          {/* Academic History */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <FaSchool className="me-2" /> Academic History
            </h4>
            <div className="row">
              {/* HSC */}
              <div className="col-md-6">
                <h5 className="subsection-title">
                  <FaGraduationCap className="me-2" /> Higher Secondary School
                  (HSC)
                </h5>
                <DetailItem
                  icon={<FaSchool />}
                  label="School Name"
                  value={detail.studhighschollname}
                />
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label="Location"
                  value={detail.studhighschoollocation}
                />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Percentage"
                  value={
                    detail.studhighschoolpercentage
                      ? `${detail.studhighschoolpercentage}%`
                      : "Not specified"
                  }
                />
              </div>
              {/* SSLC */}
              <div className="col-md-6">
                <h5 className="subsection-title">
                  <FaSchool className="me-2" /> Secondary School (SSLC)
                </h5>
                <DetailItem
                  icon={<FaSchool />}
                  label="School Name"
                  value={detail.studentsecondaryschoolname}
                />
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label="Location"
                  value={detail.studsecondaryschoollocation}
                />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Percentage"
                  value={
                    detail.studentsecondaryschoolpercentage
                      ? `${detail.studentsecondaryschoolpercentage}%`
                      : "Not specified"
                  }
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <MdFileCopy className="me-2" /> Project Details
            </h4>
            <div className="row">
              <div className="col-12">
                {detail.studprojectname && (
                  <DetailItem
                    icon={<MdFileCopy />}
                    label="Project Name"
                    value={
                      Array.isArray(detail.studprojectname)
                        ? detail.studprojectname.join(", ")
                        : detail.studprojectname
                    }
                  />
                )}
                <div className="mb-3">
                  <span className="me-2 text-primary">
                    <MdFileCopy />
                  </span>
                  <strong>Project Description:</strong>
                  <div className="mt-2 p-3 bg-light rounded project-description">
                    {detail.studprojectdecription ||
                      "No project description available."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents & Files Management */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <MdFileCopy className="me-2" /> Documents & Files
            </h4>

            {/* Resume Section */}
            <div className="document-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Resume</h5>
                {detail.studentresume && (
                  <a
                    href={`${imgurl}/${detail.studentresume}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <FaDownload className="me-2" />
                    Download Current Resume
                  </a>
                )}
              </div>
              <div
                className="upload-box"
                onClick={() => fileInputRef.current.click()}
              >
                <BsCloudUploadFill size={40} className="mb-2 text-primary" />
                <span>Click to update your Resume</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVChange}
                  style={{ display: "none" }}
                />
              </div>
              {selectedCVName && (
                <div className="file-selected mt-3">
                  <div className="text-success fw-semibold">
                    {selectedCVName}
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Save Resume"}
                  </button>
                </div>
              )}
            </div>

            {/* Cover Letter Section */}
            <div className="document-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Cover Letter</h5>
                {detail.studentcoverletter && (
                  <a
                    href={`${imgurl}/${detail.studentcoverletter}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <FaDownload className="me-2" />
                    Download Current Cover Letter
                  </a>
                )}
              </div>
              <div
                className="upload-box"
                onClick={() => coverLetterInputRef.current.click()}
              >
                <BsCloudUploadFill size={40} className="mb-2 text-primary" />
                <span>Click to update your Cover Letter</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={coverLetterInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, coverletter: file }));
                      setSelectedCoverLetterName(file.name);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </div>
              {selectedCoverLetterName && (
                <div className="file-selected mt-3">
                  <div className="text-success fw-semibold">
                    {selectedCoverLetterName}
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Save Cover Letter"}
                  </button>
                </div>
              )}
            </div>

            {/* Certificate Section */}
            <div className="document-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Certificate</h5>
                {detail.studentcertificate && (
                  <a
                    href={`${imgurl}/${detail.studentcertificate}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <FaDownload className="me-2" />
                    Download Current Certificate
                  </a>
                )}
              </div>
              <div
                className="upload-box"
                onClick={() => certificateInputRef.current.click()}
              >
                <BsCloudUploadFill size={40} className="mb-2 text-primary" />
                <span>Click to update your Certificate</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={certificateInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        certificate_path: file,
                      }));
                      setSelectedCertificateName(file.name);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </div>
              {selectedCertificateName && (
                <div className="file-selected mt-3">
                  <div className="text-success fw-semibold">
                    {selectedCertificateName}
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Save Certificate"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(detail.studcityname ||
            detail.studstatename ||
            detail.studcountryname ||
            detail.studlinkedin ||
            detail.studgithub ||
            detail.studwebsite) && (
            <div className="profile-section mb-4">
              <h4 className="section-title">
                <FaMapMarkerAlt className="me-2" /> Additional Information
              </h4>
              <div className="row">
                {/* Location Details */}
                {(detail.studcityname ||
                  detail.studstatename ||
                  detail.studcountryname) && (
                  <div className="col-12 mb-3">
                    <h6 className="text-primary mb-2">Location Details</h6>
                    <div className="row">
                      {detail.studcityname && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<FaMapMarkerAlt />}
                            label="City"
                            value={detail.studcityname}
                          />
                        </div>
                      )}
                      {detail.studstatename && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<FaMapMarkerAlt />}
                            label="State"
                            value={detail.studstatename}
                          />
                        </div>
                      )}
                      {detail.studcountryname && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<FaMapMarkerAlt />}
                            label="Country"
                            value={detail.studcountryname}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Links */}
                {(detail.studlinkedin ||
                  detail.studgithub ||
                  detail.studwebsite) && (
                  <div className="col-12">
                    <h6 className="text-primary mb-2">Professional Links</h6>
                    <div className="row">
                      {detail.studlinkedin && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<IoLogoLinkedin />}
                            label="LinkedIn"
                            value="View Profile"
                            isLink={true}
                            linkUrl={detail.studlinkedin}
                          />
                        </div>
                      )}
                      {detail.studgithub && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<IoLogoGithub />}
                            label="GitHub"
                            value="View Profile"
                            isLink={true}
                            linkUrl={detail.studgithub}
                          />
                        </div>
                      )}
                      {detail.studwebsite && (
                        <div className="col-md-4">
                          <DetailItem
                            icon={<IoGlobe />}
                            label="Website"
                            value="Visit Website"
                            isLink={true}
                            linkUrl={detail.studwebsite}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="profile-section mb-4">
            <h4 className="section-title">
              <MdOutlineDateRange className="me-2" /> Account Information
            </h4>
            <div className="row">
              {detail.createdAt && (
                <div className="col-md-4">
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="Profile Created"
                    value={formatDateToDDMMYY(detail.createdAt)}
                  />
                </div>
              )}
              {detail.updatedAt && (
                <div className="col-md-4">
                  <DetailItem
                    icon={<FaCalendarAlt />}
                    label="Last Updated"
                    value={formatDateToDDMMYY(detail.updatedAt)}
                  />
                </div>
              )}
              {detail.studstatus && (
                <div className="col-md-4">
                  <DetailItem
                    icon={<MdOutlineDomainVerification />}
                    label="Status"
                    value={detail.studstatus}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StudentProfileModal show={showModal} onClose={handleCloseModal} />
      <Footer />
    </>
  );
};

export default UserProfileDetail;
