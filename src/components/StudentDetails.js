import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      setStudent(res.data.data.user);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  if (!student)
    return (
      <div className="text-xl font-semibold text-gray-700 text-center mt-16">
        Loading...
      </div>
    );

  const leetcodeImageUrl = `https://leetcode-stats.vercel.app/api?username=${student.Username}&theme=dark`;

  return (
    <div className="font-poppins bg-gradient-to-br from-cyan-100 to-blue-200 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          {student.username}
        </h1>

        {/* Student Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Graduation Degree", value: student["Graduation Degree"] },
            { label: "Mobile Number", value: student["Mobile Number"] },
            { label: "Email ID", value: student["Email ID"] },
            { label: "X %", value: student["X % "] },
            { label: "XII %", value: student["XII % "] },
            { label: "UG Specialization", value: student["UG SPECIALIZATION"] },
            { label: "Aggregate UG", value: student["Aggregate UG"] },
            { label: "Easy Questions", value: student["EASY"] },
            { label: "Medium Questions", value: student["MEDUIM"] },
            { label: "Hard Questions", value: student["HARD"] },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center border border-gray-100"
            >
              <strong className="text-lg font-semibold text-gray-800 mb-2">
                {item.label}
              </strong>
              <span className="text-sm text-gray-600 font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* LeetCode Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            LeetCode Profile
          </h2>
          <div className="flex flex-col items-center gap-4">
            <a
              href={student["LEETCODE LINK"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors duration-300"
            >
              View Profile
            </a>
            <img
              src={leetcodeImageUrl}
              alt="LeetCode Stats"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Companies Attended */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Companies Attended
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.companies.map((company, index) => (
              <li
                key={index}
                className="bg-gray-100 rounded-lg p-3 text-gray-700 font-semibold text-center shadow-sm hover:bg-gray-200 transition-colors duration-300"
              >
                {company.companyname} - {company.rounds.length}{" "}
                {company.rounds.length === 1 ? "round" : "rounds"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
