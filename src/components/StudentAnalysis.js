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
import "./StudentAnalysis.css";

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
    <div className="student-analysis-page">
      <h1 className="student-analysis-title">Placement Officer Dashboard</h1>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Students Selected by Company</h2>
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

        <div className="chart-container">
          <h2>Round Participation Drop-Off</h2>
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

        <div className="chart-container">
          <h2>Offer Distribution</h2>
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

        <div className="chart-container">
          <h2>Company Rejection Rates</h2>
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

      <div className="table-container">
        <h2>Company Performance Overview</h2>
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Total Participants</th>
              <th>Selected</th>
              <th>Rejection Rate</th>
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
                <tr key={index}>
                  <td>{company.company}</td>
                  <td>{company.totalStudents}</td>
                  <td>{company.selectedCount}</td>
                  <td>{rejectionRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <h2>Placement Overview</h2>
        <div className="summary-content">
          <h3>Placement Data</h3>
          <p>
            <strong>Placement Interested:</strong> {totalStudents}
          </p>
          <p>
            <strong>No of Students Placed So Far:</strong> {studentsPlaced}
          </p>
          <p>
            <strong>Number of Offers:</strong> {totalOffers}
          </p>
          <p>
            <strong>Single Offers:</strong> {offerDistribution.single}
          </p>
          <p>
            <strong>Double Offers:</strong> {offerDistribution.double}
          </p>
          <p>
            <strong>Triple Offers:</strong> {offerDistribution.triple}
          </p>
          <p>
            <strong>Quad Offers:</strong> {offerDistribution.quad}
          </p>
          <p>
            <strong>Placement Percentage:</strong>{" "}
            {totalStudents > 0
              ? ((studentsPlaced / totalStudents) * 100).toFixed(2)
              : "0.00"}
            %
          </p>
          <p>
            <strong>Yet to be Placed:</strong> {totalStudents - studentsPlaced}
          </p>
        </div>
      </div>

      <div className="back-button-container">
        <Link to="/students" className="back-button">
          Back to Students
        </Link>
      </div>
    </div>
  );
};

export default StudentAnalysis;
