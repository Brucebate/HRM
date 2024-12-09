import Home from "./Components/Home"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import Admin from "./Components/Admin"
import ForgotPassword from "./Components/ForgotPassword"
import OtpVerify from "./Components/OtpVerify"
import SetPassword from "./Components/SetNewPassword";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

// import { useState } from 'react';

function App(){
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/otp-verify" element={<OtpVerify/>}/>
          <Route path="/set-password" element={<SetPassword/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App