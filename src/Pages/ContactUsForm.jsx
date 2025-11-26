import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoGoogleplus } from "react-icons/io";
import { submitContactForm } from "../service/contact";

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setSubmitStatus("success");
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container-fluid contactusbackground py-5">
      <div className="container text-center">
        {/* Heading */}
        <h1
          className="fw-bold mb-3"
          style={{ color: "var(--secondary-color)" }}
        >
          Get in Touch
        </h1>
        <div className="yellowdot mx-auto mb-3"></div>
        <p className="mb-4">
          Fill out the form below, and our team will get back to you as soon as
          possible.
        </p>

        {/* Address */}
        <div className="mb-3">
          <FaLocationDot className="fs-2 mb-2" />
          <p className="mb-0">Chennai, Tamil Nadu - 600 001</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <IoIosMail className="fs-2 mb-2" />
          <p className="mb-0">info@internsharks.ai</p>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <a>
            <FaLinkedinIn className="fs-4 social-icon" />
          </a>
          <a>
            <FaFacebookF className="fs-4 social-icon" />
          </a>
          <a>
            <FaSquareXTwitter className="fs-4 social-icon" />
          </a>
          <a>
            <IoLogoGoogleplus className="fs-4 social-icon" />
          </a>
          <a>
            <FaInstagram className="fs-4 social-icon" />
          </a>
        </div>

        {/* form */}
        <div className="d-flex justify-content-center">
          <div className="border mt-3 w-75 bg-white rounded-lg-5 rounded p-lg-5 p-2">
            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="alert alert-success mb-4" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                Thank you for your message! We have received your inquiry and
                will get back to you within 24-48 hours.
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="alert alert-danger mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Sorry, there was an error sending your message. Please try again
                or contact us directly at info@internsharks.ai
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-md-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-5">
                  <input
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-10 ">
                  <input
                    type="subject"
                    name="subject"
                    placeholder="Subject"
                    className="form-control"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-10 ">
                  <textarea
                    type="message"
                    rows={4}
                    name="message"
                    placeholder="Type Your Message Here...."
                    className="form-control"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mt-3 justify-content-center">
                <div className="col-12 col-md-5 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsForm;
