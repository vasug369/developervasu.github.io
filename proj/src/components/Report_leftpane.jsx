import React, { useState } from 'react';
import { GiNetworkBars } from "react-icons/gi";
import { CiHome } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { TbReport } from "react-icons/tb";
import { FaRegFileAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Report_leftpane() {
  const [isTestReportOpen, setIsTestReportOpen] = useState(false);

  const toggleTestReportDropdown = () => {
    setIsTestReportOpen(!isTestReportOpen);
  };

  return (
    <div className='w-56  p-4'>
      <h1 className='font-bold text-lg mb-4'>Report</h1>

      {/* Test Report Dropdown */}
      <div className='mb-2'>
        <button 
          onClick={toggleTestReportDropdown} 
          className='w-full flex gap-2 items-center text-left  p-2 rounded hover:bg-gray-300'>
            <GiNetworkBars/>
          Test Report
          {(isTestReportOpen)?<IoIosArrowUp/>:<IoIosArrowDown/>}
        </button>
        {isTestReportOpen && (
          <div className='ml-4'>
            <ul>
              <li className='p-2 hover:bg-gray-300'>Test Report</li>
              <li className='p-2 hover:bg-gray-300'>Question Report</li>
              <li className='p-2 hover:bg-gray-300'>Declines</li>
            </ul>
          </div>
        )}
      </div>

      {/* Other Dropdowns */}
      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
        <CiHome />
          QAR Report
        </button>
      </div>

      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
        <CiHome />
          Sales Report
        </button>
      </div>

      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
        <GoPerson />
          Subjective Evaluation
        </button>
      </div>

      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
            <TbReport/>
          Admin Audit Log Report
        </button>
      </div>

      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
        <FaRegFileAlt />
          Status Report
        </button>
      </div>

      <div className='mb-2'>
        <button className='w-full text-left flex items-center gap-2  p-2 rounded hover:bg-gray-300'>
        <TbReport />
          CBT Report
        </button>
      </div>
    </div>
  );
}

export default Report_leftpane;
