// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import jsPDF from 'jspdf';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import './Settings.js';
// function Header({ user, logout, setCurrentPage,}) {
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Event handler for Audit Trail button
//   const handleAuditTrail = () => {
//     console.log("Audit Trail button clicked");
//     const auditDoc = new jsPDF();
//     auditDoc.text("Audit Trail Report", 10, 10);
//     auditDoc.save("audit_trail.pdf");
//   };

//   // Event handler for Data Backup button
//   const handleDataBackup = () => {
//     console.log("Data Backup button clicked");
//     alert("Data backup process initiated!");
//   };
//   return (
//     <div className="fixed-top bg-light p-3 shadow">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center">
//           {/* Left Side: User Info */}
//           <div className="d-flex align-items-center">
//             <span className="fs-5 me-3">User: {user.name}</span>
//             <div>
//               <button className="btn btn-primary mx-1" onClick={() => setCurrentPage(1)}>
//                 Page 1
//               </button>
//               <button className="btn btn-primary mb-3">Settings</button> 
//             </div>
//           </div>

//           {/* Center: Title */}
//           <h2 className="text-center flex-grow-1 m-0">Techzone Testing</h2>

//           {/* Right Side: Buttons */}
//           <div className="d-flex align-items-center">
//             <button className="btn btn-info mx-1" onClick={() => navigate('/AhuLineChart')}>
//               Chart
//             </button>
//             <button className="btn btn-primary mx-1" onClick={() => navigate('/ReportPage')}>
//               Generate Report
//             </button>
//             <button className="btn btn-warning mx-1" onClick={() => navigate('/AlarmReport')}>
//               Alarm
//             </button>
//             <button className="btn btn-primary mx-1" onClick={handleAuditTrail}>
//               Audit Trail
//             </button>
//             <button className="btn btn-secondary mx-1" onClick={handleDataBackup}>
//               Data Backup
//             </button>
//             <button className="btn btn-danger mx-1" onClick={logout}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Header;
/////////////////////////////////////////////////
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

function Header({ user = { name: "Guest" }, logout }) {
  const navigate = useNavigate();

  const handleAuditTrail = () => {
    const auditDoc = new jsPDF();
    auditDoc.text("Audit Trail Report", 10, 10);
    auditDoc.save("audit_trail.pdf");
  };

  const handleDataBackup = () => {
    alert("Data backup process initiated!");
  };

  return (
    <div className="fixed-top bg-light p-3 shadow">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          {/* Left Side: User Info */}
          <div className="d-flex align-items-center">
            <span className="fs-5 me-3">User: {user?.employeeId}</span>
            <button
              className="btn btn-primary mx-1"
              onClick={() => navigate('/UserManagement')} // Navigate to UserManagement page
            >
              User
            </button>
          </div>

          {/* Center: Title */}
          <h2 className="text-center flex-grow-1 m-0">Techzone Testing</h2>

          {/* Right Side: Buttons */}
          <div className="d-flex align-items-center">
            <button className="btn btn-info mx-1" onClick={() => navigate('/AhuLineChart')}>
              Chart
            </button>
            <button className="btn btn-primary mx-1" onClick={() => navigate('/ReportPage')}>
              Generate Report
            </button>
            <button className="btn btn-primary mx-1" onClick={() => navigate('/Settings')}>
              Settings
            </button>
            <button className="btn btn-warning mx-1" onClick={() => navigate('/AlarmReport')}>
              Alarm
            </button>
            <button className="btn btn-primary mx-1" onClick={handleAuditTrail}>
              Audit Trail
            </button>
            <button className="btn btn-secondary mx-1" onClick={handleDataBackup}>
              Data Backup
            </button>
            <button className="btn btn-danger mx-1" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
