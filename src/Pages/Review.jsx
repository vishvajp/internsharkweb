import React from "react";
import "./Review.css";
import studentone from "../Images/s3.png";
import studenttwo from "../Images/s2 (1).png";
import studentthree from "../Images/s4.png";
import { BsFacebook } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { TiSocialLinkedinCircular } from "react-icons/ti";

const Review = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="w-100 w-md-75 w-lg-50 px-3">
          <h1 className="fw-bold text-center">What Our Students Say</h1>
          <p className="text-center">
            This is your Team section. Briefly introduce the team then add their
            bios below. Click here to edit.
          </p>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-12  col-lg-4 d-flex flex-column align-items-center text-center reviewer-col mb-5">
            <div className="image-wrapper position-relative mb-3">
              <img
                src={studentone}
                className="student-review-img"
                alt="Student One"
              />
            </div>
            <p className="mb-1 text-muted">Web Developer</p>
            <p className="fw-bold mb-2" style={{ color: "#0744c5" }}>
              Kaushik
            </p>
            <p>
              The website’s user experience is remarkable. It collects all the
              necessary internship details and makes finding opportunities easy
              with filters. Tracking applications is simple, and the platform is
              smooth and well-designed. Truly one of the best sites for finding
              internships
            </p>
            {/* <div className="d-flex justify-content-center social-icons mt-2">
              <BsFacebook />
              <AiFillTwitterCircle />
              <TiSocialLinkedinCircular />
            </div> */}
          </div>

          <div className="col-12  col-lg-4 d-flex flex-column align-items-center text-center reviewer-col mb-5">
            <div className="image-wrapper position-relative mb-3">
              <img
                src={studenttwo}
                className="student-review-img"
                alt="Student Two"
              />
            </div>
            <p className="mb-1 text-muted">Quality Tester</p>
            <p className="fw-bold mb-2" style={{ color: "#0744c5" }}>
              Thanuvika
            </p>
            <p>
              The internship program I participated in through InternSharks was
              well-structured and provided me with insights into the industry. I
              feel more confident about my career path now.
            </p>
            {/* <div className="d-flex justify-content-center social-icons mt-2">
              <BsFacebook />
              <AiFillTwitterCircle />
              <TiSocialLinkedinCircular />
            </div> */}
          </div>

          <div className="col-12  col-lg-4 d-flex flex-column align-items-center text-center reviewer-col mb-5">
            <div className="image-wrapper position-relative mb-3">
              <img
                src={studentthree}
                className="student-review-img"
                alt="Student Three"
              />
            </div>
            <p className="mb-1 text-muted">App Developer</p>
            <p className="fw-bold mb-2" style={{ color: "#0744c5" }}>
              Varnikaa
            </p>
            <p>
              InternSharks made the process of finding an internship easy and
              stress-free. I appreciate the personalized approach and the
              quality of opportunities available.
            </p>
            {/* <div className="d-flex justify-content-center social-icons mt-2">
              <BsFacebook />
              <AiFillTwitterCircle />
              <TiSocialLinkedinCircular />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
