import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { IoFilterSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const FilterNav = ({ onFilter, onDelete, actions, dropDown, customAddButton }) => {
    const [toggle, setToggle] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");

    const toggleHandler = () => {
        setToggle(!toggle);
    };

    const handleFilterClick = async (filter, e) => {
        if (e) e.stopPropagation();

        try {
            const response = await axios.get(`http://localhost:8000/api/filter/${filter}`);
            setSelectedFilter(filter);
            onFilter(filter);
            setToggle(false);
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    };

    return (
        <div className="flex flex-wrap bg-gray-200 rounded-xl shadow-md mt-0 lg:h-16">
            {/* Left Section - Filter Dropdown and Search Input */}
            <div className=" lg:flex lg:items-center ">
                {/* Filter Dropdown */}
                <div className="relative bg-white">
                    <button 
                        onClick={toggleHandler} 
                        className="p-2 w-screen border font-bold border-gray-300 rounded-md text-sm lg:w-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:mt-0"
                    >
                        <IoFilterSharp className="inline-block mr-2" />
                        {selectedFilter || "Filter"}
                    </button>
                    {toggle && (
                        <ul className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                            {["All", "Active", "Completed", "Pending"].map((filter) => (
                                <li
                                    key={filter}
                                    className="p-2 h-[42px] hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => handleFilterClick(filter, e)}
                                >
                                    {filter}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Search Input */}
            </div>
            <div className="flex">

                <div>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by Test Name"
                        className="ml-2 w-11/12 lg:ml-4 px-2 py-2 h-[42px] mt-2 w-[183px] border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-64 lg:mt-2"
                        />
                </div>

                {/* Apply Button */}
                <button
                    onClick={onFilter}
                    className="mt-2 h-11 ml-2 bg-blue-700 text-white px-4 py-2 rounded-md shadow lg:h-12 lg:mt-2 "
                    >
                    Search
                </button>
                    </div>

            {/* Right Section - Add and Delete Buttons */}
            <div className="flex p-2 gap-3 lg:flex lg:items-center lg:ml-[790px] lg:gap-4 lg:p-0">
                {/* Use Custom Add Button if provided, otherwise use the default */}
                {customAddButton ? (
                    customAddButton
                ) : (
                    <button
                        onClick={() => console.log("Default Add Clicked")}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow flex items-center gap-2"
                    >
                        Add <FaPlus />
                    </button>
                )}

                <button
                    onClick={onDelete}
                    className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-md font-bold"
                >
                    {actions === 1 ? (
                        <button onClick={dropDown}>Actions</button>
                    ) : (
                        <>
                            <Trash2 className="h-5 w-5" />
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FilterNav;

