import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Hospitals from './pages/Hospitals.jsx';
import HospitalDetail from './pages/HospitalDetail.jsx';
import Doctors from './pages/Doctors.jsx';
import DoctorDetail from './pages/DoctorDetail.jsx';
import Treatments from './pages/Treatments.jsx';
import TreatmentDetail from './pages/TreatmentDetail.jsx';
import Saved from './pages/Saved.jsx';
import Compare from './pages/Compare.jsx';
import ConsultationRequest from './pages/ConsultationRequest.jsx';
import ConsultationConfirmation from './pages/ConsultationConfirmation.jsx';
import Appointments from './pages/Appointments.jsx';
import ConsultationRequests from './pages/ConsultationRequests.jsx';
import Messages from './pages/Messages.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Auth pages render without the app chrome. */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        {/* Public discovery */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:id" element={<HospitalDetail />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:id" element={<TreatmentDetail />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/consultation" element={<ConsultationRequest />} />
        <Route path="/consultation/success" element={<ConsultationConfirmation />} />

        {/* Patient area (requires sign-in) */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <ConsultationRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
