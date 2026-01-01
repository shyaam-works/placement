import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import * as XLSX from "xlsx";
import BarLoader from "../components/BarLoader";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users");
      const usersData = res.data.data.allusers;

      const uniqueCompanies = new Set();
      usersData.forEach((user) => {
        user.companies.forEach((company) =>
          uniqueCompanies.add(company.companyname)
        );
      });

      setCompanyNames([...uniqueCompanies]);
      setStudents(usersData);
      setFilteredStudents(usersData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-poppins">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Manage Students
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="flex gap-3">
            <Link
              to="/students/analysis"
              className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-white/50 transition"
            >
              View Analysis
            </Link>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-white/50 transition"
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/50">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className=" p-3 font-bold border border-white/40 text-left">
                  Student Name
                </th>
                {companyNames.map((company, idx) => (
                  <th
                    key={idx}
                    className="p-3 font-bold border border-white/40 text-left"
                  >
                    {company}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr
                  key={student._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/10" : "bg-white/5"
                  } hover:bg-white/20 transition`}
                >
                  <td className="p-3 font-bold text-gray-900 border border-gray-200">
                    <Link
                      to={`/student/${student._id}`}
                      className="hover:underline"
                    >
                      {student.username}
                    </Link>
                  </td>
                  {companyNames.map((company, cidx) => {
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
                        key={cidx}
                        className={`p-3 border border-gray-200 font-semibold ${
                          roundsCleared > 0 ? "text-gray-600" : "text-red-500"
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
