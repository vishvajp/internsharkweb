import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

// Submit contact form
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/contact`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Contact form submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting contact form:", error);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message || "Failed to submit contact form";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error("An unexpected error occurred");
    }
  }
};
