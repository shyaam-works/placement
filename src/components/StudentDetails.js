import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import API_URL from "../config";
import "./StudentDetails.css";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate(); // Added for navigation

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true"; // Use sessionStorage
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }
    fetchStudentDetails();
  }, [navigate]);

  const fetchStudentDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/${id}`);
      setStudent(res.data.data.user);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  if (!student) return <div className="loading">Loading...</div>;

  const leetcodeImageUrl = `https://leetcode-stats.vercel.app/api?username=${student.Username}&theme=dark`;

  return (
    <div className="student-details-container">
      <h1 className="student-name">{student.username}</h1>

      <div className="student-grid">
        <div className="detail-box">
          <strong>Graduation Degree:</strong> {student["Graduation Degree"]}
        </div>
        <div className="detail-box">
          <strong>Mobile Number:</strong> {student["Mobile Number"]}
        </div>
        <div className="detail-box">
          <strong>Email ID:</strong> {student["Email ID"]}
        </div>
        <div className="detail-box">
          <strong>X %:</strong> {student["X % "]}
        </div>
        <div className="detail-box">
          <strong>XII %:</strong> {student["XII % "]}
        </div>
        <div className="detail-box">
          <strong>UG Specialization:</strong> {student["UG SPECIALIZATION"]}
        </div>
        <div className="detail-box">
          <strong>Aggregate UG:</strong> {student["Aggregate UG"]}
        </div>
        <div className="detail-box">
          <strong>Easy Questions:</strong> {student["EASY"]}
        </div>
        <div className="detail-box">
          <strong>Medium Questions:</strong> {student["MEDUIM"]}
        </div>
        <div className="detail-box">
          <strong>Hard Questions:</strong> {student["HARD"]}
        </div>
      </div>

      <div className="leetcode-profile">
        <h2>LeetCode Profile</h2>
        <a
          href={student["LEETCODE LINK"]}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          View Profile
        </a>
        <img
          src={leetcodeImageUrl}
          alt="LeetCode Stats"
          className="leetcode-img"
        />
      </div>

      <h2>Companies Attended</h2>
      <ul className="companies-list">
        {student.companies.map((company, index) => (
          <li key={index}>
            {company.companyname} - {company.rounds.length}{" "}
            {company.rounds.length === 1 ? "round" : "rounds"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDetails;
