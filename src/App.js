// App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import CompanyPage from "./pages/CompanyPage";
import CompanyDetails from "./pages/CompanyDetails";
import RoundsPage from "./pages/RoundsPage";
import ManageStudents from "./pages/ManageStudents";
import StudentDetails from "./pages/StudentDetails";
import StudentAnalysis from "./pages/StudentAnalysis";
import Landingpage from "./pages/Landingpage";

// pages
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./pages/Navbar"; // ← Our new reusable Navbar

// Layout for protected pages (includes Navbar)
const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {" "}
        {/* pt-16 gives space below fixed navbar */}
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />

          {/* All protected routes — wrapped with ProtectedRoute AND get Navbar */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/home"
              element={
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedLayout>
                  <CompanyPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/company/:id"
              element={
                <ProtectedLayout>
                  <CompanyDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/company/:id/rounds"
              element={
                <ProtectedLayout>
                  <RoundsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedLayout>
                  <ManageStudents />
                </ProtectedLayout>
              }
            />
            <Route
              path="/student/:id"
              element={
                <ProtectedLayout>
                  <StudentDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/students/analysis"
              element={
                <ProtectedLayout>
                  <StudentAnalysis />
                </ProtectedLayout>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
