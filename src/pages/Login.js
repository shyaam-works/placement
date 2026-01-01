import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { toast } from "react-toastify";
import Loader from "../components/inoutLoader";
import "react-toastify/dist/ReactToastify.css";
import "./../index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        setLoading(true);
        await axiosInstance.get("/comp");
        navigate("/home", { replace: true });
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    };
    checkIfLoggedIn();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (res.data.status === "success") {
        toast.success("Logged in successfully!", {
          style: { backgroundColor: "#3B82F6", color: "#fff" },
        });
        navigate("/home");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-8 sm:p-10 flex flex-col gap-6"
        >
          <div className="flex items-center justify-center text-4xl font-bold text-indigo-700 gap-2 mb-6">
            <AiOutlineLogin className="text-indigo-600" />
            Admin Login
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-300 transition">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none text-base bg-transparent"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-300 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-base bg-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-indigo-600 transition"
                disabled={loading}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-60"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
