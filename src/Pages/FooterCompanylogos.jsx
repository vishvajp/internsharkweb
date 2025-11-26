import React from 'react'
import sample from '../Images/infosys-logo.png.original.png'
import sampleone from '../Images/amazon-512.webp'
import sampletwo from '../Images/HCL_Technologies-Logo.wine.png'
import samplethree from '../Images/Cognizant_logo_2022.svg.png'
import samplefour from '../Images/6784a67d487bc5aeb1bbd115_66e9036fc1264929aa2b709f_63e36358b9ea27326ff510d5_Logo-True-Colors-original.png'

const FooterCompanylogos = () => {
  return (
    <div className='container-fluid footercompanylogorowbox py-4'>
  <div className="container">
    <div className="row justify-content-center">
      {/* Repeat for each logo */}
      {[sample, sampleone, sampletwo, samplethree, samplefour].map((imgSrc, index) => (
        <div className="col-12 col-lg-2 mb-4 d-flex justify-content-center" key={index}>
          <div className="footerlogoouterbackground">
            <img src={imgSrc} className='img-fluid' alt={`Logo ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  )
}

export default FooterCompanylogos