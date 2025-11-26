import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "./Header.css";
import logo from "../Images/interns-logo-final.png";
import { CgProfile } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import Registration from "./Registration";
import ProfileLogin from "./ProfileLogin";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [activeKey, setActiveKey] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [detail, setDetail] = useState(null);
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("token");
  const recruiter_token = localStorage.getItem("recruiter_token");
  const isRecruiter = recruiter_token !== null;

  const handleLoginSuccess = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      setIsLoggedIn(true);

      const response = await getdetail();

      if (response && response.name) {
        setProfileData(response);
        console.log("selectedtedstudent", setProfileData);
      }
    }

    setShowLoginModal(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      const storedProfile = JSON.parse(localStorage.getItem("profileData"));
      if (storedProfile) {
        setProfileData(storedProfile);
      }
    }
  }, []);

  useEffect(() => {
    const currentPath =
      location.pathname === "/" ? "home" : location.pathname.slice(1);
    setActiveKey(currentPath);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("stuid");
    localStorage.removeItem("recid");
    localStorage.removeItem("recruiter_token");
    localStorage.removeItem("profileData");
    localStorage.removeItem("recruiter_type");
    localStorage.removeItem("recruiterData");
    setIsLoggedIn(false);
    setProfileData(null);
    navigate("/home");
  };

  const handleSelect = (selectedKey) => {
    // Store current scroll position before navigation
    const currentScroll = window.pageYOffset;
    sessionStorage.setItem("prevScrollPos", currentScroll);

    navigate(`/${selectedKey}`);
  };

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //get student detail
  const getdetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseurl}/getStudent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const studentData = response.data.data;
      setDetail(studentData[0]);
      localStorage.setItem("profileData", JSON.stringify(studentData[0]));

      console.log("studentdetailtest", studentData);
      console.log("studentdetailimage", studentData[0].student_image);
    } catch (error) {
      console.error("Error fetching student details:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("profileData");

    if (token && storedProfile) {
      setIsLoggedIn(true);
      setDetail(JSON.parse(storedProfile));
    }
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar" fixed="top">
      <Container className="p-0">
        <Navbar.Brand
          className="logo-container"
          onClick={() => {
            scrollToTop();
            navigate("/home");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" className="logo-img" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-2" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="mx-auto my-2 my-lg-0"
            activeKey={activeKey}
            onSelect={handleSelect}
          >
            {!(isRecruiter || recruiter_token || token) && (
              <>
                <Nav.Link
                  eventKey="home"
                  className="nav-link-custom w-lg-auto text-center"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  eventKey="about"
                  className="nav-link-custom w-lg-auto text-center"
                >
                  About
                </Nav.Link>
              </>
            )}

            {isRecruiter && (
              <>
                <Nav.Link
                  eventKey="Studentprofiles"
                  className="nav-link-custom text-center"
                >
                  Student
                </Nav.Link>
                <Nav.Link
                  eventKey="postjob"
                  className="nav-link-custom text-center"
                >
                  Post Job
                </Nav.Link>
                <Nav.Link
                  eventKey="postedjob"
                  className="nav-link-custom text-center"
                >
                  Posted Job
                </Nav.Link>
              </>
            )}

            {isLoggedIn && token && !isRecruiter && (
              <>
                <Nav.Link
                  eventKey="interships"
                  className="nav-link-custom text-center"
                >
                  Internship
                </Nav.Link>
                <Nav.Link
                  eventKey="appliedjob"
                  className="nav-link-custom text-center"
                >
                  Applied
                </Nav.Link>
              </>
            )}

            {!(isRecruiter || recruiter_token || token) && (
              <Nav.Link
                eventKey="contact"
                className="nav-link-custom w-lg-auto text-center"
              >
                Contact
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex flex-column align-items-center flex-lg-row gap-2 gap-lg-3 my-2 my-lg-0">
            {isLoggedIn || recruiter_token ? (
              <Dropdown className="hover-dropdown">
                <Dropdown.Toggle
                  variant="primary"
                  className="login-btn text-center"
                  id="dropdown-hover"
                >
                  {isLoggedIn && detail?.student_image ? (
                    <img
                      src={detail.student_image}
                      alt="Profile"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <CgProfile className="me-2" />
                  )}
                  Profile
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {isLoggedIn ? (
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      My Profile
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => navigate("/recruiterprofile")}
                    >
                      My Profile
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                variant="primary"
                className="login-btn text-center"
                onClick={() => setShowLoginModal(true)}
              >
                <CgProfile className="me-2" /> Login
              </Button>
            )}

            {!(isRecruiter || recruiter_token || token) && (
              <Button
                variant="info"
                className="login-btntwo text-center"
                onClick={() => setShowRegisterModal(true)}
              >
                Registration <CiUser />
              </Button>
            )}
          </div>
        </Navbar.Collapse>
        <Registration
          show={showRegisterModal}
          handleClose={() => setShowRegisterModal(false)}
          openLoginModal={() => {
            setShowLoginModal(true);
            setShowRegisterModal(false);
          }}
        ></Registration>
        <ProfileLogin
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
          openRegisterModal={() => {
            setShowRegisterModal(true);
            setShowLoginModal(false);
          }}
          onLoginSuccess={handleLoginSuccess}
        ></ProfileLogin>
      </Container>
    </Navbar>
  );
};

export default Header;
