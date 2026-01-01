import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import * as XLSX from "xlsx";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roundsCount, setRoundsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/comp/${id}`);
      const companyData = res.data.data.company;
      setCompany(companyData);
      setRoundsCount(companyData.totalRounds || 0);

      const formattedStudents = companyData.students.map((student) => ({
        studentname: student.studentname,
        rounds: student.rounds || [],
      }));

      setStudents(formattedStudents);
      setFilteredStudents(formattedStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const filtered = students.filter((student) =>
      student.studentname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleRoundClick = async (studentname, roundIndex) => {
    setIsLoading(true);
    try {
      const student = students.find((s) => s.studentname === studentname);
      const roundName = `Round ${roundIndex + 1}`;
      let updatedRounds = new Set(student.rounds);

      if (updatedRounds.has(roundName)) updatedRounds.delete(roundName);
      else updatedRounds.add(roundName);

      await axiosInstance.patch(`/comp/${id}`, {
        students: { studentname, rounds: Array.from(updatedRounds) },
      });

      setStudents(
        students.map((s) =>
          s.studentname === studentname
            ? { ...s, rounds: Array.from(updatedRounds) }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionClick = async (studentname, currentRounds) => {
    setIsLoading(true);
    try {
      let updatedRounds = new Set(currentRounds);
      if (updatedRounds.has("Selected")) updatedRounds.delete("Selected");
      else updatedRounds.add("Selected");

      await axiosInstance.patch(`/comp/${id}`, {
        students: { studentname, rounds: Array.from(updatedRounds) },
      });

      setStudents(
        students.map((s) =>
          s.studentname === studentname
            ? { ...s, rounds: Array.from(updatedRounds) }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company Details");
    XLSX.writeFile(workbook, `${company.companyname}_Rounds.xlsx`);
  };

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-poppins text-gray-800">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
        </div>
      )}

      <div
        className={`max-w-6xl mx-auto ${
          isLoading ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Updated Header, Buttons, Search */}
        <div className="flex flex-col items-center gap-3 sm:gap-2 mb-6">
          <h1 className="text-3xl sm:text-2xl xs:text-xl font-bold text-gray-900 text-center">
            {company?.companyname || "Loading..."}
          </h1>
          <p className="text-base sm:text-sm xs:text-xs font-semibold text-gray-700 text-center">
            Students Eligible: {filteredStudents.length}
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to={`/company/${id}/rounds`}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
            >
              View Rounds Summary
            </Link>
            <button
              className="px-3 py-1.5 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>

          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg p-2 rounded-lg border border-gray-300 shadow-sm text-center text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition mt-3"
          />
        </div>

        {/* Keep the table completely intact */}
        <div className="overflow-x-auto bg-white/50 rounded-xl shadow-lg border border-gray-200">
          <table className="w-full border-collapse text-sm text-center">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hidden sm:table-header-group">
              <tr>
                <th className="p-3 border border-white/30">Student Name</th>
                {[...Array(roundsCount)].map((_, i) => (
                  <th key={i} className="p-3 border border-white/30">
                    Round {i + 1}
                  </th>
                ))}
                <th className="p-3 border border-white/30">Selected</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr
                  key={idx}
                  className={`flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0 border-gray-200 hover:bg-gray-50 transition`}
                >
                  <td className="p-3 border border-gray-200 text-gray-900 font-medium sm:table-cell">
                    {student.studentname}
                  </td>

                  {[...Array(roundsCount)].map((_, roundIndex) => (
                    <td
                      key={roundIndex}
                      className="p-2 border border-gray-200 sm:table-cell"
                    >
                      <button
                        className={`w-full px-2 py-1 rounded-md text-white text-xs font-medium shadow-sm transition duration-200 hover:scale-105 hover:shadow-md ${
                          student.rounds.includes(`Round ${roundIndex + 1}`)
                            ? "bg-indigo-500 hover:bg-indigo-600"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        onClick={() =>
                          handleRoundClick(student.studentname, roundIndex)
                        }
                      >
                        {student.rounds.includes(`Round ${roundIndex + 1}`)
                          ? `R${roundIndex + 1}`
                          : "X"}
                      </button>
                    </td>
                  ))}

                  <td className="p-2 border border-gray-200 sm:table-cell">
                    <button
                      className={`w-full px-2 py-1 rounded-md text-white text-xs font-medium shadow-sm transition duration-200 hover:scale-105 hover:shadow-md ${
                        student.rounds.includes("Selected")
                          ? "bg-purple-500 hover:bg-purple-600"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                      onClick={() =>
                        handleSelectionClick(
                          student.studentname,
                          student.rounds
                        )
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
    </div>
  );
};

export default CompanyDetails;
