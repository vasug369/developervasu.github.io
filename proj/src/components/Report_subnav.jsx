import React from 'react'
import { HiOutlineInbox } from "react-icons/hi";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import * as XLSX from 'xlsx';
import axios from 'axios';


const handleExport = () => {
    axios.get('http://localhost:8000/api/reports')
    .then(response => {
        const data = response.data;

        if (!data || data.length === 0) {
            console.warn("No data available to export.");
            return;
        }

        // Define column headers manually (Ensure they match API response keys)
        const headers = Object.keys(data[0]); 

        // Add headers to the sheet with proper formatting
        const formattedData = [
            headers,  // Header row
            ...data.map(row => headers.map(header => row[header])) // Data rows
        ];

        // Create a worksheet from the formatted data
        const ws = XLSX.utils.aoa_to_sheet(formattedData);

        // Apply styling: Set bold headers
        headers.forEach((_, colIdx) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = { font: { bold: true } };
        });

        // Adjust column widths
        ws['!cols'] = headers.map(header => ({
            wch: Math.max(header.length, 15) // Set width dynamically
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        // Export file
        XLSX.writeFile(wb, 'formatted_report.xlsx');
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};



const handleReportAdd=()=>{
    console.log("asds");
}
function Report_subnav() {
  return (
    <div className='text-lg flex flex-col mt-2 pl-4 '>
        <div className='font-bold'>
            Test Report &gt; Neet Pg
        </div>
        <div className='mt-3 flex'>
            <div className="testname">
                <input type="text" placeholder='Search by Test Name'  className=' pl-5 w-60 rounded border border-gray-300'/>
            </div>

            <div className="group ml-4">
                <select name="" id="" className='w-24 pt-1 pb-1 pl-3 bg-white text-black rounded border border-gray-300'>
                    <option value="">Group</option>
                </select>
            </div>
            <div className="date ml-4 pl-3 rounded border border-gray-300">
                <input type="date" name="" id="" />
            </div>
            <div className="credibility ml-4 ">
                <select name="" id="" className='bg-white text-black pt-1 pb-1 rounded border border-gray-300' >
                    <option value="">Credibility Range</option>
                </select>

            </div>
            <button className='ml-4 bg-blue-700 text-white w-24 rounded-md'>Apply</button>

            <div className="flex items-center ml-72 gap-3">
                <HiOutlineInbox className='size-5 bg-gray-200 hover:cursor-pointer'  />
                <BsPrinter className='size-5 hover:cursor-pointer' onClick={window.print}/>
                <MdOutlineDriveFileMove className='size-5 bg-gray-200 hover:cursor-pointer' onClick={handleExport}/>
                <PiDotsThreeOutlineFill className='size-5 bg-gray-200 hover:cursor-pointer' onClick={handleReportAdd}/>
                
            </div>
        </div>
    </div>
  )
}

export default Report_subnav