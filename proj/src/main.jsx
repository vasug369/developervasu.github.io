import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // Import Auth Context
import Front from "./components/Front";
import Dashboard from "./components/Dashboard";
import Test from "./components/Test";
import Actual_test from "./components/Actual_test";
import Candidate from "./components/Candidate";
import Product from "./components/Product";
import Cbt from "./components/Cbt";
import Questions from "./components/Questions";
import Lms from "./components/Lms";
import ReportComponent from "./components/ReportComponent";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Setting from "./components/Setting";


createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Front />} />

        {/* Previously Private Routes - Now Accessible */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/test" element={<Test />}>
            <Route path="actual_test" element={<Actual_test />} />
            <Route path="merge_test" element={<Actual_test />} />
            <Route path="category" element={<Actual_test />} />
          </Route>
          <Route path="/product" element={<Product />} />
          <Route path="/lms" element={<Lms />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/cbt" element={<Cbt />} />
          <Route path="/event" element={<Cbt />} />
          <Route path="/region" element={<Cbt />} />
          <Route path="/center" element={<Cbt />} />
          <Route path="/zone" element={<Cbt />} />
          <Route path="/session" element={<Cbt />} />
          <Route path="/lab" element={<Cbt />} />
          <Route path="/centre user" element={<Cbt />} />
          <Route path="/report" element={<ReportComponent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
