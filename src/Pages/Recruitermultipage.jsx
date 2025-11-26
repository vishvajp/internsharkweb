import React, { useState } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import RecruiterRegister from "./RecruiterRegister";
import RecruiterCompanyDetail from "./RecruiterCompanyDetail";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { recruiterRegister } from "../service/profilelogin";

const Recruitermultipage = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Lift email verification state
  const navigate = useNavigate();
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    recruiter_name: "",
    recruiter_email: "",
    recruiter_phone: "",
    secondery_phone: "",
    recruiter_gender: "",
    recruiter_designation: "",
    no_of_employees: "",
    company_name: "",
    company_address: "",
    company_pinCode: "",
    company_contact_no: "",
    company_email: "",
    company_document: null,
    company_logo: null,
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);

  //   const submitData = new FormData();
  //   for (const key in formData) {
  //     submitData.append(key, formData[key]);
  //   }

  //   let navigated = false;

  //   try {
  //     const response = await axios.post(`${baseurl}/addRecruiter`, submitData);
  //     const resData = response.data;

  //     if (resData.success) {
  //       alert(resData.message);
  //       localStorage.setItem('recruiter_token', resData.token);
  //       setSubmitting(false);
  //       navigated = true;
  //       navigate('/Studentprofiles');
  //       window.scroll(0,0);
  //       return;
  //     }

  //     if (resData.success === false) {
  //       const msg = resData.message;
  //       if (typeof msg === "string") {
  //         alert(msg);
  //       } else if (typeof msg === "object" && msg !== null) {
  //         let errorMsg = "Form submission failed:\n";
  //         for (const field in msg) {
  //           if (msg.hasOwnProperty(field)) {
  //             errorMsg += `${field}: ${msg[field].join(", ")}\n`;
  //           }
  //         }
  //         alert(errorMsg);
  //       } else {
  //         alert("Something went wrong.");
  //       }
  //     } else {
  //       alert("Some data is not valid.");
  //     }

  //   } catch (error) {
  //     if (!navigated) {
  //       console.error("Submit error:", error);
  //       alert("Server error occurred. Please try again.");
  //     }
  //   } finally {
  //     if (!navigated) {
  //       try {
  //         setSubmitting(false);
  //       } catch (err) {
  //         console.warn('Could not update state: component likely unmounted.');
  //       }
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    //append data with rename
    submitData.append("recname", formData.recruiter_name);
    submitData.append("recemail", formData.recruiter_email);
    submitData.append("recmobileno", formData.recruiter_phone);
    submitData.append("recgender", formData.recruiter_gender);

    // Only append secondary mobile if it's provided and different from primary
    if (
      formData.secondery_phone &&
      formData.secondery_phone.trim() !== "" &&
      formData.secondery_phone !== formData.recruiter_phone
    ) {
      submitData.append("recsecondarymobileno", formData.secondery_phone);
    }
    submitData.append("recdesignation", formData.recruiter_designation);
    submitData.append("reccompanysize", formData.no_of_employees);
    submitData.append("reccompanyname", formData.company_name);
    submitData.append("reccompanyaddress", formData.company_address);
    submitData.append("reccompanypincode", formData.company_pinCode);
    submitData.append("reccompanycontactno", formData.company_contact_no);
    submitData.append("reccompanyemail", formData.company_email);
    submitData.append("reccompanydocument", formData.company_document);
    submitData.append("reccompanylogo", formData.company_logo);
    submitData.append("reccompanywebsite", formData.company_website);
    submitData.append("reccompanyindustrytype", formData.industry_type_id);
    submitData.append("reccompanydocumenttype", formData.document_type_id);
    submitData.append("reccompanydescription", formData.company_description);

    // Add custom industry name if "Others" is selected
    if (
      formData.industry_type_id === "others" &&
      formData.custom_industry_name
    ) {
      submitData.append("custom_industry_name", formData.custom_industry_name);
    }

    try {
      const response = await recruiterRegister(submitData);
      console.log("recruiter register detail", response);

      if (response.message === "Recruiter registered successfully") {
        localStorage.setItem("recruiter_token", response.rectoken);
        localStorage.setItem("recid", response.recruiter.id);
        setSubmitting(false);

        // Success alert
        alert("Success! Recruiter registration successful!");

        navigate("/Studentprofiles");
        window.scroll(0, 0);
        return;
      } else {
        // Error alert for unsuccessful registration
        alert("Error! Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);

      // Error alert
      alert(
        "Error! " +
          (error.message || "Server error occurred. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "recruiter_name") {
      const lettersOnly = /^[A-Za-z\s]*$/;
      if (!lettersOnly.test(value)) return; // Reject input if it contains invalid characters
    }
    if (name === "recruiter_phone") {
      const numericOnly = /^[0-9]*$/;
      if (!numericOnly.test(value)) return; // Reject non-numeric
      if (value.length > 10) return; // Reject more than 10 digits
    }
    if (name === "secondery_phone") {
      const numericOnly = /^[0-9]*$/;
      if (!numericOnly.test(value)) return; // Reject non-numeric
      if (value.length > 10) return; // Reject more than 10 digits
    }
    if (name === "no_of_employees") {
      const numericOnly = /^[0-9]*$/;
      if (!numericOnly.test(value)) return; // Reject non-numeric
    }
    if (name === "company_name") {
      const lettersOnly = /^[A-Za-z\s]*$/;
      if (!lettersOnly.test(value)) return; // Reject input if it contains invalid characters
    }
    if (name === "company_pinCode") {
      const numericOnly = /^[0-9]*$/;
      if (!numericOnly.test(value)) return; // Reject non-numeric
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  return (
    <>
      {step === 1 && (
        <RecruiterRegister
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
        <RecruiterCompanyDetail
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          prevStep={prevStep}
          handleSubmit={handleSubmit} // ✅ pass this
          submitting={submitting}
        />
      )}
    </>
  );
};

export default Recruitermultipage;
