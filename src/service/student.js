import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;


//get all student detail
export const getstudent = async (formData = {}) => {
  const rectoken = localStorage.getItem("recruiter_token");

  try {
    // Clean out empty fields before sending
    const cleanFormData = {};
    if (formData.studentdegree) cleanFormData.studentdegree = formData.studentdegree;
    if (formData.studentcollegename) cleanFormData.studentcollegename = formData.studentcollegename;
    if (formData.studcityname) cleanFormData.studcityname = formData.studcityname;

    // ✅ Send as query params
    const response = await axios.get(`${BASE_URL}/student/getallstudentdetail`, {
      params: cleanFormData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rectoken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error while fetching student detail", error);
  }
};



//get student detail by student id
export const getstudentdetail = async (Studentid) => {
  try {
    // const Studentid = localStorage.getItem("stuid");
    // const token = localStorage.getItem('token');

    const response = await axios.post(
      `${BASE_URL}/student/getById`,
      { studentId: Studentid }, // 👈 send ID in the body
      {
        headers: {
        //   'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("getstudent error", error);
  }
};

