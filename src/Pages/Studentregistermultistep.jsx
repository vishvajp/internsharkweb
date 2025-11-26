import React, { useState } from "react";
import StudentRegistration from "./StudentRegistration";
import EducationDetails from "./EducationDetails";
import axios from "axios";

const Studentregistermultistep = () => {
  const [step, setStep] = useState(1);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Lift email verification state
  const [formData, setFormData] = useState({
    Name: "",

    gender: "",
    dob: "",
    email: "",
    phoneNumber: "",
    areaCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: null,
    otp: "",
    highschoolname: "",
    secondaryschoolname: "",
    programlag: "",

    profile: null,

    degree: "",
    fieldofstudy: "",
    college: "",
    passedout: "",
    startdate: "",
    collegelocation: "",
    projectdescription: "",
    highschoolper: "",
    hslocation: "",
    secondaryschollper: "",
    sslocation: "",

    cv: null,
    certificate: null,
    coverletter: null,
    internshipMode: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (["certificate", "cv", "coverletter"].includes(name)) {
      if (files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {step === 1 && (
        <StudentRegistration
          formData={formData} // Ensure this is passed
          setFormData={setFormData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          nextStep={nextStep}
          isEmailVerified={isEmailVerified}
          setIsEmailVerified={setIsEmailVerified}
        />
      )}
      {step === 2 && (
        <EducationDetails
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          prevStep={prevStep}
        />
      )}
    </>
  );
};

export default Studentregistermultistep;
