// import React, { useState } from 'react';
// import { useAuth } from '../AuthContext'; // Ensure correct path to AuthContext
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import userImage from '../pages/main.png';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth(); // Use login from AuthContext
//   const navigate = useNavigate();

//   const backendHost = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://192.168.29.117:3001';

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`${backendHost}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         login(data.user); // Store user data in AuthContext
//         navigate('/dashboard'); // Redirect to dashboard after login
//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="container vh-100 d-flex align-items-center">
//       <div className="row w-100">
        
//         {/* Card 1: Login Form */}
//         <div className="col-md-6">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h2 className="card-title">Login</h2>
//               {error && <div className="alert alert-danger">{error}</div>}
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">Login</button>
//               </form>
//               <p className="mt-3">Don't have an account? <a href="/signup">Sign up here</a></p>
//             </div>
//           </div>
//         </div>

//         {/* Card 2: Image Section */}
//         <div className="col-md-4">
//           <div className="card shadow-sm">
//             <div className="card-body p-0">
//               <img
//                 src={userImage}
//                 alt="Login Visual"
//                 className="img-fluid vh-50"
//                 style={{ objectFit: 'cover', width: '100%', height: '80%' }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
//////////////////////////////////////////////
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import userImage from '../pages/main.png';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const backendHost = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://192.168.29.117:3001';
      const response = await axios.post(`${backendHost}/login`, { employeeId, password });
      const { user } = response.data;
      // Assuming the backend sends a user object upon successful login
      login(user);
      navigate('/dashboard');
    } catch (err) {
      // Check if there is an error response and handle based on the status code
      if (err.response) {
        if (err.response.status === 403) {
          setError('Account is disabled. Please contact the administrator.');
        } else if (err.response.status === 401 || err.response.status === 404) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        {/* Left Column: Login Form */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="card shadow-sm w-75">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="employeeId" className="form-label">Employee ID</label>
                  <input
                    type="text"
                    id="employeeId"
                    className="form-control"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Right Column: Image Section */}
        <div className="col-md-6 d-none d-md-block">
          <div className="card shadow-sm h-100">
            <div className="card-body p-0 h-100">
              <img
                src={userImage}
                alt="Login Visual"
                className="img-fluid h-100 w-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
