import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import img from '../assets/dashboard_logo.png';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { CiCircleQuestion } from 'react-icons/ci';
import imgl from '../assets/vg_icon.png';
import axios from 'axios';
import Profile from './Profile';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(false);

  const navigate = useNavigate();
  const [profile,SetProfile]=useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleLogout = async () => {
    try {
        await axios.delete('http://localhost:8000/api/deleteToken', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        // Clear local storage and redirect
        localStorage.clear();
        navigate('/');
    } catch (error) {
        console.error('Logout Failed:', error);
    }
  };

  const handleHomeToggle=()=>{
    setUserDropdownOpen(false);
    navigate('/dashboard');
  }

  const handleSetting=()=>{
    setUserDropdownOpen(false);
    navigate('/setting');
  }
  

  const handleProfileToggle=()=>{
    setUserDropdownOpen(false);
    navigate('/profile');
  }

   useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); // Redirect to login if token is missing
                return;
  
            }
          },[]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Questions", path: "/questions" },
    { name: "Test Manager", path: "/test/actual_test" },
    { name: "Product", path: "/product" },
    { name: "Candidate", path: "/candidate" },
    { name: "CBT", path: "/cbt" },
    { name: "LMS", path: "/lms" },
    { name: "Report", path: "/report" },
  ];

  return (
    <div>
      {/* Navbar */}
      <div className="flex items-center bg-[#1C2674] p-4 justify-between">
        {/* Left Section (Logo + Hamburger Menu) */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/">
            <img src={img} className="w-[150px] h-[20.5px]" alt="Dashboard Logo" />
          </Link>

          {/* Mobile Menu Icon */}
          <button className="lg:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-10 text-white pl-40">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'text-white font-bold' : 'text-[#93BEF0]'
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Right Section (Language, Notifications, User Profile) */}
        <div className="ml-auto flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button onClick={toggleDropdown} className="text-white flex items-center">
              En <span className="ml-1">&#9660;</span>
            </button>
            {dropdownOpen && (
              <ul className="absolute mt-2 w-32 bg-white text-black shadow rounded">
                {["English", "Spanish", "Hindi"].map((lang) => (
                  <li
                    key={lang}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notification Icon */}
          <IoIosNotificationsOutline
            color="white"
            className="md:w-4 md:h-4 lg:w-6 lg:h-6 hover:cursor-pointer"
            onClick={() => setNotification(!notification)}
          />

          {/* Help Icon */}
          <CiCircleQuestion color="white" className="md:w-4 md:h-4 lg:w-6 lg:h-6 hover:cursor-pointer" />

          {/* User Dropdown */}
          <div className="relative">
            <img
              src={imgl}
              alt="User Icon"
              className="h-9 w-8 rounded-full cursor-pointer"
              onClick={toggleUserDropdown}
            />
            {notification && (
              <div className="absolute right-0 mt-2 w-44 flex justify-center bg-white text-black shadow-lg rounded">
                <h2>No notifications yet</h2>
              </div>
            )}
            {userDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleHomeToggle}>Home</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileToggle}>Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleSetting}>Setting</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
              </ul>

)}

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#1C2674] text-white flex flex-col gap-4 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;
