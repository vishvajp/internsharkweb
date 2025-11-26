import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MONGO;


//get student profile data
export const getstudentdetail = async () => {
  try {
    const Studentid = localStorage.getItem("stuid");
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${BASE_URL}/student/getById`,
      { studentId: Studentid }, // 👈 send ID in the body
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("getstudent error", error);
  }
};

//get recruiter profile data
export const getrecruiterdetail = async () => {
    try{
        const recruiterid = localStorage.getItem("recid");
        const token = localStorage.getItem('recruiter_token');

        const response = await axios.post(
            `${BASE_URL}/recruiter/getrecruiterbyid`,
            { id: recruiterid},
            {
              headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },  
            }
        );

        return response.data;

    }catch(error){
        console.log("getrecruiter detail error",error)
    }
}


//update the recruiter detail
export const updaterecruiterdetail = async(formData) =>{
    try{
        const token = localStorage.getItem('recruiter_token');
        const response = await axios.put(
            `${BASE_URL}/recruiter/recruiterregisterupdate`,formData,{
                 headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },  

            }
        );
        return response.data;

    }catch(error){
        console.log("error while updating recruiter detail",error)
    }
}


//update the student detail
export const updatestudentdetail = async(formObject) =>{
    try{
        const token = localStorage.getItem('token');
        const response = await axios.put(
        `${BASE_URL}/student/studregisterupdate`,formObject,{
              headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },  
        }
    );
    return response.data;
    }catch(error){
        console.log("Error while updating recruiter detail",error);

    }
}

