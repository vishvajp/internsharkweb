import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { Select } from "antd";
import { getjobdetailbyid } from "../service/job";
import { updatethepostedjob } from "../service/postjob";
import { degreeOptions } from "../objects/DegreeObject";
import { getStates, getDistricts } from "../objects/IndiaLocations";

const EditJobModal = ({ show, onClose, internshipId, onUpdate }) => {
  // State
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Location states
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const states = getStates();

  // Degree and field of study
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState("");

  // Field of study mapping
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

  // Form data
  const [formData, setFormData] = useState({
    roletype: "",
    intern_skill_name: "",
    about_internship: "",
    intern_description: "",
    intern_availability: "",
    student_education: "",
    field_of_study: "",
    skill_set: "",
    eligibility_criteria: "",
    company_state: "",
    company_district: "",
    company_location_link: "",
    internship_duration: "",
    intern_stipend: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          company_logo: reader.result, // for preview
          logoFile: file, // actual file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //fetch all job detail
  // useEffect(() => {
  //   const getroletype = async () => {
  //     try {
  //       const recruiter_token = localStorage.getItem("recruiter_token");
  //       if (!recruiter_token) {
  //         setError("No recruiter token found");
  //         return;
  //       }

  //       const response = await axios.post(
  //         `${baseurl}/getJobRoles`,
  //         {},
  //         { headers: { Authorization: `Bearer ${recruiter_token}` } }
  //       );

  //       console.log("📊 Response data:", response.data);

  //       if (response.data.data && Array.isArray(response.data.data)) {
  //         setJobRoleTypes(response.data.data);
  //       } else {
  //         console.log("❌ No data in response");
  //         setError("No data received");
  //       }
  //     } catch (err) {
  //       console.error("🔥 Error:", err);
  //       if (err.response) console.error("Error details:", err.response.data);
  //       setError("Failed to load job roles");
  //     }
  //   };

  //   getroletype();
  // }, [baseurl, show]);
  // ✅ Add `show` to re-run when modal opens

  // Fetch job data
  // useEffect(() => {
  //   const fetchJob = async () => {
  //     if (!internshipId || !show) {
  //       setJobData(null);
  //       setError(null);
  //       return;
  //     }

  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const recruiter_token = localStorage.getItem("recruiter_token");
  //       const response = await axios.post(
  //         `${baseurl}/getInternPostById/${internshipId}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${recruiter_token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       setJobData(response.data.data);
  //       console.log('fetjobdetail',response.data.data);
  //       setFormData({
  //         company_name: response.data.data.company_name || "",
  //         company_district: response.data.data.company_district || "",
  //         about_company: response.data.data.about_company || "",
  //         company_website: response.data.data.company_website || "",
  //         company_logo: response.data.data.company_logo || "",
  //         company_role_name: response.data.data.company_role_name || "",
  //         about_internship:response.data.data.about_internship || "",
  //         intern_description:response.data.data.intern_description || "",
  //         intern_availability:response.data.data.intern_availability || "",
  //         student_education:response.data.data.student_education || "",
  //         skill_set:response.data.data.skill_set || "",
  //         eligibility_criteria:response.data.data.eligibility_criteria || "",
  //         company_location_link:response.data.data.company_location_link || "",
  //         internship_duration:response.data.data.internship_duration || "",
  //         intern_stipend:response.data.data.intern_stipend || "",
  //         internPost_id:response.data.data.internship_id || "",
  //         intern_skill_name:response.data.data.intern_skill_name || "",
  //         intern_skill_id:response.data.data.inter_skill_id || "",

  //       });
  //     } catch (error) {
  //       console.error("Error fetching job:", error);
  //       setError("Failed to load job details. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchJob();
  // }, [baseurl, internshipId, show]);

  //fetch jobdetail by id
  useEffect(() => {
    if (show && internshipId) {
      const fetchJobDetail = async () => {
        setLoading(true);
        try {
          const response = await getjobdetailbyid(internshipId);
          console.log("Fetched job detail:", response);

          if (response) {
            setJobData(response);

            // Set location
            setSelectedState(response.companystate || "");
            setSelectedDistrict(response.companycity || "");

            // Set degree and field of study
            setSelectedDegree(response.studentqualification || "");
            setSelectedFieldOfStudy(response.fieldofstudy || "");

            setFormData({
              roletype: response.title || "",
              intern_skill_name: response.roletype || "",
              about_internship: response.aboutinternship || "",
              intern_description: response.intershipdescription || "",
              intern_availability: response.Internshipqualification || "",
              student_education: response.studentqualification || "",
              field_of_study: response.fieldofstudy || "",
              skill_set: Array.isArray(response.requiredskills)
                ? response.requiredskills.join(", ")
                : response.requiredskills || "",
              eligibility_criteria: response.eligibilitycriteria || "",
              company_state: response.companystate || "",
              company_district: response.companycity || "",
              company_location_link: response.locationlink || "",
              internship_duration: response.internshipduration || "",
              intern_stipend: response.internshipstipend || "",
            });
          }
        } catch (error) {
          console.error("Error while fetching job data:", error);
          setError("Failed to load job details. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchJobDetail();
    }
  }, [show, internshipId]);

  // Handle form submission
  //  const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitLoading(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const recruiter_token = localStorage.getItem("recruiter_token");

  //     const formDataToSend = new FormData();
  //     formDataToSend.append("company_name", formData.company_name);
  //     formDataToSend.append("company_district", formData.company_district);
  //     formDataToSend.append("about_company", formData.about_company);
  //     formDataToSend.append("company_website", formData.company_website);
  //     formDataToSend.append("company_role_name", formData.company_role_name);
  //     formDataToSend.append("about_internship", formData.about_internship);
  //     formDataToSend.append("intern_description", formData.intern_description);
  //     formDataToSend.append("intern_availability", formData.intern_availability);
  //     formDataToSend.append("student_education", formData.student_education);
  //     formDataToSend.append("skill_set", formData.skill_set);
  //     formDataToSend.append("eligibility_criteria", formData.eligibility_criteria);
  //     formDataToSend.append("company_location_link", formData.company_location_link);
  //     formDataToSend.append("internship_duration", formData.internship_duration);
  //     formDataToSend.append("intern_stipend", formData.intern_stipend);
  //     formDataToSend.append("internPost_id", formData.internPost_id || internshipId);
  //     formDataToSend.append("intern_skill_name", formData.intern_skill_name);
  //     formDataToSend.append("intern_skill_id", formData.intern_skill_id);

  //     if (formData.logoFile) {
  //   formDataToSend.append("company_logo", formData.logoFile);
  // }

  //     console.log("FormData entries to be submitted:");
  //     for (let pair of formDataToSend.entries()) {

  //     }

  //     const response = await axios.post(
  //       `${baseurl}/editInternPost`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${recruiter_token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       alert("Internship updated successfully!");
  //       if (onUpdate) onUpdate();
  //     } else {
  //       setError(response.data.message || "Update failed");
  //     }
  //   } catch (error) {
  //     console.error("Error updating internship:", error);
  //     setError(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Failed to update internship. Please try again."
  //     );
  //   } finally {
  //     setSubmitLoading(false);
  //   }
  // };

  //node summit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("companyname", formData.company_name);
      formDataToSend.append("company_district", formData.company_district);
      formDataToSend.append("aboutcompany", formData.about_company);
      formDataToSend.append("companywebsite", formData.company_website);
      formDataToSend.append("title", formData.roletype);
      formDataToSend.append("roletype", formData.intern_skill_name);
      formDataToSend.append("aboutinternship", formData.about_internship);
      formDataToSend.append(
        "intershipdescription",
        formData.intern_description
      );
      formDataToSend.append(
        "Internshipqualification",
        formData.intern_availability
      );
      formDataToSend.append("studentqualification", formData.student_education);
      formDataToSend.append("requiredskills", formData.skill_set);
      formDataToSend.append(
        "eligibilitycriteria",
        formData.eligibility_criteria
      );
      formDataToSend.append("studentqualification", selectedDegree);
      formDataToSend.append("fieldofstudy", selectedFieldOfStudy);
      formDataToSend.append("companystate", selectedState);
      formDataToSend.append("companycity", selectedDistrict);
      formDataToSend.append("locationlink", formData.company_location_link);
      formDataToSend.append("internshipduration", formData.internship_duration);
      formDataToSend.append("internshipstipend", formData.intern_stipend);

      const response = await updatethepostedjob(internshipId, formDataToSend);
      console.log("Updated job successfully", response);

      setSuccess("Job updated successfully!");
      setTimeout(() => {
        if (onUpdate) onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      console.log("Error while update jobdetail", error);
      setError("Something went wrong while updating the job.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Posted Job</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {loading && (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
              <p>Loading job details...</p>
            </div>
          )}

          {error && (
            <Alert
              variant="danger"
              className="my-2"
              onClose={() => setError(null)}
              dismissible
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              className="my-2"
              onClose={() => setSuccess(null)}
              dismissible
            >
              {success}
            </Alert>
          )}

          {!loading && !error && jobData && (
            <>
              <Form.Group controlId="internSkillName">
                <Form.Label>Role Type</Form.Label>
                <Form.Control
                  name="intern_skill_name"
                  value={formData.intern_skill_name}
                  onChange={handleChange}
                  placeholder=""
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  name="roletype"
                  value={formData.roletype}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>About Intership</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="about_internship"
                  value={formData.about_internship}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Inter Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="intern_description"
                  value={formData.intern_description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Intership for</Form.Label>
                <Form.Control
                  type="text"
                  name="intern_availability
"
                  value={formData.intern_availability}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Student Qualification</Form.Label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Degree"
                  value={selectedDegree}
                  onChange={(value) => {
                    setSelectedDegree(value);
                    setSelectedFieldOfStudy("");
                    setFormData((prev) => ({
                      ...prev,
                      student_education: value,
                      field_of_study: "",
                    }));
                  }}
                  options={degreeOptions}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  getPopupContainer={(trigger) => trigger.parentNode}
                  dropdownStyle={{ zIndex: 10000 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Field of Study</Form.Label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Field of Study"
                  value={selectedFieldOfStudy}
                  onChange={(value) => {
                    setSelectedFieldOfStudy(value);
                    setFormData((prev) => ({
                      ...prev,
                      field_of_study: value,
                    }));
                  }}
                  options={
                    selectedDegree && fieldOfStudyMap[selectedDegree]
                      ? fieldOfStudyMap[selectedDegree].map((field) => ({
                          label: field,
                          value: field,
                        }))
                      : []
                  }
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  disabled={!selectedDegree}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  dropdownStyle={{ zIndex: 10000 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Required Skills</Form.Label>
                <Form.Control
                  type="text"
                  name="skill_set"
                  value={formData.skill_set}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Eligibility Criteria</Form.Label>
                <Form.Control
                  type="text"
                  name="eligibility_criteria
"
                  value={formData.eligibility_criteria}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Company State</Form.Label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select State"
                  value={selectedState}
                  onChange={(value) => {
                    setSelectedState(value);
                    setSelectedDistrict("");
                    setFormData((prev) => ({
                      ...prev,
                      company_state: value,
                      company_district: "",
                    }));
                  }}
                  options={states.map((state) => ({
                    label: state,
                    value: state,
                  }))}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  getPopupContainer={(trigger) => trigger.parentNode}
                  dropdownStyle={{ zIndex: 10000 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company District</Form.Label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select District"
                  value={selectedDistrict}
                  onChange={(value) => {
                    setSelectedDistrict(value);
                    setFormData((prev) => ({
                      ...prev,
                      company_district: value,
                    }));
                  }}
                  options={
                    selectedState
                      ? getDistricts(selectedState).map((district) => ({
                          label: district,
                          value: district,
                        }))
                      : []
                  }
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  disabled={!selectedState}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  dropdownStyle={{ zIndex: 10000 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location Link</Form.Label>
                <Form.Control
                  type="text"
                  name="company_location_link"
                  value={formData.company_location_link}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Intership Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="internship_duration"
                  value={formData.internship_duration}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Compensation</Form.Label>
                <Form.Control
                  type="text"
                  name="intern_stipend"
                  value={formData.intern_stipend}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {!loading && !error && !jobData && <p>No internship data loaded.</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={submitLoading}
          >
            Close
          </Button>
          {jobData && (
            <Button variant="primary" type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Updating...</span>
                </>
              ) : (
                "Update Job"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditJobModal;
