import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import API_URL from "../config";

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
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/");
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
    <div className="font-poppins bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center p-6 sm:p-4 xs:p-3 text-gray-800 box-border">
      <h1 className="text-3xl sm:text-2xl xs:text-xl font-bold mb-6 sm:mb-4 text-gray-900 text-center tracking-tight">
        {company?.companyname}
      </h1>
      <div className="flex gap-3 mb-6 sm:mb-4 flex-wrap justify-center">
        <Link
          to={`/company/${id}/rounds`}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 no-underline"
        >
          View Rounds Summary
        </Link>
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
      <input
        type="text"
        className="w-full max-w-lg p-2.5 sm:p-2 rounded-lg border border-gray-300 shadow-sm text-center text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="w-full max-w-7xl mt-6 sm:mt-4 bg-white p-6 sm:p-4 xs:p-3 rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-xs text-center">
          <thead className="bg-indigo-100 text-indigo-900 font-semibold border-b-2 border-indigo-200 hidden sm:table-header-group">
            <tr>
              <th className="p-3 sm:p-2 border border-indigo-200">
                Student Name
              </th>
              {[...Array(roundsCount)].map((_, index) => (
                <th key={index} className="p-3 sm:p-2 border border-indigo-200">
                  Round {index + 1}
                </th>
              ))}
              <th className="p-3 sm:p-2 border border-indigo-200">Selected</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, studentIndex) => (
              <tr
                key={studentIndex}
                className="flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <td
                  className="p-3 sm:p-2 border border-gray-200 flex justify-between items-center sm:table-cell text-gray-900 font-medium before:content-[attr(data-label)] before:font-semibold before:mr-2 before:text-indigo-700 sm:before:content-none"
                  data-label="Student Name"
                >
                  {student.studentname}
                </td>
                {[...Array(roundsCount)].map((_, roundIndex) => (
                  <td
                    className="p-3 sm:p-2 border border-gray-200 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-semibold before:mr-2 before:text-indigo-700 sm:before:content-none"
                    key={roundIndex}
                    data-label={`Round ${roundIndex + 1}`}
                  >
                    <button
                      className={`w-full sm:w-24 px-2 py-1.5 rounded-md text-white text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ${
                        student.rounds.includes(`Round ${roundIndex + 1}`)
                          ? "bg-teal-500 hover:bg-teal-600"
                          : "bg-red-500 hover:bg-red-600"
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
                        ? `R${roundIndex + 1}`
                        : "X"}
                    </button>
                  </td>
                ))}
                <td
                  className="p-3 sm:p-2 border border-gray-200 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-semibold before:mr-2 before:text-indigo-700 sm:before:content-none"
                  data-label="Selected"
                >
                  <button
                    className={`w-full sm:w-24 px-2 py-1.5 rounded-md text-white text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      student.rounds.includes("Selected")
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                    onClick={() =>
                      handleSelectionClick(student.studentname, student.rounds)
                    }
                  >
                    {student.rounds.includes("Selected") ? "✓" : "✗"}
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
