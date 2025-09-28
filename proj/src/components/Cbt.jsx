import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {motion} from 'framer-motion';
import Footer from './Footer';
import { AiOutlineDelete } from "react-icons/ai";
import { BsThreeDots } from 'react-icons/bs';

function CBT_NAV() {
  const [showPopup, setShowPopup] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowidx,setSelectedRowidx]=useState(null);

  const [editMode , setEditMode] = useState(false);

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
    
  const handleEdit= async(event) => {
  
    setFormData({
      id:event.id,
      event_name: event.event_name,
      event_code: event.event_code,
      exam_event_type: event.exam_event_type,
      event_type: event.event_type,
      event_opening: event.event_opening,
      event_closing: event.event_closing,
      instruction_date: event.instruction_date,
      password_instruction: event.password_instruction,
    });
    setEditMode(true); // Set the edit mode
    setSelectedRowidx(null); // Close the dropdown menu
  };

  // Handle delete option click
  const handleDelete = async (event_code) => {
    try {
      await axios.delete(`http://localhost:8000/api/deleteEventRow/${event_code}`);
      fetchEvents(); // Refresh the table after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };


  
  // State for master checkbox (checked or unchecked)
  const [isMasterChecked, setIsMasterChecked] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_name: '',
    event_code: '',
    exam_event_type: 'CBT Private',
    event_type: 'Regular Event',
    event_opening: '',
    event_closing: '',
    instruction_date: '',
    password_instruction: '',
  });
  
  const toggleEvent = (index) => {
    if (selectedRowidx === index) {
      setSelectedRowidx(null); // Hide dropdown if clicking the same row again
    } else {
      setSelectedRowidx(index); // Show dropdown for this row
    }
  };
  // Fetch events on component mount
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/event_get');
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  useEffect(() => {
    const token=localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // setTimeout(()=>{

    // },1000);
    if(!token){
      navigate('/');
    }
    fetchEvents();
  }, []);

  
  const togglePopup = () => {
    if (!showPopup) {
      // Reset formData to initial empty values
      setFormData({
        event_name: '',
        event_code: '',
        exam_event_type: 'CBT Private',
        event_type: 'Regular Event',
        event_opening: '',
        event_closing: '',
        instruction_date: '',
        password_instruction: '',
      });
    }
    setShowPopup(!showPopup);
  };
  
  

  const deleteSelectedRowsData = async() => {
    const selectedData = selectedRows.map(index => tableData[index].event_code); // Get data for selected rows using their indices
    console.log('Selected Rows Data:', selectedData); // Logs the data of the selected rows

    try{

      for(const event_code of selectedData){
        await axios.delete(`http://localhost:8000/api/deleteEventRow/${event_code}`);
        
      }

      // window.location.reload();
      fetchEvents();
    }
    catch(error){
      console.log(error);
    }



  };

  const toggleRowSelection = (index) => {
    // Create a copy of the current selected rows
    const updatedSelectedRows = [...selectedRows];
    
    // Check if the row is already selected
    if (updatedSelectedRows.includes(index)) {
      // Deselect the row (remove the index)
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(index), 1);
    } else {
      // Select the row (add the index)
      updatedSelectedRows.push(index);
    }

    // Update the state with the new selected rows
    setSelectedRows(updatedSelectedRows);


    // selectedRows.forEach((event, i) => {
    //   console.log(`Selected Event ${i + 1}:`);
    //   console.log(`Event Name: ${event.event_name}`);
    //   console.log(`Event Type: ${event.event_type}`);
    //   console.log(`Event Opening: ${event.event_opening}`);
    //   console.log(`Event Closing: ${event.event_closing}`);
    //   console.log(`Instruction Date: ${event.instruction_date}`);
    //   console.log('-----------------------------');
    // });

    // Update the master checkbox if all rows are selected
    setIsMasterChecked(updatedSelectedRows.length === tableData.length);
  };

  // Function to handle changes on the master checkbox
  const toggleMasterSelection = () => {
    if (isMasterChecked) {
      // If the master checkbox is checked, deselect all rows
      setSelectedRows([]);
    } else {
      // If the master checkbox is unchecked, select all rows
      setSelectedRows(tableData.map((_, index) => index)); // Select all rows
    }
   
    setIsMasterChecked(!isMasterChecked); // Toggle the master checkbox state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
 

  const submitHandler = async (e) => {
    // e.preventDefault(); // Prevent default form submission
    e.preventDefault();
    console.log(formData.event_code);
    const url = editMode? `http://localhost:8000/api/event_update/${formData.event_code}` : 'http://localhost:8000/api/event_store';
    const method = editMode ? 'put' : 'post';
    try {
      const response = await axios({
        method: method,
        url: url,
        data: formData,
      });
      setShowPopup(false);

      if (response.status === 200) {
        const newEvent = response.data; // Assuming the API response returns the new event
        setTableData((prevData) => [...prevData, newEvent]); // Dynamically add to tableData
        togglePopup();
        setEditMode(false);
         // Close the popup automatically after successful submission
         //  navigate('/cbt'); // Navigate back to '/cbt'
        }
      } catch (error) {
        console.error('Error creating event:', error);
      }
      fetchEvents();
  };

  return (
    <>
    
    <div>
      {/* Navigation Bar */}
      <div className="w-full  py-2 flex gap-9 font-medium justify-center ">
        <Link to="/Event">Event</Link>
        <Link to="/Region">Region</Link>
        <Link to="/Center">Center</Link>
        <Link to="/Zone">Zone</Link>
        <Link to="/Session">Session</Link>
        <Link to="/Lab">Lab</Link>
        <Link to="/Centre User">Centre User</Link>
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-center mt-6 px-4 bg-gray-100 h-[50px]">
        <div className="text-lg font-medium " style={{ wordSpacing: "10px" }}>
          Dashboard &gt; Candidate &gt; ADD_CANDIDATES
        </div>
        </div>

        <div className="flex justify-between  p-4">
          <div className="flex gap-3   ml-5">
            <button className="bg-gray-200 px-4 py-2 rounded border text-sm">Filter</button>
            <input
            type="text"
            placeholder="Search By Test Name"
            className="border px-4 py-2 rounded text-sm"
            />
           <button className="bg-blue-700 text-white px-4 py-2 rounded text-sm">Apply</button>
          </div>

          <div className="flex items-center gap-3  mr-6">

          <button
            onClick={togglePopup}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold"
            >
            +Add
          </button>

          <AiOutlineDelete className='bg-gray-200 h-8 w-5 cursor-pointer' onClick={deleteSelectedRowsData}/>
            </div>
      </div>

      {/* Event Data Table */}
      <div className="mt-4 px-4">
  <div className="overflow-x-auto overflow-y-auto h-[400px] -z-20 w-full">
    <table className="w-full table-auto border-t-2 border-gray-300 shadow-md">
      <thead className="text-black h-20" >
        <tr>
          <th>
            <input
              type="checkbox"
              checked={isMasterChecked}
              onChange={toggleMasterSelection}
            />
          </th>
          <th className="text-left">Sno</th>
          <th className="text-left">Event Name</th>
          <th className="text-left">Event Type</th>
          <th className="text-left">Event Opening</th>
          <th className="text-left">Event Closing</th>
          <th className="text-left">Event Date</th>
          <th className="text-left">Actions</th>
        </tr>
      </thead>

      <tbody className="bg-gray-100 text-gray-700">
        {tableData.length > 0 ? (
          tableData.map((event, index) => (
            <motion.tr  
           
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
            
              key={index}
              className={`border border-gray-300 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-blue-50 transition`}
            >
              <td className=" px-4 py-2">
                <input
                  type="checkbox"
                  className="ml-24"
                  checked={selectedRows.includes(index)}
                  onChange={() => toggleRowSelection(index)}
                />
              </td>
              <td className="eventcheck px-4 py-2">{index + 1}</td>
              <td className="eventcheck px-2 py-2">{event.event_name}</td>
              <td className="eventcheck px-2 py-2">{event.event_type}</td>
              <td className="eventcheck px-2 py-2">{event.event_opening}</td>
              <td className="eventcheck px-2 py-2">{event.event_closing}</td>
              <td className="eventcheck px-2 py-2">{event.instruction_date}</td>
              <td className="eventcheck px-2 py-2 relative">
                <button className="text-blue-600 hover:underline">
                  <BsThreeDots onClick={()=>toggleEvent(index)}/>

                  {selectedRowidx === index && 
                    <div className="absolute Add-delete-event rounded-md text-black bg-white z-10 shadow-md h-20 w-20">
                      <ul>

                       <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>handleEdit(event)}>Edit</li>
                       <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>handleDelete(event.event_code)}>delete</li>
                      </ul>

                      
                      
                    </div>
                  }
                
                  </button>

                  {editMode && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex items-center justify-center z-50 shadow-lg">
    <div className="bg-white p-8 rounded-lg w-[900px] max-w-[90%]">
      <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
      <form onSubmit={submitHandler}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Event Name</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="Enter Event Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Event Code</label>
            <input
              type="text"
              name="event_code"
              value={formData.event_code}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="Enter Event Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Exam Event Type</label>
            <select
              name="exam_event_type"
              value={formData.exam_event_type}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="CBT Private">CBT Private</option>
              <option value="CBT Public">CBT Public</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Event Type</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="Regular Event">Regular Event</option>
              <option value="Special Event">Special Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Event Opening</label>
            <input
              type="date"
              name="event_opening"
              value={formData.event_opening}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Event Closing</label>
            <input
              type="date"
              name="event_closing"
              value={formData.event_closing}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Instruction Date</label>
            <input
              type="date"
              name="instruction_date"
              value={formData.instruction_date}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password Instruction</label>
            <input
              type="text"
              name="password_instruction"
              value={formData.password_instruction}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="Enter Password Instruction"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setEditMode(false)} // Close edit mode when cancel
            className="bg-gray-200 px-4 py-2 rounded text-gray-600 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

              </td>
            </motion.tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="8"
              className="text-center border border-gray-300 px-4 py-4 text-gray-500"
            >
              No Events Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* Add Event Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[900px] max-w-[90%]">
            <h2 className="text-2xl font-bold mb-6">Add Event</h2>
            <form onSubmit={submitHandler}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Event Name</label>
                  <input
                    type="text" 
                    name="event_name"
                    value={formData.event_name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Enter Event Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Event Code</label>
                  <input
                    type="text"
                    name="event_code"
                    value={formData.event_code}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Enter Event Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Exam Event Type</label>
                  <select
                    name="exam_event_type"
                    value={formData.exam_event_type}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                  >
                    <option value="CBT Private">CBT Private</option>
                    <option value="CBT Public">CBT Public</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Event Type</label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                  >
                    <option value="Regular Event">Regular Event</option>
                    <option value="Special Event">Special Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Event Opening</label>
                  <input
                    type="date"
                    name="event_opening"
                    value={formData.event_opening}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Event Closing</label>
                  <input
                    type="date"
                    name="event_closing"
                    value={formData.event_closing}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Instruction Date</label>
                  <input
                    type="date"
                    name="instruction_date"
                    value={formData.instruction_date}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password Instruction</label>
                  <input
                    type="text"
                    name="password_instruction"
                    value={formData.password_instruction}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Enter Password Instruction"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="bg-gray-200 px-4 py-2 rounded text-gray-600 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Save
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}

      

    </div>
    {/* <button onClick={getSelectedRowsData}>Get Selected Rows Data</button> */}
    
    </>
  );
}

export default CBT_NAV;
