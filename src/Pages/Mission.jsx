import React from 'react'
import successimage from '../Images/mission-statement (1).png'
import opportunity from '../Images/opportunity (1) (1).png'
import styled from 'styled-components';

const Mission = () => {
  return (
   <div className='container py-5'>
  <div className='row justify-content-center gy-4'>

    {/* Our Mission */}
    <div className='col-12 col-md-6 col-lg-5 d-flex justify-content-center'>
      <div className='missionbox p-5 text-center position-relative'>
        <div className='image-wrapper-left'>
          <img 
            src={successimage}
            className='top-circle-image'
            alt="Success"
          />
        </div>
        <h4 className='fw-bold mb-3 mt-5 text-white'>Our Mission</h4>
        <p className='text-white'>We aim to connect students with impactful internship opportunities to build real-world experience and career growth.</p>
      </div>
    </div>

    {/* Our Vision */}
    <div className='col-12 col-md-6 col-lg-5 d-flex justify-content-center'>
      <div className='ourvision p-5 text-center position-relative'>
        <div className='image-wrapper-right'>
          <img 
            src={opportunity}
            className='top-circle-image'
            alt="Vision"
          />
        </div>
        <h4 className='fw-bold mb-3 mt-5 text-white'>Our Vision</h4>
        <p className='text-white'>To be the leading bridge between fresh talent and organizations seeking innovation and energy from young minds.</p>
      </div>
    </div>

  </div>
</div>


  )
}

export default Mission