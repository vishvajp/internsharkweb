import React, { useEffect, useState } from "react";
import "./RecruiterProfileUpdate.css";
import Header from "../Layouts/Header";
import Footer from "../Layouts/Footer";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import RecruiterProfileModal from "./RecruiterProfileModal";
import { getrecruiterdetail } from "../service/profileupdate";

const RecruiterProfileUpdate = () => {
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  const recruiterType = localStorage.getItem("recruiter_type");

  console.log("rectype", recruiterType);
  const [recruiterDetail, setRecruiterDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleIconClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  //apis
  //recruiter detail

  // useEffect(() => {
  //   const getrecruiterdetail = async () => {
  //     try {
  //       const recruiter_token = localStorage.getItem('recruiter_token');
  //       if (!recruiter_token) {
  //         console.error('No recruiter token found');
  //         return;
  //       }

  //       const response = await axios.post(
  //         `${baseurl}/get_Rec_Com_ComDoc`,
  //         {},
  //         {
  //           headers: {
  //             'Authorization': `Bearer ${recruiter_token}`,
  //             'Content-Type': 'application/json',
  //           }
  //         }
  //       );

  //       const recruiterDetail = response.data.data;
  //       if (recruiterDetail) {
  //         setRecruiterDetail(recruiterDetail);
  //         console.log('check company id',recruiterDetail);
  //         localStorage.setItem("company_id",recruiterDetail.company.company_id);
  //         console.log('recruiterdetail', recruiterDetail);
  //         const companyid=localStorage.getItem('company_id');
  //         console.log('companyid')
  //       } else {
  //         console.error('No recruiter details found in response');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching recruiter details:', error);
  //     }
  //     finally {
  //         setLoading(false);
  //       }
  //   };

  //   getrecruiterdetail();
  // }, [baseurl]);

  const test = async () => {
    try {
      setLoading(true);
      const response = await getrecruiterdetail();
      console.log("recruiter data from node", response);
      setRecruiterDetail(response);
    } catch (error) {
      console.log("error while fetch recruiter data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // getdetail();
    test();
  }, []);

  return (
    <>
      <Header></Header>
      <div className="container-fluid recruiterprofiledetailbackground">
        <div className="container profileupdatecard mt-5 p-5">
          {/* {recruiterType === 'Primary' && ( */}
          <div className="row d-flex justify-content-end">
            <div className="col-1">
              <FaUserEdit
                className="profileicons"
                onClick={handleIconClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          {/* )} */}
          <div className="row">
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "200px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recruiterDetail ? (
              <div>
                <div>
                  <strong>Company Name:</strong>{" "}
                  {recruiterDetail.reccompanyname}
                </div>
                <div>
                  <strong>Recruiter Name:</strong> {recruiterDetail.recname}
                </div>
                <div>
                  <strong>Address:</strong> {recruiterDetail.reccompanyaddress}
                </div>
                <div>
                  <strong>Pincode:</strong> {recruiterDetail.reccompanypincode}
                </div>
                <hr className="mt-2 mb-2" />
                <div>
                  <strong>Primary Number:</strong> {recruiterDetail.recmobileno}
                </div>
                <div>
                  <strong>Secondary Number:</strong>{" "}
                  {recruiterDetail.recsecondarymobileno}
                </div>
                <div>
                  <strong>E-Mail:</strong> {recruiterDetail.reccompanyemail}
                </div>
                <div>
                  <strong>Recruiter Description:</strong>{" "}
                  {recruiterDetail.recdesignation}
                </div>
                <div>
                  <strong>Employees Count:</strong>{" "}
                  {recruiterDetail.reccompanysize}
                </div>
              </div>
            ) : (
              <p>No data found.</p>
            )}
          </div>
        </div>
      </div>
      <RecruiterProfileModal
        show={showModal}
        handleClose={handleCloseModal}
      ></RecruiterProfileModal>
      <Footer></Footer>
    </>
  );
};

export default RecruiterProfileUpdate;
