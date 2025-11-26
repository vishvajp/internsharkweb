import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

//request OTP for login
export const requestLoginOTP = async (mobile, userType = null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/stulogin/request-mobile-otp`,
      {
        mobile,
        userType, // 'student' or 'recruiter' (optional)
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Request OTP error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Failed to send OTP");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Error while requesting OTP");
    }
  }
};

//verify OTP for login
export const verifyLoginOTP = async (mobile, otp, userType = null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/stulogin/verify-mobile-otp`,
      {
        mobile,
        otp,
        userType, // Pass userType to check appropriate collection
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Invalid OTP");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Error while verifying OTP");
    }
  }
};

//login with mobile (after OTP verification)
export const profileLogin = async (formData) => {
  try {
    // Make POST request to backend login API
    const response = await axios.post(
      `${BASE_URL}/stulogin/login-mobile`,
      {
        mobile: formData.number,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data (usually token or user info)
    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server");
    } else {
      // Something else happened
      throw new Error("Error while logging in");
    }
  }
};

//student register
export const studentRegister = async (formObject) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/student/studregister`,
      formObject,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Register error:", error);

    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx
      throw new Error(error.response.data.message || "Register failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server");
    } else {
      // Something else happened
      throw new Error("Error while Register");
    }
  }
};

//recruiter register
export const recruiterRegister = async (formObject) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/recruiter/recruiterregister`,
      formObject,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Recruiter Register error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Register failed");
    } else if (error.request) {
      //Request was made but server not response
      throw new Error("No response from server");
    } else {
      //something else happend
      throw new Error("Error whilr Register");
    }
  }
};

//student email otp sent
export const studentEmailVerify = async (email) => {
  try {
    // Make POST request to backend login API
    const response = await axios.post(`${BASE_URL}/email/request-otp`, email, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response data (usually token or user info)
    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server");
    } else {
      // Something else happened
      throw new Error("Error while Sent OTP");
    }
  }
};

//student email verify api
export const emailverify = async ({ email, otp, userType }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/email/verify-otp`,
      { email, otp, userType }, // Include userType
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Always return the response data
    return response.data;
  } catch (error) {
    console.error("Verify Email error:", error);

    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server");
    } else {
      // Something else happened
      throw new Error("Error while Sent OTP");
    }
  }
};
