import "./RecruiterJobPost.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import { useState, useEffect } from "react";
import { recruiterpostjob } from "../service/postjob";
import { Select } from "antd";
import { degreeOptions } from "../objects/DegreeObject";
import { getStates, getDistricts } from "../objects/IndiaLocations";
import { getrecruiterdetail } from "../service/profileupdate";
import { useNavigate } from "react-router-dom";

const RecruiterJobPost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Field of study mapping (same as EducationDetails)
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
    if (!selectedDegree) return [];
    const fields = fieldOfStudyMap[selectedDegree] || [];
    return fields.map((field) => ({ label: field, value: field }));
  };

  const getDistrictOptions = () => {
    if (!selectedState) return [];
    const districts = getDistricts(selectedState);
    return districts.map((d) => ({ label: d, value: d }));
  };
  const [formData, setFormData] = useState({
    company_id: localStorage.getItem("company_id"),
    company_name: "",
    company_role_name: "",
    intern_skill_name: "",
    intern_skill_id: "",
    company_state: "",
    company_district: "",
    student_education: "",
    intern_availability: "",
    intern_description: "",
    skill_set: "",
    about_internship: "",
    eligibility_criteria: "",
    internship_duration: "",
    intern_stipend: "",
    company_website: "",
    company_location_link: "",
    roletype: "",
    company_logo: null,
    about_company: "",
    intern_post_date: new Date().toISOString().split("T")[0], // Sets current date as default
  });

  // Fetch recruiter/company details on component mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await getrecruiterdetail();
        console.log("Recruiter details:", response);

        if (response) {
          // Auto-fill company details including logo
          setFormData((prev) => ({
            ...prev,
            company_name: response.reccompanyname || "",
            company_website: response.reccompanywebsite || "",
            about_company: response.reccompanydescription || "",
            company_logo: response.reccompanylogo || null, // Auto-fill logo path
          }));
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  //set values to formdata

  // const handleChange = (e) => {
  //     const { name, value, files } = e.target;

  //     if (name === 'company_logo') {
  //       setFormData({
  //         ...formData,
  //         [name]: files[0]
  //       });
  //     } else {
  //       setFormData({
  //         ...formData,
  //         [name]: value
  //       });
  //     }
  //   };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   if (!formData.company_logo) {
  //     alert('Please attach your company logo');
  //     return;
  //   }

  //   const formDataToSend = new FormData();

  //   Object.entries(formData).forEach(([key, value]) => {

  //     if (value !== null && value !== undefined) {

  //       if (key === 'company_logo' && value instanceof File) {
  //         formDataToSend.append(key, value, value.name);
  //       }

  //       else if (Array.isArray(value)) {
  //         value.forEach(item => formDataToSend.append(key, item));
  //       }

  //       else {
  //         formDataToSend.append(key, value);
  //       }
  //     }
  //   });

  //   try {
  //     const recruiter_token = localStorage.getItem('recruiter_token');

  //     if (!recruiter_token) {
  //       throw new Error('No recruiter token found');
  //     }

  //     const response = await axios.post(
  //       `${baseurl}/addInternPost`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${recruiter_token}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     if (response.data.success) {

  //       console.log('Job posted successfully:', response.data);
  //       alert('Job posted successfully!');

  //     } else {
  //       throw new Error(response.data.message || 'Failed to post job');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     alert(error.response?.data?.message || error.message || 'Failed to post job');
  //   } finally {
  //     setIsSubmitting(false);

  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Create FormData object
    const formObject = new FormData();

    // Append all your form fields (key, value)
    formObject.append("companyname", formData.company_name);
    formObject.append("aboutcompany", formData.about_company);
    formObject.append("companywebsite", formData.company_website);
    // Logo is auto-filled from recruiter profile, no need to append
    formObject.append("roletype", formData.roletype);
    formObject.append("title", formData.company_role_name); //jobtitle
    formObject.append("Internshipqualification", formData.about_internship);
    formObject.append("intershipdescription", formData.intern_description);
    formObject.append("studentqualification", formData.student_education); //student degree
    formObject.append("fieldofstudy", formData.intern_availability); // field of study
    formObject.append("requiredskills", formData.skill_set);
    formObject.append("eligibilitycriteria", formData.eligibility_criteria);
    formObject.append("companystate", formData.company_state);
    formObject.append("companycity", formData.company_district);
    formObject.append("locationlink", formData.company_location_link);
    formObject.append("internshipduration", formData.internship_duration);
    formObject.append("internshipstipend", formData.intern_stipend);
    formObject.append("aboutinternship", formData.about_internship);

    try {
      // ✅ Pass FormData to recruiterpostjob
      const response = await recruiterpostjob(formObject);
      console.log("✅ Job posted successfully:", response);

      if (response.message === "Job posted successfully") {
        // Optionally clear form or show success message
        alert("Job posted successfully!");

        // Re-fetch company details to restore logo
        const response = await getrecruiterdetail();

        navigate("/postedjob");

        // ✅ Clear all input fields but keep company info
        setFormData({
          company_name: response?.reccompanyname || "",
          about_company: response?.reccompanydescription || "",
          company_website: response?.reccompanywebsite || "",
          company_logo: response?.reccompanylogo || null,
          roletype: "",
          company_role_name: "",
          about_internship: "",
          intern_description: "",
          intern_availability: "",
          student_education: "",
          skill_set: "",
          eligibility_criteria: "",
          company_state: "",
          company_district: "",
          company_location_link: "",
          internship_duration: "",
          intern_stipend: "",
        });
        setSelectedDegree("");
        setSelectedState("");
        setSelectedDistrict("");
      }
    } catch (error) {
      console.error("❌ Error while posting job:", error);
      alert("Something went wrong while posting the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="container-fluid">
        <div className="container jobpostshowcard p-5 d-flex flex-column justify-content-center align-items-center">
          <form className="w-100" onSubmit={handleSubmit}>
            {/* Company Information Section */}
            <div className="mb-4 w-100">
              <h4 className="mb-3">Company Information</h4>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Company Name*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter company name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">About Company*</label>
                </div>
                <div className="col-md-8">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Brief description of your company"
                    required
                    value={formData.about_company}
                    onChange={handleChange}
                    name="about_company"
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Company Website</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.company_website}
                    onChange={handleChange}
                    name="company_website"
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Company Logo</label>
                </div>
                <div className="col-md-8">
                  {loading ? (
                    <p className="text-muted">Loading logo...</p>
                  ) : formData.company_logo ? (
                    <div className="d-flex align-items-center">
                      <img
                        src={`${process.env.REACT_APP_BASE_IMG_URL}/${formData.company_logo}`}
                        alt="Company Logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "5px",
                        }}
                      />
                      <span className="ms-3 text-success">
                        ✓ Logo loaded from your profile
                      </span>
                    </div>
                  ) : (
                    <p className="text-danger">
                      No logo found. Please update your company profile.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="mb-4 w-100">
              <h4 className="mb-3">Internship Details</h4>

              {/* Role Type* */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Role*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. Developer,Tester,Devops...."
                    required
                    value={formData.roletype}
                    onChange={handleChange}
                    name="roletype"
                  />
                </div>
              </div>

              {/* <JobRoleType
    jobRoleTypes={jobRoleTypes}
      formData={formData}
      setFormData={setFormData}
    ></JobRoleType> */}

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Title*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. Software Developer Intern"
                    required
                    value={formData.company_role_name}
                    onChange={handleChange}
                    name="company_role_name"
                  />
                </div>
              </div>

              {/* About intern */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">
                    Internship Responsibilities*
                  </label>
                </div>
                <div className="col-md-8">
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Detailed description of responsibilities"
                    value={formData.about_internship}
                    name="about_internship"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* intership description */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Internship Skills*</label>
                </div>
                <div className="col-md-8">
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Detailed description of responsibilities"
                    value={formData.intern_description}
                    name="intern_description"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="mb-4 w-100">
              <h4 className="mb-3">Requirements</h4>

              {/* Student Qualification - Degree */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Student Qualification*</label>
                </div>
                <div className="col-md-8">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Degree"
                    options={degreeOptions}
                    value={selectedDegree}
                    onChange={(value) => {
                      setSelectedDegree(value);
                      setFormData({
                        ...formData,
                        student_education: value,
                        intern_availability: "", // Reset field of study
                      });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                  />
                </div>
              </div>

              {/* Internship For - Field of Study */}
              {selectedDegree && (
                <div className="row align-items-center mb-3">
                  <div className="col-md-2">
                    <label className="form-label">Internship For*</label>
                  </div>
                  <div className="col-md-8">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Field of Study"
                      options={getFieldOfStudyOptions()}
                      value={formData.intern_availability}
                      onChange={(value) =>
                        setFormData({ ...formData, intern_availability: value })
                      }
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      required
                    />
                  </div>
                </div>
              )}
              {/* required skills */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Required Skills*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. JavaScript, Python, React"
                    value={formData.skill_set}
                    name="skill_set"
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    Separate skills with commas
                  </small>
                </div>
              </div>
              {/* eligibility */}
              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Eligibility Criteria</label>
                </div>
                <div className="col-md-8">
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Any specific eligibility requirements"
                    value={formData.eligibility_criteria}
                    name="eligibility_criteria"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Duration */}
            <div className="mb-4 w-100">
              <h4 className="mb-3">Location & Duration</h4>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">State*</label>
                </div>
                <div className="col-md-8">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select State"
                    options={getStates().map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    value={selectedState}
                    onChange={(value) => {
                      setSelectedState(value);
                      setSelectedDistrict("");
                      setFormData({
                        ...formData,
                        company_state: value,
                        company_district: "",
                      });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">District*</label>
                </div>
                <div className="col-md-8">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select District"
                    options={getDistrictOptions()}
                    value={selectedDistrict}
                    onChange={(value) => {
                      setSelectedDistrict(value);
                      setFormData({ ...formData, company_district: value });
                    }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    disabled={!selectedState}
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Location Link</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="Google Maps link"
                    value={formData.company_location_link}
                    name="company_location_link"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col-md-2">
                  <label className="form-label">Internship Duration*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. 3 months, 6 months"
                    value={formData.internship_duration}
                    name="internship_duration"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="w-100">
              <h4 className="mb-3">Compensation</h4>

              <div className="row align-items-center">
                <div className="col-md-2">
                  <label className="form-label">Internship Stipend*</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. ₹10,000/month or Performance based"
                    value={formData.intern_stipend}
                    name="intern_stipend"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Posting...
                  </>
                ) : (
                  "Post Internship"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default RecruiterJobPost;
