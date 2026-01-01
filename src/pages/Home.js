// src/pages/Home.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarLoader from "../components/BarLoader"; // make sure path is correct

const Home = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(20);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(false); // For fetching top students
  const [pageLoading, setPageLoading] = useState(true); // For initial page load
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate minimal load for page, remove if unnecessary
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchTopStudents = async () => {
    const num = parseInt(count, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      toast.error("Please enter a number between 1 and 100");
      return;
    }

    setLoading(true);
    setError("");
    setTopStudents([]);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_RANKING_API_URL}/top-students?n=${num}`
      );
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      setTopStudents(data.top_students || []);
      toast.success("Top students fetched successfully!", {
        style: { backgroundColor: "#3B82F6", color: "#fff" },
      });
    } catch {
      setError("Could not fetch top students. Try again later!");
      toast.error("Could not fetch top students. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <BarLoader />
      </div>
    );

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* LEFT — ACTIONS */}
        <div className="flex-1 basis-0 rounded-3xl bg-white shadow-xl p-8 sm:p-10 border border-gray-100 flex flex-col">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Placement Operations Hub
            </h1>

            <p className="text-gray-600 mb-8 text-lg">
              Centralized control for student data, companies, and performance
              insights.
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={() => navigate("/companies")}
              className="w-full py-4 text-lg font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         rounded-xl shadow-lg hover:shadow-xl
                         hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Manage Companies
            </button>

            <button
              onClick={() => navigate("/students")}
              className="w-full py-4 text-lg font-semibold text-indigo-700
                         bg-indigo-50 rounded-xl border border-indigo-200
                         hover:bg-indigo-100 transition"
            >
              Manage Students
            </button>

            <button
              onClick={() => navigate("/students/analysis")}
              className="w-full py-4 text-lg font-semibold text-purple-700
                         bg-purple-50 rounded-xl border border-purple-200
                         hover:bg-purple-100 transition"
            >
              Student Performance Analysis
            </button>
          </div>
        </div>

        {/* RIGHT — PREDICTION */}
        <div className="flex-1 basis-0 min-w-0 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl p-8 sm:p-10 flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-3">Predict Top Students</h2>
            <p className="text-indigo-100">
              Our ranking uses academics, skills, and placement outcomes to
              provide unbiased insights.
            </p>
          </div>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full sm:w-32 px-4 py-3 rounded-xl text-gray-900 text-center focus:outline-none focus:ring-4 focus:ring-white/40"
              placeholder="20"
            />
            <button
              onClick={fetchTopStudents}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition disabled:opacity-70"
            >
              {loading ? "Analysing..." : "Get Top Students"}
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Placeholder */}
            {topStudents.length === 0 && !loading && !error && (
              <div className="flex-1 flex items-end">
                <div className="w-full bg-white/10 p-6 rounded-2xl border border-white/20 text-indigo-50">
                  <p className="text-lg">
                    Run prediction to view top performing students.
                  </p>
                  <ul className="mt-3 list-disc list-inside space-y-1 text-indigo-100">
                    <li>Data-driven ranking</li>
                    <li>Unbiased and transparent</li>
                    <li>Helps in fair placement decisions</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Results */}
            {topStudents.length > 0 && (
              <div className="flex-1 bg-white/95 text-gray-800 rounded-2xl p-6 overflow-y-auto relative">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Top {topStudents.length} Students
                </h3>

                <button
                  onClick={() => setTopStudents([])}
                  className="absolute top-3 right-3 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  ✕ Close
                </button>

                <div className="space-y-3">
                  {topStudents.map((student, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl"
                    >
                      <span className="font-semibold">
                        #{index + 1} {student.username}
                      </span>
                      <span className="text-sm font-medium">
                        {student.weighted_score?.toFixed(3) ??
                          student.final_score?.toFixed(3) ??
                          "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-red-200 font-medium text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
