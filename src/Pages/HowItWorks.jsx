import React from 'react'
import image1 from '../Images/home-slider-1.jpg'
import Signup from '../Images/sign-up.png'
import Explore from '../Images/explore.png'
import Applyeasy from '../Images/apply.png'
import gain from '../Images/gain.png'
import styled from 'styled-components';

const HowItWorks = () => {
  return (
    <div className='container'>
        <div className='row gx-4 gy-4'>
  <div className='col-12 col-md-3'>
    <div className='exploreintern p-5 d-flex flex-column align-items-center text-center shadow-sm '>
  <div className='interimageouter p-3 mb-3 d-flex justify-content-center align-items-center'>
    <img
      src={Signup}
      alt="Internship Step"
      className='interimage'
    />
  </div>
  <h5 className="fw-bold text-white signuptextheightfix">Sign Up</h5>
  <p className="small text-white howitworkpara">Create a profile and showcase your skills</p>
</div>
  </div>
  <div className='col-12 col-md-3'>
    <div className='exploreintern p-5 d-flex flex-column align-items-center text-center shadow-sm '>
  <div className='interimageouter mb-3 p-3 d-flex justify-content-center align-items-center'>
    <img
      src={Explore}
      alt="Internship Step"
      className='interimage'
    />
  </div>
  <h5 className="fw-bold text-white signuptextheightfix">Explore Internships</h5>
  <p className="small text-white howitworkpara">Browse industry-specific internship opportunities.</p>
</div>
  </div>
  <div className='col-12 col-md-3'>
    <div className='exploreintern p-5 d-flex flex-column align-items-center text-center shadow-sm '>
  <div className='interimageouter mb-3 p-3 d-flex justify-content-center align-items-center'>
    <img
      src={Applyeasy}
      alt="Internship Step"
      className='interimage'
    />
  </div>
  <h5 className="fw-bold text-white signuptextheightfix">Apply with Ease</h5>
  <p className="small text-white howitworkpara">Submit applications in just a few clicks.</p>
</div>
  </div>
  <div className='col-12 col-md-3'>
    <div className='exploreintern p-5 d-flex flex-column align-items-center text-center shadow-sm '>
  <div className='interimageouter mb-3 p-3 d-flex justify-content-center align-items-center'>
    <img
      src={gain}
      alt="Internship Step"
      className='interimage'
    />
  </div>
  <h5 className="fw-bold text-white signuptextheightfix">Gain Experience</h5>
  <p className="small text-white howitworkpara">Work, learn, and grow with top companies.</p>
</div>
  </div>
</div>

    </div>
  )
}

export default HowItWorks