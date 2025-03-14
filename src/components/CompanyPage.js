import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [totalRounds, setTotalRounds] = useState("");
  const [showRoundsInput, setShowRoundsInput] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(API_URL);
      setCompanies(res.data.data.allcompanies);
      setFilteredCompanies(res.data.data.allcompanies);
      setError("");
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch companies. Please try again.");
    }
  };

  const addCompany = async () => {
    if (!companyName.trim() || !totalRounds.trim()) return;
    try {
      const roundsNum = parseInt(totalRounds, 10);
      if (isNaN(roundsNum) || roundsNum <= 0) {
        setError("Total rounds must be a positive number.");
        return;
      }
      await axios.post(API_URL, {
        companyname: companyName,
        totalRounds: roundsNum,
      });
      setCompanyName("");
      setTotalRounds("");
      setShowRoundsInput(false);
      setError("");
      fetchCompanies();
    } catch (err) {
      console.error("Error adding company:", err);
      setError("Failed to add company. Please try again.");
    }
  };

  const deleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setError("");
        fetchCompanies();
      } catch (err) {
        console.error("Error deleting company:", err);
        setError("Failed to delete company. Please try again.");
      }
    }
  };

  const startEdit = (company) => {
    setEditingCompany(company);
    setCompanyName(company.companyname);
    setTotalRounds(company.totalRounds.toString());
    setShowRoundsInput(true);
    setError("");
  };

  const updateCompany = async () => {
    if (!editingCompany || !companyName.trim() || !totalRounds.trim()) {
      setError("Company name and total rounds are required.");
      return;
    }
    try {
      const roundsNum = parseInt(totalRounds, 10);
      if (isNaN(roundsNum) || roundsNum <= 0) {
        setError("Total rounds must be a positive number.");
        return;
      }
      await axios.patch(`${API_URL}/${editingCompany._id}`, {
        companyname: companyName,
        totalRounds: roundsNum,
      });
      setEditingCompany(null);
      setCompanyName("");
      setTotalRounds("");
      setShowRoundsInput(false);
      setError("");
      fetchCompanies();
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Failed to update company. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredCompanies(
      companies.filter((company) =>
        company.companyname.toLowerCase().includes(searchValue)
      )
    );
  };

  return (
    <div
      className="font-poppins bg-cover bg-no-repeat bg-center min-h-screen flex flex-col items-center text-black p-4 sm:p-2 pt-6 sm:pt-4 box-border"
      style={{ backgroundImage: "url('/Screenshot 2025-02-21 143339.png')" }}
    >
      <h1 className="text-4xl sm:text-3xl font-semibold text-black mb-6 sm:mb-4 text-center">
        Company Management
      </h1>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      <div className="flex items-center md:items-center gap-3.5 w-full max-w-4xl p-3.5 bg-white/40 rounded-lg backdrop-blur-md shadow-lg mb-5 flex-col md:flex-row">
        <input
          type="text"
          className="flex-1 max-w-[250px] md:max-w-none p-2.5 sm:p-2 rounded-lg border-none text-center bg-white/50 text-black focus:border-2 focus:border-blue-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="flex gap-2.5 flex-col md:flex-row w-full">
          <input
            type="text"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value.toUpperCase());
              setShowRoundsInput(e.target.value.trim() !== "");
            }}
            className="flex-1 p-2.5 sm:p-2 rounded-lg border-none text-center bg-white/50 text-black focus:border-2 focus:border-blue-200 focus:ring-4 focus:ring-blue-300 focus:outline-none placeholder-black/50"
          />

          {showRoundsInput && (
            <input
              type="number"
              min="1"
              placeholder="Enter total rounds"
              value={totalRounds}
              onChange={(e) => setTotalRounds(e.target.value)}
              className="flex-1 p-2.5 sm:p-2 rounded-lg border-none text-center bg-white/50 text-black focus:border-2 focus:border-blue-200 focus:ring-4 focus:ring-blue-300 focus:outline-none placeholder-black/50"
            />
          )}
        </div>

        <button
          className="p-2.5 px-3.5 sm:p-2 sm:px-3 rounded-md bg-black text-white font-bold text-base sm:text-sm hover:scale-105 transition-all duration-300 w-full md:w-auto"
          onClick={editingCompany ? updateCompany : addCompany}
        >
          {editingCompany ? "Update" : "Add"}
        </button>
      </div>
      {filteredCompanies.length === 0 ? (
        <p className="text-center text-xl sm:text-lg text-black font-bold mt-5">
          No companies found. Add one now!
        </p>
      ) : (
        <div className="flex flex-wrap gap-3.5 justify-center p-5 sm:p-3 w-full">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white/50 p-3.5 sm:p-3 rounded-lg shadow-md text-center w-[250px] sm:w-full sm:max-w-[300px] min-h-[150px] sm:min-h-[120px] flex flex-col justify-between items-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:border-2 hover:border-gray-200"
            >
              <Link
                to={`/company/${company._id}`}
                className="text-xl sm:text-lg font-bold text-black no-underline hover:text-gray-800"
              >
                {company.companyname}
              </Link>
              <p className="text-base">Total Rounds: {company.totalRounds}</p>
              <div className="flex gap-2.5">
                <button
                  className="p-2 sm:p-1.5 mt-2 bg-blue-200 text-black text-sm sm:text-xs rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
                  onClick={() => startEdit(company)}
                >
                  Edit
                </button>
                <button
                  className="p-2 sm:p-1.5 mt-2 bg-gray-300/60 text-black text-sm sm:text-xs rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                  onClick={() => deleteCompany(company._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
