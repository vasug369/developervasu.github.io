import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CandidateNav from "./Candidate_nav";
import { FaPlus, FaRegCircleUser } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";
import img from '../assets/contact_icon.png';
import axios from "axios";
import FilterNav from "./Filter_nav";
import { motion } from "framer-motion";
import Candidate_Filter_nav from "./Candidate_Filter_nav"
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Candidate = () => {
  const [fileName,setFileName]=useState('');
  const [showPopup,setShowPopup]=useState(false);
  const [rowDropdownOpen, setRowDropdownOpen] = useState(null); // Separate state for row dropdowns
  const navigate=useNavigate();
  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRow = currentPage * itemsPerPage; // Last row index
const indexOfFirstRow = indexOfLastRow - itemsPerPage; // First row index

const [tableData, setTableData] = useState([]);
const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
const [loading,setLoading]=useState(true);

const fetchTableData = async () => {
  await axios.get('http://localhost:8000/api/index')
    .then((response) => {
      console.log(response.data);
      setTableData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
};


useEffect(() => {
  const token=localStorage.getItem("token");
  if(!token){
    navigate('/');
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  fetchTableData();
  // console.log(tableData);
}, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    enrollment_number: "", // updated key
    registration_date: "", // updated key
    phone_number: "", // updated key
    dob: "", // updated key
    gender: "",
    address: "",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    uploads: {
      profilePhoto: null,
      signature: null,
      idProof: null,
    },
  });

  const togglePopup=()=>{
    setShowPopup(!showPopup);
  }
  


  const handleSave = (e) => {
    e.preventDefault();
    handleSubmit('saveAndNew');
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setFormData((prevState) => ({
        ...prevState,
        uploads: {
          ...prevState.uploads,
          [field]: file, // Store file object
          [`${field}Name`]: file.name, // Dynamically store file name
        },
      }));
    }
  };
  
  const  toggleRowDropdown=(index)=>{
    setRowDropdownOpen((prev)=>console.log(prev));
    // console.log(index);
    setRowDropdownOpen(prev=>prev===index?null:index);


  }

  const handleSubmit = async (action) => {
    const formPayload = new FormData();
    for (const key in formData) {
      if (key === "uploads") {
        for (const uploadKey in formData.uploads) {
          formPayload.append(uploadKey, formData.uploads[uploadKey]);
        }
      } else {
        formPayload.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("http://localhost:8000/api/candidates", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Candidate data saved successfully!");
      fetchTableData();
      if (action === "saveAndNew") {
        setFormData({
          email: "",
          password: "",
          name: "",
          enrollment_number: "",
          registration_date: "",
          phone_number: "",
          dob: "",
          gender: "",
          address: "",
          country: "",
          state: "",
          city: "",
          uploads: {
            profilePhoto: null,
            signature: null,
            idProof: null,
          },
        });

        setShowPopup(false);
        
        
      }
    } catch (error) {
      console.error("Error saving candidate data:", error);
      alert("Failed to save candidate data. Please try again.");
    }
  };

  return (
    <>  
     
      <Candidate_Filter_nav  customAddButton={<button onClick={togglePopup} className="flex  justify-center bg-blue-700 text-white px-6 py-2 rounded-md"><FaPlus className="mt-1"/>Add</button>}/>

      <div className="mt-4 overflow-y-auto max-h-[70vh]">
        <table className="w-full border-collapse text-left">
      
                <thead className="bg-white border-b">
                <tr className="h-[60px] border-b">
                  <th className="p-[4px] text-left whitespace-nowrap">S No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone No.</th>
                  <th className="px-4 py-2 whitespace-nowrap">Enrollment No.</th>
                  <th className="px-4 py-2 whitespace-nowrap">Registration Date</th>
                  <th className="px-4 py-2">DOB</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2 whitespace-nowrap">Profile Photo</th>
                  <th className="px-4 py-2">Signature</th>
                  <th className="px-4 py-2 whitespace-nowrap">ID Proof</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>

                </thead>
                <tbody>
                {loading ? (
              // Skeleton Loading Effect
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-2"><div className="h-4 w-8 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-24 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-32 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-16 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-28 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-24 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-12 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-36 bg-gray-300 rounded"></div></td>
                  <td className="px-4 py-2"><div className="h-4 w-10 bg-gray-300 rounded"></div></td>
                </tr>
              ))
            ) : (
  currentRows.map((row, index) => (
    <motion.tr  
   
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
     key={index} className={`h-[20px] hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} `}>
      <td className="border-b-2 px-4 py-1">{indexOfFirstRow + index + 1}</td>
      <td className="border-b-2 px-4 py-1">{row.name}</td>
      <td className="border-b-2 px-4 py-1">{row.email}</td>
      <td className="border-b-2 px-4 py-1">{row.phone_number}</td>
      <td className="border-b-2 px-4 py-1">{row.enrollment_number}</td>
      <td className="border-b-2 px-4 py-1">{row.registration_date}</td>
      <td className="border-b-2 px-4 py-1 whitespace-nowrap">{row.dob}</td>
      <td className="border-b-2 px-4 py-1">{row.gender}</td>
      <td className="border-b-2 px-4 py-1">{row.address}</td>
      <td className="border-b-2 px-4 py-1">{row.country}</td>
      <td className="border-b-2 px-4 py-1">{row.state}</td>
      <td className="border-b-2 px-4 py-1">{row.city}</td>

      {/* Profile Photo */}
      <td className="border-b-2 px-4 py-2">
        {row.profile_photo ? <img src={row.profile_photo} alt="Profile" className="w-12 h-6" /> : "N/A"}
      </td>

      {/* Signature */}
      <td className="border-b-2 px-4 py-2">
        {row.signature ? <img src={row.signature} alt="Signature" className="w-12 h-6" /> : "N/A"}
      </td>

      {/* ID Proof */}
      <td className="border-b-2 px-4 py-2">
        {row.id_proof ? <img src={row.id_proof} alt="Signature" className="w-12 h-6" /> : "N/A"}
      </td>

      {/* Actions Dropdown */}
      <td className="border-b-2 px-4 py-2">
        <div className="relative">
          <BsThreeDots onClick={() => toggleRowDropdown(index)} className="cursor-pointer" />
          {rowDropdownOpen === index && (
            <div className="absolute top-5 right-0 z-10 bg-white shadow-md rounded-md">
              <button onClick={() => handleDeleteRow(row.id)} className="px-4 py-2 w-full text-left text-red-600">Delete</button>
              <button onClick={() => handleEdit(row)} className="px-4 py-2 w-full text-left">Edit</button>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  )))}
</tbody>

              </table>
            </div>



      {showPopup &&
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
             <form className="bg-white p-6 rounded-md w-[1200px] max-h-[90vh] overflow-y-auto" enctype="multipart/form-data" onSubmit={handleSave}>

             
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Candidate</h1>
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
            {/* Login Details */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Login Detail</h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-600 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="demo@thinkexam.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-gray-600 font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="****"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Candidate Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="demo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Enrollment Number</label>
                  <input
                    type="text"
                    name="enrollment_number"
                    value={formData.enrollment_number}
                    onChange={handleInputChange}
                    placeholder="ENR123456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Date of Registration</label>
                  <input
                    type="date"
                    name="registration_date"
                    value={formData.registration_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="9856327789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Gender</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-500"
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-500"
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Address Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {["India", "USA", "Canada", "Australia", "Germany", "France", "Italy", "Japan", "China", "Brazil"].map(
                      (country, idx) => (
                        <option key={idx}>{country}</option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {["Delhi", "California", "Texas", "Florida"].map((state, idx) => (
                      <option key={idx}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {["New Delhi", "Los Angeles", "Miami", "Dallas"].map((city, idx) => (
                      <option key={idx}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Uploads */}
            {/* <div className="mb-6">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Uploads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Profile Photo</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "profilePhoto")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">Signature</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "signature")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-2">ID Proof</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "idProof")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
             */}
          </div>

          {/* Right Section (Profile Picture, etc.) */}
          <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
          <h1 className="font-bold">Upload</h1>
          <div className="grid grid-cols-2 gap-2 py-1 ">
              {[
               { label: "Profile Photo", image: "../public/Image1.png", field: "profilePhoto" },
               { label: "Signature", image: "../public/Image2.png", field: "signature" },
               { label: "ID Proof", image: "../public/Image3.png", field: "idProof" },
               { label: "New Me", image: "../public/Image4.png", field: "newMe" },
               { label: "Other Identifications", image: "../public/Image4.png", field: "otherIdentifications" },
                { label: "other identifications", image: "../public/Image4.png" ,field: "otherIdentifications1"},
              ].map((item, index) => (
                <>
                 <div className="pack ">

                  <div className="item mt-8 w-[100px] ">

                  <h2 className="text-gray-500">{item.label}</h2>
                  <div key={index} className="text-center mt-2 bg-gray-100 rounded-lg mt-2 w-36 h-15  ">
                    <input type="file"
                    id={`file-input-${index}`}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, item.field)} // Dynamically pass the field name
                  />
                  <label htmlFor={`file-input-${index}`} className="hover:cursor-pointer">
                    <img src={img} alt={item.label} className="w-72 h-30 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">{item.label}</p>
                  </label>
                  </div>


        {formData.uploads[`${item.field}Name`] && (
        <h3 className="mt-2 text-green-700 flex text-center whitespace-nowrap">
          {formData.uploads[`${item.field}Name`]}
        </h3>
      )}
                  
                  </div>
                 </div>
                </>
                ))}
          </div>
          <div className="flex gap-2 mt-20 mb-16 ml-28 ">
              <button
                
                className="bg-white text-black shadow-md font-bold px-4 py-2 rounded-md"
              >
                Save & Add New
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md"
              >
                Cancel
              </button>
            </div>
        </div>
      </div>
      </form>
      </div>
      }
     
    </>
  );
};

export default Candidate;
