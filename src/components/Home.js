import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true"; // Use sessionStorage
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="home-page">
        <h1 className="home-heading">Welcome to VCET Placement Portal!</h1>
        <button className="home-button" onClick={() => navigate("/companies")}>
          Manage Companies
        </button>
        <button className="home-button" onClick={() => navigate("/students")}>
          Manage Students
        </button>
      </div>
    </div>
  );
};

export default Home;
