import React, { useEffect } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import "./About.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imageone from "../Images/home-slider-1.jpg";
import imagetwo from "../Images/home-slider-2.jpg";
import AboutusTop from "./AboutusTop";
import Mission from "./Mission";
import HowItWorks from "./HowItWorks";
import NetworkingOpportunities from "./NetworkingOpportunities";
import FooterCompanylogos from "./FooterCompanylogos";

const About = () => {
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

  return (
    <>
      <Header />
      <div>
        {" "}
        {/* Add padding to account for fixed header */}
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
        <div id="who-we-are" className="container text-center py-5">
          <h2 className="fw-bold display-6 mb-3">Who We Are</h2>
          <div className="yellowdot mx-auto mb-3"></div>
          <p className="w-100 w-md-75 mx-auto text-muted fs-5">
            Internshark is a dedicated internship platform designed to help
            students and fresh graduates find meaningful work experiences. We
            partner with top companies to offer diverse opportunities, bridging
            the gap between education and employment.
          </p>
        </div>
        <Mission />
        <div id="how-it-works" className="container text-start">
          <h2 className="fw-bold display-6 mb-3">How It Works</h2>
          <div className="yellowdot mb-3 justify-content-start"></div>
          <p className="w-100 w-md-75 mx-auto text-muted fs-5">
            Internshark is a dedicated internship platform designed to help
            students and fresh graduates find meaningful work experiences. We
            partner with top companies to offer diverse opportunities, bridging
            the gap between education and employment.
          </p>
        </div>
        <HowItWorks />
        <NetworkingOpportunities />
        <FooterCompanylogos />
      </div>
      <Footer />
    </>
  );
};

export default About;
