import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import BarLoader from "../components/BarLoader";

const RoundsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [roundGroups, setRoundGroups] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const companyRes = await axiosInstance.get(`/comp/${id}`);
      const companyData = companyRes.data.data.company;
      setCompany(companyData);

      const totalRounds = companyData.totalRounds;
      const students = companyData.students;

      const formattedRoundGroups = Array.from(
        { length: totalRounds },
        (_, index) => ({
          round: `Round ${index + 1}`,
          students: students.filter((student) =>
            student.rounds.includes(`Round ${index + 1}`)
          ),
        })
      );

      const selected = students.filter((student) =>
        student.rounds.includes("Selected")
      );

      setRoundGroups(formattedRoundGroups);
      setSelectedStudents(selected);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching data:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADING */}
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          {company?.companyname} – Round Summary
        </h1>

        {/* ROUNDS GRID (2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roundGroups.map((roundGroup, roundIndex) => (
            <div
              key={roundIndex}
              className="
                bg-white
                border border-indigo-200
                rounded-3xl
                p-6
                shadow-md
                hover:shadow-lg
                transition
              "
            >
              <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                {roundGroup.round}
              </h2>

              {roundGroup.students.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roundGroup.students.map((student, index) => (
                    <li
                      key={index}
                      className="
                        px-4 py-3
                        rounded-xl
                        bg-gradient-to-r from-indigo-50 to-purple-50
                        text-gray-900
                        font-medium
                        text-center
                        shadow-sm
                        hover:scale-[1.02]
                        transition
                      "
                    >
                      {student.studentname}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">
                  No students cleared this round.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* SELECTED STUDENTS */}
        <div
          className="
            bg-white/90
            text-gray-900
            rounded-3xl
            p-8
            shadow-md
            border border-gray-200
          "
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Selected Students
          </h2>

          {selectedStudents.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedStudents.map((student, index) => (
                <li
                  key={index}
                  className="
                    px-4 py-3
                    rounded-xl
                    bg-gray-100
                    border border-gray-300
                    text-center
                    font-semibold
                    hover:bg-gray-200
                    transition
                  "
                >
                  {student.studentname}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No students selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundsPage;
