import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-center items-center min-h-screen w-screen p-4 bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-white/10 p-8 sm:p-6 xs:p-4 rounded-xl shadow-lg text-center w-full max-w-md mx-auto transition-all duration-300">
        <h1 className="text-4xl sm:text-3xl xs:text-2xl font-semibold text-black mb-6 sm:mb-5">
          Welcome to VCET Placement Portal!
        </h1>
        <button
          className="w-full py-3 sm:py-2.5 xs:py-2 bg-blue-500 text-white text-base sm:text-sm font-bold rounded-lg mb-2.5 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => navigate("/companies")}
        >
          Manage Companies
        </button>
        <button
          className="w-full py-3 sm:py-2.5 xs:py-2 bg-blue-500 text-white text-base sm:text-sm font-bold rounded-lg mb-2.5 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => navigate("/students")}
        >
          Manage Students
        </button>
      </div>
    </div>
  );
};

export default Home;
