import React from 'react';
import LoginForm from './LoginForm';
// import '../style/LoginPage.css'

import metric from '../assets/metrics.png'

const LoginPage = () => {
  return (
    <div className="block lg:flex">
      
      <div className="container">
        <LoginForm />
      </div>

      <div className="metrics_container hidden md:block lg:flex">
        <img src={metric} alt="metric" className="metric h-full " />
      </div>

    </div>
  );
};

export default LoginPage;
