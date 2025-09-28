import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoPlus } from 'react-icons/go';
import { BsThreeDots } from 'react-icons/bs';
import { motion } from "framer-motion";

import * as XLSX from 'xlsx';
import FilterNav from './Filter_nav';
import { useNavigate } from 'react-router-dom';

function ActualTest() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const [error, setError] = useState(null);
  const [newRow, setNewRow] = useState({
    name: '',
    start_date: '',
    end_date: '',
    questions: '',
    level: '',
    candidates: '',
    product: '',
    category: '',
    status: 'active',
    template: '',
    version: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // State to track if it's an edit or add
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 200;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rowDropdownOpen, setRowDropdownOpen] = useState(null); // Separate state for row dropdowns
  const navigate=useNavigate();

  useEffect(() => {
    const token=localStorage.getItem('token');
    if(!token){
      navigate('/');
    }
    axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
    axios.get('http://localhost:8000/api/tests')
      .then((response) => {
        console.log(response.data);
        setLoading(false); // Set loading to false when data is fetched
        setTableData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleExport=()=>{
    setDropdownOpen(false);
    axios.get('http://localhost:8000/api/tests')
    .then(response => {
      // Ensure the response data is available
      const data = response.data;

      // Create a worksheet from the data
      const ws = XLSX.utils.json_to_sheet(data);

      // Create a workbook with the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      // Export the workbook to Excel format and trigger download
      XLSX.writeFile(wb, 'report.xlsx');
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (row) => {
    setIsEdit(true); // Set to true to indicate edit mode
    setNewRow({
      id: row.id,
      name: row.name,
      start_date: row.start_date,
      end_date: row.end_date,
      questions: row.questions,
      level: row.level,
      candidates: row.candidates,
      product: row.product,
      category: row.category,
      status: row.status,
      template: row.template,
      version: row.version,
    });
    setModalOpen(true); // Open the modal
    setRowDropdownOpen(false);
  };

  const previewHandle=()=>{
    setDropdownOpen(false);
    window.print();
    
  }

  const handleAddRow = () => {
    setIsEdit(false); // Set to false for adding a new row
    setNewRow({
      name: '',
      start_date: '',
      end_date: '',
      questions: '',
      level: '',
      candidates: '',
      product: '',
      category: '',
      status: 'active',  // Default to active
      template: '',
      version: '',
    });
    setModalOpen(true);
  };

  const handleDeleteRow = (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      axios.delete(`http://localhost:8000/api/delete/${id}`)
        .then(() => {
          setTableData((prevData) => prevData.filter((row) => row.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting row:', error);
        });
    }
    setRowDropdownOpen(false);


  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEdit ? `http://localhost:8000/api/update/${newRow.id}` : 'http://localhost:8000/api/tests';
    const method = isEdit ? 'put' : 'post';

    try {
      const response = await axios({
        method: method,
        url: url,
        data: newRow,
      });
      
      setModalOpen(false);
      setNewRow({
        name: '',
        start_date: '',
        end_date: '',
        status:'',
        questions: '',
        level: '',
        candidates: '',
        product: '',
        category: '',
        status: 'active',
        template: '',
        version: '',
      });

      if (isEdit) {
        // Update the existing data in the table
        setTableData((prevData) => prevData.map((row) =>
          row.id === response.data.test.id ? response.data.test : row
        ));
      } else {
        // Add the new row to the table
        setTableData((prevTableData) => [...prevTableData, response.data.test]);
      }

      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error saving row:', error);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 2 } },
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleRowDropdown = (index) => {
    setRowDropdownOpen(prev => prev === index ? null : index);
  };

  return (
    <div className=" flex flex-col min-h-screen">
      <FilterNav onAdd={handleAddRow} actions="1" dropDown={toggleDropdown}  />

      {dropdownOpen && (
        <div className="absolute top-6 right-8 bg-white border shadow-md rounded-md">
          <button className="px-4 py-2 w-full text-left" onClick={previewHandle}>Preview</button>
          <button className="px-4 py-2 w-full text-left" onClick={handleExport}>Export</button>
          <button className="px-4 py-2 w-full text-left text-red-500">Delete</button>
        </div>
      )}

<div
  className="overflow-y-auto max-h-[70vh]"
>
  <table className="min-w-full border-collapse border border-gray-300 text-left">

          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">S. No</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Questions</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Candidates</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Template</th>
              <th className="px-4 py-2">Version</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {loading ? (
              // Skeleton Rows
              Array.from({ length: 7 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td><td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td>
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </td>
                  <td className="border-b-2 px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </td>
                </tr>
              ))
            ) : 
            currentRows.map((row, index) => (
              <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
 key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="border-b-2 px-4 py-2">{indexOfFirstRow + index + 1}</td>
                <td className="border-b-2 px-4 py-2">{row.name}</td>
                <td className="border-b-2 px-4 py-2 whitespace-nowrap">{row.start_date}</td>
                <td className="border-b-2 px-4 py-2 whitespace-nowrap">{row.end_date}</td>
                <td className="border-b-2 px-4 py-2">
                  
                
                  <span className={`border-b-2  rounded-full px-3 py-1 ${(row.status === 'Active' || row.status === 'active'  )? 'text-green-600 bg-green-200 ' : 'text-red-600 bg-red-200'}`}>


                  {row.status}
                  </span>
                  

                  

                </td>
                <td className="border-b-2 px-4 py-2">{row.questions}</td>
                <td className="border-b-2 px-4 py-2">{row.level}</td>
                <td className="border-b-2 px-4 py-2">{row.candidates}</td>
                <td className="border-b-2 px-4 py-2">{row.product}</td>
                <td className="border-b-2 px-4 py-2">{row.category}</td>
                <td className="border-b-2 px-4 py-2">{row.template}</td>
                <td className="border-b-2 px-4 py-2">{row.version}</td>
                <td className="border-b-2 px-4 py-2">
                  <div className="relative">
                    <BsThreeDots
                      onClick={() => toggleRowDropdown(index)}
                      className="cursor-pointer"
                    />
                    <br />
                    {rowDropdownOpen === index && (
                      <div className="absolute top-5 right-0 z-10 bg-white shadow-md rounded-md">
                        <button onClick={() => handleDeleteRow(row.id)} className="px-4 py-2 w-full text-left text-red-600">Delete</button>
                        <button onClick={() => handleEdit(row)} className="px-4 py-2 w-full text-left">Edit</button>
                      </div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Test' : 'Add New Test'}</h2>
            <form method="post" onSubmit={handleSave}>
              {/* Form fields for the test details */}
              <div className="mb-4">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newRow.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={newRow.start_date}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={newRow.end_date}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="mb-4">
  <label>Status</label>
  <select
    name="status"
    value={newRow.status}
    onChange={handleChange}
    className="w-full border px-4 py-2 rounded-md"
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>

  </select>
</div>

              <div className="mb-4">
                <label>Questions</label>
                <input
                  type="number"
                  name="questions"
                  value={newRow.questions}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Level</label>
                <input
                  type="text"
                  name="level"
                  value={newRow.level}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Candidates</label>
                <input
                  type="number"
                  name="candidates"
                  value={newRow.candidates}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Product</label>
                <input
                  type="text"
                  name="product"
                  value={newRow.product}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={newRow.category}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Template</label>
                <input
                  type="text"
                  name="template"
                  value={newRow.template}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label>Version</label>
                <input
                  type="text"
                  name="version"
                  value={newRow.version}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActualTest;
