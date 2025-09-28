import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { HiMiniUserCircle } from "react-icons/hi2";
import axios from 'axios';


function Profile() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [name,setName]=useState();
    const [password,setPassword]=useState();
    const [email,setEmail]=useState();

    const [resetToggle,setResetToggle]=useState(false);

    async function fetchData(){
           //fetch user data
           const [name_res,email_res]=await Promise.all([
            axios.get('http://localhost:8000/api/getUserName'),
            axios.get('http://localhost:8000/api/getUserEmail'),
            // axios.get('http://localhost:8000/api/getUserPassword'),
        ]
        )

        setName(name_res.data.name);
        setEmail(email_res.data.email);
        // setPassword(password_res.data.password);
        // console.log(password);
        console.log(email);
    }

    const handleBack = () => {
      navigate(-1); // This will take the user back to the previous page
    };

    const submitHandle=async(event)=>{
        // console.log(newPassword);
        
        try{

            const response=await axios.post('http://localhost:8000/api/newpass',
            { password: newPassword}
            );

            if(response.status=='200'){
                alert('your password reset successfully');
                setResetToggle(false);
                localStorage.clear();
                navigate('/');

            }
        }
        catch(err){
            console.log(err);
            return {success:false};
        }


    };

    const handleLogout=()=>{
        localStorage.clear();
        navigate('/');

    }

    const handleResetToggle=()=>{
        setResetToggle(!resetToggle);
    }
 // Add ESC key event listener for modal close


 useEffect(() => {
    const handleEscKey = (e) => {
        if (e.key === "Escape" && resetToggle) {
            setResetToggle(false); // Close the modal when ESC is pressed
        }
    };

    if (resetToggle) {
        window.addEventListener('keydown', handleEscKey); // Add event listener if modal is open
    } else {
        window.removeEventListener('keydown', handleEscKey); // Remove event listener when modal is closed
    }

    // Cleanup on component unmount or resetToggle change
    return () => {
        window.removeEventListener('keydown', handleEscKey);
    };
}, [resetToggle]); // Only re-run if resetToggle changes




    useEffect(()=>{
        
        const token=localStorage.getItem('token');
        if(!token){
           navigate('/');
       }
       axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
       fetchData();
     
      


    },[])
    
    // addEventListener('key')
  return (
    <div className='flex  justify-center h-screen '>
        <div className="flex flex-col w-[40%]  h-[75%] shadow-lg mt-10  rounded-lg shadow-lg">
            <div className="flex justify-between">

            <h1 className="text-red-500 font-bold cursor-pointer" onClick={handleBack}>
            &#8592; Back
            </h1>
            
            <h1 className="text-red-500 font-bold cursor-pointer cursor-pointer" onClick={handleLogout}>
            Logout&#8594;
            </h1>
            </div>


            <div className="logo ml-60 mt-16">
                <HiMiniUserCircle className='size-36'/>
                <h2 className='ml-11 text-green-600'>Admin</h2>
                <h1 className='ml-12 font-bold'>{name}</h1>
            </div>

            <hr className='text-gray-100 mt-6 '/>

            <div className="Profile info">
                <h1 className='font-bold ml-6 mt-5'>Profile Information</h1>
                <div className="flex flex-col ml-6">

                    <div className="flex gap-2 mt-4">

                        <HiMiniUserCircle className='mt-1'/> <h1 className='font-bold'>Name:</h1><h2>{name}</h2>
                    </div>
                    <div className="flex gap-2 mt-4">

                        <HiMiniUserCircle className='mt-1'/> <h1 className='font-bold'>Email:</h1><h2>{email}</h2>
                    </div>
                    <div className="flex gap-2 mt-4">

                        <HiMiniUserCircle className='mt-1'/> <h1 className='font-bold'>Password:</h1><h2>*****</h2> <button className='bg-gray-300 rounded-md w-36 h-7 ml-3' onClick={handleResetToggle}>Reset Password</button>
                    </div>

                    {resetToggle &&
                    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
                        <div className="bg-white w-96 h-48 rounded-lg">
                        
                            <h1 className='ml-32 mb-6 font-bold mt-4'>Reset Password</h1>
                            <label htmlFor="password" className='ml-3 mt-32 p-1 ' >New Password:</label>
                            <input type="password"  placeholder='enter password' className='pl-1 border border-black rounded-md' onChange={(e)=>{setNewPassword(e.target.value)}}/>
                            <button className='mt-10 bg-blue-600 text-white rounded-md ml-32 w-16 h-8' onClick={submitHandle}>Submit</button>
                        </div>
                    </div>

                    }
                    <div className="flex gap-2 mt-4">

                        <HiMiniUserCircle className='mt-1'/> <h1 className='font-bold'>Created At:</h1><h2>29/02/200</h2>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Profile