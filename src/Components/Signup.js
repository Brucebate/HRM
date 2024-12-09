

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [employeeId, setEmployee] = useState('');
  const [role, setRole] = useState('employee');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password doesn't match");
      return;
    }
    if (!validatePassword(password)) {
      alert("Password must be at least 10 characters long and contain at least one number, one alphabet, and one special character.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/signup", {
        name,
        email,
        employeeId,
        role,
        mobile,
        password
      });

      console.log(response.data.status); // Log the response data for debugging

      if (response.data.status === "exist") {
        alert("User already exists");
      }
      else if (response.data.status === "admin_limit_reached"){
        alert("Admin signup limit reached, please choose a differnt role")
      } else if (response.data.status === "notexist") {
        alert("Sign up Successful");
        navigate("/"); // Navigate to the login page after successful signup
        // Clear the form fields after successful signup
        setName('');
        setEmail('');
        setEmployee('');
        setRole('employee');
        setMobile('');
        setPassword('');
        setConfirmPassword('');
      } else {
        alert("Unexpected response from the server");
        
      }
    } catch (error) {
      alert("Error signing up");
      console.error(error);
    }
  }
  
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
  const validatePassword = (password) => {
    // Password must be at least 20 characters long and contain at least one number, one alphabet, and one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    return regex.test(password);
  };

  return (
    <div className="page-container2">
      <div className="wrapper2">
        <div className="title-text2">
          <div className="title2">Sign Up</div>
        </div>
        <form onSubmit={submit}>
          <div className="form-container2">
            <div className="field2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field2">
              <input
                type="email"
                name="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field2">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee Id"
                value={employeeId}
                onChange={(e) => setEmployee(e.target.value)}
                required
              />
            </div>
            <div className="field2">
              <select name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field2">
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="field2">
              <input
                type={passwordShown ? "text" : "password"} /// this is the main thing if toggle function not woriking do this
                name="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon2" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className="field2">
              <input
                type={confirmPasswordShown ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon2" onClick={toggleConfirmPasswordVisibility}>
                <FontAwesomeIcon icon={confirmPasswordShown ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className="field2 btn2">
              <div className="btn-layer2"></div>
              <input type="submit" value="Sign Up" />
            </div>
          </div>
        </form>
        <div className="login-link2">
          Already have an account?{' '}
          <Link to="/">Login Page</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
