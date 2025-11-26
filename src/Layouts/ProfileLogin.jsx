import { Modal, Button } from "react-bootstrap";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { Input, Typography } from "antd";
import "./ProfileLogin.css";
import Registration from "./Registration";
import Swal from "sweetalert2";
import {
  profileLogin,
  requestLoginOTP,
  verifyLoginOTP,
} from "../service/profilelogin";

const ProfileLogin = ({ show, handleClose, openRegisterModal }) => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [userType, setUserType] = useState(null); // Store user type from OTP request

  const [formData, setFormData] = useState({
    number: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      otp: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered Mobile Number:", formData.number);
    console.log("enter otp:", formData.otp);
  };
  const { Title } = Typography;

  //apis

  //sentotp

  const sentotp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await requestLoginOTP(formData.number);
      console.log("OTP Request Response:", response);

      // Store user type for verification
      setUserType(response.userType);

      Swal.fire({
        title: "Success!",
        text: response.message || "OTP sent successfully to your mobile!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  //verifyotp
  // const verifyotp = async () => {
  //   try {
  //     const response = await axios.post(`${baseurl}/verifyOtp`, {
  //       mobile_no: formData.number,
  //       otp: formData.otp,
  //     });

  //     const data = response.data;

  //     if (data.success) {
  //       alert(data.message);

  //       if (data.message === "Not Registered") {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("recruiter_token");
  //         console.log("User not registered. Tokens cleared.");
  //         openRegisterModal();
  //         return;
  //       }

  //       if (data.message === "OTP Verified successfully") {

  //         const { token, recruiter_token } = data;

  //         if (token) {
  //           localStorage.setItem("token", token);
  //           localStorage.removeItem("recruiter_token");
  //           console.log("Student login successful. Token stored.");
  //           navigate('/interships');
  //           window.location.reload();
  //         } else if (recruiter_token) {

  //           console.log('recrutertoken',recruiter_token);
  //           localStorage.setItem("recruiter_token", recruiter_token);
  //           localStorage.removeItem("token");
  //           console.log("Recruiter login successful. Recruiter token stored.");
  //           navigate("/postjob");
  //           window.location.reload();
  //         } else {
  //           alert("Token not found in response.");
  //           return;
  //         }

  //         onLoginSuccess();
  //         navigate("/home");
  //       }
  //     } else {

  //       localStorage.removeItem("token");
  //       localStorage.removeItem("recruiter_token");
  //       alert(`OTP verification failed: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("OTP verification error:", error);
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("recruiter_token");
  //     alert("An error occurred while verifying OTP.");
  //   }
  // };

  const verifyotp = async () => {
    setIsVerifying(true);
    try {
      // Step 1: Verify OTP with userType
      const verifyResponse = await verifyLoginOTP(
        formData.number,
        formData.otp,
        userType // Pass stored user type
      );
      console.log("OTP Verification Response:", verifyResponse);

      if (verifyResponse.message === "Mobile verified") {
        setOtpVerified(true);

        // Step 2: Login after OTP verification
        const loginResponse = await profileLogin(formData);
        console.log("Login Success:", loginResponse);

        if (
          loginResponse.message === "Student login successful with dummy OTP"
        ) {
          localStorage.setItem("token", loginResponse.studtoken);
          console.log("student login token:", loginResponse.studtoken);
          localStorage.setItem("stuid", loginResponse.student.id);
          console.log("student id:", loginResponse.student.id);

          // Success alert
          Swal.fire({
            title: "Success!",
            text: "Student login successful!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            timer: 2000,
          });

          setTimeout(() => {
            handleClose();
            navigate("/interships");
          }, 2000);
        } else if (
          loginResponse.message === "Recruiter login successful with dummy OTP"
        ) {
          localStorage.setItem("recruiter_token", loginResponse.rectoken);
          console.log("recruiter login token:", loginResponse.rectoken);
          localStorage.setItem("recid", loginResponse.recruiter.id);
          console.log("recruiter id:", loginResponse.recruiter.id);

          // Success alert
          Swal.fire({
            title: "Success!",
            text: "Recruiter login successful!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            timer: 2000,
          });

          setTimeout(() => {
            handleClose();
            navigate("/postjob");
          }, 2000);
        } else {
          // ❌ If login fails or message doesn't match, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("stuid");
          localStorage.removeItem("recruiter_token");
          localStorage.removeItem("recid");
          console.warn("Login failed — cleared localStorage");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);

      const errorMessage = error.message || "Login failed. Please try again.";

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("stuid");
      localStorage.removeItem("recruiter_token");
      localStorage.removeItem("recid");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="custom-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-custom"></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-7 p-3 p-md-4 rounded shadow bg-white">
              <form className="w-100" onSubmit={handleSubmit}>
                {/* Profile Icon & Title */}
                <div className="text-center mb-4">
                  <CgProfile size={60} style={{ color: "#0d6efd" }} />
                  <h4 className="mt-3 fw-semibold" style={{ color: "#0d6efd" }}>
                    Login Your Profile
                  </h4>
                </div>

                {/* Mobile Number Input */}
                <div className="mb-4">
                  <Title level={5} style={{ color: "#000" }}>
                    Mobile Number
                  </Title>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      size="large"
                      autoComplete="tel"
                      maxLength={10}
                      pattern="\d*"
                      required
                      className="w-100"
                    />
                    <Button
                      type="primary"
                      size="large"
                      className="w-100 w-md-auto"
                      disabled={
                        formData.number.length !== 10 ||
                        !/^\d{10}$/.test(formData.number) ||
                        isSendingOtp
                      }
                      onClick={sentotp}
                    >
                      {isSendingOtp
                        ? "Sending..."
                        : otpSent
                        ? "Resend OTP"
                        : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {/* OTP Input */}
                {otpSent && (
                  <div className="mb-4">
                    <Title level={5} className="mb-2" style={{ color: "#000" }}>
                      Enter OTP
                    </Title>
                    <Input.OTP
                      length={4}
                      name="otp"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      placeholder="●"
                      size="large"
                      required
                      className="w-100"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    disabled={
                      !/^\d{10}$/.test(formData.number) ||
                      !/^\d{4}$/.test(formData.otp) ||
                      isVerifying
                    }
                    onClick={verifyotp}
                  >
                    {isVerifying ? "Verifying..." : "Login"}
                  </button>
                  <small className="text-muted mt-2 text-center">
                    New to Intershark?{" "}
                    <span
                      onClick={openRegisterModal}
                      style={{
                        color: "#0d6efd",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Create an account
                    </span>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Registration
          show={showRegisterModal}
          handleClose={() => setShowRegisterModal(false)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileLogin;
