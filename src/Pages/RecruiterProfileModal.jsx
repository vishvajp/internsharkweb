import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./StudentProfileModal.css";
import {
  getrecruiterdetail,
  updaterecruiterdetail,
} from "../service/profileupdate";

const StudentProfileModal = ({ show, handleClose }) => {
  const imgurl = process.env.REACT_APP_BASE_IMG_URL;
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    company_address: "",
    company_pinCode: "",
    no_of_employees: "",
    recruiter_designation: "",
    recruiter_email: "",
    recruiter_name: "",
    recruiter_phone: "",
    secondery_phone: "",
    company_logo: null,
    logoFile: null,
  });

  // Fetch student data once modal opens
  useEffect(() => {
    if (show) {
      getDetail();
    }
  }, [show]);

  //php backend get recruiter
  //   const getDetail = async () => {

  //       try {
  //         const recruiter_token = localStorage.getItem('recruiter_token');
  //         const response = await axios.post(`${baseurl}/get_Rec_Com_ComDoc`, {}, {
  //           headers: {
  //             Authorization: `Bearer ${recruiter_token}`,
  //             'Content-Type': 'application/json',
  //           }
  //         });

  //         const RecruiterData = response.data.data;
  //         setFormData({
  //           company_name: RecruiterData.recruiter.company_name || '',
  //           company_address: RecruiterData.recruiter.company_address || '',
  //           company_pinCode: RecruiterData.recruiter.company_pinCode || '',
  //           hiring_for: RecruiterData.recruiter.hiring_for || '',
  //           no_of_employees: RecruiterData.recruiter.no_of_employees || '',
  //           recruiter_designation: RecruiterData.recruiter.recruiter_designation || '',
  //           recruiter_email: RecruiterData.recruiter.recruiter_email || '',
  //           recruiter_name: RecruiterData.recruiter.recruiter_name || '',
  //           recruiter_phone: RecruiterData.recruiter.recruiter_phone || '',
  //           secondery_phone: RecruiterData.recruiter.secondery_phone || '',
  // });

  //         localStorage.setItem('recruiterprofiledata', JSON.stringify(RecruiterData));
  //       } catch (error) {
  //         console.error('Error fetching student details:', error);
  //       }
  //     };

  //node backend connect get recruiter
  const getDetail = async () => {
    try {
      const response = await getrecruiterdetail();
      console.log("model data", response);

      setFormData({
        company_name: response.reccompanyname || "",
        company_address: response.reccompanyaddress || "",
        company_pinCode: response.reccompanypincode || "",
        no_of_employees: response.reccompanysize || "",
        recruiter_designation: response.recdesignation || "",
        recruiter_email: response.reccompanyemail || "",
        recruiter_name: response.recname || "",
        recruiter_phone: response.recmobileno || "",
        secondery_phone: response.recsecondarymobileno || "",
        company_logo: response.reccompanylogo || null,
        logoFile: null,
      });

      // Set logo preview if exists
      if (response.reccompanylogo) {
        setLogoPreview(`${imgurl}/${response.reccompanylogo}`);
      }
    } catch (error) {
      console.log("error fetch recruiter detail", error);
    }
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          logoFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //php bcakend update
  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     const recruiter_token = localStorage.getItem('recruiter_token');
  //     const formDataToSend = new FormData();

  //     Object.entries(formData).forEach(([key, value]) => {
  //       formDataToSend.append(key, value);
  //     });

  //     const response = await axios.post(
  //       `${baseurl}/editRecruiter`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${recruiter_token}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     alert('Profile updated successfully!');
  //     handleClose();
  //     window.location.reload();

  //     if (response.data.data) {
  //       localStorage.setItem('recruiterprofiledata', JSON.stringify(response.data.data));

  //     }

  //   } catch (error) {
  //     console.error('Error saving profile:', error.response?.data || error.message);
  //     alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  //node backend
  const handleSave = async () => {
    setIsSaving(true);
    const formObject = new FormData();

    formObject.append("reccompanyname", formData.company_name);
    formObject.append("reccompanyaddress", formData.company_address);
    formObject.append("reccompanypincode", formData.company_pinCode);
    formObject.append("reccompanysize", formData.no_of_employees);
    formObject.append("recdesignation", formData.recruiter_designation);
    formObject.append("reccompanyemail", formData.recruiter_email);
    formObject.append("recname", formData.recruiter_name);
    formObject.append("recmobileno", formData.recruiter_phone);
    formObject.append("recsecondarymobileno", formData.secondery_phone);

    // Add logo file if changed
    if (formData.logoFile) {
      formObject.append("reccompanylogo", formData.logoFile);
    }
    try {
      const response = await updaterecruiterdetail(formObject);
      console.log("recruiter update form response", response);
      if (response.message === "Recruiter updated successfully") {
        alert("Profile updated successfully!");
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.log("Error while updateting recruiter", error);
      alert("failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
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
            <div>
              <label className="form-label">Company Name</label>

              <input
                className="form-control"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
              />
            </div>

            <div>
              <label>Recruiter Name</label>
              <input
                className="form-control"
                value={formData.recruiter_name}
                onChange={(e) =>
                  setFormData({ ...formData, recruiter_name: e.target.value })
                }
              />
            </div>

            <div>
              <label>Primary Number</label>
              <input
                className="form-control"
                value={formData.recruiter_phone}
                onChange={(e) =>
                  setFormData({ ...formData, recruiter_phone: e.target.value })
                }
              />
            </div>

            <div>
              <label>Secondary Number</label>
              <input
                className="form-control"
                value={formData.secondery_phone}
                onChange={(e) =>
                  setFormData({ ...formData, secondery_phone: e.target.value })
                }
              />
            </div>

            <div>
              <label>Company Address</label>
              <input
                className="form-control"
                placeholder="Enter full company address"
                value={formData.company_address}
                onChange={(e) =>
                  setFormData({ ...formData, company_address: e.target.value })
                }
              />
            </div>

            <div>
              <label>Company Pincode</label>
              <input
                className="form-control"
                value={formData.company_pinCode}
                onChange={(e) =>
                  setFormData({ ...formData, company_pinCode: e.target.value })
                }
              />
            </div>

            <div>
              <label>Recruiter Designation</label>
              <input
                className="form-control"
                value={formData.recruiter_designation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recruiter_designation: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label>Recruiter E-mail</label>
              <input
                className="form-control"
                value={formData.recruiter_email}
                onChange={(e) =>
                  setFormData({ ...formData, recruiter_email: e.target.value })
                }
              />
            </div>

            <div>
              <label>Employees Count</label>
              <input
                className="form-control"
                value={formData.no_of_employees}
                onChange={(e) =>
                  setFormData({ ...formData, no_of_employees: e.target.value })
                }
              />
            </div>

            <div>
              <label>Company Logo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleLogoChange}
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Updating..." : "Save Changes"}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentProfileModal;
