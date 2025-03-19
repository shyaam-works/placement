import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance"; // Import axiosInstance instead of API_URL

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const res = await axiosInstance.get(`/users/${id}`); // Use axiosInstance
      setStudent(res.data.data.user);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  if (!student)
    return (
      <div className="text-xl sm:text-lg text-white text-center mt-12">
        Loading...
      </div>
    );

  const leetcodeImageUrl = `https://leetcode-stats.vercel.app/api?username=${student.Username}&theme=dark`;

  return (
    <div className="font-poppins bg-cyan-200 min-h-screen flex flex-col items-center p-4 sm:p-3 xs:p-2 text-black box-border">
      <h1 className="text-4xl sm:text-3xl xs:text-2xl font-bold text-black mb-5 sm:mb-4 xs:mb-3 text-center">
        {student.username}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-3 w-full max-w-5xl mb-5 sm:mb-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Graduation Degree:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["Graduation Degree"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Mobile Number:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["Mobile Number"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Email ID:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["Email ID"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            X %:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["X % "]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            XII %:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["XII % "]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            UG Specialization:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["UG SPECIALIZATION"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Aggregate UG:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["Aggregate UG"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Easy Questions:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["EASY"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Medium Questions:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["MEDUIM"]}
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 sm:p-3 xs:p-2.5 text-center shadow-lg flex flex-col justify-center items-center h-20 sm:h-auto min-h-[80px]">
          <strong className="block text-xl sm:text-lg xs:text-base mb-2.5 sm:mb-2 text-black">
            Hard Questions:
          </strong>
          <span className="text-sm sm:text-[0.85rem] xs:text-[0.8rem] text-white">
            {student["HARD"]}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-5 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-bold mb-2.5 sm:mb-2">
          LeetCode Profile
        </h2>
        <a
          href={student["LEETCODE LINK"]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-lg sm:text-base font-bold mb-2.5 sm:mb-2 hover:text-blue-200 transition-colors duration-300 no-underline"
        >
          View Profile
        </a>
        <img
          src={leetcodeImageUrl}
          alt="LeetCode Stats"
          className="w-full max-w-[500px] sm:max-w-[400px] xs:max-w-[300px] h-auto rounded-xl shadow-lg"
        />
      </div>

      <h2 className="text-2xl sm:text-xl font-bold mb-2.5 sm:mb-2">
        Companies Attended
      </h2>
      <ul className="list-none p-0 text-center w-full max-w-4xl">
        {student.companies.map((company, index) => (
          <li
            key={index}
            className="bg-white/10 p-2.5 sm:p-2 xs:p-1.5 m-1 sm:m-0.5 rounded-lg text-lg sm:text-base xs:text-sm font-bold"
          >
            {company.companyname} - {company.rounds.length}{" "}
            {company.rounds.length === 1 ? "round" : "rounds"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDetails;
