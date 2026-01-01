import { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
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
import { Link } from "react-router-dom";
import BarLoader from "../components/BarLoader";

const StudentAnalysis = () => {
  const [companyStats, setCompanyStats] = useState([]);
  const [roundStats, setRoundStats] = useState([]);
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
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users");
      const usersData = res.data.data.allusers;

      setTotalStudents(usersData.length);

      const companyStats = {};
      const roundStats = {};
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
              selectedCount: 0,
            };
            rejectionStats[company.companyname] = {
              company: company.companyname,
              rejectedCount: 0,
            };
          }

          companyStats[company.companyname].totalStudents += 1;

          if (company.rounds.includes("Selected")) {
            companyStats[company.companyname].selectedCount += 1;
            totalOffersCount += 1;
            studentOffers += 1;
          } else {
            rejectionStats[company.companyname].rejectedCount += 1;
          }

          company.rounds.forEach((round) => {
            roundStats[round] = (roundStats[round] || 0) + 1;
          });
        });

        offersPerStudent[student.username] = studentOffers;
      });

      const distribution = { single: 0, double: 0, triple: 0, quad: 0 };
      Object.values(offersPerStudent).forEach((count) => {
        if (count === 1) distribution.single++;
        else if (count === 2) distribution.double++;
        else if (count === 3) distribution.triple++;
        else if (count >= 4) distribution.quad++;
      });

      setCompanyStats(Object.values(companyStats));
      setRoundStats(
        Object.keys(roundStats).map((round) => ({
          round,
          count: roundStats[round],
        }))
      );
      setStudentsPlaced(
        Object.values(offersPerStudent).filter((c) => c > 0).length
      );
      setTotalOffers(totalOffersCount);
      setOfferDistribution(distribution);
      setRejectionStats(Object.values(rejectionStats));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#22D3EE"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="font-poppins bg-gradient-to-br from-cyan-100 to-cyan-200 min-h-screen px-7 py-10 flex flex-col items-center text-gray-800">
      <h1 className="text-5xl font-bold mb-8 text-black text-center">
        Placement Officer Dashboard
      </h1>

      {/* Charts */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: "Students Selected by Company",
            content: (
              <BarChart data={companyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="selectedCount" fill="#22D3EE" />
                <Bar dataKey="totalStudents" fill="#6366F1" />
              </BarChart>
            ),
          },
          {
            title: "Round Participation Drop-Off",
            content: (
              <LineChart data={roundStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#EC4899" />
              </LineChart>
            ),
          },
          {
            title: "Offer Distribution",
            content: (
              <PieChart>
                <Pie
                  data={[
                    { name: "Single", value: offerDistribution.single },
                    { name: "Double", value: offerDistribution.double },
                    { name: "Triple", value: offerDistribution.triple },
                    { name: "Quad+", value: offerDistribution.quad },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  label
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ),
          },
          {
            title: "Company Rejection Rates",
            content: (
              <BarChart data={rejectionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rejectedCount" fill="#EF4444" />
              </BarChart>
            ),
          },
        ].map((item, i) => (
          <div key={i} className="bg-white/95 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              {item.title}
            </h2>
            <ResponsiveContainer width="100%" height={420}>
              {item.content}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Placement Overview */}
      <div className="w-full max-w-6xl mb-14 rounded-3xl bg-white shadow-xl border border-gray-200 p-8 sm:p-10">
        <h2 className="text-3xl font-bold mb-3 text-gray-900">
          Placement Overview
        </h2>

        <p className="text-gray-600 mb-6">
          High-level placement insights based on current data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <strong className="text-gray-700">Total Students:</strong>{" "}
            <span className="text-gray-900">{totalStudents}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <strong className="text-gray-700">Placed:</strong>{" "}
            <span className="text-gray-900">{studentsPlaced}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <strong className="text-gray-700">Total Offers:</strong>{" "}
            <span className="text-gray-900">{totalOffers}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <strong className="text-gray-700">Placement %:</strong>{" "}
            <span className="text-gray-900">
              {totalStudents
                ? ((studentsPlaced / totalStudents) * 100).toFixed(2)
                : 0}
              %
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 sm:col-span-2">
            <strong className="text-gray-700">Yet to be Placed:</strong>{" "}
            <span className="text-gray-900">
              {totalStudents - studentsPlaced}
            </span>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="pb-10">
        <Link
          to="/students"
          className="
      inline-flex items-center justify-center
      px-8 py-3
      text-lg font-semibold
      text-indigo-700
      bg-white
      border border-indigo-200
      rounded-xl
      shadow-md
      hover:bg-indigo-50
      hover:shadow-lg
      transition
    "
        >
          ← Back to Students
        </Link>
      </div>
    </div>
  );
};

export default StudentAnalysis;
