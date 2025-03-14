import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import API_URL from "../config";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/");
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
    <div
      className="font-poppins bg-cover bg-no-repeat bg-center min-h-screen flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/Screenshot 2025-02-21 143339.png')" }}
    >
      <div className="w-full max-w-6xl my-10 sm:my-6 xs:my-4 p-5 sm:p-3 xs:p-2 text-center text-black box-border">
        <h1 className="text-4xl sm:text-3xl xs:text-2xl font-bold mb-5 sm:mb-4 xs:mb-3 text-black">
          Manage Students
        </h1>

        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md p-2.5 sm:p-2 m-3 sm:m-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-600 outline-none"
        />

        <div className="flex gap-2.5 my-5 sm:my-4 flex-wrap justify-center">
          <Link
            to="/students/analysis"
            className="px-4 sm:px-3 py-2 sm:py-1.5 text-base sm:text-sm font-bold text-black bg-gradient-to-r from-pink-500 to-blue-400 rounded-lg hover:from-pink-400 hover:to-blue-300 hover:scale-105 transition-all duration-300 no-underline"
          >
            View Analysis
          </Link>
          <button
            className="px-4 sm:px-3 py-2 sm:py-1.5 text-base sm:text-sm font-bold text-black bg-green-500 rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse bg-white/10 rounded-lg border-2 border-black">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-blue-600">
                <th className="p-3 sm:p-2 text-black uppercase font-bold text-xl sm:text-base border-2 border-white/40">
                  Student Name
                </th>
                {companyNames.map((company, index) => (
                  <th
                    key={index}
                    className="p-3 sm:p-2 text-black uppercase font-bold text-xl sm:text-base border-2 border-white/40"
                  >
                    {company}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className={`${
                    index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                  } flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0 border-gray-300`}
                >
                  <td
                    className="p-3 sm:p-2 text-blue-400 font-bold text-center border-2 border-black flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-black sm:before:content-none"
                    data-label="Student Name"
                  >
                    <Link
                      to={`/student/${student._id}`}
                      className="text-xl sm:text-base text-gray-600 hover:text-black hover:underline transition-colors duration-300 no-underline"
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
                        className={`p-3 sm:p-2 font-bold text-center border-2 border-black flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-black sm:before:content-none ${
                          roundsCleared > 0 ? "text-black" : "text-red-500"
                        }`}
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
