import React, { useEffect, useState } from "react";
import "./IntershipShow.css";
import companylogo from "../Images/pngtree-agricultural-logo-png-image_6514915.png";
import { IoTimeOutline } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { ImLocation2 } from "react-icons/im";
import axios from "axios";

const IntershipShow = () => {
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const [getDetail, setgetDetail] = useState(null);

  // Fetch job details on mount
  // useEffect(() => {
  //   const getjobdetail = async () => {
  //     try {
  //       const token = localStorage.getItem('token');

  //       const response = await axios.post(
  //         `${baseurl}/getAllInternPost`,
  //         {}, // Request body (empty in this case)
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       );

  //       console.log('Job details:', response.data.data[0]);
  //       setgetDetail(response.data.data[0]);

  //     } catch (error) {
  //       console.error('Error fetching job details:', error);
  //     }
  //   };

  //   getjobdetail();
  // }, []);

  return (
    <>
      {getDetail ? (
        <div className="container intershipcard w-lg-100 w-75 mb-5 mt-5 p-4 p-md-5">
          {/* Top row: role and logo */}
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-12 col-md-8">
              <div
                className="d-inline-block text-center py-1 px-3 rounded-4 mb-2"
                style={{ backgroundColor: "#e8e8e8", color: "black" }}
              >
                {(() => {
                  const postDate = new Date(getDetail.intern_post_date);
                  const today = new Date();
                  postDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  const diffTime = today - postDate;
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) return "Posted Today";
                  if (diffDays === 1) return "1 Day Ago";
                  return `${diffDays} Days Ago`;
                })()}
              </div>
              <div className="rolltext h2 text-wrap">
                {getDetail.company_role_name}
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-center">
              <div className="logo-wrapper d-flex justify-content-center align-items-center">
                <img
                  src={getDetail.company_logo}
                  className="img-fluid company-logo"
                  alt="Company Logo"
                />
              </div>
            </div>
          </div>

          {/* Company name and description */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="fs-5 mb-1" style={{ color: "blue" }}>
                {getDetail.company_name}
              </div>
              <p className="jobdescription">{getDetail.about_internship}</p>
            </div>
          </div>

          {/* Info boxes */}
          <div className="row g-2 mt-2">
            <div className="col-12 col-md-4">
              <div
                className="text-center py-1 rounded-4 w-100"
                style={{ backgroundColor: "#e8e8e8", color: "black" }}
              >
                <IoTimeOutline className="me-1" />
                {(() => {
                  const postDate = new Date(getDetail.intern_post_date);
                  const today = new Date();
                  postDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  const diffTime = today - postDate;
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) return "Posted Today";
                  if (diffDays === 1) return "1 Day Ago";
                  return `${diffDays} Days Ago`;
                })()}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div
                className="text-center py-1 rounded-4 w-100"
                style={{ backgroundColor: "#e8e8e8", color: "black" }}
              >
                <GiMoneyStack className="me-1" /> Stipend:{" "}
                {getDetail.intern_stipend}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div
                className="text-center py-1 rounded-4 w-100"
                style={{ backgroundColor: "#e8e8e8", color: "black" }}
              >
                <ImLocation2 className="me-1" /> {getDetail.company_district}
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="row mt-3 g-2">
            <div className="col-12 col-md-6">
              <span style={{ color: "#01cdcd" }}>Education:</span>{" "}
              {getDetail.student_education}
            </div>
            <div className="col-12 col-md-6">
              <span style={{ color: "#01cdcd" }}>Available:</span>{" "}
              {getDetail.intern_availability}
            </div>
          </div>

          {/* Time left */}
          <div className="row mt-2">
            <div className="col-12">
              <span style={{ color: "red" }}>12 Days Left To Apply</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default IntershipShow;
