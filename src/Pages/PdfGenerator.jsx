import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Layouts/Footer";
import Header from "../Layouts/Header";
import { FaFilePdf, FaRobot, FaCheckCircle } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

const PdfGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    role: "",
    skill: "",
    internshipmonth: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [pdfId, setPdfId] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);

  // Loading messages
  const loadingMessages = [
    "AI analyzing internship requirements...",
    "Generating course syllabus...",
    "Creating week-by-week curriculum...",
    "Structuring learning modules...",
    "Designing practical assignments...",
    "Finalizing course materials...",
    "Preparing PDF documents...",
    "Generating syllabus pdf...",
  ];

  // Check if data was passed from navigation
  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.pdfData) {
      setGenerated(true);
      setPdfId(location.state.pdfData.id);
      setDownloadLinks(location.state.pdfData.download_links || []);
    }
  }, [location.state]);

  // Cycle through loading messages and progress
  useEffect(() => {
    let messageInterval;
    let progressInterval;

    if (isGenerating) {
      let currentIndex = 0;
      setLoadingMessage(loadingMessages[0]);
      setProgress(0);

      // Change message every 5 seconds
      messageInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[currentIndex]);
      }, 10000);

      // Increment progress gradually and smoothly (reaches ~90% before API completes)
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Stop at 90%, wait for API
          // Slower increment for smoother animation
          return prev + 0.5;
        });
      }, 300); // Increment every 300ms (slower)
    } else {
      setProgress(0);
    }

    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isGenerating]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.role || !formData.skill || !formData.internshipmonth) {
      alert("Please fill in all fields");
      return;
    }

    // Extract number from duration text
    const durationMatch = formData.internshipmonth.match(/(\d+)/);
    const internshipMonths = durationMatch ? parseInt(durationMatch[0]) : 1;

    if (!durationMatch || internshipMonths < 1) {
      alert("Please enter a valid duration (e.g., '3 months' or '6 months')");
      return;
    }

    setIsGenerating(true);

    try {
      const recruiter_token = localStorage.getItem("recruiter_token");

      const response = await axios.post(
        `${BASE_URL}/syllabus/generate`,
        {
          role: formData.role,
          skill: formData.skill,
          internshipmonth: internshipMonths,
        },
        {
          headers: {
            Authorization: `Bearer ${recruiter_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Set progress to 100% on success
        setProgress(100);

        // Small delay to show 100% before transitioning
        setTimeout(() => {
          setGenerated(true);
          setPdfId(response.data.id);
          setDownloadLinks(response.data.download_links || []);
          setIsGenerating(false);
        }, 500);
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate PDF. Please try again."
      );
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      role: "",
      skill: "",
      internshipmonth: "",
    });
    setGenerated(false);
    setPdfId(null);
    setDownloadLinks([]);
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <div
        className="text-white"
        style={{
          background: "linear-gradient(135deg, #0346FA 0%, #10CBCB 100%)",
        }}
      >
        <div className="container text-center py-4">
          <h1 className="fw-bold display-5 mb-2">
            <FaRobot className="me-3" />
            Internship Syllabus Generator
          </h1>
          <p className="fs-5 opacity-75">
            Generate comprehensive course materials for your internship program
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Input Form */}
        {!generated && !isGenerating && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="p-5 rounded-4 shadow-lg bg-white"
                style={{ border: "2px solid #10CBCB" }}
              >
                <h4 className="fw-bold mb-4 text-primary">
                  Enter Internship Details
                </h4>

                {/* Role */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Role / Position <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Frontend Developer, Data Analyst"
                  />
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Internship Skills <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    rows="4"
                    placeholder="e.g., HTML, CSS, JavaScript, React.js, Node.js"
                  />
                  <small className="text-muted">
                    List all skills separated by commas
                  </small>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Internship Duration <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="internshipmonth"
                    value={formData.internshipmonth}
                    onChange={handleChange}
                    placeholder="e.g., 3 months, 6 months"
                  />
                  <small className="text-muted">
                    Enter duration (e.g., "3 months" or "6 months")
                  </small>
                </div>

                {/* Generate Button */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-lg text-white px-5 shadow"
                    style={{
                      background: "linear-gradient(90deg, #0346FA, #10CBCB)",
                      borderRadius: "50px",
                    }}
                    onClick={handleGenerate}
                  >
                    <FaRobot className="me-2" />
                    Generate Course PDFs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-5 rounded-4 shadow-lg bg-white text-center">
                <div
                  className="spinner-border text-primary mb-4"
                  style={{ width: "4rem", height: "4rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="fw-bold text-primary mb-3">{loadingMessage}</h4>
                <p className="text-muted">
                  This may take a few moments. Please don't close this page.
                </p>
                <div className="progress mt-4" style={{ height: "20px" }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #0346FA, #10CBCB)",
                      transition: "width 0.3s ease-in-out",
                    }}
                  >
                    <span className="fw-bold">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {generated && !isGenerating && (
          <div className="animate__animated animate__fadeIn">
            {/* Success Message */}
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <div
                  className="alert alert-success d-flex align-items-center shadow"
                  role="alert"
                >
                  <FaCheckCircle className="fs-3 me-3" />
                  <div>
                    <h5 className="mb-1">
                      Course Syllabus Generated Successfully!
                    </h5>
                    <p className="mb-0">
                      Your course materials are ready for download.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Details */}
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                  <h4 className="fw-bold mb-3 text-primary">
                    Generated Course Details
                  </h4>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block">Role</small>
                        <strong>{formData.role}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block">Duration</small>
                        <strong>{formData.internshipmonth}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block">
                          Total Syllabus
                        </small>
                        <strong>{downloadLinks.length} Weeks</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted d-block mb-2">
                      Skills Covered
                    </small>
                    <p className="mb-0">{formData.skill}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Links */}
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                  <h4 className="fw-bold mb-4 text-primary">
                    Download Course Materials
                  </h4>
                  <div className="list-group">
                    {downloadLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-group-item list-group-item-action d-flex align-items-center p-3 mb-2 rounded"
                        style={{ border: "2px solid #e9ecef" }}
                      >
                        <FaFilePdf className="text-danger fs-3 me-3" />
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">
                            Week {index + 1} Course Material
                          </h6>
                          <small className="text-muted">
                            Click to download or view
                          </small>
                        </div>
                        <i className="bi bi-download fs-5 text-primary"></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <button
                  className="btn btn-outline-primary btn-lg px-5 me-3"
                  onClick={handleReset}
                >
                  Generate Another
                </button>
                {/* <button
                  className="btn btn-primary btn-lg px-5"
                  onClick={() => navigate("/postjob")}
                >
                  Post Internship
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PdfGenerator;
