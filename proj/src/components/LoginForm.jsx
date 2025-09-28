import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import logo from '../assets/thinkExam_logo.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuEye } from "react-icons/lu";

function LoginForm() {
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [eye,setEye]=useState(false);


useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if token is missing
            return;

        }
      },[]);
const handleEye=(()=>{
  setEye(!eye);
})
const handleRegister=async(e)=>{
  e.preventDefault();

  if (!email || !password) {
    setErrorMessage('Please fill in all fields.');
    return;
  }

  try {
    // Send login credentials to Laravel backend
    const response = await axios.post('http://127.0.0.1:8000/api/register', {
      email,
      password
    });

    // If login is successful, store the token (you can store it in localStorage/sessionStorage or use a state management library like Redux)
    localStorage.setItem('token', response.data.token);
    setErrorMessage('Resistration Successfull')

    // Redirect to the dashboard route after successful login
  } catch (error) {
    // If the credentials are incorrect or any error occurs
    if (error.response && error.response.data) {
      setErrorMessage(error.response.data.message || 'Login failed');
    } else {
      setErrorMessage('An error occurred. Please try again later.');
    }
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setErrorMessage('Please fill in all fields.');
    return;
  }

  try {
    // Send login credentials to Laravel backend
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email,
      password
    });

    // If login is successful, store the token (you can store it in localStorage/sessionStorage or use a state management library like Redux)
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user_name', response.data.user.name);

    // Redirect to the dashboard route after successful login
    navigate('/dashboard');
  } 
  catch (error) {
    // If the credentials are incorrect or any error occurs
    if (error.response && error.response.data) {
      setErrorMessage(error.response.data.message || 'Login failed');
    } else {
      setErrorMessage('An error occurred. Please try again later.');
    }
  }
};

return (
  <Container className="flex justify-center items-center h-screen">
    <div className="text-left p-6 rounded-lg w-full max-w-md">
      <div className="logo-container mb-6">
        <img src={logo} alt="Logo" className="block ml-0 mt-85 w-48" />
      </div>

      <div className="mb-6 mt-[60px]">
        <h1 className="font-bold text-[30px] ml-1 text-[#0B0D57] md:text-5xl lg:text-4xl">Get started with</h1>
        <h1 className="font-bold text-[30px] mt-1 ml-1 text-[#0B0D57] md:text-5xl lg:text-4xl">ThinkExam</h1>
      </div>

      {errorMessage && (
        <div className="max-w-sm mx-auto p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md mt-4 mb-6">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <Form onSubmit={handleSubmit} className="mt-[50px]">
        <Form.Group controlId="formEmail" className="mb-4">
          <Form.Label className="block text-left md:text-[25px] lg:text-[14px]">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              border-gray-500 rounded-3xl w-full mt-2 px-3 py-2 box-border"
            style={{ border: '2px solid gray' }}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-4">
    <Form.Label className="block text-left md:text-[25px] lg:text-[14px]">Password</Form.Label>
    <div className="relative flex">

    <Form.Control
      type={eye?'text':'password'}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      border-gray-300 rounded-3xl w-full mt-2 px-3 py-2 box-border pr-10" // Added pr-10 to make space for the icon
        style={{ border: '2px solid gray' }}
      />

  {/* Eye Icon Inside the Input Box */}
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
    <LuEye size={24} className='mt-2' onClick={handleEye}/>
  </div>

</div>
</Form.Group>

        <Button type="submit" variant="primary" className="w-full rounded-3xl py-2 bg-blue-900 mt-6 text-white" onClick={handleSubmit}>
          Start 14 Days Free Trial
        </Button>
      </Form>

      <p className="terms mt-3 text-center text-sm mt-8  ">
        By clicking "Start Free Trial" you agree to seo.do's<br />
        <a href="#" className="text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-700">Privacy Policy</a>
      </p>

      {/* Remove the direct Link */}
      <p className="text-center mt-3">
        Already have an account? 
        {/* Use a button or any element to trigger the login logic */}
        <button 
          onClick={handleRegister} 
          className="text-blue-700">
          Log in
        </button>
      </p>
    </div>
  </Container>
);
}

export default LoginForm;
