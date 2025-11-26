import React from 'react'
import './Certificate.css'
import studentcertificate from '../Images/1.png'
import studentcertificatetwo from '../Images/2.png'

const Certificate = () => {
  return (
    <>
<div className="container-fluid mt-5">
  <div className="worldmap d-flex align-items-center justify-content-center">
    <div className="row w-100">
      <div className="col-lg-6 d-flex align-items-center justify-content-center">
       <img className="img-fluid " src={studentcertificate} alt="Certificate 2" />
      </div>
      <div className="col-lg-6 d-flex align-items-center justify-content-center">
        <img className="img-fluid" src={studentcertificatetwo} alt="Certificate 2" />
      </div>
    </div>
  </div>
</div>




    </>
  )
}

export default Certificate