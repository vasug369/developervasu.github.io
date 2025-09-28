import React from 'react'
import { Outlet } from 'react-router-dom'
import LoginForm from './LoginForm'
import Navbar from './Navbar'
import Footer from './Footer'

function Body() {
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <main className='flex-grow'>
           <Outlet/>
        </main>
        <Footer/>
        
    </div>
  )
}

export default Body