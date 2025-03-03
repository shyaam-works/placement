import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config";
import "./RoundsPage.css";

const RoundsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [roundGroups, setRoundGroups] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true"; // Use sessionStorage
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    fetchCompanyDetails();
  }, [navigate]);

  const fetchCompanyDetails = async () => {
    try {
      const companyRes = await axios.get(`${API_URL}/${id}`);
      const companyData = companyRes.data.data.company;
      setCompany(companyData);

      const totalRounds = companyData.totalRounds;
      const students = companyData.students;

      const formattedRoundGroups = Array.from(
        { length: totalRounds },
        (_, index) => {
          return {
            round: `Round ${index + 1}`,
            students: students.filter((student) =>
              student.rounds.includes(`Round ${index + 1}`)
            ),
          };
        }
      );

      const selected = students.filter((student) =>
        student.rounds.includes("Selected")
      );

      setRoundGroups(formattedRoundGroups);
      setSelectedStudents(selected);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="rounds-summary">
      <h1>{company?.companyname} - Round Summary</h1>

      {roundGroups.map((roundGroup, roundIndex) => (
        <div key={roundIndex} className="round-section">
          <h2>{roundGroup.round}</h2>
          {roundGroup.students.length > 0 ? (
            <ul>
              {roundGroup.students.map((student, index) => (
                <li key={index}>{student.studentname}</li>
              ))}
            </ul>
          ) : (
            <p>No students cleared this round.</p>
          )}
        </div>
      ))}

      <div className="round-section selected-section">
        <h2>Selected</h2>
        {selectedStudents.length > 0 ? (
          <ul>
            {selectedStudents.map((student, index) => (
              <li key={index}>{student.studentname}</li>
            ))}
          </ul>
        ) : (
          <p>No students selected.</p>
        )}
      </div>
    </div>
  );
};

export default RoundsPage;
