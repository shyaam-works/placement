import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import API_URL from "../config";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roundsCount, setRoundsCount] = useState(0);
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
      setRoundsCount(companyData.totalRounds || 0);

      const usersRes = await axios.get(`${API_URL}/users`);
      const usersData = usersRes.data.data.allusers;

      const formattedUsers = usersData.map((user) => {
        const companyEntry = user.companies.find(
          (c) => c.companyname === companyData.companyname
        );

        const userRounds = new Set(companyEntry ? companyEntry.rounds : []);

        return {
          studentname: user.username,
          rounds: Array.from(userRounds),
        };
      });

      setStudents(formattedUsers);
      setFilteredStudents(formattedUsers);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.studentname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleRoundClick = async (studentname, roundIndex, currentStatus) => {
    try {
      const roundName = `Round ${roundIndex + 1}`;
      let updatedRounds = new Set(
        students.find((student) => student.studentname === studentname).rounds
      );

      if (currentStatus === "Not Cleared") {
        updatedRounds.add(roundName);
      } else {
        updatedRounds.delete(roundName);
      }

      await axios.patch(`${API_URL}/${id}`, {
        students: {
          studentname,
          rounds: Array.from(updatedRounds),
        },
      });

      const updatedStudents = students.map((student) => {
        if (student.studentname === studentname) {
          return { ...student, rounds: Array.from(updatedRounds) };
        }
        return student;
      });

      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error updating round:", error);
    }
  };

  const handleSelectionClick = async (studentname, currentRounds) => {
    try {
      let updatedRounds = new Set(currentRounds);

      if (updatedRounds.has("Selected")) {
        updatedRounds.delete("Selected");
      } else {
        updatedRounds.add("Selected");
      }

      await axios.patch(`${API_URL}/${id}`, {
        students: {
          studentname,
          rounds: Array.from(updatedRounds),
        },
      });

      const updatedStudents = students.map((student) =>
        student.studentname === studentname
          ? { ...student, rounds: Array.from(updatedRounds) }
          : student
      );

      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error updating selection status:", error);
    }
  };

  const exportToExcel = () => {
    if (!company || filteredStudents.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "Student Name",
      ...Array.from({ length: roundsCount }, (_, i) => `Round ${i + 1}`),
      "Selected",
    ];
    const data = filteredStudents.map((student) => {
      const row = [student.studentname];
      for (let i = 0; i < roundsCount; i++) {
        row.push(
          student.rounds.includes(`Round ${i + 1}`) ? "Cleared" : "Not Cleared"
        );
      }
      row.push(student.rounds.includes("Selected") ? "Yes" : "No");
      return row;
    });

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company Details");
    const fileName = `${company.companyname}_Rounds.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="company-details">
      <h1 className="company-title">{company?.companyname}</h1>
      <div className="button-container">
        <button className="rounds-page-btn">
          <Link to={`/company/${id}/rounds`}>View Rounds Summary</Link>
        </button>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="company-table-container">
        <table className="company-table">
          <thead>
            <tr>
              <th>Student Name</th>
              {[...Array(roundsCount)].map((_, index) => (
                <th key={index}>Round {index + 1}</th>
              ))}
              <th>Selected</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, studentIndex) => (
              <tr key={studentIndex}>
                <td>{student.studentname}</td>
                {[...Array(roundsCount)].map((_, roundIndex) => (
                  <td key={roundIndex}>
                    <button
                      className={`company-round-btn ${
                        student.rounds.includes(`Round ${roundIndex + 1}`)
                          ? "company-cleared"
                          : "company-not-cleared"
                      }`}
                      onClick={() =>
                        handleRoundClick(
                          student.studentname,
                          roundIndex,
                          student.rounds.includes(`Round ${roundIndex + 1}`)
                            ? "Cleared"
                            : "Not Cleared"
                        )
                      }
                    >
                      {student.rounds.includes(`Round ${roundIndex + 1}`)
                        ? `Round ${roundIndex + 1}`
                        : "Not Cleared"}
                    </button>
                  </td>
                ))}
                <td>
                  <button
                    className={`company-round-btn ${
                      student.rounds.includes("Selected")
                        ? "company-cleared"
                        : "company-not-cleared"
                    }`}
                    onClick={() =>
                      handleSelectionClick(student.studentname, student.rounds)
                    }
                  >
                    {student.rounds.includes("Selected")
                      ? "Selected"
                      : "Not Selected"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDetails;
