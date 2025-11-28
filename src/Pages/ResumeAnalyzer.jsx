import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Layouts/Footer";
import Header from "../Layouts/Header";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaStar,
  FaChartPie,
  FaFilePdf,
} from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

// Mini Circular Progress Chart Component
const MiniCircularChart = ({ rating, color, size = 60 }) => {
  const percentage = (rating / 10) * 100;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="position-relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
      {/* Rating text */}
      <div
        className="position-absolute top-50 start-50 translate-middle text-center"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            lineHeight: "1",
            color: "#333",
          }}
        >
          {rating}
        </div>
        <div
          style={{
            fontSize: "8px",
            lineHeight: "1",
            color: "#666",
            marginTop: "1px",
          }}
        >
          /10
        </div>
      </div>
    </div>
  );
};

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [fromRegistration, setFromRegistration] = useState(false);

  // Check if analysis data was passed from registration
  React.useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
      setFromRegistration(location.state.fromRegistration || false);
    }
  }, [location.state]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Check if file is PDF
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload only PDF files.");
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please upload only PDF files.");
        // Reset the file input
        e.target.value = "";
      }
    }
  };

  const uploadResume = async () => {
    if (!file) return alert("Please upload a PDF resume!");

    // Double check file type before uploading
    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        `${BASE_URL}/resume/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error analyzing resume");
    }
    setLoading(false);
  };

  // Color palette for sections
  const SECTION_COLORS = [
    "#0346FA",
    "#10CBCB",
    "#F5A000",
    "#FF6B6B",
    "#8A2BE2",
    "#00CED1",
    "#32CD32",
    "#FF4500",
    "#9370DB",
    "#20B2AA",
    "#FFD700",
    "#FF69B4",
  ];

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
        <div className="container text-center py-2">
          <h1 className="fw-bold display-5 mb-2">AI Resume Analyzer</h1>
          <p className="fs-5 opacity-75">
            Get ATS scores, grading, strengths & improvement tips instantly.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Only show upload section if not coming from registration */}
        {!fromRegistration && (
          <>
            {/* Upload Box */}
            <div
              className={`p-5 rounded-4 shadow-lg text-center mb-4 position-relative ${
                dragActive ? "border-primary bg-light" : "bg-white"
              }`}
              style={{
                border: "2px dashed #10CBCB",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                className="d-none"
                id="fileUpload"
                onChange={handleFileSelect}
              />

              <label htmlFor="fileUpload" className="w-100">
                <FaFilePdf
                  size={70}
                  color={dragActive ? "#0346FA" : "#10CBCB"}
                  className="mb-3"
                />

                <h4 className="fw-bold">
                  {file ? file.name : "Drag & Drop your PDF resume"}
                </h4>

                <p className="text-muted">
                  Supports <strong>PDF files only</strong>
                </p>

                <p className="text-muted mt-2">
                  or{" "}
                  <span style={{ color: "#0346FA", fontWeight: "600" }}>
                    Browse PDF File
                  </span>
                </p>
              </label>
            </div>

            {/* Analyze Button */}
            <div className="text-center mb-5">
              <button
                className="btn btn-lg text-white px-4 shadow"
                style={{
                  background: "linear-gradient(90deg, #0346FA, #10CBCB)",
                  borderRadius: "50px",
                }}
                onClick={uploadResume}
                disabled={loading || !file}
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </>
        )}

        {/* Result Section */}
        {analysis &&
          (() => {
            // Calculate section average safely inside the analysis block
            const sectionAverage =
              Object.values(analysis.sections).reduce(
                (sum, sec) => sum + sec.rating,
                0
              ) / Object.values(analysis.sections).length;

            // Prepare section data for pie chart
            const sectionData = Object.entries(analysis.sections).map(
              ([sectionName, sectionData], index) => ({
                name:
                  sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
                value: sectionData.rating,
                color: SECTION_COLORS[index % SECTION_COLORS.length],
              })
            );

            return (
              <div className="animate__animated animate__fadeIn">
                {/* Score Cards */}
                <div className="row g-4 mb-4">
                  <div className="col-md-3">
                    <div className="card shadow-lg text-center p-4 border-0 rounded-4">
                      <FaChartPie size={40} color="#0346FA" className="mb-3" />
                      <h2 className="fw-bold">{analysis.overallScore}</h2>
                      <p className="text-muted">Overall Score</p>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card shadow-lg text-center p-4 border-0 rounded-4">
                      <FaCheckCircle
                        size={40}
                        color="#10CBCB"
                        className="mb-3"
                      />
                      <h2 className="fw-bold">{analysis.atsScore}</h2>
                      <p className="text-muted">ATS Score</p>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card shadow-lg text-center p-4 border-0 rounded-4">
                      <FaStar size={40} color="#F5A000" className="mb-3" />
                      <h2 className="fw-bold">{sectionAverage.toFixed(1)}</h2>
                      <p className="text-muted">Section Average</p>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="card shadow-lg text-center p-4 border-0 rounded-4">
                      <FaStar size={40} color="#FF6B6B" className="mb-3" />
                      <h2 className="fw-bold">{analysis.grade}</h2>
                      <p className="text-muted">Grade</p>
                    </div>
                  </div>
                </div>

                {/* PIE CHART SECTION */}
                <div className="card shadow-lg border-0 rounded-4 p-4 mb-5">
                  <h4 className="fw-bold mb-4" style={{ color: "#0346FA" }}>
                    Section Ratings Breakdown
                  </h4>

                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={sectionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {sectionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}/10`, "Rating"]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value, entry, index) => (
                            <span style={{ color: "#333" }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <h3 className="fw-bold mb-3" style={{ color: "#0346FA" }}>
                  Detailed Section Analysis
                </h3>

                <div className="row">
                  {Object.entries(analysis.sections).map(
                    ([key, value], index) => (
                      <div className="col-md-6 mb-4" key={key}>
                        <div
                          className="card shadow-sm border-0 p-3 rounded-4 h-100"
                          style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(8px)",
                            borderLeft: `4px solid ${
                              SECTION_COLORS[index % SECTION_COLORS.length]
                            }`,
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5
                                className="fw-bold text-capitalize mb-0"
                                style={{ color: "#0346FA" }}
                              >
                                {key}
                              </h5>
                              <ul className="mt-3 mb-1">
                                {value.suggestions.map((s, suggestionIndex) => (
                                  <li
                                    key={suggestionIndex}
                                    className="text-muted"
                                  >
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Mini Circular Chart */}
                            <MiniCircularChart
                              rating={value.rating}
                              color={
                                SECTION_COLORS[index % SECTION_COLORS.length]
                              }
                              size={60}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Strengths */}
                <h3 className="fw-bold mt-4" style={{ color: "#0346FA" }}>
                  Strengths
                </h3>
                <div className="card p-4 shadow-sm border-0 rounded-4 mb-4">
                  <ul className="mb-0">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <h3 className="fw-bold mt-4" style={{ color: "#0346FA" }}>
                  Improvements
                </h3>
                <div className="card p-4 shadow-sm border-0 rounded-4 mb-4">
                  <ul className="mb-0">
                    {analysis.improvements.map((s, i) => (
                      <li key={i} className="text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Continue to Dashboard Button - Only show if coming from registration */}
                {fromRegistration && (
                  <div className="text-center mt-5 mb-4">
                    <button
                      className="btn btn-lg text-white px-5 shadow"
                      style={{
                        background: "linear-gradient(90deg, #0346FA, #10CBCB)",
                        borderRadius: "50px",
                      }}
                      onClick={() => navigate("/interships")}
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
      </div>

      <Footer />
    </>
  );
}
