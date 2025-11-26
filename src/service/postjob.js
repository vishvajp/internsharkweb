import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

//post new job
export const recruiterpostjob = async (formData) => {
  const token = localStorage.getItem("recruiter_token");
  const recruiterId = localStorage.getItem("recid");

  try {
    // Append recruiterId to the FormData before sending
    formData.append("recruiterId", recruiterId);

    const response = await axios.post(
      `${BASE_URL}/jobpost/recruiter-jobpost`,
      formData, // ✅ Send your form data here
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Bearer token added
        },
      }
    );

    console.log("✅ Job posted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error while posting job:", error);
    throw error;
  }
};

//recruiter to get the posted job detail
export const getrecruiterpostedjob = async () => {
  const recruiterId = localStorage.getItem("recid");
  const token = localStorage.getItem("recruiter_token");
  try {
    const response = await axios.get(
      `${BASE_URL}/jobpost/jobs/${recruiterId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.jobs;
    // console.log("jopsssssssssssssss postedddddddddd",response.data);
  } catch (error) {
    console.log("Error while get posted job detail", error);
  }
};

//update the posted job
export const updatethepostedjob = async (jobid, formData) => {
  const token = localStorage.getItem("recruiter_token");
  try {
    const response = await axios.put(
      `${BASE_URL}/jobpost/job/${jobid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while update the jobdetail", error);
    throw error;
  }
};

//recruiter to view student application list
export const getapplicationlist = async (id) => {
  const token = localStorage.getItem("recruiter_token");
  try {
    const response = await axios.get(`${BASE_URL}/getjob/jobs/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.applications;
  } catch (error) {
    console.log("Error while fetch applicant detail", error);
  }
};

//updateapplication status
export const jobststatusupdate = async (id, status) => {
  const token = localStorage.getItem("recruiter_token");
  try {
    const response = await axios.put(
      `${BASE_URL}/getjob/updatejobstatus/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while fetch applicant detail", error);
  }
};
