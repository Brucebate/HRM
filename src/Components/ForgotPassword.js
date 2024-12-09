import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ForgotPassword.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleSendOtp = async() => {
        try{
            const response = await axios.post('http://localhost:8000/forgot-password', { email });
            localStorage.setItem('resetToken', response.data.token);
            localStorage.setItem('email', email); /// store the email in local storage
            console.log('Token:', response.data.token)
            navigate('/otp-verify')
        } catch (error) {
            console.error(error);
            alert('error sending otp')
        }
            
    }
    const isValidEmail = () => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <h2>Forgot Password</h2>
        <div className="field">
          <label>Enter Email Address</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="field btn">
          <button onClick={handleSendOtp} disabled ={!isValidEmail()}>
            Send OTP
          </button>
        </div>
        <div className="back-to-signin">
          {/* <a href="#" onClick={handleBackToSignIn}>
            Back to Sign In
          </a> */}
          <Link to={'/'}> Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
  
}

export default ForgotPassword
