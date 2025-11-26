import React, { useState, useEffect } from "react";
import "./Trendingcategory.css";
import { FaCircleArrowRight } from "react-icons/fa6";
import software from "../Images/software.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import ProfileLogin from "../Layouts/ProfileLogin";
import Registration from "../Layouts/Registration";
import axios from "axios";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // Number of cards visible at once
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Trendingcategory = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const [detail, setDetail] = useState(null);
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

  const navigate = useNavigate();
  const jobData = [
    { title: "IT/Software", count: 52 },
    { title: "Marketing", count: 38 },
    { title: "Finance", count: 44 },
    { title: "Design", count: 27 },
    { title: "Engineering", count: 33 },
    { title: "Content Writing", count: 19 },
    { title: "Designer", count: 34 },
    { title: "Designer", count: 34 },
  ];
  return (
    <>
      <div className="container-fluid Trendingcategory mt-5 d-flex flex-column align-items-center">
        <div className="text-center w-75">
          <h1 className="mb-3 mt-5">Trending Categories</h1>
          <p>
            Each month, more than 1 lakh job seekers visit our website in search
            of internships, submitting over 10,000 applications every single
            day.
          </p>
        </div>

        <div className="w-75 mt-4">
          <div className="row">
            {jobData.map((job, index) => (
              <div key={index} className="col-lg-3 mb-4">
                <div className="jobcards p-3 shadow-sm text-center">
                  <div className="jobimage mb-2 mx-auto">
                    <img
                      className="jobimageicons"
                      src={software}
                      alt={job.title}
                    />
                  </div>
                  <h5 className="mb-2 text-white">{job.title}</h5>
                  <p className="mb-2 text-white">
                    {job.count} internships available
                  </p>
                  <FaCircleArrowRight
                    className="jobarrow"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (token) {
                        navigate("/interships");
                      } else {
                        alert("Please log in to continue.");
                        setShowLoginModal(true);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <button className="viewmore px-3 py-2 mt-5">View more...</button> */}
      </div>
      <ProfileLogin
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        openRegisterModal={() => {
          setShowRegisterModal(true);
          setShowLoginModal(false); // Close the login modal before opening register
        }}
        onLoginSuccess={handleLoginSuccess}
      ></ProfileLogin>
      <Registration
        show={showRegisterModal}
        handleClose={() => setShowRegisterModal(false)}
        openLoginModal={() => {
          setShowLoginModal(true);
          setShowRegisterModal(false);
        }}
      ></Registration>
    </>
  );
};

export default Trendingcategory;
