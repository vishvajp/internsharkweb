import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import './StudentappliedlistModal.css'
import { useNavigate } from "react-router-dom";
import {getapplicationlist,jobststatusupdate} from '../service/postjob'

const StudentappliedlistModal = ({ show, onClose, internshipId }) => {
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  // Example: loading and data state
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch applied students when modal opens
  useEffect(() => {
    if (show) {
      // fetchStudents();
      fetchapplication();
      console.log("intershipid",internshipId)
    }
  }, [show,internshipId]);

// const fetchStudents = async () => {
//   setLoading(true);
//   setError(null);

//   try {
//     const recruiter_token = localStorage.getItem("recruiter_token");

//     const res = await axios.post(
//       `${baseurl}/getAppliedInternship/${internshipId}`,
//       {}, 
//       {
//         headers: {
//           Authorization: `Bearer ${recruiter_token}`
//         }
//       }
//     );

//     console.log("API response:", res.data.data);
//     setStudents(res.data.data || []);
//   } catch (err) {
//     console.error("Fetch error", err);
//     setError("Failed to load student list.");
//   } finally {
//     setLoading(false);
//   }
// };



//node to handle fetch applicant detail
const fetchapplication = async() => {
  setLoading(true);
  setError(null);
  setStudents([]);

  try{
    const response = await getapplicationlist(internshipId);
    console.log("aplicantsssssssssss",response);
  
    if (response.message === "No students have applied yet") {
      setStudents([]);
    } else {
      setStudents(response); 
    }
  }catch(error){
    console.log("Error while fetch applicant detail",error);
    if (error.message === "No students have applied yet") {
      setStudents([]);
    }
  
  }finally {
    setLoading(false);
  }
}


 // Accept/Reject handler
//   const handleUpdateStatus = async (studentId, status) => {
//   const recruiter_token = localStorage.getItem("recruiter_token");
//   setActionLoading(studentId);

//   try {
//     const res = await axios.post(
//       `${baseurl}/updateStudentAppliedStatus/${internshipId}`,
//       {
//         student_id: studentId,
//         status: status
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${recruiter_token}`
//         }
//       }
//     );

//     console.log("Status updated:", res.data);
    
//     fetchapplication();
//   } catch (err) {
//     console.error(`Error updating status for student ${studentId}:`, err);
//     alert("Failed to update status.");
//   } finally {
//     setActionLoading(null);
//   }
// };

//node accept and reject handler
// const handleTestUpdateStatus = async (studentId,status)
const handleUpdateStatus = async (id, status) => {
  try {
    setActionLoading(id);
    const response = await jobststatusupdate(id, status);

    // ✅ Update local state instantly
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === id ? { ...student, status } : student
      )
    );
  } catch (error) {
    console.error("Error updating status", error);
  } finally {
    setActionLoading(null);
  }
};

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Students Applied</Modal.Title>
      </Modal.Header>

      <Modal.Body
      style={{
    maxHeight: "400px",
    overflowY: "auto"
  }}
      >
  {loading && (
    <div className="text-center">
      <Spinner animation="border" />
    </div>
  )}

  {error && <Alert variant="danger">{error}</Alert>}

  {!loading && !error && students.length === 0 && (
    <p>No students have applied yet.</p>
  )}

  {!loading && students.length > 0 && (
    <div className="d-flex flex-column gap-3">
      {students.map((student) => (
        <div
          key={student._id}
          className="border rounded p-3 shadow-sm eachstudentaccept"
          
        >
          <h6 className="mb-1">{student.student.studname}</h6>
          <p className="mb-1 text-muted">{student.student.studemail}</p>
          <p className="mb-1">
            <strong>College:</strong> {student.student.studentcollegename}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {student.student.studentaddress}
          </p>
          <p className="mb-2">
            <strong>Mobile:</strong> {student.student.studmobileno}
          </p>

          {/* Action buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
  window.open(`${process.env.PUBLIC_URL}/studentdetail/${student.student._id}`, '_blank');
}}
            >
              <i className="bi bi-check-circle me-1"></i>
              View Detail
            </Button>
            
             {/* ✅ ACCEPT Button */}
  {student.status === "Applied" || student.status === "Selected" ? (
    <Button
      variant={student.status === "Selected" ? "success" : "outline-success"}
      size="sm"
      disabled={actionLoading === student._id || student.status === "Selected"}
      onClick={() => handleUpdateStatus(student._id, "Selected")}
    >
      {student.status === "Selected" ? (
        "Accepted"
      ) : actionLoading === student._id ? (
        <Spinner as="span" animation="border" size="sm" />
      ) : (
        <>
          <i className="bi bi-check-circle me-1"></i> Accept
        </>
      )}
    </Button>
  ) : null}

  {/* ❌ REJECT Button */}
  {student.status === "Applied" || student.status === "Rejected" ? (
    <Button
      variant={student.status === "Rejected" ? "danger" : "outline-danger"}
      size="sm"
      disabled={actionLoading === student._id || student.status === "Rejected"}
      onClick={() => handleUpdateStatus(student._id, "Rejected")}
    >
      {student.status === "Rejected" ? (
        "Rejected"
      ) : actionLoading === student._id ? (
        <Spinner as="span" animation="border" size="sm" />
      ) : (
        <>
          <i className="bi bi-x-circle me-1"></i> Reject
        </>
      )}
    </Button>
  ) : null}
            
          </div>
        </div>
      ))}
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

export default StudentappliedlistModal;
