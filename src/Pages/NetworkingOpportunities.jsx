import React from 'react'
import Fileimage from '../Images/fileimage.png'
import femalesitting from '../Images/femalestudingimage.png'
import Trust from '../Images/trust (1).png'
import Diverge from '../Images/diverse.png'
import Carreer from '../Images/carreer.png'
import Network from '../Images/networking.png'

const NetworkingOpportunities = () => {

    const steps = [
  {
    title: "Trusted Internship Portal",
    description: "Verified internships from trusted companies.",
    image: Trust,
  },
  {
    title: "Diverse Internship Listings",
    description: "Remote, part-time, and full-time options.",
    image: Diverge,
  },
  {
    title: "Career Growth",
    description: "Gain hands-on industry experience.",
    image: Carreer,
  },
  {
    title: "Networking Opportunities",
    description: "Connect with professionals and mentors.",
    image: Network,
  },
];

    return (
        <div className='container py-5'>
  <div className='row align-items-center'>
    {/* Left Content: Steps */}
    <div className='col-12 col-lg-6 order-2 order-lg-1'>
      <div className='text-center text-lg-start mb-4 mb-lg-0'>
        <h2 className="fw-bold display-6 mb-3 how-it-works-title">How It Works</h2>
        <div className='yellowdot mb-3 mx-lg-0 mx-auto'></div>
      </div>

      <div className='row'>
        {steps.map((step, index) => (
          <div className='col-12 mb-4' key={index}>
            <div className="row">
  <div className="col-4 mx-auto">
    <div className="howworkiconouter p-2 d-flex justify-content-center align-items-center">
      <img
        src={step.image}
        alt={step.title}
        className="img-fluid howworkicons"
      />
    </div>
  </div>
  <div className="col-12 col-md-8 ps-0 ps-md-4 mt-2 mt-md-0 d-flex justify-content-center justify-content-md-start">
    <div className="how-it-works-hover-wrapper d-flex flex-column justify-content-center text-center text-md-start">
      <h5 className="fw-bold mb-1 how-it-works-step-title">{step.title}</h5>
      <p className="mb-0 text-secondary how-it-works-step-content">{step.description}</p>
    </div>
  </div>
</div>

          </div>
        ))}
      </div>
    </div>

    {/* Right Image */}
    <div className='col-12 col-lg-6 order-1 order-lg-2 d-flex justify-content-center mb-4 mb-lg-0'>
      <img
        src={femalesitting}
        alt="Illustration"
        className='img-fluid Illustrationimage'
      />
    </div>
  </div>
</div>

    )
}

export default NetworkingOpportunities