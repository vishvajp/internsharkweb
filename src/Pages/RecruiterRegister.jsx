import React, { useState } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import { FaRegCircleUser } from "react-icons/fa6";
import { studentEmailVerify, emailverify } from "../service/profilelogin";
import Swal from "sweetalert2";
import axios from "axios";

const RecruiterRegister = ({
  formData,
  handleChange,
  handleSelectChange,
  nextStep,
  setFormData,
  isEmailVerified,
  setIsEmailVerified,
}) => {
  const [recruiterEmailError, setRecruiterEmailError] = useState("");
  const [recruiterPhoneError, setRecruiterPhoneError] = useState("");
  const [secondaryPhoneError, setSecondaryPhoneError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [issummit, setIsSummit] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        recruiter_designation: value,
      }));
    }
  };

  const handleVerifyClick = async () => {
    setIsSendingOtp(true);
    try {
      const response = await studentEmailVerify({
        email: formData.recruiter_email,
        name: formData.recruiter_name || "Provider",
        userType: "recruiter",
      });

      if (response.message === "OTP sent to email") {
        Swal.fire({
          title: "Success",
          text:
            "OTP sent successfull Kindly check your Inbox/Spam folder" ||
            "Failed to send OTP.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        setOtpSent(true);
        setShowOtp(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Check if email already exists
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;

        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("already registered")
        ) {
          // Allow re-verification for existing email
          Swal.fire({
            title: "Email Already Registered",
            text: "This email is already registered. Click 'Re-verify' to verify your email again.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Re-verify Email",
            cancelButtonText: "Cancel",
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Force send OTP for re-verification
              try {
                const retryResponse = await studentEmailVerify({
                  email: formData.recruiter_email,
                  name: formData.recruiter_name || "Provider",
                  userType: "recruiter",
                  forceResend: true,
                });

                if (retryResponse.message === "OTP sent to email") {
                  Swal.fire({
                    title: "Success",
                    text: "OTP sent successfully! Kindly check your Inbox/Spam folder",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                  });
                  setOtpSent(true);
                  setShowOtp(true);
                }
              } catch (retryError) {
                console.error("Error resending OTP:", retryError);
                Swal.fire({
                  title: "Error",
                  text: "Failed to send OTP. Please try again.",
                  icon: "error",
                  confirmButtonColor: "#3085d6",
                });
              }
            }
          });
        } else {
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        alert("Something went wrong while sending OTP.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsSummit(true);
    try {
      const response = await emailverify({
        email: formData.recruiter_email,
        otp: otp,
        userType: "recruiter", // Specify user type
      });
      console.log("after success verify otp", response);
      if (response.message === "Email verified successfully") {
        Swal.fire({
          title: "Success",
          text: response.message || "Failed to verify Email",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        setIsEmailVerified(true);
        setShowOtp(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        title: "Error",
        text: error || "Something went Wrong while verify email",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSummit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      alert("Please verify your email before proceeding to the next step.");
      return;
    }

    // Check if email or mobile already exists
    try {
      const BASE_URL_MONGO = process.env.REACT_APP_API_BASE_URL_MONGO;
      const response = await axios.post(
        `${BASE_URL_MONGO}/student/checkExistence`,
        {
          email: formData.recruiter_email,
          mobileNo: formData.recruiter_phone,
        }
      );

      // If we get here without error, proceed to next step
      nextStep();
      window.scrollTo(0, 0);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { message } = error.response.data;

        // If email exists, suggest re-verification
        if (message.includes("email") || message.includes("Email")) {
          Swal.fire({
            icon: "warning",
            title: "Email Already Registered",
            text: message + " Please re-verify your email to continue.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then(() => {
            // Reset email verification to allow re-verification
            setIsEmailVerified(false);
            setShowOtp(false);
            setOtpSent(false);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Already Registered",
            text: message,
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to verify registration details. Please try again.",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  return (
    <>
      <Header></Header>
      <div className="container p-3 d-flex justify-content-center align-items-center formboxmain mt-5 mb-5">
        <div className="row w-75 p-3 form-box">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="personaltext">Personal Information</h2>
              <p>Registration Form</p>
            </div>
            <div>
              <FaRegCircleUser className="userprofile-icon" />
            </div>
          </div>

          <hr className="custom-line" />

          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Name:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <input
                    type="text"
                    name="recruiter_name"
                    value={formData.recruiter_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="form-control"
                    required
                    pattern="[A-Za-z\s]+"
                    title="Only letters and spaces are allowed"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  E-Mail:<span className="text-danger">*</span>
                </label>

                <div className="col-md-4 d-flex align-items-center gap-2">
                  <input
                    className={`form-control ${
                      recruiterEmailError ? "is-invalid" : ""
                    }`}
                    type="email"
                    name="recruiter_email"
                    value={formData.recruiter_email}
                    onChange={(e) => {
                      handleChange(e);
                      setRecruiterEmailError(""); // clear error while typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                      if (value && !emailPattern.test(value)) {
                        setRecruiterEmailError(
                          "Please enter a valid email address"
                        );
                      } else {
                        setRecruiterEmailError("");
                      }
                    }}
                    disabled={isEmailVerified}
                    required
                  />

                  {recruiterEmailError && (
                    <div className="invalid-feedback">
                      {recruiterEmailError}
                    </div>
                  )}
                </div>

                {!isEmailVerified && (
                  <div className="col-md-4 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleVerifyClick}
                      disabled={isSendingOtp || recruiterEmailError}
                    >
                      {isSendingOtp
                        ? "Sending..."
                        : otpSent
                        ? "Resend OTP"
                        : "Verify Email"}
                    </button>
                  </div>
                )}

                {isEmailVerified && (
                  <div className="col-md-4 d-flex align-items-center">
                    <span className="text-success fw-bold">✓ Verified</span>
                  </div>
                )}
              </div>

              {showOtp && (
                <>
                  <div className="row align-items-center mb-3">
                    <label className="col-md-3 col-form-label fs-5">
                      Enter OTP:
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="Enter OTP sent to your email"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <div className="offset-md-3 col-md-4">
                      <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={handleOtpSubmit}
                        disabled={issummit}
                      >
                        {issummit ? "Submitting" : "Submit OTP"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Gender:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <select
                    name="recruiter_gender"
                    value={formData.recruiter_gender}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row align-items-start mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Mobile Number:<span className="text-danger">*</span>
                </label>

                <div className="col-md-4">
                  <input
                    className={`form-control mb-2 ${
                      recruiterPhoneError ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="recruiter_phone"
                    placeholder="Mobile Number"
                    value={formData.recruiter_phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // only digits

                      if (value.length > 10) value = value.slice(0, 10); // max 10

                      setFormData((prev) => ({
                        ...prev,
                        recruiter_phone: value,
                      }));

                      setRecruiterPhoneError(""); // clear while typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;

                      // For INDIA: must start with 6-9 and be 10 digits
                      const phonePattern = /^[6-9]\d{9}$/;

                      if (!phonePattern.test(value)) {
                        setRecruiterPhoneError(
                          "Enter a valid 10-digit mobile number"
                        );
                      } else {
                        setRecruiterPhoneError("");
                      }
                    }}
                    required
                  />

                  {recruiterPhoneError && (
                    <div className="invalid-feedback">
                      {recruiterPhoneError}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-start mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Secondary Number:
                </label>

                <div className="col-md-4">
                  <input
                    className={`form-control mb-2 ${
                      secondaryPhoneError ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="secondery_phone"
                    placeholder="Mobile Number"
                    value={formData.secondery_phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // only digits

                      if (value.length > 10) value = value.slice(0, 10); // max 10

                      setFormData((prev) => ({
                        ...prev,
                        secondery_phone: value,
                      }));

                      setSecondaryPhoneError(""); // clear when typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;

                      // If empty, it's valid (optional field)
                      if (!value || value.trim() === "") {
                        setSecondaryPhoneError("");
                        return;
                      }

                      const phonePattern = /^[6-9]\d{9}$/; // Indian mobile

                      if (!phonePattern.test(value)) {
                        setSecondaryPhoneError(
                          "Enter a valid 10-digit mobile number"
                        );
                      } else if (value === formData.recruiter_phone) {
                        setSecondaryPhoneError(
                          "Secondary mobile number must be different from primary mobile number"
                        );
                      } else {
                        setSecondaryPhoneError("");
                      }
                    }}
                  />

                  {secondaryPhoneError && (
                    <div className="invalid-feedback">
                      {secondaryPhoneError}
                    </div>
                  )}
                </div>
              </div>

              <div className="row align-items-start mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Recruiter Designation: <span className="text-danger">*</span>
                </label>
                <div className="col-md-9">
                  <input
                    className=" textarea form-control mb-2"
                    type="text"
                    name="recruiter_designation"
                    placeholder="Designation"
                    value={formData.recruiter_designation}
                    onChange={handleDesignationChange}
                    required
                  />
                </div>
              </div>

              <div className="row align-items-start mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Number Of Employees:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <input
                    className=" textarea form-control mb-2"
                    type="text"
                    name="no_of_employees"
                    placeholder="Employees Count"
                    value={formData.no_of_employees}
                    onChange={handleChange}
                    required
                    pattern="^[0-9]+$"
                    title="Enter a valid Employee Count"
                  />
                </div>
              </div>

              <hr className="custom-line" />

              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary px-4">
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default RecruiterRegister;
