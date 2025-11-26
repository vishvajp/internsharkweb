import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;

//getjobdetail by the jobid
export const getjobdetailbyid = async (id) => {
  const studentId = localStorage.getItem("stuid"); // can be null

  try {
    // Build URL dynamically
    let url = `${BASE_URL}/jobpost/jobbyid/${id}`;
    if (studentId) {
      url += `?studentId=${studentId}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Job detail API response:", response.data);
    return response.data.job;
  } catch (error) {
    console.error("Error while fetching job detail:", error);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message || "Failed to fetch job details";
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

//get applied jobs list
export const getappliedjobs = async () => {
  const studentId = localStorage.getItem("stuid");
  try {
    const response = await axios.get(
      `${BASE_URL}/getjob/appliedjob/${studentId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.applications;
  } catch (error) {
    console.log("Error while fetching applied job", error);
    throw error;
  }
};

//apply job by id
export const applyjobbyid = async (id) => {
  const studentId = localStorage.getItem("stuid");

  if (!studentId) {
    throw new Error("Please log in to apply for jobs");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/getjob/jobs/apply`,
      {
        jobId: id,
        studentId: studentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Job applied successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error while applying for job:", error);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message || "Failed to apply for job";
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
