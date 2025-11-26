import React, { useState, useEffect } from "react";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCloudUploadFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { studentRegister } from "../service/profilelogin";
import { Select } from "antd";
import { degreeOptions } from "../objects/DegreeObject";
import { CollegeName } from "../objects/CollegeName";
import { getStates, getDistricts } from "../objects/IndiaLocations";
import { getAllColleges, addNewCollege } from "../service/collegeService";

const EducationDetails = ({
  formData,
  handleChange,
  prevStep,
  nextStep,
  setFormData,
  openLoginModal,
}) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  // State and District management
  const [collegeState, setCollegeState] = useState("");
  const [collegeDistrict, setCollegeDistrict] = useState("");
  const [hsState, setHsState] = useState("");
  const [hsDistrict, setHsDistrict] = useState("");
  const [ssState, setSsState] = useState("");
  const [ssDistrict, setSsDistrict] = useState("");

  // Other college management
  const [showOtherCollegeInput, setShowOtherCollegeInput] = useState(false);
  const [customCollegeName, setCustomCollegeName] = useState("");
  const [collegeList, setCollegeList] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [addingCollege, setAddingCollege] = useState(false);

  const states = getStates();

  // Fetch colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);
        const colleges = await getAllColleges();
        setCollegeList(colleges);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
        // Fallback to static list if API fails
        setCollegeList([...CollegeName]);
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, []);

  const handleFileInputClick = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = ""; // clear to allow same file selection later
      input.click(); // manually trigger picker
    }
  };

  // Handle college selection
  const handleCollegeChange = (value) => {
    if (value === "Other") {
      setShowOtherCollegeInput(true);
      setFormData({ ...formData, college: "" });
    } else {
      setShowOtherCollegeInput(false);
      setCustomCollegeName("");
      setFormData({ ...formData, college: value });
    }
  };

  // Handle custom college name input
  const handleCustomCollegeChange = (e) => {
    const value = e.target.value;
    setCustomCollegeName(value);
    setFormData({ ...formData, college: value });
  };

  // Add new college to the list
  const addNewCollegeToList = async () => {
    if (!customCollegeName.trim()) return;

    try {
      setAddingCollege(true);

      // Add to backend
      await addNewCollege(customCollegeName.trim());

      // Add to local state
      const newCollegeList = [customCollegeName.trim(), ...collegeList];
      setCollegeList(newCollegeList);

      // Update form data and hide input
      setFormData({ ...formData, college: customCollegeName.trim() });
      setShowOtherCollegeInput(false);
      setCustomCollegeName("");

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "College added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to add college:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to add college. Please try again.",
      });
    } finally {
      setAddingCollege(false);
    }
  };

  const handlePercentageChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Field of study options based on degree
  const extraBranches = [
    "Artificial Intelligence",
    "Machine Learning",
    "AI & ML",
    "Data Science",
    "Cyber Security",
    "Cloud Computing",
    "Internet of Things (IoT)",
  ];
  const commonEngBranches = [
    "Instrumentation Engineering",
    "Mechatronics Engineering",
    "Automobile Engineering",
    "Biomedical Engineering",
    "Genetic Engineering",
    "Environmental Engineering",
    "Food Technology",
    "Petroleum Engineering",
    "Marine Engineering",
    "Textile Engineering",
    "Agricultural Engineering",
    "Mining Engineering",
    "Robotics Engineering",
  ];

  const fieldOfStudyMap = {
    BE: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
      "Aerospace",
      "Biotechnology",
      ...extraBranches,
      ...commonEngBranches,
    ],
    BTech: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
      "Aerospace",
      "Biotechnology",
      ...extraBranches,
      ...commonEngBranches,
    ],
    ME: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
      "Aerospace",
      "Biotechnology",
      ...extraBranches,
      ...commonEngBranches,
    ],
    MTech: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
      "Aerospace",
      "Biotechnology",
      ...extraBranches,
      ...commonEngBranches,
    ],
    BCA: [
      "Computer Applications",
      "Software Development",
      "Web Development",
      "Data Science",
      ...extraBranches,
    ],
    MCA: [
      "Computer Applications",
      "Software Engineering",
      "Data Science",
      "Artificial Intelligence",
      "Cyber Security",
      ...extraBranches,
    ],
    BSc: [
      "Computer Science",
      "Information Technology",
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Biotechnology",
      "Statistics",
      ...extraBranches,
    ],
    MSc: [
      "Computer Science",
      "Information Technology",
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Biotechnology",
      "Statistics",
      ...extraBranches,
    ],
    MBA: [
      "Finance",
      "Marketing",
      "Human Resources",
      "Operations",
      "International Business",
      "Strategy",
      "Analytics",
      // Not adding AI/ML unless needed
    ],
    BCom: ["Accounting", "Finance", "Banking", "Taxation", "Economics"],
    MCom: ["Accounting", "Finance", "Banking", "Taxation", "Economics"],
    BA: [
      "English",
      "History",
      "Political Science",
      "Psychology",
      "Sociology",
      "Economics",
      "Philosophy",
    ],
    MA: [
      "English",
      "History",
      "Political Science",
      "Psychology",
      "Sociology",
      "Economics",
      "Philosophy",
    ],
    BBA: [
      "Finance",
      "Marketing",
      "Human Resources",
      "Operations",
      "International Business",
      "Logistics",
      "Entrepreneurship",
    ],

    // ✅ Added BBM
    BBM: [
      "Management",
      "Finance",
      "Marketing",
      "Human Resources",
      "Business Analytics",
      "International Business",
    ],
    PhD: [
      "Computer Science",
      "Engineering",
      "Management",
      "Science",
      "Arts",
      "Commerce",
      ...extraBranches,
    ],
    MBBS: [
      // Pre-Clinical
      "Anatomy",
      "Physiology",
      "Biochemistry",

      // Para-Clinical
      "Pathology",
      "Pharmacology",
      "Microbiology",
      "Forensic Medicine",
      "Community Medicine",

      // Clinical
      "General Medicine",
      "General Surgery",
      "Orthopedics",
      "Pediatrics",
      "Obstetrics & Gynecology",
      "ENT (Otorhinolaryngology)",
      "Ophthalmology",
      "Dermatology",
      "Psychiatry",
      "Radiology",
      "Anesthesiology",
      "Respiratory Medicine",
      "Emergency Medicine",

      // Elective/Modern
      "Family Medicine",
      "Sports Medicine",
      "Palliative Care",
    ],
    Nursing: [
      "General Nursing",
      "Medical-Surgical Nursing",
      "Pediatric Nursing",
      "Psychiatric Nursing",
      "Community Health Nursing",
      "OBG Nursing (Obstetrics & Gynecology)",
      "Critical Care Nursing",
      "Emergency & Trauma Nursing",
      "Geriatric Nursing",
      "Oncology Nursing",
      "Cardiac Nursing",
      "Neonatal Nursing",
      "Orthopedic Nursing",
      "Neurology Nursing",
      "Operation Theatre Nursing",
    ],
    BDS: [
      "General Anatomy (Head & Neck)",
      "Human Physiology",
      "Biochemistry",
      "Dental Anatomy & Oral Histology",
      "General Pathology",
      "Microbiology",
      "Pharmacology",
      "General Medicine",
      "General Surgery",

      // Core Dental Subjects
      "Oral Pathology",
      "Oral Medicine & Radiology",
      "Periodontology",
      "Orthodontics",
      "Prosthodontics",
      "Conservative Dentistry & Endodontics",
      "Pediatric Dentistry",
      "Public Health Dentistry",
      "Oral & Maxillofacial Surgery",

      // Modern & Elective
      "Implantology",
      "Aesthetic Dentistry",
      "Forensic Odontology",
    ],
  };

  const getFieldOfStudyOptions = () => {
    if (!formData.degree) return [];
    const fields = fieldOfStudyMap[formData.degree] || [];
    console.log("Selected degree:", formData.degree);
    console.log("Available fields:", fields);
    return fields.map((field) => ({ label: field, value: field }));
  };

  //select year option
  const currentYear = new Date().getFullYear();
  const yearOptions = [];

  for (let y = currentYear; y >= 1900; y--) {
    yearOptions.push({
      value: y,
      label: y.toString(),
    });
  }

  // select percentage option
  const percentageOptions = [];

  for (let i = 100; i >= 1; i--) {
    percentageOptions.push({
      value: i,
      label: `${i}%`,
    });
  }

  //college name
  const CollegeNameOptions = [
    { label: "Other", value: "Other" },
    ...collegeList.map((college) => ({
      label: college,
      value: college,
    })),
  ];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);

  //   const formObject = new FormData();
  //   formObject.append('student_name', formData.Name);
  //   formObject.append('gender', formData.gender);
  //   formObject.append('dob', formData.dob);
  //   formObject.append('student_email', formData.email);
  //   formObject.append('student_mobile_no', formData.phoneNumber);
  //   formObject.append('address', formData.addressLine1);
  //   formObject.append('hsc_name', formData.highschoolname);
  //   formObject.append('language', formData.programlag);
  //   formObject.append('sslc_name', formData.secondaryschoolname);
  //   formObject.append('education', formData.degree);
  //   formObject.append('college_location', formData.college_location);
  //   formObject.append('end_year', formData.passedout);
  //   formObject.append('start_year', formData.startdate);
  //   formObject.append('college', formData.college);
  //   formObject.append('project_description', formData.projectdescription);
  //   formObject.append('hsc_percentage', formData.highschoolper);
  //   formObject.append('hsc_location', formData.hslocation);
  //   formObject.append('sslc_percentage', formData.secondaryschollper);
  //   formObject.append('sslc_location', formData.sslocation);

  //   if (formData.profile) formObject.append('student_image', formData.profile);
  //   if (formData.cv) formObject.append('cv_path', formData.cv);
  //   if (formData.certificate) formObject.append('certificate_path', formData.certificate);
  //   if (formData.coverletter) formObject.append('coverletter', formData.coverletter);

  //   try {
  //     const response = await axios.post(`${baseUrl}/addStudent`, formObject, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });

  //     if (response.data.success) {
  //       alert(response.data.message);
  //       if (response.data.token) {
  //   localStorage.setItem("token", response.data.token);
  // }
  //       if (response.data.message === "Student Profile added successfully") {

  //         navigate('/interships');
  //       }
  //       if (response.data.message === "Recruiter added successfully") {

  //         navigate('/postjob');
  //       }
  //     } else if (response.data.success === false) {
  //       const msg = response.data.message;
  //       if (typeof msg === "string") {
  //         alert(msg);
  //       } else if (typeof msg === "object" && msg !== null) {
  //         let errorMsg = "Form submission failed:\n";
  //         for (const field in msg) {
  //           errorMsg += `${field}: ${msg[field].join(", ")}\n`;
  //         }
  //         alert(errorMsg);
  //       } else {
  //         alert("Something went wrong.");
  //       }
  //     } else {
  //       alert("Invalid form submission.");
  //     }
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     alert(error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cv) {
      alert("Please upload your resume before continuing");
      return;
    }
    setSubmitting(true);

    const formObject = new FormData();
    formObject.append("studname", formData.Name);
    formObject.append("studgender", formData.gender);
    formObject.append("studdob", formData.dob);
    formObject.append("studemail", formData.email);
    formObject.append("studmobileno", formData.phoneNumber);
    formObject.append("studentaddress", formData.addressLine1);
    formObject.append("studhighschollname", formData.highschoolname);
    formObject.append("studprogramminglang", formData.programlag);
    formObject.append(
      "studentsecondaryschoolname",
      formData.secondaryschoolname
    );
    formObject.append("studentdegree", formData.degree);
    formObject.append("studentfieldofstudy", formData.fieldofstudy);
    formObject.append("studcollegelocation", formData.college_location);
    formObject.append("studcollegestartyear", formData.startdate);
    if (formData.passedout) {
      formObject.append("studcollegeendyear", formData.passedout);
    }
    formObject.append("studentcollegename", formData.college);
    formObject.append("studprojectdecription", formData.projectdescription);
    formObject.append("studhighschoolpercentage", formData.highschoolper);
    formObject.append("studhighschoollocation", formData.hslocation);
    formObject.append(
      "studentsecondaryschoolpercentage",
      formData.secondaryschollper
    );
    formObject.append("studsecondaryschoollocation", formData.sslocation);

    if (formData.profile) {
      formObject.append("studprofile", formData.profile);
    }
    formObject.append("studentresume", formData.cv);
    if (formData.coverletter) {
      formObject.append("studentcoverletter", formData.coverletter);
    }
    if (formData.certificate) {
      formObject.append("studentcertificate", formData.certificate);
    }

    try {
      const response = await studentRegister(formObject);

      console.log("student register detail", response);
      if (response.message === "Student registered successfully") {
        localStorage.setItem("token", response.studtoken);
        localStorage.setItem("stuid", response.student.id);

        // Success alert
        Swal.fire({
          title: "Success!",
          text: "Student registration successful!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });

        setTimeout(() => {
          navigate("/interships");
        }, 2000);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("stuid");
        localStorage.removeItem("recruiter_token");
        localStorage.removeItem("recid");

        // Error alert
        Swal.fire({
          title: "Error!",
          text: "Registration failed. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);

      // Error alert
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred during registration.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("stuid");
      localStorage.removeItem("recruiter_token");
      localStorage.removeItem("recid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container p-3 d-flex justify-content-center align-items-center formboxmain mt-5 mb-5">
        <div className="row w-100 w-md-75 p-3 form-box">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <h2 className="personaltext">Education</h2>
            <FaRegCircleUser className="userprofile-icon" />
          </div>

          <hr className="custom-line" />

          <div className="col-12">
            <form onSubmit={handleSubmit}>
              {/* {[
                { label: "Degree", name: "degree", type: "text" },
                { label: "College Name", name: "college", type: "text" },
                { label: "Started Year", name: "startdate", type: "number" },
                { label: "Passout Year", name: "passedout", type: "number" },
                { label: "Location", name: "college_location", type: "text" },
                { label: "High School Name", name: "highschoolname", type: "text" },
                { label: "High School (%)", name: "highschoolper", type: "text", onChange: handlePercentageChange },
                { label: "High School Location", name: "hslocation", type: "text" },
                { label: "Secondary School Name", name: "secondaryschoolname", type: "text" },
                { label: "Secondary School (%)", name: "secondaryschollper", type: "text", onChange: handlePercentageChange },
                { label: "Secondary School Location", name: "sslocation", type: "text" },
              ].map(({ label, name, type, onChange = handleChange }) => (
                <div className="row align-items-center mb-4" key={name}>
                  <label className="col-12 col-md-3 col-form-label fs-5">{label}</label>
                  <div className="col-12 col-md-9">
                    <input
                      type={type}
                      name={name}
                      value={formData[name] || ""}
                      onChange={onChange}
                      className="form-control"
                      min="1900"
                      max={new Date().getFullYear()} 
                      required
                    />
                  </div>
                </div>
              ))} */}

              {/* Degree */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Degree<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Degree"
                    options={degreeOptions}
                    value={formData.degree}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        degree: value,
                        fieldofstudy: "",
                      })
                    }
                    allowClear
                    showSearch // ✅ enables typing search
                    optionFilterProp="label" // ✅ tells Select to search by label
                    required
                  />
                </div>
              </div>

              {/* Field of Study */}
              {formData.degree && formData.degree !== "" && (
                <div className="row align-items-center mb-4">
                  <label className="col-12 col-md-3 col-form-label fs-5">
                    Field of Study<span className="text-danger">*</span>
                  </label>
                  <div className="col-12 col-md-9">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Field of Study"
                      options={getFieldOfStudyOptions()}
                      value={formData.fieldofstudy}
                      onChange={(value) =>
                        setFormData({ ...formData, fieldofstudy: value })
                      }
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      required
                    />
                  </div>
                </div>
              )}

              {/* College Name */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  College Name<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  {/* <input
        type="text"
        name="college"
        placeholder='Enter Your Collage Name'
        value={formData.college || ""}
        onChange={handleChange}
        className="form-control"
        required
      /> */}
                  <Select
                    style={{ width: "100%" }}
                    placeholder={
                      loadingColleges ? "Loading colleges..." : "Select College"
                    }
                    options={CollegeNameOptions}
                    value={showOtherCollegeInput ? "Other" : formData.college}
                    onChange={handleCollegeChange}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                    loading={loadingColleges}
                    disabled={loadingColleges}
                  />

                  {/* Custom college input field */}
                  {showOtherCollegeInput && (
                    <div className="mt-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your college name"
                          value={customCollegeName}
                          onChange={handleCustomCollegeChange}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addNewCollegeToList();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addNewCollegeToList}
                          disabled={!customCollegeName.trim() || addingCollege}
                        >
                          {addingCollege ? "Adding..." : "Add College"}
                        </button>
                      </div>
                      <small className="text-muted">
                        Enter your college name and click "Add College" to add
                        it to the list
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Started Year */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Started Year<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  {/* <input
        type="number"
        name="startdate"
        value={formData.startdate || ""}
        onChange={handleChange}
        className="form-control"
        min="1900"
        max={new Date().getFullYear()}
        required
      /> */}
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Starting Year"
                    options={yearOptions}
                    value={formData.startdate}
                    onChange={(value) =>
                      setFormData({ ...formData, startdate: value })
                    }
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                  ></Select>
                </div>
              </div>

              {/* Passout Year */}
              {/* <div className="row align-items-center mb-4">
    <label className="col-12 col-md-3 col-form-label fs-5">Passout Year</label>
    <div className="col-12 col-md-9">
      <input
        type="number"
        name="passedout"
        value={formData.passedout || ""}
        onChange={handleChange}
        className="form-control"
        min="1900"
        max={new Date().getFullYear()}
        required
      />
    </div>
  </div> */}

              {/* College Location - State */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  College State<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select State"
                    options={states.map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    value={collegeState}
                    onChange={(value) => {
                      setCollegeState(value);
                      setCollegeDistrict(""); // Reset district when state changes
                      setFormData({ ...formData, college_location: value });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                  />
                </div>
              </div>

              {/* College Location - District */}
              {collegeState && (
                <div className="row align-items-center mb-4">
                  <label className="col-12 col-md-3 col-form-label fs-5">
                    College District<span className="text-danger">*</span>
                  </label>
                  <div className="col-12 col-md-9">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select District"
                      options={getDistricts(collegeState).map((district) => ({
                        label: district,
                        value: district,
                      }))}
                      value={collegeDistrict}
                      onChange={(value) => {
                        setCollegeDistrict(value);
                        setFormData({
                          ...formData,
                          college_location: `${value}, ${collegeState}`,
                        });
                      }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      required
                    />
                  </div>
                </div>
              )}

              {/* High School Name */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  High School Name<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <input
                    type="text"
                    name="highschoolname"
                    placeholder="High School Name"
                    value={formData.highschoolname || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* High School % */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  High School (%)
                </label>
                <div className="col-12 col-md-9">
                  {/* <input
        type="text"
        name="highschoolper"
        value={formData.highschoolper || ""}
        onChange={handlePercentageChange}
        className="form-control"
        required
      /> */}
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select %"
                    value={formData.highschoolper}
                    options={percentageOptions}
                    onChange={(value) =>
                      setFormData({ ...formData, highschoolper: value })
                    }
                    allowClear
                    showSearch
                    optionFilterProp="label"
                  />
                </div>
              </div>

              {/* High School Location - State */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  High School State
                </label>
                <div className="col-12 col-md-9">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select State"
                    options={states.map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    value={hsState}
                    onChange={(value) => {
                      setHsState(value);
                      setHsDistrict(""); // Reset district when state changes
                      setFormData({ ...formData, hslocation: value });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                  />
                </div>
              </div>

              {/* High School Location - District */}
              {hsState && (
                <div className="row align-items-center mb-4">
                  <label className="col-12 col-md-3 col-form-label fs-5">
                    High School District
                  </label>
                  <div className="col-12 col-md-9">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select District"
                      options={getDistricts(hsState).map((district) => ({
                        label: district,
                        value: district,
                      }))}
                      value={hsDistrict}
                      onChange={(value) => {
                        setHsDistrict(value);
                        setFormData({
                          ...formData,
                          hslocation: `${value}, ${hsState}`,
                        });
                      }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                    />
                  </div>
                </div>
              )}

              {/* Secondary School Name */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Secondary School Name<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <input
                    type="text"
                    name="secondaryschoolname"
                    placeholder="Secondary School Name"
                    value={formData.secondaryschoolname || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Secondary School % */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Secondary School (%)
                </label>
                <div className="col-12 col-md-9">
                  {/* <input
        type="text"
        name="secondaryschollper"
        value={formData.secondaryschollper || ""}
        onChange={handlePercentageChange}
        className="form-control"
        required
      /> */}
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select %"
                    value={formData.secondaryschollper}
                    options={percentageOptions}
                    onChange={(value) =>
                      setFormData({ ...formData, secondaryschollper: value })
                    }
                    allowClear
                    showSearch
                    optionFilterProp="label"
                  ></Select>
                </div>
              </div>

              {/* Secondary School Location - State */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Secondary School State
                </label>
                <div className="col-12 col-md-9">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select State"
                    options={states.map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    value={ssState}
                    onChange={(value) => {
                      setSsState(value);
                      setSsDistrict(""); // Reset district when state changes
                      setFormData({ ...formData, sslocation: value });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                  />
                </div>
              </div>

              {/* Secondary School Location - District */}
              {ssState && (
                <div className="row align-items-center mb-4">
                  <label className="col-12 col-md-3 col-form-label fs-5">
                    Secondary School District
                  </label>
                  <div className="col-12 col-md-9">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select District"
                      options={getDistricts(ssState).map((district) => ({
                        label: district,
                        value: district,
                      }))}
                      value={ssDistrict}
                      onChange={(value) => {
                        setSsDistrict(value);
                        setFormData({
                          ...formData,
                          sslocation: `${value}, ${ssState}`,
                        });
                      }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                    />
                  </div>
                </div>
              )}

              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Project Description
                </label>

                <div className="col-12 col-md-9">
                  <textarea
                    name="projectdescription"
                    placeholder="Enter Project Description"
                    value={formData.projectdescription || ""}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                  />
                </div>
              </div>

              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Skills<span className="text-danger">*</span>
                </label>

                <div className="col-12 col-md-9">
                  <textarea
                    name="programlag"
                    placeholder="Enter Your Skills Ex (c, c++, Java)"
                    value={formData.programlag || ""}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Attach Certificate */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Attach Certificate
                </label>
                <div className="col-12 col-md-9">
                  <div
                    className="border border-2 rounded p-4 d-flex flex-column align-items-center justify-content-center"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <BsCloudUploadFill
                      size={40}
                      className="mb-2 text-primary"
                    />
                    <strong>Browse file</strong>
                    <span className="text-muted small">
                      or drag and drop file here
                    </span>
                    <input
                      type="file"
                      name="certificate"
                      id="certificateUploadInput"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleChange}
                      className="form-control"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                  {formData.certificate && (
                    <p className="mt-2 text-success">
                      Selected file: {formData.certificate.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Attach CV */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Attach CV<span className="text-danger">*</span>
                </label>
                <div className="col-12 col-md-9">
                  <div
                    className="border border-2 rounded p-4 d-flex flex-column align-items-center justify-content-center"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <BsCloudUploadFill
                      size={40}
                      className="mb-2 text-primary"
                    />
                    <strong>Browse file</strong>
                    <span className="text-muted small">
                      or drag and drop file here
                    </span>
                    <input
                      type="file"
                      name="cv"
                      id="cvUploadInput"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleChange}
                      className="form-control"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                      }}
                      required
                    />
                  </div>
                  {formData.cv && (
                    <p className="mt-2 text-success">
                      Selected file: {formData.cv.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Attach Cover Letter */}
              <div className="row align-items-center mb-4">
                <label className="col-12 col-md-3 col-form-label fs-5">
                  Attach Cover Letter
                </label>
                <div className="col-12 col-md-9">
                  <div
                    className="border border-2 rounded p-4 d-flex flex-column align-items-center justify-content-center"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <BsCloudUploadFill
                      size={40}
                      className="mb-2 text-primary"
                    />
                    <strong>Browse file</strong>
                    <span className="text-muted small">
                      or drag and drop file here
                    </span>
                    <input
                      type="file"
                      name="coverletter"
                      id="coverletterUploadInput"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleChange}
                      className="form-control"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>

                  {formData.coverletter && (
                    <p className="mt-2 text-success">
                      Selected file: {formData.coverletter.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-between">
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
      <Footer />
    </>
  );
};

export default EducationDetails;
