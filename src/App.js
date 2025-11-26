import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./Pages/Home";
import StudentRegistration from "./Pages/StudentRegistration";
import Studentregistermultistep from "./Pages/Studentregistermultistep";
import Recruitermultipage from "./Pages/Recruitermultipage";
import About from "./Pages/About";
import UserProfileDetail from "./Pages/UserProfileDetail";
import AllIntershippage from "./Pages/AllIntershippage";
import JobDetailCenterData from "./Pages/JobDetailCenterData";
import JobFullDetailPage from "./Pages/JobFullDetailPage";
import RecruiterProfileUpdate from "./Pages/RecruiterProfileUpdate";
import StudentDetailPage from "./Pages/StudentDetailsPage";
import RecruiterJobPost from "./Pages/RecruiterJobPost";
import RecruiterPostJobPage from "./Pages/RecruiterPostJobPage";
import JobDetailCorosol from "./Pages/JobDetailCorosol";
import ContactUs from "./Pages/ContactUs";
import StudentFullDetail from "./Pages/StudentFullDetail";
import StudentAppliedJobs from "./Pages/StudentAppliedJobs";
import AllAppliedjobsByStudent from "./Pages/AllAppliedjobsByStudent";
import RecruiterActions from "./Pages/RecruiterActions";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsandCondition from "./Pages/TermsandCondition";

function App() {
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      {/* <Route path="/studentregistration" element={<StudentRegistration></StudentRegistration>}></Route> */}
      <Route
        path="/studentregistration"
        element={<Studentregistermultistep />}
      />
      <Route
        path="/recruiterregistration"
        element={<Recruitermultipage></Recruitermultipage>}
      ></Route>
      <Route path="/about" element={<About></About>}></Route>
      <Route
        path="/profile"
        element={<UserProfileDetail></UserProfileDetail>}
      ></Route>
      <Route
        path="/privacypolicy"
        element={<PrivacyPolicy></PrivacyPolicy>}
      ></Route>
      <Route
        path="/termsandconditions"
        element={<TermsandCondition></TermsandCondition>}
      ></Route>
      <Route path="/interships" element={<AllIntershippage />} />
      {/* <Route path="/internships/:industryId" element={<AllIntershippage />} /> */}
      <Route
        path="/company/:internship_id"
        element={<JobFullDetailPage></JobFullDetailPage>}
      ></Route>
      <Route
        path="/recruiterprofile"
        element={<RecruiterProfileUpdate></RecruiterProfileUpdate>}
      ></Route>
      <Route
        path="/Studentprofiles"
        element={<StudentDetailPage></StudentDetailPage>}
      ></Route>
      <Route
        path="/postjob"
        element={<RecruiterJobPost></RecruiterJobPost>}
      ></Route>
      <Route
        path="/postedjob"
        element={<RecruiterPostJobPage></RecruiterPostJobPage>}
      ></Route>
      <Route
        path="/jobs/industry/:industryId"
        element={<JobDetailCorosol />}
      ></Route>
      <Route path="/contact" element={<ContactUs></ContactUs>}></Route>

      <Route path="/studentdetail/:studentId" element={<StudentFullDetail />} />
      <Route
        path="/appliedjob"
        element={<StudentAppliedJobs></StudentAppliedJobs>}
      ></Route>
      <Route
        path="/appliedjobs"
        element={<AllAppliedjobsByStudent></AllAppliedjobsByStudent>}
      ></Route>
      <Route
        path="recruiter-actions"
        element={<RecruiterActions></RecruiterActions>}
      ></Route>
    </Routes>
    // </Router>
  );
}

export default App;
