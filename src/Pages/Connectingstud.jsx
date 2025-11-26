import React, { useState } from "react";
import "./Connectingstud.css";
import student from "../Images/s1.png";
import iconone from "../Images/icon-1.png";
import icontwo from "../Images/icon-2.png";
import employee from "../Images/employee (2).png";
import selfemply from "../Images/self-employed.png";
import { FaRegCircleDown } from "react-icons/fa6";
import Registration from "../Layouts/Registration";
import ProfileLogin from "../Layouts/ProfileLogin";

const Connectingstud = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleOpenRegistration = () => setShowRegistrationModal(true);
  const handleCloseRegistration = () => setShowRegistrationModal(false);
  const handleOpenLogin = () => {
    setShowRegistrationModal(false);
    setShowLoginModal(true);
  };
  const handleCloseLogin = () => setShowLoginModal(false);
  return (
    <>
      <div className="container connectingstudent  pos py-5">
        <div className="row px-5 d-flex flex-column flex-lg-row align-items-center justify-content-center">
          {/* Text Section (second on large, first on mobile) */}
          <div className="col-12 col-lg-7 order-1 order-lg-2 mt-3 mt-lg-0">
            <div className="row translate-top d-flex justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-5 mt-2 mt-lg-0">
                <div
                  className="for-inter d-flex align-items-center justify-content-between w-100 p-2"
                  onClick={handleOpenRegistration}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={employee}
                    className="employephoto me-2"
                    alt="employee"
                  />
                  <p className="mb-0 me-2 inter-text">For Intern</p>
                  <FaRegCircleDown className="inter-textone" />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-5 mt-2 mt-lg-0">
                <div
                  className="for-recruiter d-flex align-items-center justify-content-between w-100 p-2"
                  onClick={handleOpenRegistration}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={selfemply}
                    className="employephoto me-2"
                    alt="employee"
                  />
                  <p className="mb-0 me-2 inter-text">For Recruiter</p>
                  <FaRegCircleDown className="inter-textone" />
                </div>
              </div>
            </div>

            <div className="text-content">
              <h2>Connecting Students with Dream Internships!</h2>
              <p>
                Discover top internship opportunities that match your skills and
                career goals. Whether you're a student or a recent graduate, we
                connect you with leading companies across various industries.
              </p>
            </div>

            {/* Icons Row */}
            <div className="row g-2 mt-3 text-center">
              {/* First Icon + Text */}
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <img
                  src={iconone}
                  alt="Icon One"
                  className="img-fluid me-2 connecticons"
                />
                <p className="mb-0">Understand Your Needs</p>
              </div>

              {/* Second Icon + Text */}
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <img
                  src={icontwo}
                  alt="Icon Two"
                  className="img-fluid me-2 connecticons"
                />
                <p className="mb-0">Find the Perfect Company</p>
              </div>
            </div>
          </div>

          {/* Image Section (first on large, last on mobile) */}
          <div className="col-12 col-lg-5 order-2 order-lg-1 d-flex justify-content-center align-items-end">
            <img
              src={student}
              alt="Student"
              className="img-fluid student-img"
            />
          </div>
        </div>
      </div>

      <Registration
        show={showRegistrationModal}
        handleClose={handleCloseRegistration}
        openLoginModal={handleOpenLogin}
      />
      <ProfileLogin show={showLoginModal} handleClose={handleCloseLogin} />
    </>
  );
};

export default Connectingstud;
