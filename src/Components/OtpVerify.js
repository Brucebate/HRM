// 



import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtpVerify.css';

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const inputRefs = useRef([]); // Ref to store references to input fields

  useEffect(() => {
    // Focus on the first input field when the component mounts
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Accept only numeric values

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move focus to the next input field if a character is entered
    if (index < verificationCode.length - 1 && value !== '') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length === 4) {
      try {
        const token = localStorage.getItem('resetToken');
        const response = await fetch('http://localhost:8000/otp-verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: code, token }),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          navigate('/set-password');
        } else {
          setErrorMessage('Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setErrorMessage('An error occurred while verifying OTP.');
      }
    } else {
      setErrorMessage('Please enter the complete verification code.');
    }
  };

  const handleResendCode = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await fetch('http://localhost:8000/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('resetToken', result.token);
        setErrorMessage('OTP has been resent to your email.');
      } else {
        setErrorMessage('Error resending OTP. Please try again.');
      }
    } catch (error) {
      console.log('Error resending OTP:', error);
      setErrorMessage('An error occurred while resending the OTP.');
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-wrapper">
        <h2>Verification</h2>
        <p>Enter verification code</p>
        <div className="verification-code">
          {verificationCode.map((code, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={code}
              onChange={(e) => handleChange(index, e.target.value)}
              ref={(input) => (inputRefs.current[index] = input)}
              onKeyDown={(e) => {
                // Prevent default tab behavior
                if (e.key === 'Tab') {
                  e.preventDefault();
                }
              }}
            />
          ))}
        </div>
        <p>If you don't receive the code!</p>
        <div className="resend-link" onClick={handleResendCode}>
          Resend
        </div>
        <div className="field btn">
          <button onClick={handleVerify}>Verify</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Verification;
