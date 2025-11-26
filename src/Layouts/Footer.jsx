import React from "react";
import "./Footer.css";
import logo from "../Images/RECOVER_IS-LOGO-s.png";
import { CiMail } from "react-icons/ci";
import { Button } from "react-bootstrap";
import payment from "../Images/pngkey.com-payment-methods-png-3987066.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  // Check if user is logged in (student or recruiter)
  const isLoggedIn =
    localStorage.getItem("token") ||
    localStorage.getItem("stuid") ||
    localStorage.getItem("recid");
  return (
    <>
      <div className="footerone py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-flex flex-column">
              <div>
                <img src={logo} className="logofooter"></img>
              </div>
              <p className="footertext">
                India's No.1 AI platform for Internship
              </p>
            </div>
            <div className="col-lg-2 d-flex flex-column">
              <strong className="footertext">Useful link</strong>
              <ul className="list-unstyled">
                <li
                  className="footertext"
                  onClick={() => handleNavigation("/")}
                  style={{ cursor: "pointer" }}
                >
                  Home
                </li>
                <li
                  className="footertext"
                  onClick={() => handleNavigation("/about")}
                  style={{ cursor: "pointer" }}
                >
                  About Us
                </li>
                {!isLoggedIn && (
                  <>
                    <li
                      className="footertext"
                      onClick={() => handleNavigation("/studentregistration")}
                      style={{ cursor: "pointer" }}
                    >
                      Students
                    </li>
                    <li
                      className="footertext"
                      onClick={() => handleNavigation("/recruiterregistration")}
                      style={{ cursor: "pointer" }}
                    >
                      Recruiter
                    </li>
                  </>
                )}
                <li
                  className="footertext"
                  onClick={() => handleNavigation("/contact")}
                  style={{ cursor: "pointer" }}
                >
                  Contact Us
                </li>
                <li
                  className="footertext"
                  onClick={() => handleNavigation("/privacypolicy")}
                  style={{ cursor: "pointer" }}
                >
                  Privacy Policy
                </li>
                <li
                  className="footertext"
                  onClick={() => handleNavigation("/termsandconditions")}
                  style={{ cursor: "pointer" }}
                >
                  Terms and Conditions
                </li>
              </ul>
            </div>
            <div className="col-lg-4 flex-column">
              <strong className="footertext">Support</strong>
              <p className="footertext mt-2">
                <CiMail className="mail-icon me-2" />
                info@internsharks.ai
              </p>
              <strong className="footertext">Payment</strong>
              <div className="d-flex w-100 gap-1">
                <img src={payment} className="w-50 mt-4"></img>
                <img></img>
                <img></img>
                <img></img>
                <img></img>
              </div>
            </div>
            <div className="col-lg-3 d-flex flex-column">
              <strong className="footertext">Get in touch</strong>
              <div className="d-flex flex-column mt-3">
                {/* <label className="footertext">Email</label> */}
                <p className="footertext mt-2">
                  <CiMail className="mail-icon me-2" />
                  info@internsharks.ai
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footertwo py-2">
        <a
          style={{ textDecoration: "none" }}
          href="https://doubletapinnovations.ai/"
          target="blank"
        >
          Developed and Managed by DoubleTap Innovations and Technologies Pvt
          Ltd
        </a>
      </div>
    </>
  );
};
export default Footer;
