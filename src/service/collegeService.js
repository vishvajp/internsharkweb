import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

// Get all colleges
export const getAllColleges = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/colleges`);
    return response.data.colleges;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error;
  }
};

// Add new college
export const addNewCollege = async (collegeName) => {
  try {
    const response = await axios.post(`${BASE_URL}/colleges`, {
      name: collegeName,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding college:", error);
    throw error;
  }
};
