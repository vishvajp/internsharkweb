import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

export const getIndustryDetail = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/industry/getindustrylist`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // ✅ Return only the data (common practice)
  } catch (error) {
    console.error("Error fetching industry details:", error);
    throw error; // ✅ Let the caller handle the error
  }
};

export const getIndustryDetailbyid = async (industryId, filters = {}) => {
  const studentId = localStorage.getItem("stuid") || null;

  // destructure safely with defaults
  const {
    companystate = "",
    companycity = "",
    studentqualification = "",
    fieldofstudy = "",
  } = filters;

  try {
    const response = await axios.post(
      `${BASE_URL}/getjob/industry/${industryId}`,
      {
        studentId,
        companystate,
        companycity,
        studentqualification,
        fieldofstudy,
      }
    );

    return response.data.jobs;
  } catch (error) {
    console.error("Error while fetching industry detail:", error);
    throw error;
  }
};
