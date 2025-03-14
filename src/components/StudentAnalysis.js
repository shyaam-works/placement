import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";

const StudentAnalysis = () => {
  const [companyStats, setCompanyStats] = useState([]);
  const [roundStats, setRoundStats] = useState([]);
  const [companyParticipation, setCompanyParticipation] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsPlaced, setStudentsPlaced] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);
  const [offerDistribution, setOfferDistribution] = useState({
    single: 0,
    double: 0,
    triple: 0,
    quad: 0,
  });
  const [rejectionStats, setRejectionStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    fetchAnalysisData();
  }, [navigate]);

  const fetchAnalysisData = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      const usersData = res.data.data.allusers;

      setTotalStudents(usersData.length);

      const companyStats = {};
      const roundStats = {};
      const companyParticipation = {};
      const rejectionStats = {};
      let totalOffersCount = 0;
      const offersPerStudent = {};

      usersData.forEach((student) => {
        let studentOffers = 0;
        student.companies.forEach((company) => {
          if (!companyStats[company.companyname]) {
            companyStats[company.companyname] = {
              company: company.companyname,
              totalStudents: 0,
              totalRounds: 0,
              maxRounds: 0,
              selectedCount: 0,
            };
            rejectionStats[company.companyname] = {
              company: company.companyname,
              rejectedCount: 0,
            };
          }

          companyStats[company.companyname].totalStudents += 1;
          const roundsCount = company.rounds.length;
          companyStats[company.companyname].totalRounds += roundsCount;
          companyStats[company.companyname].maxRounds = Math.max(
            companyStats[company.companyname].maxRounds,
            roundsCount
          );

          companyParticipation[company.companyname] =
            (companyParticipation[company.companyname] || 0) + 1;

          if (company.rounds.includes("Selected")) {
            companyStats[company.companyname].selectedCount += 1;
            totalOffersCount += 1;
            studentOffers += 1;
          } else if (roundsCount > 0) {
            rejectionStats[company.companyname].rejectedCount += 1;
          }

          company.rounds.forEach((round) => {
            if (!roundStats[round]) roundStats[round] = 0;
            roundStats[round] += 1;
          });
        });

        offersPerStudent[student.username] = studentOffers;
      });

      const distribution = { single: 0, double: 0, triple: 0, quad: 0 };
      Object.values(offersPerStudent).forEach((offerCount) => {
        if (offerCount === 1) distribution.single += 1;
        else if (offerCount === 2) distribution.double += 1;
        else if (offerCount === 3) distribution.triple += 1;
        else if (offerCount >= 4) distribution.quad += 1;
      });

      setCompanyStats(Object.values(companyStats));
      setRoundStats(
        Object.keys(roundStats)
          .sort((a, b) =>
            a === "Round 1" ? -1 : b === "Round 1" ? 1 : a.localeCompare(b)
          )
          .map((round) => ({
            round,
            count: roundStats[round],
          }))
      );
      setCompanyParticipation(
        Object.keys(companyParticipation).map((company) => ({
          name: company,
          value: companyParticipation[company],
        }))
      );
      setStudentsPlaced(
        Object.values(offersPerStudent).filter((count) => count > 0).length
      );
      setTotalOffers(totalOffersCount);
      setOfferDistribution(distribution);
      setRejectionStats(Object.values(rejectionStats));
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5733"];

  return (
    <div className="font-poppins bg-gradient-to-br from-cyan-100 to-cyan-200 min-h-screen p-7 sm:p-5 xs:p-3 flex flex-col items-center text-gray-800 box-border">
      <h1 className="text-5xl sm:text-4xl xs:text-3xl font-bold mb-7 sm:mb-5 text-black text-center">
        Placement Officer Dashboard
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-4 mb-7 sm:mb-5">
        <div className="bg-white/95 p-5 sm:p-3 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-lg text-black text-center mb-3 sm:mb-2">
            Students Selected by Company
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={companyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="selectedCount"
                name="Selected Students"
                fill="#00C49F"
              />
              <Bar
                dataKey="totalStudents"
                name="Participated Students"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 p-5 sm:p-3 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-lg text-black text-center mb-3 sm:mb-2">
            Round Participation Drop-Off
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={roundStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Students Participated"
                stroke="#ff7300"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 p-5 sm:p-3 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-lg text-black text-center mb-3 sm:mb-2">
            Offer Distribution
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: "Single Offer", value: offerDistribution.single },
                  { name: "Double Offers", value: offerDistribution.double },
                  { name: "Triple Offers", value: offerDistribution.triple },
                  { name: "Quad+ Offers", value: offerDistribution.quad },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {[
                  offerDistribution.single,
                  offerDistribution.double,
                  offerDistribution.triple,
                  offerDistribution.quad,
                ].map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 p-5 sm:p-3 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-lg text-black text-center mb-3 sm:mb-2">
            Company Rejection Rates
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rejectionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="rejectedCount"
                name="Rejected Students"
                fill="#FF5733"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full max-w-6xl p-5 sm:p-3 xs:p-2 mb-7 sm:mb-5 bg-white/95 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-xl text-blue-800 text-center mb-3 sm:mb-2">
          Company Performance Overview
        </h2>
        <table className="w-full border-collapse text-base sm:text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-blue-600">
              <th className="p-3 border border-gray-300 text-white uppercase font-semibold">
                Company
              </th>
              <th className="p-3 border border-gray-300 text-white uppercase font-semibold">
                Total Participants
              </th>
              <th className="p-3 border border-gray-300 text-white uppercase font-semibold">
                Selected
              </th>
              <th className="p-3 border border-gray-300 text-white uppercase font-semibold">
                Rejection Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {companyStats.map((company, index) => {
              const rejectionData = rejectionStats.find(
                (r) => r.company === company.company
              );
              const rejectionRate =
                company.totalStudents > 0
                  ? (
                      ((rejectionData?.rejectedCount || 0) /
                        company.totalStudents) *
                      100
                    ).toFixed(1)
                  : "0.0";
              return (
                <tr
                  key={index}
                  className="flex flex-col sm:table-row mb-3 sm:mb-0 border-b sm:border-b-0 border-gray-300"
                >
                  <td
                    data-label="Company"
                    className="p-3 sm:p-2 border border-gray-300 bg-white text-gray-800 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-blue-800 sm:before:content-none"
                  >
                    {company.company}
                  </td>
                  <td
                    data-label="Total Participants"
                    className="p-3 sm:p-2 border border-gray-300 bg-white text-gray-800 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-blue-800 sm:before:content-none"
                  >
                    {company.totalStudents}
                  </td>
                  <td
                    data-label="Selected"
                    className="p-3 sm:p-2 border border-gray-300 bg-white text-gray-800 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-blue-800 sm:before:content-none"
                  >
                    {company.selectedCount}
                  </td>
                  <td
                    data-label="Rejection Rate"
                    className="p-3 sm:p-2 border border-gray-300 bg-white text-gray-800 flex justify-between items-center sm:table-cell before:content-[attr(data-label)] before:font-bold before:mr-2 before:text-blue-800 sm:before:content-none"
                  >
                    {rejectionRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-6xl p-6 sm:p-4 xs:p-3 mb-7 sm:mb-5 bg-white/98 rounded-xl shadow-md text-center">
        <h2 className="text-3xl sm:text-2xl text-blue-700 mb-5 sm:mb-3">
          Placement Overview
        </h2>
        <div>
          <h3 className="text-xl sm:text-lg text-blue-800 mb-3 sm:mb-2">
            Placement Data
          </h3>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Placement Interested:
            </strong>{" "}
            {totalStudents}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              No of Students Placed So Far:
            </strong>{" "}
            {studentsPlaced}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Number of Offers:
            </strong>{" "}
            {totalOffers}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Single Offers:
            </strong>{" "}
            {offerDistribution.single}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Double Offers:
            </strong>{" "}
            {offerDistribution.double}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Triple Offers:
            </strong>{" "}
            {offerDistribution.triple}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Quad Offers:
            </strong>{" "}
            {offerDistribution.quad}
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Placement Percentage:
            </strong>{" "}
            {totalStudents > 0
              ? ((studentsPlaced / totalStudents) * 100).toFixed(2)
              : "0.00"}
            %
          </p>
          <p className="text-lg sm:text-base xs:text-sm mb-2 sm:mb-1.5">
            <strong className="text-blue-800 font-semibold">
              Yet to be Placed:
            </strong>{" "}
            {totalStudents - studentsPlaced}
          </p>
        </div>
      </div>

      <div className="mt-7 sm:mt-5 text-center">
        <Link
          to="/students"
          className="inline-block px-7 sm:px-5 xs:px-4 py-3 sm:py-2.5 xs:py-2 text-lg sm:text-base xs:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg hover:from-blue-700 hover:to-cyan-300 hover:scale-105 transition-all duration-300 no-underline"
        >
          Back to Students
        </Link>
      </div>
    </div>
  );
};

export default StudentAnalysis;
