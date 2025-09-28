import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CandidateNav = () => {
  return (
    <>
      <div className="w-full h-auto flex flex-wrap justify-center text-black gap-6 p-2 shadow-lg">
        <Link
          to="/Candidate/Candidate"
          className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Candidate
        </Link>
        <Link
          to="/test-manager/management"
          className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Current Affairs
        </Link>
        <Link
          to="/test-manager/course"
          className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Documents
        </Link>
        <Link
          to="/test-manager/course"
          className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Group
        </Link>
        <Link
          to="/test-manager/course"
          className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Import Data
        </Link>
      </div>
      
      <Outlet />
    </>
  );
};

export default CandidateNav;
