import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { IoFilterSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
const FilterNav = ({ onFilter, onAdd, onDelete ,actions,dropDown}) => {
    const [toggle,setToggle]=useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    
    
    const toggleHandler=(e)=>{
        // e.stopPropagation();
        setToggle(!toggle);
    }
    const handleFilterClick = async (filter, e) => {
      if (e) e.stopPropagation(); // Prevent event propagation if needed
    
      try {
        // Use backticks for template literals
        const response = await axios.get(`http://localhost:8000/api/filter/${filter}`);
        
        setSelectedFilter(filter); // Update the state
        onFilter(filter); // Pass selected filter to parent
        setToggle(false); // Close dropdown after selection
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    
  
  return (
    <div className="flex flex-wrap bg-gray-200 items-center justify-between p-4 shadow-md mt-0 ">
      {/* Left Section - Filter Dropdown and Search Input */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter Dropdown */}
        <div className="relative">
  <button onClick={toggleHandler} className="p-2 border font-bold border-gray-300 bg-white rounded-md text-sm w-32 text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
    <IoFilterSharp className="inline-block mr-2" />
    {selectedFilter || "Filter"}
  </button>
    {toggle &&
    <ul className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md ">
    {["All", "Active", "Completed", "Pending"].map((filter) => (
      <li
        key={filter}
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={(e) => handleFilterClick(filter,e)}
      >
        {filter}
      </li>
    ))}
  </ul>
}
</div>

        {/* Search Input */}
        <div>
          
          <input
            id="search"
            type="text"
            placeholder="Search by Test Name"
            className=" p-2 w-64 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Apply Button */}
        <button
          onClick={onFilter}
          className="bg-blue-700 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Right Section - Add and Delete Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onAdd}
          className="bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center gap-2"
        >
          Add<FaPlus />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 bg-white font-bold text-black px-4 py-2 rounded-md hover:bg-red-100"
        >
          {actions==1?<button onClick={dropDown}>Actions</button>:
          <>
          <Trash2 className="h-5 w-5" />
          Delete
          </>
}
        </button>
      </div>
    </div>
  );
};

export default FilterNav;