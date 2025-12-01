import React, { useState } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import "./StudentRegistration.css";
import { FaRegCircleUser } from "react-icons/fa6";
import Select from "react-select";
import countryList from "react-select-country-list";
import axios from "axios";
import noimage from "../Images/noImage.jpg";
import { studentEmailVerify, emailverify } from "../service/profilelogin";
import Swal from "sweetalert2";
import { Select as AntSelect } from "antd";
import { getStates, getDistricts } from "../objects/IndiaLocations";

const StudentRegistration = ({
  formData,
  handleChange,
  handleSelectChange,
  nextStep,
  setFormData,
  isEmailVerified,
  setIsEmailVerified,
}) => {
  const options = countryList().getData();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [issummit, setIsSummit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Address location state
  const [addressState, setAddressState] = useState("");
  const [addressDistrict, setAddressDistrict] = useState("");
  const states = getStates();

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleVerifyClick = async () => {
    setIsSendingOtp(true);
    try {
      const response = await studentEmailVerify({
        email: formData.email,
        name: formData.Name || "Student",
        userType: "student",
      });

      //  console.log("sent otp to email",response);
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
                  email: formData.email,
                  name: formData.Name || "Student",
                  userType: "student",
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
      setIsSendingOtp(false); // stop loading
    }
  };

  const handleOtpSubmit = async () => {
    setIsSummit(true);
    try {
      const response = await emailverify({
        email: formData.email,
        otp: otp,
        userType: "student", // Specify user type
      });
      console.log("after sucess verify otp", response);
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
        text: error || "Somthing went Wrong while verify email",
        icon: "Error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSummit(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits

    if (value.length > 10) value = value.slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));

    setPhoneError(""); // clear error while typing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !profileImage ||
      !formData.Name ||
      !formData.gender ||
      !formData.dob ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.addressLine1
    ) {
      alert(
        "Please fill in all required fields, including uploading your profile image."
      );
      return;
    }

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
          email: formData.email,
          mobileNo: formData.phoneNumber,
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
      <Header />
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
                  User Profile:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4 text-center">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profileUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />

                  {/* Clickable image label */}
                  <label htmlFor="profileUpload" style={{ cursor: "pointer" }}>
                    <img
                      src={profileImage || noimage}
                      alt="Profile"
                      className="profileimageuplode"
                    />
                    <div className="mt-2 text-primary">Click to upload</div>
                  </label>
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Name:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Gender:<span className="text-danger">*</span>
                </label>
                <div className="col-md-9 d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={handleChange}
                      checked={formData.gender === "Male"}
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={handleChange}
                      checked={formData.gender === "Female"}
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  DOB:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  E-Mail:<span className="text-danger">*</span>
                </label>

                <div className="col-md-4 d-flex align-items-center gap-2">
                  <input
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    type="email"
                    name="email"
                    placeholder="Enter Your E-mail"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setEmailError(""); // clear while typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                      if (value && !emailPattern.test(value)) {
                        setEmailError("Please enter a valid email address");
                      } else {
                        setEmailError("");
                      }
                    }}
                    disabled={isEmailVerified}
                    required
                  />

                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                {!isEmailVerified && (
                  <div className="col-md-4 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleVerifyClick}
                      disabled={isSendingOtp || emailError}
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
                        {issummit ? "Submiting" : "Submit Otp"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  Phone Number:<span className="text-danger">*</span>
                </label>

                <div className="col-md-4 d-flex gap-2">
                  <input
                    className={`form-control ${phoneError ? "is-invalid" : ""}`}
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={(e) => {
                      const value = e.target.value;
                      const phonePattern = /^\d{10}$/; // ✅ any 10 digits allowed

                      if (!phonePattern.test(value)) {
                        setPhoneError("Enter a valid 10-digit mobile number");
                      } else {
                        setPhoneError("");
                      }
                    }}
                    maxLength={10}
                    required
                  />

                  {phoneError && (
                    <div className="invalid-feedback">{phoneError}</div>
                  )}
                </div>
              </div>

              {/* Address State */}
              <div className="row align-items-center mb-4">
                <label className="col-md-3 col-form-label fs-5">
                  State:<span className="text-danger">*</span>
                </label>
                <div className="col-md-4">
                  <AntSelect
                    style={{ width: "100%" }}
                    placeholder="Select State"
                    options={states.map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    value={addressState}
                    onChange={(value) => {
                      setAddressState(value);
                      setAddressDistrict(""); // Reset district when state changes
                      setFormData({ ...formData, addressLine1: value });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                  />
                </div>
              </div>

              {/* Address District */}
              {addressState && (
                <div className="row align-items-center mb-4">
                  <label className="col-md-3 col-form-label fs-5">
                    District:<span className="text-danger">*</span>
                  </label>
                  <div className="col-md-4">
                    <AntSelect
                      style={{ width: "100%" }}
                      placeholder="Select District"
                      options={getDistricts(addressState).map((district) => ({
                        label: district,
                        value: district,
                      }))}
                      value={addressDistrict}
                      onChange={(value) => {
                        setAddressDistrict(value);
                        setFormData({
                          ...formData,
                          addressLine1: `${value}, ${addressState}`,
                        });
                      }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Detailed Address */}
              {addressDistrict && (
                <div className="row align-items-start mb-4">
                  <label className="col-md-3 col-form-label fs-5">
                    Address:<span className="text-danger">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control mb-2"
                      type="text"
                      name="addressLine2"
                      placeholder="Street, Building, Landmark"
                      value={formData.addressLine2 || ""}
                      onChange={(e) => {
                        handleChange(e);
                        // Update full address with street details
                        const fullAddress = `${e.target.value}, ${addressDistrict}, ${addressState}`;
                        setFormData({
                          ...formData,
                          addressLine1: fullAddress,
                          addressLine2: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              )}

              <hr className="custom-line" />

              {!isEmailVerified && (
                <div className="row mt-3">
                  <div className="col-12 text-center">
                    <p className="text-warning fw-bold">
                      ⚠️ Please verify your email to proceed to the next step
                    </p>
                  </div>
                </div>
              )}

              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={!isEmailVerified}
                    style={{
                      opacity: !isEmailVerified ? 0.6 : 1,
                      cursor: !isEmailVerified ? "not-allowed" : "pointer",
                    }}
                  >
                    Next
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

export default StudentRegistration;
