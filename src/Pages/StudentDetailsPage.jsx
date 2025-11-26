import React, { useEffect, useState } from 'react';
import './StudentDetailPage.css';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import FilterStudent from './FilderStudent';
import StudentListCenter from './StudentListCenter';
import axios from 'axios';
import {getstudent} from '../service/student'

const StudentDetailsPage = () => {
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formdata,setformdata] = useState({});

  // Fetch all students once
  // useEffect(() => {
  //   const getAllStudentDetail = async () => {
  //     const recruiter_token = localStorage.getItem("recruiter_token");

  //     if (!recruiter_token) {
  //       setError("No recruiter token found");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await axios.post(
  //         `${baseurl}/getAllStudentsProfile`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${recruiter_token}`,
  //           },
  //         }
  //       );

  //       if (response.data && response.data.data) {
  //         console.log('getallstudentdetail',response.data.data);
  //         setAllStudents(response.data.data);
  //         setFilteredStudents(response.data.data);
  //       } else {
  //         setError("No data received from server");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching student details:", error);
  //       setError(error.message || "Failed to fetch student details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getAllStudentDetail();
  // }, [baseurl]);


//node to fetch the student detail
useEffect(() => {
  const getAllStudentDetail = async () => {
    try {
      const response = await getstudent(formdata);
      console.log("student detaillllllllllll", response);
      setAllStudents(response);
      setFilteredStudents(response);
    } catch (error) {
      console.log("Error while fetch student detail", error);
    } finally {
      setLoading(false);
    }
  };

  getAllStudentDetail();
}, []);

  return (
    <>
      <Header />
      <div className="container w-lg-75 p-5">
        <div className="row">
          <div className="col-12 mb-4 mb-lg-0">
            <div className="sidefilterouterbox p-3 shadow-sm rounded">
              <FilterStudent
                allStudents={allStudents}
                setFilteredStudents={setFilteredStudents}
              />
            </div>
          </div>
          <div className="col-12 mt-2">
            <div className="centerjobshowboxouter p-3 p-lg-5 bg-white rounded shadow-sm">
              <StudentListCenter
                loading={loading}
                error={error}
                students={filteredStudents}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentDetailsPage;
