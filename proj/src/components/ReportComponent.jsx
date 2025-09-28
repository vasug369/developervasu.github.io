import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import ReportSubnav from "./Report_subnav";
import ReportLeftPane from "./Report_leftpane";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';



const ReportComponent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  
  // Filter states
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");
  const [credibility, setCredibility] = useState("");

  useEffect(() => {
    const token=localStorage.getItem("token");
    if(!token){
      navigate('/');
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reports");
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports.");
      setLoading(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(search.toLowerCase()) &&
    (group ? report.group === group : true) &&
    (date ? report.start_date.includes(date) : true) &&
    (credibility ? report.credibility === credibility : true)
  );

  return (
    <>
     
      <div className="main flex">
        <div className="leftpane">
          <ReportLeftPane />
        </div>

        <div className="rightcontent border-l w-full overflow-x-auto">

          <ReportSubnav 
            search={search} 
            setSearch={setSearch} 
            group={group} 
            setGroup={setGroup}
            date={date}
            setDate={setDate}
            credibility={credibility}
            setCredibility={setCredibility}
          />
          
          <div className="p-6 pl-0">
            {loading ? (
              <p>Loading reports...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
<div className="border border-gray-300 overflow-x-auto">
  <div className="max-h-96 overflow-y-auto w-full">
    <table className="min-w-full border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-4 py-2 sticky left-0 bg-gray-200 z-20">S.No</th>
          <th className="border px-4 py-2 sticky left-14 bg-gray-200 z-20">Name</th>
          <th className="border px-4 py-2">Start Date</th>
          <th className="border px-4 py-2">End Date</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Group</th>
          <th className="border px-4 py-2">Attempts</th>
          <th className="border px-4 py-2">Correct</th>
          <th className="border px-4 py-2">Incorrect</th>
          <th className="border px-4 py-2">Skipped</th>
          <th className="border px-4 py-2">Marks</th>
          <th className="border px-4 py-2">Ranks</th>
          <th className="border px-4 py-2">Credibility Score</th>
          <th className="border px-4 py-2">Total UFM's</th>
          <th className="border px-4 py-2">Suspended Count</th>
          <th className="border px-4 py-2">Verified Image</th>
          <th className="border px-4 py-2">Candidate Image-1</th>
          <th className="border px-4 py-2">Candidate Image-2</th>
          <th className="border px-4 py-2">Test End By Proctor</th>
          <th className="border px-4 py-2">IP Address</th>
        </tr>
      </thead>
      <tbody>
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <motion.tr  
            
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
            key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2 sticky left-0 bg-white z-10">{index + 1}</td>
              <td className="border px-4 py-2 sticky left-14 bg-white z-10">{report.name}</td>
              <td className="border px-4 py-2">{report.start_date}</td>
              <td className="border px-4 py-2">{report.end_date}</td>
              <td className="border px-4 py-2">{report.email}</td>
              <td className="border px-4 py-2">{report.group}</td>
              <td className="border px-4 py-2">{report.attempts}</td>
              <td className="border px-4 py-2">{report.correct}</td>
              <td className="border px-4 py-2">{report.incorrect}</td>
              <td className="border px-4 py-2">{report.skipped}</td>
              
              <td className="border px-4 py-2">{report.marks}</td>
              <td className="border px-4 py-2">{report.ranks}</td>
              <td className="border px-4 py-2">{report.credibility_score}</td>
              <td className="border px-4 py-2">{report.total_ufm}</td>
              <td className="border px-4 py-2">{report.suspended_count}</td>
              <td className="border px-4 py-2">
              {report.verified_image ? (
                                <img src={report.verified_image} alt="Verified" className="w-20 h-20 object-cover" />
                              ) : (
                                "No Image"
                              )}
                </td>
              <td className="border px-4 py-2">
              {report.verified_image ? (
                                <img src={report.candidate_image_1} alt="Verified" className="w-20 h-20 object-cover" />
                              ) : (
                                "No Image"
                              )}
                </td>
              <td className="border px-4 py-2">
              {report.verified_image ? (
                                <img src={report.candidate_image_2} alt="Verified" className="w-20 h-20 object-cover" />
                              ) : (
                                "No Image"
                              )}
                </td>
              <td className="border px-4 py-2">{report.test_end_by_proctor}</td>
              <td className="border px-4 py-2">{report.ip_address}</td>
            </motion.tr>
          ))
        ) : (
          <tr>
            <td colSpan="20" className="text-center py-4">No matching reports found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportComponent;
