import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import "./../index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post(`/login`, {
        username,
        password,
      });

      if (res.data.status === "success") {
        navigate("/home");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 sm:p-6 xs:p-4 rounded-lg shadow-md w-full max-w-md flex flex-col items-center transition-all duration-300 mx-4"
      >
        <div className="text-3xl sm:text-2xl xs:text-xl font-semibold text-gray-800 mb-6 sm:mb-5 text-center">
          Login
        </div>

        <label
          htmlFor="username"
          className="self-start mb-1 text-gray-600 text-sm sm:text-xs"
        >
          Username
        </label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 sm:p-2.5 mb-5 sm:mb-4 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300"
        />

        <label
          htmlFor="password"
          className="self-start mb-1 text-gray-600 text-sm sm:text-xs"
        >
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 sm:p-2.5 mb-5 sm:mb-4 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full p-3 sm:p-2.5 bg-blue-600 text-white rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
