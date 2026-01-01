import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import BarLoader from "../components/BarLoader";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [totalRounds, setTotalRounds] = useState("");
  const [minXth, setMinXth] = useState("");
  const [minXIIth, setMinXIIth] = useState("");
  const [minAggregateUG, setMinAggregateUG] = useState("");
  const [showRoundsInput, setShowRoundsInput] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/comp");
      setCompanies(res.data.data.allcompanies);
      setFilteredCompanies(res.data.data.allcompanies);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch companies");
      console.error(error);
    }
  };

  const addCompany = async () => {
    try {
      await axiosInstance.post("/comp", {
        companyname: companyName,
        totalRounds: parseInt(totalRounds, 10),
        minXth: parseFloat(minXth) || 0,
        minXIIth: parseFloat(minXIIth) || 0,
        minAggregateUG: parseFloat(minAggregateUG) || 0,
      });
      toast.success("company added successfully!", {
        style: { backgroundColor: "#3B82F6", color: "#fff" },
      });
      resetForm();
      fetchCompanies();
    } catch (error) {
      if (totalRounds === "") {
        toast.warn("enter rounds to add company");
      } else toast.error("failed to add try again later");
      console.log(error);
    }
  };

  const updateCompany = async () => {
    try {
      await axiosInstance.patch(`comp/${editingCompany._id}`, {
        companyname: companyName,
        totalRounds: parseInt(totalRounds, 10),
        minXth: parseFloat(minXth) || 0,
        minXIIth: parseFloat(minXIIth) || 0,
        minAggregateUG: parseFloat(minAggregateUG) || 0,
      });
      resetForm();
      fetchCompanies();
      toast.success("company updated successfully!", {
        style: { backgroundColor: "#3B82F6", color: "#fff" },
      });
    } catch (error) {
      toast.error("failed to update try again later");
      console.log(error);
    }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;

    try {
      await axiosInstance.delete(`/comp/${id}`);
      fetchCompanies();
      toast.success("Company deleted successfully", {
        style: { backgroundColor: "#EF4444", color: "#fff" },
      });
    } catch (error) {
      toast.error("Failed to delete company");
      console.error(error);
    }
  };

  const startEdit = (company) => {
    setEditingCompany(company);
    setCompanyName(company.companyname);
    setTotalRounds(company.totalRounds.toString());
    setMinXth(company.minXth?.toString() || "");
    setMinXIIth(company.minXIIth?.toString() || "");
    setMinAggregateUG(company.minAggregateUG?.toString() || "");
    setShowRoundsInput(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingCompany(null);
    setCompanyName("");
    setTotalRounds("");
    setMinXth("");
    setMinXIIth("");
    setMinAggregateUG("");
    setShowRoundsInput(false);
  };

  const handleSearch = (e) => {
    const v = e.target.value.toLowerCase();
    setSearchTerm(v);
    setFilteredCompanies(
      companies.filter((c) => c.companyname.toLowerCase().includes(v))
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADING */}
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Company Management
        </h1>

        {/* SEARCH + ADD */}
        <div
          className="max-w-5xl mx-auto
                     bg-gradient-to-br from-white to-indigo-50
                     border border-indigo-200
                     rounded-2xl shadow-lg
                     p-5 space-y-4"
        >
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 rounded-lg
                       border border-indigo-200
                       focus:ring-2 focus:ring-indigo-400
                       outline-none"
          />

          <input
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value.toUpperCase());
              setShowRoundsInput(e.target.value.trim() !== "");
            }}
            className="w-full p-3 rounded-lg
                       border border-indigo-200
                       focus:ring-2 focus:ring-indigo-400
                       outline-none"
          />

          {showRoundsInput && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="number"
                placeholder="Rounds"
                value={totalRounds}
                onChange={(e) => setTotalRounds(e.target.value)}
                className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Min Xth %"
                value={minXth}
                onChange={(e) => setMinXth(e.target.value)}
                className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Min XIIth %"
                value={minXIIth}
                onChange={(e) => setMinXIIth(e.target.value)}
                className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Min UG %"
                value={minAggregateUG}
                onChange={(e) => setMinAggregateUG(e.target.value)}
                className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          <button
            onClick={editingCompany ? updateCompany : addCompany}
            className="w-full py-3 font-semibold text-white rounded-lg
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:from-indigo-700 hover:to-purple-700
                       transition"
          >
            {editingCompany ? "Update Company" : "Add Company"}
          </button>
        </div>

        {/* COMPANY CARDS */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <BarLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="
                  bg-white/90
                  border border-gray-200
                  rounded-2xl
                  p-8
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  active:scale-[0.98]
                "
              >
                <Link
                  to={`/company/${company._id}`}
                  className="block text-xl font-bold tracking-tight text-center text-gray-900 mb-1"
                >
                  {company.companyname}
                </Link>

                <p className="text-sm text-center text-gray-600 mt-2">
                  Total Rounds:{" "}
                  <span className="font-semibold text-gray-800">
                    {company.totalRounds}
                  </span>
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => startEdit(company)}
                    className="flex-1 py-2 rounded-lg font-semibold text-white
                               bg-gradient-to-r from-indigo-600 to-purple-600
                               hover:from-indigo-700 hover:to-purple-700
                               transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCompany(company._id)}
                    className="flex-1 py-2 rounded-lg font-semibold
                               bg-indigo-50 text-indigo-700
                               border border-indigo-200
                               hover:bg-red-600 hover:text-white
                               transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
