import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import API_URL from "../config";
import "./ManageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true"; // Use sessionStorage
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }
    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      const usersData = res.data.data.allusers;

      const uniqueCompanies = new Set();
      usersData.forEach((user) => {
        user.companies.forEach((company) =>
          uniqueCompanies.add(company.companyname)
        );
      });
      console.log(usersData);
      setCompanyNames([...uniqueCompanies]);
      setStudents(usersData);
      setFilteredStudents(usersData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = students.filter((student) =>
      student.username.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Student Name", ...companyNames];
    const data = filteredStudents.map((student) => {
      const row = [student.username];
      companyNames.forEach((company) => {
        const companyData = student.companies.find(
          (c) => c.companyname === company
        );
        const roundsCleared =
          companyData?.rounds.filter((round) => round !== "Selected").length ||
          0;
        const isSelected = companyData?.rounds.includes("Selected");
        row.push(
          roundsCleared > 0
            ? `${roundsCleared} Rounds${isSelected ? " and Selected" : ""}`
            : "Not Applied"
        );
      });
      return row;
    });

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Students_Placement.xlsx");
  };

  return (
    <div className="manage-students-wrapper">
      <div className="manage-students-container">
        <h1 className="manage-students-title">Manage Students</h1>

        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="button-container">
          <Link to="/students/analysis" className="analysis-button">
            View Analysis
          </Link>
          <button className="export-button" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>

        <div className="manage-students-table-wrapper">
          <table className="manage-students-table">
            <thead>
              <tr className="manage-students-table-header-row">
                <th className="manage-students-table-header">Student Name</th>
                {companyNames.map((company, index) => (
                  <th key={index} className="manage-students-table-header">
                    {company}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="manage-students-table-row">
                  <td className="manage-students-name data-label">
                    <Link
                      to={`/student/${student._id}`}
                      className="manage-students-link"
                    >
                      {student.username}
                    </Link>
                  </td>
                  {companyNames.map((company, companyIndex) => {
                    const companyData = student.companies.find(
                      (c) => c.companyname === company
                    );
                    const roundsCleared =
                      companyData?.rounds.filter(
                        (round) => round !== "Selected"
                      ).length || 0;
                    const isSelected = companyData?.rounds.includes("Selected");

                    return (
                      <td
                        data-label={company}
                        key={companyIndex}
                        className={
                          roundsCleared > 0
                            ? "manage-students-rounds-cleared"
                            : "manage-students-not-applied"
                        }
                      >
                        {roundsCleared > 0
                          ? `${roundsCleared} Rounds${
                              isSelected ? " and Selected" : ""
                            }`
                          : "Not Applied"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
