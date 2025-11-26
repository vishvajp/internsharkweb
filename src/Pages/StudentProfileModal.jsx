import { useEffect, useState, useRef, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import "./StudentProfileModal.css";
import {
  getstudentdetail,
  updatestudentdetail,
} from "../service/profileupdate";
import { Select } from "antd";
import { degreeOptions } from "../objects/DegreeObject";
import { getStates, getDistricts } from "../objects/IndiaLocations";
import { CollegeName } from "../objects/CollegeName";
import { getAllColleges, addNewCollege } from "../service/collegeService";

const StudentProfileModal = ({ show, onClose }) => {
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Location states
  const [addressState, setAddressState] = useState("");
  const [addressDistrict, setAddressDistrict] = useState("");
  const [collegeState, setCollegeState] = useState("");
  const [collegeDistrict, setCollegeDistrict] = useState("");
  const [hsState, setHsState] = useState("");
  const [hsDistrict, setHsDistrict] = useState("");
  const [ssState, setSsState] = useState("");
  const [ssDistrict, setSsDistrict] = useState("");

  // Degree and field of study
  const [selectedDegree, setSelectedDegree] = useState("");

  // College data
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  // Other college management
  const [showOtherCollegeInput, setShowOtherCollegeInput] = useState(false);
  const [customCollegeName, setCustomCollegeName] = useState("");
  const [addingCollege, setAddingCollege] = useState(false);

  const states = getStates();
  console.log("States available:", states.length);

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

  const getFieldOfStudyOptions = () => {
    if (!selectedDegree) return [];
    const fields = fieldOfStudyMap[selectedDegree] || [];
    return fields.map((field) => ({ label: field, value: field }));
  };

  // Create college options with "Other" at the top - memoized to prevent re-renders
  const collegeOptions = useMemo(() => {
    return [
      { label: "Other", value: "Other" },
      ...colleges.map((college) => ({
        label: college,
        value: college,
      })),
    ];
  }, [colleges]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        student_image: file,
      }));
    }
  };

  const [formData, setFormData] = useState({
    student_name: "",
    student_mobile_no: "",
    address: "",
    language: "",
    student_email: "",
    project_description: "",
    college: "",
    education: "",
    field_of_study: "",
    college_location: "",
    hsc_name: "",
    hsc_location: "",
    hsc_percentage: "",
    sslc_name: "",
    sslc_location: "",
    sslc_percentage: "",
    start_year: "",
    // end_year: "",
    student_image: null,
    existing_image_url: "",
    date_of_birth: "",
    gender: "",
  });

  // Fetch student data and colleges once modal opens
  useEffect(() => {
    if (show) {
      getDetail();
      fetchColleges();
    } else {
      // Reset "Other" state when modal is closed
      setShowOtherCollegeInput(false);
      setCustomCollegeName("");
    }
  }, [show]);

  // Fetch colleges from API and combine with predefined list
  const fetchColleges = async () => {
    setLoadingColleges(true);
    try {
      const apiColleges = await getAllColleges();
      // Combine API colleges with predefined colleges and remove duplicates
      const allColleges = [
        ...new Set([
          ...CollegeName,
          ...apiColleges.map((college) => college.name),
        ]),
      ];
      setColleges(allColleges.sort());
    } catch (error) {
      console.log("Error fetching colleges, using predefined list:", error);
      // Fallback to predefined list if API fails
      setColleges(CollegeName);
    } finally {
      setLoadingColleges(false);
    }
  };

  // Handle college selection
  const handleCollegeChange = (value) => {
    if (value === "Other") {
      setShowOtherCollegeInput(true);
      setFormData({ ...formData, college: "" });
    } else if (value === null || value === undefined) {
      // Handle clear selection
      setShowOtherCollegeInput(false);
      setCustomCollegeName("");
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
      const newCollegeList = [customCollegeName.trim(), ...colleges].sort();
      setColleges(newCollegeList);

      // Update form data and hide input
      setFormData({ ...formData, college: customCollegeName.trim() });
      setShowOtherCollegeInput(false);
      setCustomCollegeName("");

      // Show success message
      alert("College added successfully!");
    } catch (error) {
      console.error("Failed to add college:", error);
      alert("Failed to add college. Please try again.");
    } finally {
      setAddingCollege(false);
    }
  };

  // Parse location from address string
  const parseLocation = (locationString) => {
    if (!locationString) return { state: "", district: "" };
    const parts = locationString.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      return {
        state: parts[parts.length - 1],
        district: parts[parts.length - 2],
      };
    }
    return { state: "", district: "" };
  };

  const getDetail = async () => {
    try {
      const response = await getstudentdetail();
      console.log("modal student data", response);
      console.log("Degree options:", degreeOptions);
      console.log("States available:", states.length);

      // Parse locations
      const addressLoc = parseLocation(response.studentaddress);
      const collegeLoc = parseLocation(response.studcollegelocation);
      const hsLoc = parseLocation(response.studhighschoollocation);
      const ssLoc = parseLocation(response.studsecondaryschoollocation);

      setAddressState(addressLoc.state);
      setAddressDistrict(addressLoc.district);
      setCollegeState(collegeLoc.state);
      setCollegeDistrict(collegeLoc.district);
      setHsState(hsLoc.state);
      setHsDistrict(hsLoc.district);
      setSsState(ssLoc.state);
      setSsDistrict(ssLoc.district);

      setSelectedDegree(response.studentdegree || "");

      setFormData({
        student_name: response.studname || "",
        student_mobile_no: response.studmobileno || "",
        address: response.studentaddress || "",
        language: response.studprogramminglang || "",
        student_email: response.studemail || "",
        project_description: response.studprojectdecription || "",
        college: response.studentcollegename || "",
        education: response.studentdegree || "",
        field_of_study: response.studentfieldofstudy || "",
        college_location: response.studcollegelocation || "",
        hsc_name: response.studhighschollname || "",
        hsc_location: response.studhighschoollocation || "",
        hsc_percentage: response.studhighschoolpercentage || "",
        sslc_name: response.studentsecondaryschoolname || "",
        sslc_location: response.studsecondaryschoollocation || "",
        sslc_percentage: response.studentsecondaryschoolpercentage || "",
        start_year: response.studcollegestartyear || "",
        // end_year: response.studcollegeendyear || "",
        student_image: null,
        existing_image_url: response.studprofile || "",
        date_of_birth: response.studdob ? response.studdob.split("T")[0] : "",
        gender: response.studgender || "",
      });
    } catch (error) {
      console.log("error while get student detail modal:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formObject = new FormData();

    formObject.append("studname", formData.student_name);
    formObject.append("studmobileno", formData.student_mobile_no);
    formObject.append("studentaddress", `${addressDistrict}, ${addressState}`);
    formObject.append("studprogramminglang", formData.language);
    formObject.append("studemail", formData.student_email);
    formObject.append("studprojectdecription", formData.project_description);
    formObject.append("studentcollegename", formData.college);
    formObject.append("studentdegree", formData.education);
    formObject.append("studentfieldofstudy", formData.field_of_study);
    formObject.append(
      "studcollegelocation",
      `${collegeDistrict}, ${collegeState}`
    );
    formObject.append("studhighschollname", formData.hsc_name);
    formObject.append("studhighschoollocation", `${hsDistrict}, ${hsState}`);
    formObject.append("studhighschoolpercentage", formData.hsc_percentage);
    formObject.append("studentsecondaryschoolname", formData.sslc_name);
    formObject.append(
      "studsecondaryschoollocation",
      `${ssDistrict}, ${ssState}`
    );
    formObject.append(
      "studentsecondaryschoolpercentage",
      formData.sslc_percentage
    );
    formObject.append("studcollegestartyear", formData.start_year);
    // formObject.append("studcollegeendyear", formData.end_year);
    formObject.append("studdob", formData.date_of_birth);
    formObject.append("studgender", formData.gender);

    if (formData.student_image) {
      formObject.append("studprofile", formData.student_image);
    } else if (formData.existing_image_url) {
      formObject.append("studprofile", formData.existing_image_url);
    }

    try {
      const response = await updatestudentdetail(formObject);
      console.log("updated student detail", response);
      if (response.message === "Student updated successfully") {
        alert("Profile updated successfully!");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.log("Error while update student detail", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="custom-modalone"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-custom">
          Edit <span className="text-black">Your Current Details.</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5">
        <div className="row">
          <div className="col-12 d-flex flex-column gap-3">
            {/* Profile Image */}
            <div>
              <label className="form-label">Student Image</label>
              <div>
                {formData.student_image ? (
                  <img
                    src={URL.createObjectURL(formData.student_image)}
                    alt="Preview"
                    className="mt-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : formData.existing_image_url ? (
                  <img
                    src={`${process.env.REACT_APP_BASE_IMG_URL}/${formData.existing_image_url}`}
                    alt="Current"
                    className="mt-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="text-muted mt-2">No image available</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="btn btn-success mt-2"
                onClick={() => fileInputRef.current.click()}
              >
                Edit Profile Image
              </button>
            </div>

            {/* Name */}
            <div>
              <label>Name</label>
              <input
                className="form-control"
                value={formData.student_name}
                onChange={(e) =>
                  setFormData({ ...formData, student_name: e.target.value })
                }
              />
            </div>

            {/* Mobile */}
            <div>
              <label>Mobile Number</label>
              <input
                className="form-control"
                value={formData.student_mobile_no}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    student_mobile_no: e.target.value,
                  })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label>Student E-mail</label>
              <input
                className="form-control"
                type="email"
                value={formData.student_email}
                onChange={(e) =>
                  setFormData({ ...formData, student_email: e.target.value })
                }
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label>Date of Birth</label>
              <input
                className="form-control"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
            </div>

            {/* Gender */}
            <div>
              <label>Gender</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Gender"
                value={formData.gender}
                onChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                allowClear
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* Address State */}
            <div>
              <label>Address State</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select State"
                value={addressState}
                onChange={(value) => {
                  setAddressState(value);
                  setAddressDistrict("");
                }}
                options={states.map((state) => ({
                  label: state,
                  value: state,
                }))}
                showSearch
                allowClear
                optionFilterProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* Address District */}
            <div>
              <label>Address District</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select District"
                value={addressDistrict}
                onChange={(value) => setAddressDistrict(value)}
                options={
                  addressState
                    ? getDistricts(addressState).map((district) => ({
                        label: district,
                        value: district,
                      }))
                    : []
                }
                showSearch
                allowClear
                optionFilterProp="label"
                disabled={!addressState}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* Skills */}
            <div>
              <label>Skills</label>
              <input
                className="form-control"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                placeholder="e.g., JavaScript, Python, React"
              />
            </div>

            {/* Degree */}
            <div>
              <label>Degree</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Degree"
                value={selectedDegree}
                onChange={(value) => {
                  setSelectedDegree(value);
                  setFormData({
                    ...formData,
                    education: value,
                    field_of_study: "",
                  });
                }}
                options={degreeOptions}
                showSearch
                allowClear
                optionFilterProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* Field of Study */}
            {selectedDegree && (
              <div>
                <label>Field of Study</label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Field of Study"
                  value={formData.field_of_study}
                  onChange={(value) =>
                    setFormData({ ...formData, field_of_study: value })
                  }
                  options={getFieldOfStudyOptions()}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  getPopupContainer={(trigger) => trigger.parentNode}
                />
              </div>
            )}

            {/* College */}
            <div>
              <label>College Name</label>
              <Select
                style={{ width: "100%" }}
                placeholder={
                  loadingColleges ? "Loading colleges..." : "Select College"
                }
                options={collegeOptions}
                value={showOtherCollegeInput ? "Other" : formData.college}
                onChange={handleCollegeChange}
                allowClear
                showSearch
                optionFilterProp="label"
                loading={loadingColleges}
                disabled={loadingColleges}
                getPopupContainer={(trigger) => trigger.parentNode}
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowOtherCollegeInput(false);
                        setCustomCollegeName("");
                        setFormData({ ...formData, college: "" });
                      }}
                      disabled={addingCollege}
                    >
                      Cancel
                    </button>
                  </div>
                  <small className="text-muted">
                    Enter your college name and click "Add College" to add it to
                    the list
                  </small>
                </div>
              )}
            </div>

            {/* College State */}
            <div>
              <label>College State</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select State"
                value={collegeState}
                onChange={(value) => {
                  setCollegeState(value);
                  setCollegeDistrict("");
                }}
                options={states.map((state) => ({
                  label: state,
                  value: state,
                }))}
                showSearch
                allowClear
                optionFilterProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* College District */}
            <div>
              <label>College District</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select District"
                value={collegeDistrict}
                onChange={(value) => setCollegeDistrict(value)}
                options={
                  collegeState
                    ? getDistricts(collegeState).map((district) => ({
                        label: district,
                        value: district,
                      }))
                    : []
                }
                showSearch
                allowClear
                optionFilterProp="label"
                disabled={!collegeState}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* Start Year */}
            <div>
              <label>Start Year</label>
              <input
                className="form-control"
                type="number"
                value={formData.start_year}
                onChange={(e) =>
                  setFormData({ ...formData, start_year: e.target.value })
                }
              />
            </div>

            {/* End Year */}
            {/* <div>
              <label>End Year</label>
              <input
                className="form-control"
                type="number"
                value={formData.end_year}
                onChange={(e) =>
                  setFormData({ ...formData, end_year: e.target.value })
                }
              />
            </div> */}

            {/* HSC School */}
            <div>
              <label>Higher Secondary School</label>
              <input
                className="form-control"
                value={formData.hsc_name}
                onChange={(e) =>
                  setFormData({ ...formData, hsc_name: e.target.value })
                }
              />
            </div>

            {/* HSC State */}
            <div>
              <label>HSC State</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select State"
                value={hsState}
                onChange={(value) => {
                  setHsState(value);
                  setHsDistrict("");
                }}
                options={states.map((state) => ({
                  label: state,
                  value: state,
                }))}
                showSearch
                allowClear
                optionFilterProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* HSC District */}
            <div>
              <label>HSC District</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select District"
                value={hsDistrict}
                onChange={(value) => setHsDistrict(value)}
                options={
                  hsState
                    ? getDistricts(hsState).map((district) => ({
                        label: district,
                        value: district,
                      }))
                    : []
                }
                showSearch
                allowClear
                optionFilterProp="label"
                disabled={!hsState}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* HSC Percentage */}
            <div>
              <label>HSC Percentage</label>
              <input
                className="form-control"
                type="number"
                value={formData.hsc_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, hsc_percentage: e.target.value })
                }
              />
            </div>

            {/* SSLC School */}
            <div>
              <label>Secondary School</label>
              <input
                className="form-control"
                value={formData.sslc_name}
                onChange={(e) =>
                  setFormData({ ...formData, sslc_name: e.target.value })
                }
              />
            </div>

            {/* SSLC State */}
            <div>
              <label>SSLC State</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select State"
                value={ssState}
                onChange={(value) => {
                  setSsState(value);
                  setSsDistrict("");
                }}
                options={states.map((state) => ({
                  label: state,
                  value: state,
                }))}
                showSearch
                allowClear
                optionFilterProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* SSLC District */}
            <div>
              <label>SSLC District</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select District"
                value={ssDistrict}
                onChange={(value) => setSsDistrict(value)}
                options={
                  ssState
                    ? getDistricts(ssState).map((district) => ({
                        label: district,
                        value: district,
                      }))
                    : []
                }
                showSearch
                allowClear
                optionFilterProp="label"
                disabled={!ssState}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </div>

            {/* SSLC Percentage */}
            <div>
              <label>SSLC Percentage</label>
              <input
                className="form-control"
                type="number"
                value={formData.sslc_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, sslc_percentage: e.target.value })
                }
              />
            </div>

            {/* Project Description */}
            <div>
              <label>Project Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.project_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_description: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Updating..." : "Save Changes"}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentProfileModal;
