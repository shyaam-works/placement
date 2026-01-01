// src/components/Navbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./../components/inoutLoader"; // 👈 IMPORT LOADER

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // change password states
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // logout loader
  const [logoutLoading, setLogoutLoading] = useState(false);

  // visibility toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true); // 👈 SHOW FULL PAGE LOADER

    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully!", {
        style: { backgroundColor: "#3B82F6", color: "#fff" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLogoutLoading(false); // 👈 HIDE LOADER
      navigate("/login", { replace: true });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/auth/changepw", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully", {
        style: { backgroundColor: "#3B82F6", color: "#fff" },
      });

      setShowChangePw(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* 🔥 FULL PAGE LOADER FOR LOGOUT */}
      {logoutLoading && <Loader />}

      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-indigo-700 transition"
            onClick={() => navigate("/home")}
          >
            VCET Placement Portal
          </h1>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white/30 transition"
            >
              <span className="text-2xl font-bold text-gray-800">⋮</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 backdrop-blur-md bg-white/80 border border-white/40 rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    setShowChangePw(true);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-indigo-50 transition"
                >
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Change Password Modal */}
      {showChangePw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-center text-indigo-700">
              Change Password
            </h2>

            {/* Current Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-indigo-300 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showCurrentPw ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((p) => !p)}
                className="text-gray-500 ml-2"
              >
                {showCurrentPw ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* New Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-indigo-300 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showNewPw ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPw((p) => !p)}
                className="text-gray-500 ml-2"
              >
                {showNewPw ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 mb-6 focus-within:ring-2 focus-within:ring-indigo-300 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showConfirmPw ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((p) => !p)}
                className="text-gray-500 ml-2"
              >
                {showConfirmPw ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChangePw(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
