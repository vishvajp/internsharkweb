import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Registration.css'
import { FaArrowRightLong } from "react-icons/fa6";
import studentlogin from '../Images/student.png'
import recruiter from '../Images/recruiter.png'
import { useNavigate } from 'react-router-dom';
import ProfileLogin from './ProfileLogin';
import { useState } from 'react';

const Registration = ({ show, handleClose,openLoginModal }) => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal " size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="modal-title-custom">
                    Choose
                    <span>Your Registration Profile Here.</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className='container d-flex flex-column justify-content-center align-items-center'>
                    <div className='row d-flex justify-content-center align-items-center g-5'>
                        <div className='col-lg-4 me-lg-3 me-0 registrationcards p-5 d-flex flex-column align-items-center justify-content-center'>
                            <div>
                                <img src={studentlogin} className='login-image mb-3' alt="student login">
                                </img>
                            </div>
                            <strong className='rectext mb-3'>Students</strong>
                            <p className='text-center rectexttwo mb-4 '>Are you a student looking

                                for Internship</p>
                                <Button className='btn btn-lg p-2 w-75 rounded-5' onClick={() => {
  navigate('/studentregistration');
  window.scrollTo(0, 0);
  handleClose();
}}>start <FaArrowRightLong></FaArrowRightLong>  </Button>
                        </div>
                        <div className='col-lg-4 registrationcards p-5 d-flex flex-column align-items-center justify-content-center'>
                            <div>
                                <img src={recruiter} className='login-image mb-3' alt="student login">
                                </img>
                            </div>
                            <strong className='rectext mb-3'>Recruiter</strong>
                            <p className='text-center rectexttwo mb-4'>Are you  seeking talented Interns?</p>
                                <Button className='btn btn-lg p-2 w-75 rounded-5'
                                onClick={() => {
    navigate('/recruiterregistration');
    window.scrollTo(0, 0);
    handleClose();
  }}>start <FaArrowRightLong></FaArrowRightLong>  </Button>
                        </div>

                    </div>
                    <div className='mt-4'><small className="text-white mt-2">
    Existing User?{' '}
    <span
      onClick={openLoginModal}
      style={{ color: '#01cdcd', cursor: 'pointer', textDecoration: 'underline' }}
    >
      Log in
    </span>
  </small></div>
                    
                </div>
                
   <ProfileLogin show={showLoginModal} handleClose={() => setShowLoginModal(false)}></ProfileLogin>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    )
}

export default Registration