import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';

import Footer from './Footer'
import Navbar from './Navbar'

function MainLayout() {
  const token = localStorage.getItem('token');

  // if not logged in → redirect immediately (without rendering layout)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='flex flex-col min-h-screen font-sans'>
      <div className="sticky top-0 z-50">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
