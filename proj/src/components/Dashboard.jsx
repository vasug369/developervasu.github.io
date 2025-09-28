import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Skeleton Loaders
const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse w-full sm:w-72 p-3 shadow-lg h-[80px] rounded-lg flex flex-col items-center justify-center">
    <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
    <div className="h-6 w-16 bg-gray-400 rounded"></div>
  </div>
);

const SkeletonActivity = () => (
  <div className="p-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="animate-pulse flex items-center space-x-3 mb-3">
        <div className="h-5 w-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-400 rounded"></div>
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

function Dashboard() {
    const [recentActivities, setRecentActivities] = useState([]);
    const [totalCan, setTotalCan] = useState(0);
    const [totalTest, setTotalTest] = useState(0);
    const [activeTest, setActiveTest] = useState(0);
    const [reportGen, setReportGen] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/');
        }
        axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
        if (!token) {
            navigate('/'); // Redirect to login if token is missing
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [recentActivitiesRes, testCountRes, candidateCountRes, reportGenRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/recent-activities', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:8000/api/tests/count"),
                    axios.get("http://localhost:8000/api/candidates/count"),
                    axios.get("http://localhost:8000/api/report/count"),
                ]);

                setRecentActivities(recentActivitiesRes.data || []);
                setActiveTest(testCountRes.data.count || 0);
                setTotalCan(candidateCountRes.data.count || 0);
                setReportGen(reportGenRes.data.count || 0);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        // const intervalId = setInterval(fetchDashboardData, 10000);
        // return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <h1 className="text-2xl m-2 font-bold text-[#1C2674]">Welcome to Your Dashboard</h1>
            <div className="title px-2 flex justify-center text-1xl mt-5 font-bold">
                Here's a quick overview of your platform's performance
            </div>

            {/* Dashboard Cards with Lazy Loading */}
            <div className="cards flex flex-wrap justify-between m-3 mt-6 gap-4">
                {loading ? <SkeletonCard /> : (
                    <div className="total_can flex flex-col items-center justify-center bg-white w-full sm:w-72 p-3 shadow-lg h-[80px] rounded-lg">
                        <h2>Total Candidates</h2>
                        <h1 className="font-bold">{totalCan}</h1>
                    </div>
                )}
                {loading ? <SkeletonCard /> : (
                    <div className="tests_taken flex flex-col items-center justify-center bg-white w-full sm:w-72 p-3 shadow-lg h-[80px] rounded-lg">
                        <h2>Tests Taken</h2>
                        <h1 className="font-bold">{totalTest}</h1>
                    </div>
                )}
                {loading ? <SkeletonCard /> : (
                    <div className="active_test flex flex-col items-center justify-center bg-white w-full sm:w-72 p-3 shadow-lg h-[80px] rounded-lg">
                        <h2>Active Tests</h2>
                        <h1 className="font-bold">{activeTest}</h1>
                    </div>
                )}
                {loading ? <SkeletonCard /> : (
                    <div className="report_gen flex flex-col items-center justify-center bg-white w-full sm:w-72 p-3 shadow-lg h-[80px] rounded-lg">
                        <h2>Reports Generated</h2>
                        <h1 className="font-bold">{reportGen}</h1>
                    </div>
                )}
            </div>

            {/* Recent Activity Section with Lazy Loading */}
            <div className="recent_container pt-28">
                <h1 className="text-[#1C2674] font-bold text-lg mb-3  ml-5">Recent Activity</h1>
                <div className="recent overflow-y-auto max-h-[300px] bg-white shadow-md m-4 p-4 rounded-md">
                    {loading ? <SkeletonActivity /> : (
                        recentActivities.length > 0 ? (
                            <ul className="space-y-2">
                                {recentActivities.map((activity, index) => (
                                    <li key={index} className="flex items-center border-b last:border-none py-2">
                                        <span className="text-[#1C2674] font-medium">{localStorage.getItem('user_name')}</span>
                                        <span className="mx-2 text-gray-500">
                                            {activity.isResponse1 ? "added a candidate successfully:" : "created a test:"}
                                        </span>
                                        <span className="font-semibold text-[#1C2674]">{activity.name}</span>
                                        <span className="ml-3 text-sm text-gray-400">({activity.created_at})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center">No recent activity yet.</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
