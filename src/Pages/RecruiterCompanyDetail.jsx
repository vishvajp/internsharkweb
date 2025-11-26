import React, { useEffect, useState } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiBuildingOfficeDuotone } from "react-icons/pi";
import axios from "axios";
import { getIndustryDetail } from "../service/industryType";

const RecruiterCompanyDetail = ({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  setFormData,
  submitting,
}) => {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [websiteError, setWebsiteError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pinError, setPinError] = useState("");
  const [contactError, setContactError] = useState("");
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const baseurl = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file && !allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      company_document: file,
    }));
  };

  const handleIndustryChange = (e) => {
    const selectedId = e.target.value;

    // Check if "Others" is selected
    if (selectedId === "others") {
      setShowOtherIndustry(true);
      setFormData((prevData) => ({
        ...prevData,
        industry_type_id: "others",
        industry_type: "",
      }));
    } else {
      setShowOtherIndustry(false);
      setCustomIndustry("");
      const selectedIndustry = industryOptions.find(
        (item) => String(item.id) === selectedId
      );

      setFormData((prevData) => ({
        ...prevData,
        industry_type_id: selectedId,
        industry_type: selectedIndustry?.name || "",
      }));
    }
  };

  const handleDocTypeChange = (e) => {
    const selectedId = e.target.value;
    const selected = documentTypes.find((doc) => String(doc.id) === selectedId);

    setFormData((prev) => ({
      ...prev,
      company_document_type_id: selectedId,
      company_document_type_name: selected?.name || "",
    }));
  };

  //php backend
  // const getIndustryType = async () => {
  //   try {
  //     const response = await axios.post(`${baseurl}/getIndustryType`);
  //     const industryList = response.data?.data;

  //     if (Array.isArray(industryList)) {
  //       const formatted = industryList.map((item) => ({
  //         id: item.industry_type_id,
  //         name: item.industry_type_name
  //       }));
  //       setIndustryOptions(formatted);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching industry details:", error);
  //   }
  // };

  const getIndustryType = async () => {
    try {
      const response = await getIndustryDetail();
      console.log("new industry detail", response);

      if (Array.isArray(response)) {
        const formatted = response.map((item) => ({
          id: item._id,
          name: item.name,
        }));
        setIndustryOptions(formatted);
        // console.log("new map data",formatted);
      }
    } catch (error) {
      console.error("Error fetching industry details:", error);
    }
  };

  const getDocumentType = async () => {
    try {
      const response = await axios.post(`${baseurl}/getComDocType`);
      const docList = response.data?.data;

      if (Array.isArray(docList)) {
        const formatted = docList.map((item) => ({
          id: item.company_registration_document_type_id,
          name: item.company_registration_document_type_name,
        }));
        setDocumentTypes(formatted);
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  useEffect(() => {
    getIndustryType();
    getDocumentType();
  }, []);

  return (
    <>
      <Header />
      <div className="container formboxmain my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-10">
            <div className="p-4  rounded shadow-sm ">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Company Detail</h2>
                <PiBuildingOfficeDuotone size={32} />
              </div>

              <hr />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Company Name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company Address<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Company Address"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Company Pincode</label>

                  <input
                    type="text"
                    name="company_pinCode"
                    value={formData.company_pinCode}
                    onChange={(e) => {
                      // allow only digits
                      let value = e.target.value.replace(/\D/g, "");

                      // limit to 6 digits
                      if (value.length > 6) value = value.slice(0, 6);

                      setFormData((prev) => ({
                        ...prev,
                        company_pinCode: value,
                      }));
                      setPinError(""); // clear error while typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;

                      // regex check for exactly 6 digits
                      if (!/^\d{6}$/.test(value)) {
                        setPinError("Pincode must be 6 digits");
                      } else {
                        setPinError("");
                      }
                    }}
                    className={`form-control ${pinError ? "is-invalid" : ""}`}
                    placeholder="Pincode"
                    // required
                  />

                  {pinError && (
                    <div className="invalid-feedback">{pinError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company Website <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="company_website"
                    value={formData.company_website}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        company_website: value,
                      }));
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      const pattern =
                        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

                      if (value && !pattern.test(value)) {
                        setWebsiteError("Please enter a valid website URL");
                      } else {
                        setWebsiteError("");
                      }
                    }}
                    className={`form-control ${
                      websiteError ? "is-invalid" : ""
                    }`}
                    placeholder="Company Website"
                    required
                  />

                  {websiteError && (
                    <div className="invalid-feedback">{websiteError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company E-Mail <span className="text-danger">*</span>
                  </label>

                  <input
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={(e) => {
                      handleChange(e);
                      // clear error while typing
                      setEmailError("");
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                      if (value && !emailPattern.test(value)) {
                        setEmailError("Please enter a valid email address");
                      } else {
                        setEmailError("");
                      }
                    }}
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    placeholder="Company Email"
                    required
                  />

                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Industry Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="industry_type_id"
                    value={formData.industry_type_id}
                    onChange={handleIndustryChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Industry Type</option>
                    {industryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                    <option value="others">Others</option>
                  </select>
                </div>

                {showOtherIndustry && (
                  <div className="mb-3">
                    <label className="form-label">Enter Industry Name</label>
                    <input
                      type="text"
                      name="custom_industry"
                      value={customIndustry}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomIndustry(value);
                        setFormData((prev) => ({
                          ...prev,
                          custom_industry_name: value,
                        }));
                      }}
                      className="form-control"
                      placeholder="Enter your industry type"
                      required
                    />
                    <small className="text-muted">
                      Please specify your industry type
                    </small>
                  </div>
                )}

                {/* <div className="mb-3">
                  <label className="form-label">Document Type</label>
                  <select
                    name="document_type_id"
                    value={formData.document_type_id}
                    onChange={handleDocTypeChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                <div className="mb-3">
                  <label className="form-label">
                    Company Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="company_description"
                    value={formData.company_description}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[0-9]/g, ""); // remove numbers
                      handleChange({
                        target: { name: "company_description", value },
                      });
                    }}
                    className="form-control"
                    placeholder="Company Description"
                    rows={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company Contact Number{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="company_contact_no"
                    value={formData.company_contact_no}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // only digits

                      if (value.length > 10) value = value.slice(0, 10); // max 10 digits

                      setFormData((prev) => ({
                        ...prev,
                        company_contact_no: value,
                      }));

                      setContactError(""); // clear error while typing
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;

                      if (!/^\d{10}$/.test(value)) {
                        setContactError(
                          "Contact number must be exactly 10 digits"
                        );
                      } else {
                        setContactError("");
                      }
                    }}
                    className={`form-control ${
                      contactError ? "is-invalid" : ""
                    }`}
                    placeholder="Contact Number"
                    required
                  />

                  {contactError && (
                    <div className="invalid-feedback">{contactError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company Logo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    name="company_logo"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const allowedTypes = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/gif",
                      ];

                      if (file && !allowedTypes.includes(file.type)) {
                        alert(
                          "Only JPG, JPEG, PNG, and GIF images are allowed."
                        );
                        return;
                      }

                      setFormData((prev) => ({
                        ...prev,
                        company_logo: file,
                      }));
                    }}
                    className="form-control"
                    required
                  />
                  <small className="text-muted">
                    Upload your company logo (JPG, PNG, GIF)
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Company Document <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    name="company_document"
                    accept=".pdf, .doc, .docx"
                    onChange={handleFileChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      prevStep();
                      window.scroll(0, 0);
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecruiterCompanyDetail;
