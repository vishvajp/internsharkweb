import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./ApplicationStatusModal.css";
import axios from "axios";

const ApplicationStatusModal = ({ show, onClose, jobDetail }) => {
  const [statusData, setStatusData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseurl = process.env.REACT_APP_API_BASE_URL;

  // useEffect(() => {
  //   if (!show || !jobDetail?.internship_id) {
  //     return;
  //   }

  //   const getStatus = async () => {
  //     setLoading(true);
  //     setError(null);
  //     const token = localStorage.getItem("token");
  //     try {
  //       const response = await axios.post(
  //         `${baseurl}/getStudentApllyStatus/${jobDetail.internship_id}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log("application status", response.data);
  //       setStatusData(response.data);
  //     } catch (err) {
  //       console.error("Error fetching status", err);
  //       setError("Failed to load status");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getStatus();
  // }, [show, jobDetail, baseurl]);



  useEffect(() => {
    if (show && jobDetail) {
      console.log("Modal opened with job detail:", jobDetail);
      setStatusData(jobDetail);
    }
  }, [show, jobDetail]);

  // Determine status
  let isViewed = false;
  let stepStatus = "pending";
  let responseLabel = "Pending";

  if (statusData?.status === "Selected") {
    isViewed = true;
    stepStatus = "completed";
    responseLabel = "Selected";
  } else if (statusData?.status === "Rejected") {
    isViewed = true;
    stepStatus = "wrong";
    responseLabel = "Not Shortlisted and Rejected";
  } else if (statusData?.status === "Applied") {
    isViewed = false;
    stepStatus = "pending";
    responseLabel = "Pending";
  }

  const renderStep = (index, title, status, customLabel) => {
    const stepClass =
      status === "completed"
        ? "stepper-step stepper-completed"
        : status === "wrong"
        ? "stepper-step stepper-rejected"
        : "stepper-step stepper-pending";

    const circleContent =
      status === "completed" ? (
        // Check
        <svg
          viewBox="0 0 16 16"
          className="bi bi-check-lg"
          fill="currentColor"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      ) : status === "wrong" ? (
        // Cross
        <svg
          viewBox="0 0 16 16"
          className="bi bi-x-lg"
          fill="currentColor"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"
          />
        </svg>
      ) : (
        index + 1
      );

    return (
      <div className={stepClass} key={index}>
        <div className="stepper-circle">{circleContent}</div>
        {index !== 3 && <div className="stepper-line"></div>}
        <div className="stepper-content">
          <div className="stepper-title">{title}</div>
          <div className="stepper-status">
            {status === "completed"
              ? customLabel || "Completed"
              : status === "wrong"
              ? customLabel
              : customLabel || "Pending"}
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    { title: "Applied", status: "completed" },
    { title: "Application Sent", status: "completed" },
    {
      title: "Application Viewed By Recruiter",
      status: isViewed ? "completed" : "pending",
    },
    {
      title: "Application Status",
      status: stepStatus,
      customLabel: responseLabel,
    },
  ];

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Application Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div>Loading status...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && (
          <div className="stepper-box">
            {steps.map((step, i) =>
              renderStep(i, step.title, step.status, step.customLabel)
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApplicationStatusModal;
