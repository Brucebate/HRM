

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const LoginSignup = () => {
  const [isEmployee, setIsEmployee] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  // const handleToggle = () => {
  //   setIsEmployee(!isEmployee);
  // };

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      const res = await axios.post("http://localhost:8000/", {
        email,
        password,
        isEmployee
      });

      if (res.data.status === "exist") {
        if (res.data.role === "admin" && !isEmployee) {
          navigate("/admin", { state: { name: res.data.name } });
        } else if (res.data.role === "employee" && isEmployee) {
          navigate("/home", { state: { name: res.data.name } });
        }else {
            alert("you are trying to login with wrong role")
        }
      } else if (res.data.status === "notexist") {
        alert("User does not exist. Please sign up.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (e) {
      alert("Wrong details or server error.");
      console.error(e);
    }
  }

  const handleSignup = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // const handleForgotPassword = () => {
  //   navigate('/forgot-password');
  // };

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>THE HARD CASH - HRM TOOL</h1>
      </div>
      <div className="wrapper">
        <div className="title-text">
          <div className={`title ${isEmployee ? "employee" : "admin"}`}>
            {isEmployee ? "Employee Login" : "Admin Login"}
          </div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input
              type="radio"
              name="slide"
              id="admin"
              checked={!isEmployee}
              readOnly
            />
            <input
              type="radio"
              name="slide"
              id="employee"
              checked={isEmployee}
              readOnly
            />
            <label
              htmlFor="admin"
              className="slide admin"
              onClick={() => setIsEmployee(false)}
            >
              Admin Login
            </label>
            <label
              htmlFor="employee"
              className="slide employee"
              onClick={() => setIsEmployee(true)}
            >
              Employee Login
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form
              onSubmit={handleLogin}
              className="login"
              style={{ transform: `translateX(${isEmployee ? "-100%" : "0"})` }}
            >
              <div className="field">
                <input type="text" name="email" placeholder="Email" required />
              </div>
              <div className="field">
                <input
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                />
                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="pass-link">
                {/* <a href="/" onClick={handleForgotPassword}>Forgot password?</a> */}
                <Link to={'/forgot-password'}>Forgot Password</Link>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Don't have an account? Register yourself{" "}
                <button type="button" className="link-button" onClick={handleSignup}>
                  Sign up
                </button>
              </div>
            </form>
            <form
              onSubmit={handleLogin}
              className="login"
              style={{ transform: `translateX(${isEmployee ? "-100%" : "0"})` }}
            >
              <div className="field">
                <input type="text" name="email" placeholder="Email" required />
              </div>
              <div className="field">
                <input
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                />
                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="pass-link">
                {/* <a href="#" onClick={handleForgotPassword}>Forgot password?</a> */}
                <Link to={'/forgot-password'}>Forgot Password</Link>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Don't have an account? Register yourself{" "}
                <button type="button" className="link-button" onClick={handleSignup}>
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;



