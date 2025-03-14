import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config";

const RoundsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [roundGroups, setRoundGroups] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
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
    <div className="font-poppins bg-cyan-200 min-h-screen flex flex-col items-center p-4 sm:p-3 xs:p-2 text-black box-border">
      <h1 className="text-4xl sm:text-3xl xs:text-2xl font-bold mb-5 sm:mb-4 xs:mb-3 text-center">
        {company?.companyname} - Round Summary
      </h1>

      {roundGroups.map((roundGroup, roundIndex) => (
        <div
          key={roundIndex}
          className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-3 xs:p-2.5 mb-3.5 sm:mb-3 xs:mb-2.5 shadow-lg text-center"
        >
          <h2 className="text-2xl sm:text-xl xs:text-lg font-bold text-pink-500 mb-2.5 sm:mb-2">
            {roundGroup.round}
          </h2>
          {roundGroup.students.length > 0 ? (
            <ul className="list-none p-0 m-0">
              {roundGroup.students.map((student, index) => (
                <li
                  key={index}
                  className="p-2 sm:p-1.5 xs:p-1 m-1 sm:m-0.5 bg-white/20 rounded-md text-lg sm:text-base xs:text-sm transition-colors duration-300 hover:bg-white/30"
                >
                  {student.studentname}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base sm:text-sm xs:text-xs text-gray-700 m-2.5 sm:m-2">
              No students cleared this round.
            </p>
          )}
        </div>
      ))}

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-3 xs:p-2.5 mb-3.5 sm:mb-3 xs:mb-2.5 shadow-lg text-center border-2 border-pink-500">
        <h2 className="text-2xl sm:text-xl xs:text-lg font-bold text-pink-500 mb-2.5 sm:mb-2">
          Selected
        </h2>
        {selectedStudents.length > 0 ? (
          <ul className="list-none p-0 m-0">
            {selectedStudents.map((student, index) => (
              <li
                key={index}
                className="p-2 sm:p-1.5 xs:p-1 m-1 sm:m-0.5 bg-white/20 rounded-md text-lg sm:text-base xs:text-sm transition-colors duration-300 hover:bg-white/30"
              >
                {student.studentname}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base sm:text-sm xs:text-xs text-gray-700 m-2.5 sm:m-2">
            No students selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default RoundsPage;
