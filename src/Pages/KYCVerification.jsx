import { useState } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCloudUploadFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { studentRegister } from "../service/profilelogin";
import axios from "axios";

const KYCVerification = ({ formData, prevStep }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const BASE_URL_MONGO = process.env.REACT_APP_API_BASE_URL_MONGO;

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload only image files (JPEG, PNG, GIF)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "File size should not exceed 5MB",
        });
        return;
      }

      setter(file);
    }
  };

  const handleFileInputClick = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = "";
      input.click();
    }
  };

  // Function to analyze resume and navigate to ResumeAnalyzer page
  const analyzeResumeAndNavigate = async (resumeFile) => {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axios.post(
        `${BASE_URL_MONGO}/resume/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const analysis = response.data.analysis;

      // Close the loader
      Swal.close();

      // Navigate to ResumeAnalyzer page with analysis data
      navigate("/resume-analyzer", {
        state: {
          analysis: analysis,
          fromRegistration: true,
        },
      });
    } catch (error) {
      console.error("Resume analysis error:", error);
      // Close the loader
      Swal.close();

      // If resume analysis fails, still navigate to dashboard
      Swal.fire({
        title: "Notice",
        text: "Resume analysis is currently unavailable. Proceeding to dashboard.",
        icon: "info",
        confirmButtonColor: "#0346FA",
        timer: 2000,
      }).then(() => {
        navigate("/interships");
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all files are uploaded
    if (!aadharFront || !aadharBack || !idFront || !idBack) {
      Swal.fire({
        icon: "warning",
        title: "Missing Documents",
        text: "Please upload all required documents",
      });
      return;
    }

    setSubmitting(true);

    const formObject = new FormData();

    // Student basic info
    formObject.append("studname", formData.Name);
    formObject.append("studgender", formData.gender);
    formObject.append("studdob", formData.dob);
    formObject.append("studemail", formData.email);
    formObject.append("studmobileno", formData.phoneNumber);
    formObject.append("studentaddress", formData.addressLine1);

    // Education details
    formObject.append("studhighschollname", formData.highschoolname);
    formObject.append("studprogramminglang", formData.programlag);
    formObject.append(
      "studentsecondaryschoolname",
      formData.secondaryschoolname
    );
    formObject.append("studentdegree", formData.degree);
    formObject.append("studentfieldofstudy", formData.fieldofstudy);
    formObject.append("studcollegelocation", formData.college_location);
    formObject.append("studcollegestartyear", formData.startdate);
    if (formData.passedout) {
      formObject.append("studcollegeendyear", formData.passedout);
    }
    formObject.append("studentcollegename", formData.college);
    formObject.append("studprojectdecription", formData.projectdescription);
    formObject.append("studhighschoolpercentage", formData.highschoolper);
    formObject.append("studhighschoollocation", formData.hslocation);
    formObject.append(
      "studentsecondaryschoolpercentage",
      formData.secondaryschollper
    );
    formObject.append("studsecondaryschoollocation", formData.sslocation);

    // Files from previous steps
    if (formData.profile) {
      formObject.append("studprofile", formData.profile);
    }
    formObject.append("studentresume", formData.cv);
    if (formData.coverletter) {
      formObject.append("studentcoverletter", formData.coverletter);
    }
    if (formData.certificate) {
      formObject.append("studentcertificate", formData.certificate);
    }

    // KYC Documents - Aadhar and ID as arrays
    // Append Aadhar files with array notation
    formObject.append("studentAdhar", aadharFront);
    formObject.append("studentAdhar", aadharBack);
    // Append ID files with array notation
    formObject.append("studentId", idFront);
    formObject.append("studentId", idBack);

    // Show loading popup
    Swal.fire({
      title: "Processing Registration",
      html: "Please wait while we register your account...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await studentRegister(formObject);

      console.log("student register detail", response);
      if (response.message === "Student registered successfully") {
        localStorage.setItem("token", response.studtoken);
        localStorage.setItem("stuid", response.student.id);

        // Update loader message for resume analysis
        Swal.update({
          title: "Registration Successful!",
          html: "Analyzing your resume, please wait...",
        });

        // Automatically analyze resume and navigate to ResumeAnalyzer page
        if (formData.cv) {
          await analyzeResumeAndNavigate(formData.cv);
        } else {
          Swal.close();
          navigate("/interships");
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("stuid");
        localStorage.removeItem("recruiter_token");
        localStorage.removeItem("recid");

        Swal.fire({
          title: "Error!",
          text: "Registration failed. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);

      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred during registration.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("stuid");
      localStorage.removeItem("recruiter_token");
      localStorage.removeItem("recid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container p-3 d-flex justify-content-center align-items-center formboxmain mt-5 mb-5">
        <div className="row w-100 w-md-75 p-3 form-box">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <h2 className="personaltext">KYC Verification</h2>
            <FaRegCircleUser className="userprofile-icon" />
          </div>

          <hr className="custom-line" />

          <div className="col-12">
            <form onSubmit={handleSubmit}>
              {/* Aadhar Card Front */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Aadhar Card Front<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => handleFileInputClick("aadharFront")}
                    >
                      <BsCloudUploadFill className="me-2" />
                      Upload Aadhar Front
                    </button>
                    <input
                      type="file"
                      id="aadharFront"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setAadharFront)}
                      style={{ display: "none" }}
                    />
                    {aadharFront && (
                      <span className="ms-3 text-success">
                        ✓ {aadharFront.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aadhar Card Back */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Aadhar Card Back<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => handleFileInputClick("aadharBack")}
                    >
                      <BsCloudUploadFill className="me-2" />
                      Upload Aadhar Back
                    </button>
                    <input
                      type="file"
                      id="aadharBack"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setAadharBack)}
                      style={{ display: "none" }}
                    />
                    {aadharBack && (
                      <span className="ms-3 text-success">
                        ✓ {aadharBack.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Card Front */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  ID Card Front<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => handleFileInputClick("idFront")}
                    >
                      <BsCloudUploadFill className="me-2" />
                      Upload ID Front
                    </button>
                    <input
                      type="file"
                      id="idFront"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setIdFront)}
                      style={{ display: "none" }}
                    />
                    {idFront && (
                      <span className="ms-3 text-success">
                        ✓ {idFront.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Card Back */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  ID Card Back<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => handleFileInputClick("idBack")}
                    >
                      <BsCloudUploadFill className="me-2" />
                      Upload ID Back
                    </button>
                    <input
                      type="file"
                      id="idBack"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setIdBack)}
                      style={{ display: "none" }}
                    />
                    {idBack && (
                      <span className="ms-3 text-success">✓ {idBack.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="row mt-5">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                    disabled={submitting}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KYCVerification;
