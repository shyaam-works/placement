// src/pages/LandingPage.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const pageAnimation = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 sm:px-6">
      <motion.div
        className="max-w-6xl w-full"
        variants={pageAnimation}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* LEFT TOP — TITLE */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                Placement Portal
              </h1>
              <p className="text-gray-600 text-lg">
                A centralized platform to manage students, companies, placement
                rounds, and performance analytics — designed for real-world
                placement workflows.
              </p>
            </div>

            {/* RIGHT TOP — AI HIGHLIGHT */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-3">
                AI-Assisted, Bias-Reduced Insights
              </h2>
              <p className="text-indigo-100">
                Student rankings are generated using consistent, data-driven
                scoring signals to support fair and unbiased shortlisting
              </p>
            </div>

            {/* LEFT BOTTOM — DETAILS */}
            <div className="flex flex-col justify-center space-y-3">
              <p className="text-gray-700 font-medium">
                ✔ Company-wise round tracking
              </p>
              <p className="text-gray-700 font-medium">
                ✔ Student performance analytics
              </p>
              <p className="text-gray-700 font-medium">
                ✔ Transparent ranking logic
              </p>
              <p className="text-gray-700 font-medium">
                ✔ Built with scalability in mind
              </p>
            </div>

            {/* RIGHT BOTTOM — BUTTONS */}
            <div className="flex flex-col justify-end gap-4">
              <Link
                to="/login"
                className="w-full text-center px-6 py-3 rounded-xl text-base font-semibold text-white
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           shadow-md hover:shadow-lg
                           hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Login to Dashboard
              </Link>

              <a
                href="https://github.com/shyaam-works/placement"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-3 rounded-xl text-base font-semibold text-indigo-700
                           bg-indigo-50 border border-indigo-200
                           hover:bg-indigo-100 transition"
              >
                View Project Repository
              </a>
            </div>
          </div>

          {/* FOOTER */}
          <p className="mt-8 sm:mt-10 text-center text-sm text-gray-400">
            Scalable • Data-driven • AI-assisted decision support
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
