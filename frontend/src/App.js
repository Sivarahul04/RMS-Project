import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Pages/Login';
import Newuser from "./Pages/Newuser";
import Forgot from "./Pages/Forgot";
import UserDashboard from "./Pages/UserDashboard";
import ViewRequest from "./Pages/ViewRequest";
import RaiseRequest from "./Pages/RaiseRequest";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageUsers from "./Pages/ManageUsers";
import ManageServices from "./Pages/ManageServices";
import ManageRequest from "./Pages/ManageRequest";
import SuperAdminDashboard from "./Pages/SuperAdminDashboard";
import SuperAdminReports from "./Pages/SuperAdminReports";

import RequestDetail from "./Pages/RequestDetail";

import EditRequest from "./Pages/EditRequest";
import RequestsPage from "./Pages/RequestsPage";
import ManageAdmin from "./Pages/ManageAdmin";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />   {/* ✅ added */}
          <Route path="/newuser" element={<Newuser />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/raiserequest" element={<RaiseRequest />} />
          <Route path="/viewrequest" element={<ViewRequest />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/manageusers" element={<ManageUsers />} />
          <Route path="/manageservices" element={<ManageServices />} />
          <Route path="/managerequests" element={<ManageRequest />} />
          <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />
          <Route path="/reports" element={<SuperAdminReports />} />
          <Route path="/requestdetail/:id" element={<RequestDetail />} />
          <Route path="/editrequest/:id" element={<EditRequest />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/admin" element={<ManageAdmin />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
