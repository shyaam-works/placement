import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import "./CompanyPage.css";

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
      sessionStorage.getItem("isAuthenticated") === "true"; // Use sessionStorage
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
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
    <div className="company-container">
      <h1>Company Management</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="type-container">
        <input
          type="text"
          className="searchbar"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="company-form">
          <input
            type="text"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value.toUpperCase());
              setShowRoundsInput(e.target.value.trim() !== "");
            }}
          />

          {showRoundsInput && (
            <input
              type="number"
              min="1"
              placeholder="Enter total rounds"
              value={totalRounds}
              onChange={(e) => setTotalRounds(e.target.value)}
            />
          )}
        </div>

        {editingCompany ? (
          <button className="company-button" onClick={updateCompany}>
            Update
          </button>
        ) : (
          <button className="company-button" onClick={addCompany}>
            Add
          </button>
        )}
      </div>
      {filteredCompanies.length === 0 ? (
        <p className="empty-message">No companies found. Add one now!</p>
      ) : (
        <div className="company-card-container">
          {filteredCompanies.map((company) => (
            <div className="company-card" key={company._id}>
              <Link to={`/company/${company._id}`} className="company-name">
                {company.companyname}
              </Link>
              <p>Total Rounds: {company.totalRounds}</p>
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => startEdit(company)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
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
