import React, { useState } from 'react';
import Header from './Header'; // Import the Header component
const Settings = ({ onClose, onSave, user }) => {
    const [passwordExpiry, setPasswordExpiry] = useState(30); // Days before password expiry
    const [disableUser, setDisableUser] = useState(false); // Disable user account
    const [reportFormat, setReportFormat] = useState('PDF'); // Default report format
    const [reportEmail, setReportEmail] = useState(''); // Email for report sending
    const [machines, setMachines] = useState([{ name: '', id: '' }]); // Initialize with one machine

    const [userRoles, setUserRoles] = useState({
        admin: true,
        supervisor: false,
        operator: false,
        engineer: false,
        developer: false,
    });

    const handleAddMachine = () => {
        setMachines([...machines, { name: '', id: '' }]); // Add a new machine entry
    };

    const handleMachineChange = (index, field, value) => {
        const newMachines = [...machines];
        newMachines[index][field] = value; // Update the specific field for the machine
        setMachines(newMachines);
    };

    const handleRoleChange = (role) => {
        setUserRoles((prev) => ({ ...prev, [role]: !prev[role] }));
    };

    const handleSave = () => {
        // Save the settings
        onSave({ passwordExpiry, disableUser, reportFormat, reportEmail, machines, userRoles });
        onClose(); // Close the settings modal
    };

    return (
        <div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)', top: 0, left: 0, width: '100%', height: '100%' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', margin: 'auto', padding: '20px', maxWidth: '500px', borderRadius: '8px' }}>
                <Header user={user} onClose={onClose} />
                <span className="close" onClick={onClose} style={{ cursor: 'pointer', float: 'right', fontSize: '24px' }}>&times;</span>
                <h2>SCADA Settings</h2>

                <div>
                    <label>
                        Password Expiry (days): 
                        <input 
                            type="number" 
                            value={passwordExpiry} 
                            onChange={(e) => setPasswordExpiry(e.target.value)} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Disable User Account: 
                        <input 
                            type="checkbox" 
                            checked={disableUser} 
                            onChange={(e) => setDisableUser(e.target.checked)} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Report Format: 
                        <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
                            <option value="PDF">PDF</option>
                            <option value="CSV">CSV</option>
                            <option value="Excel">Excel</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Report Email: 
                        <input 
                            type="email" 
                            value={reportEmail} 
                            onChange={(e) => setReportEmail(e.target.value)} 
                            placeholder="Enter email for reports"
                        />
                    </label>
                </div>

                <h3>Add New Machine</h3>
                {machines.map((machine, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <label>
                            Machine Name: 
                            <input 
                                type="text" 
                                value={machine.name} 
                                onChange={(e) => handleMachineChange(index, 'name', e.target.value)} 
                            />
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            Machine ID: 
                            <input 
                                type="text" 
                                value={machine.id} 
                                onChange={(e) => handleMachineChange(index, 'id', e.target.value)} 
                            />
                        </label>
                    </div>
                ))}
                <button onClick={handleAddMachine}>Add Another Machine</button>
                
                <h3>User Roles Settings</h3>
                <div>
                    {Object.keys(userRoles).map((role) => (
                        <label key={role}>
                            <input
                                type="checkbox"
                                checked={userRoles[role]}
                                onChange={() => handleRoleChange(role)}
                            />
                            {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize role name */}
                        </label>
                    ))}
                </div>

                <button onClick={handleSave} style={{ marginTop: '20px' }}>Save</button>
            </div>
        </div>
    );
};

export default Settings;
