import { Route, Routes } from "react-router-dom";

import Admins from "./components/Admin/Admins/Admins";
import Candidates from "./components/Admin/Candidates/Candidates";
import Companies from "./components/Admin/Companies/Companies";
import Dashboard from "./components/Admin/Dashboard/DashBoard";
import Employers from "./components/Admin/Employers/Employers";
import CompanyProfile from "./pages/CompanyProfile/CompanyProfile";
import PostedJob from "./components/Admin/PostedJob/PostedJob";
import Admin from "./pages/Admin/Admin";
import Employer from "./pages/Employer/Employer";
import CandidateSignUp from "./pages/CandidateSignUp/CandidateSignUp";
import CVManagementPage from './pages/CVManagement/CVManagementPage';
import EmployerSignUp from "./pages/EmployerSignUp/EmployerSignUp";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import EmployeerIndex from "./pages/EmployerIndex/EmployeerIndex";

import CompanyJob from "./components/Employer/Job/Job";
import CompanyJobDetail from "./components/Employer/Job-Detail/Job-Detail";
import CompanyJobEdit from "./components/Employer/Job-Edit/Job-Edit";
import CompanyJobPost from "./components/Employer/Job-Post/Job-Post";
import EmployerProfile from "./components/Employer/Employer-Profile/Employer-Profile";
import CompanyEditProflie from "./components/Employer/Company-EditProfile/Company-EditProfile";
import CompanyProflie from "./components/Employer/Company-Profile/Company-Profile";
import CompanyChat from "./components/Employer/Chat/Chat";
import CompanyCandidateProflie from "./components/Employer/Candidate-Profile/Candidate-Profile";
import CompanyCandidateList from "./components/Employer/Candidate-List/Candidate-List";
import History from "./components/Admin/History/History";


import { ConfigProvider } from "antd";
import { themes } from "./helper";
import Account from "./components/Admin/Account/Account";

function App() {
  return (
    <div className="App">
      <ConfigProvider theme={themes}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer/index" element={<EmployeerIndex />} />
          <Route path="/candidate/sign-up" element={<CandidateSignUp />} />
          <Route path="/company/company-profile" element={<CompanyProfile />} />

          <Route path="/employer" element={<Employer />}>
            <Route path="company-profile" index element={<CompanyProflie />} />
            <Route path="company-editprofile" index element={<CompanyEditProflie />} />
            <Route path="companyjob-detail" index element={<CompanyJobDetail />} />
            <Route path="companyjob-edit" index element={<CompanyJobEdit />} />
            <Route path="companyjob-post" index element={<CompanyJobPost />} />
            <Route path="companyjob" index element={<CompanyJob />} />
            <Route path="employer-profile" index element={<EmployerProfile />} />
            <Route path="chat" index element={<CompanyChat />} />
            <Route path="candidate-profile" index element={<CompanyCandidateProflie />} />
            <Route path="candidate-list" index element={<CompanyCandidateList />} />
          </Route>

          <Route path="/employer/sign-up" element={<EmployerSignUp />} />
          <Route path="admin/" element={<Admin />}>
            <Route path="dashboard" index element={<Dashboard />} />
            <Route path="management/candidates" element={<Candidates />} />
            <Route path="management/employers" element={<Employers />} />
            <Route path="management/admins" element={<Admins />} />
            <Route path="management/companies" element={<Companies />} />
            <Route path="management/posted-job" element={<PostedJob />} />
            <Route path="account" element={<Account />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/verify/:status" element={<VerifyEmail />} />
          <Route path="/cv-management" element={<CVManagementPage />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
}

export default App;
