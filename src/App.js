import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CompanyPage from "./components/CompanyPage";
import CompanyDetails from "./components/CompanyDetails";
import RoundsPage from "./components/RoundsPage";
import ManageStudents from "./components/ManageStudents";
import StudentDetails from "./components/StudentDetails";
import StudentAnalysis from "./components/StudentAnalysis"; // Import new page
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/company/:id/rounds" element={<RoundsPage />} />
          <Route path="/students" element={<ManageStudents />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/students/analysis" element={<StudentAnalysis />} />{" "}
        </Route>
        {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
