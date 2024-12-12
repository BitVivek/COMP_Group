import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import NurseDashboard from "./pages/NurseDashboard";
import AddVitals from "./pages/AddVitals";
import ViewVitals from "./pages/ViewVitals";
import SendTips from "./pages/SendTips";
import MedicalAnalysis from "./pages/MedicalAnalysis";

import PatientDashboard from "./pages/PatientDashboard";
import EmergencyAlert from "./pages/EmergencyAlert";
import DailyMetrics from "./pages/DailyMetrics";
import SymptomChecklist from "./pages/SymptomChecklist";

// Inside Routes

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/nurse/add-vitals" element={<AddVitals />} />
        <Route path="/nurse/view-vitals" element={<ViewVitals />} />
        <Route path="/nurse/send-tips" element={<SendTips />} />
        <Route path="/nurse/analysis" element={<MedicalAnalysis />} />

        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/emergency-alert" element={<EmergencyAlert />} />
        <Route path="/patient/daily-metrics" element={<DailyMetrics />} />
        <Route path="/patient/symptoms" element={<SymptomChecklist />} />
      </Routes>
    </Router>
  );
};

export default App;
