import React, { useEffect } from "react";
import "./StudentListCenter.css";
import sample from "../Images/noImage.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const StudentListCenter = ({ students, loading, error }) => {
  const navigate = useNavigate();
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;

  useEffect(() => {
    console.log("student length changed:", students.length);
  }, [students]);

  if (loading) {
    return <div className="text-center py-4">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-danger py-4">Error: {error}</div>;
  }

  return (
    <div className="row g-3">
      {console.log("studenlenght", students.length)}
      {students && students.length > 0 ? (
        students.map((student, index) => (
          <div key={student._id || index} className="col-md-6 col-lg-4 mb-4">
            <div
              className="studentcard p-3 text-center"
              onClick={() => {
                window.open(
                  `${process.env.PUBLIC_URL}/studentdetail/${student._id}`,
                  "_blank"
                );
              }}
            >
              <div className="studentimage-wrapper mx-auto mb-2">
                <img
                  className="studentimage"
                  src={`${imgurl}/${student.studprofile}` || sample}
                  alt={student.studname || "Profile"}
                  onError={(e) => {
                    e.target.src = sample;
                  }}
                />
              </div>
              <div className="fw-bold mt-2">
                {student.studname || "No Name"}
              </div>
              <div className="roletext">
                {student.studentcollegename || "No College Specified"}
              </div>
              <div className="roletext">
                {student.studentdegree || "No Degree Specified"} -{" "}
                {student.studentfieldofstudy || "No Field Specified"}
              </div>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <div className="d-flex align-items-center gap-1 w-100">
                  <FaLocationDot />
                  <span className="w-100" style={{ wordWrap: "break-word" }}>
                    {student.studentaddress || "Location not specified"}
                  </span>
                </div>
              </div>
              <div className="text-muted mt-2">
                {/* {Array.isArray(student.studprojectname)
        ? student.studprojectname.join(", ")
        : student.studprojectname || "No language listed"} */}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-bold fs-5 py-4">
          No students found.
        </div>
      )}
    </div>
  );
};

export default StudentListCenter;
