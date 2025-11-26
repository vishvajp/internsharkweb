import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./JobDetailCorosol.css";
import { getIndustryDetail } from "../service/industryType";

const JobDetailCorosol = ({ onIndustrySelect, selectedIndustryId }) => {
  //state managements
  const [industryDetails, setIndustryDetails] = useState([]);

  //initially set the it industry id as default
  useEffect(() => {
    if (industryDetails.length > 0 && !selectedIndustryId) {
      const defaultIndustry = industryDetails.find(
        (item) => item._id === "68fb2b06d513c9bec54195ff" // IT Industry ID
      );

      if (defaultIndustry && onIndustrySelect) {
        onIndustrySelect(defaultIndustry._id);
      }
    }
  }, [industryDetails, selectedIndustryId, onIndustrySelect]);

  const handleClick = (industryId) => {
    if (onIndustrySelect) {
      onIndustrySelect(industryId); // Pass the ID to parent
    }
  };

  //responsive corosol
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1, // optional
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  //fetch node industry detail
  useEffect(() => {
    getallindustrydetail();
  }, []);

  const getallindustrydetail = async () => {
    try {
      const response = await getIndustryDetail();
      console.log("New node industry detail:", response);
      setIndustryDetails(response);
    } catch (error) {
      console.log("Get industry detail error", error);
    }
  };

  return (
    //old php
    // <div className='row companiesdetailcorosolbox p-3'>
    //  {industryDetails.length > 0 ? (
    //     <Carousel
    //       responsive={responsive}
    //       infinite={true}
    //       arrows={true}

    //node
    <div className="row companiesdetailcorosolbox p-3">
      {industryDetails.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          arrows={true}
          autoPlay={false}
          keyBoardControl={true}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
        >
          {industryDetails.map((item, index) => (
            <div
              key={index}
              className={`img text-center border rounded indutryboxincorosol p-2 ${
                selectedIndustryId === item._id ? "selected-industry" : ""
              }`}
              style={{ cursor: "pointer", height: "100%" }}
              onClick={() => handleClick(item._id)}
            >
              <label>{item.name || "No Name"}</label>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="text-center">Loading industry details...</div>
      )}
    </div>
  );
};

export default JobDetailCorosol;
