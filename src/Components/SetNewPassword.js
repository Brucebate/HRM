// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import './SetPassword.css';

// const SetPassword = () => {
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('')
//   const [passwordShown, setPasswordShown] = useState(false);
//   const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async(e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword){
//       setErrorMessage('Password does not match');
//       return;
//     }
//     if (!validatePassword(newPassword)) {
//       alert("Password must be at least 10 characters long and contain at least one number, one alphabet, and one special character.");
//       return;
//     }


    
//     try{
//       const token = localStorage.getItem('resetToken');
//       const response = await fetch('http://localhost:8000/reset-password', {
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json'
//         },
//         body: JSON.stringify({token, newPassword})
//       });
//       const result = await response.json();
//       if (response.ok) {
//         alert('Password reset successfully')
//         navigate('/')
//       } else {
//         setErrorMessage(result.message || 'Erorr resetting password')
//       }
//     }catch (error) {
//       console.error('Error resetting password:', error);
//       setErrorMessage('An error occured while resetting the password')
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordShown(!passwordShown);
//   };
  
//   const toggleConfirmPasswordVisibility = () => {
//     setConfirmPasswordShown(!confirmPasswordShown);
//   }
//   const validatePassword = (password) => {
//     // Password must be at least 20 characters long and contain at least one number, one alphabet, and one special character
//     const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
//     return regex.test(password);
//   };

//   return (
//     <div className="set-password-container">
//       <div className="set-password-wrapper">
//         <h2>New Password</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="field">
//             <label>Set New Password</label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="New Password"
//               required
//             />
//             <span className="password-toggle-icon2" onClick={togglePasswordVisibility}>
//                 <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
//               </span>
//           </div>
//           <div className="field">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm Password"
//               required
//             />
//             <span className="password-toggle-icon2" onClick={toggleConfirmPasswordVisibility}>
//                 <FontAwesomeIcon icon={confirmPasswordShown ? faEyeSlash : faEye} />
//               </span>
//           </div>
//           <div className="field btn">
//             <button type="submit">Submit</button>
//           </div>
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SetPassword;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import './SetPassword.css';

const SetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage("Password must be at least 10 characters long and contain at least one number, one alphabet, and one special character.");
      return;
    }

    try {
      const token = localStorage.getItem('resetToken');
      const response = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Password reset successfully');
        navigate('/');
      } else {
        setErrorMessage(result.message || 'Error resetting password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('An error occurred while resetting the password');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const validatePassword = (password) => {
    // Password must be at least 10 characters long and contain at least one number, one alphabet, and one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    return regex.test(password);
  };

  return (
    <div className="set-password-container">
      <div className="set-password-wrapper">
        <h2>New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Set New Password</label>
            <input
              type={passwordShown ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <span className="password-toggle-icon2" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type={confirmPasswordShown ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <span className="password-toggle-icon2" onClick={toggleConfirmPasswordVisibility}>
              <FontAwesomeIcon icon={confirmPasswordShown ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="field btn">
            <button type="submit">Submit</button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SetPassword;

