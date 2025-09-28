import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Test() {
  return (
    <div>
      {/* Navigation Bar */}
    

      {/* Navigation Links - Responsive */}
      <div className="flex flex-wrap justify-center gap-7 px-4 py-2  w-full">
        <NavLink
          to="actual_test"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-bold' : 'text-gray-700'
          }
        >
          Test
        </NavLink>
        <NavLink
          to="merge_test"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-bold' : 'text-gray-700'
          }
        >
          MergeTest
        </NavLink>
        <NavLink
          to="category"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-bold' : 'text-gray-700'
          }
        >
          Category
        </NavLink>
      </div>

      {/* Placeholder for Nested Route Content */}
      <Outlet />

      {/* Footer */}
     
    </div>
  );
}

export default Test;
