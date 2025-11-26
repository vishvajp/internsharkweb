import React, { useEffect } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imageone from "../Images/home-slider-1.jpg";
import imagetwo from "../Images/home-slider-2.jpg";
import "./Home.css";
import "animate.css";
import inter from "../Images/Discover Icon 2.jpg";
import interone from "../Images/Discover Icon 3.jpg";
import intertwo from "../Images/Discover Icon 1.jpg";
import inter4 from "../Images/Discover Icon 4.jpg";
import inter5 from "../Images/Discover Icon 5.jpg";
import inter6 from "../Images/Discover Icon 6.jpg";
import inter7 from "../Images/Discover Icon 7.jpg";
import inter8 from "../Images/Discover Icon 8.jpg";
import inter9 from "../Images/Discover Icon 9.jpg";
import Connectingstud from "./Connectingstud";
import Trendingcategory from "./Trendingcategory";
import Review from "./Review";
import Certificate from "./Certificate";
import IntershipShow from "./IntershipShow";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

export const Home = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    scrollToTop();
  }, []);

  return (
    <>
      <Header />
      <div>
        <div className="slider-wrapper mb-0">
          <Slider {...settings}>
            <div>
              <img src={imageone} alt="Slide 1" className="slider-image" />
            </div>
            <div>
              <img src={imagetwo} alt="Slide 2" className="slider-image" />
            </div>
          </Slider>
        </div>
        <div className="animate__animated animate__backInUp discover-text text-center mt-5 h1">
          Discover Yourself
        </div>
        <div className="d-flex justify-content-center">
          <div className="w-75 text-center animate__animated animate__backInUp ">
            <p>
              Unlock your true potential with AI-powered insights designed to
              help you understand who you are, what you're great at, and where
              you can shine. At InternSharks.ai, we believe every student's
              journey is unique and our intelligent tools make that journey
              clearer, smarter, and more personalized. Our AI analyzes your
              skills, strengths, learning style, and aspirations to guide you
              toward the right opportunities and growth paths. It's not just
              about finding an internship. it's about discovering yourself
              before you step into the professional world.
            </p>
          </div>
        </div>
        <div className="container mt-5">
          <div className="row g-3">
            {/* Card 1 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter9}
                    alt="Strength Profile"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Your Strength Profile
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={intertwo}
                    alt="Verified internship"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Verified internship listing
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter}
                    alt="Smart Internship Matches"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Smart Internship Matches
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={interone}
                    alt="Top companies"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Internship with top companies
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter4}
                    alt="AI Driven schedules"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    AI Driven Internship schedules
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter5}
                    alt="Skill-Gap Analysis"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Skill-Gap Analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Card 7 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter6}
                    alt="Progress Tracker"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Smart Progress Tracker
                  </p>
                </div>
              </div>
            </div>

            {/* Card 8 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter7}
                    alt="Real world Experience"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Real world Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Card 9 */}
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <div className="d-flex align-items-center w-100 p-2">
                <div className="flex-shrink-0" style={{ width: "50px" }}>
                  <img
                    className="w-100 interimages"
                    src={inter8}
                    alt="Career Path Suggestions"
                  />
                </div>
                <div className="flex-grow-1 ps-2">
                  <p className="mb-0 fw-semibold intertexts text-center text-sm-start">
                    Career Path Suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Connectingstud />
        <Certificate />
        <Trendingcategory />
        <p className="mt-4 text-center fs-3">
          35k+ Recent Internship Available
        </p>
        <IntershipShow />
        <Review />
      </div>
      <Footer className="mt-0" />
    </>
  );
};
