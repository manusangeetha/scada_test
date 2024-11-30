import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [isDisabled, setIsDisabled] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users.');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:3001/users', {
                employeeId,
                password,
                role,
                isDisabled,
            });
            setSuccessMessage(response.data.message);
            fetchUsers(); // Refresh user list
            clearFields();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        }
    };

    const clearFields = () => {
        setEmployeeId('');
        setPassword('');
        setRole('user');
        setIsDisabled(false);
    };

    // Toggle the user's enable/disable status
    const handleToggleUserStatus = async (id, currentStatus) => {
        setError('');
        setSuccessMessage('');
        try {
            await axios.patch(`http://localhost:3001/users/${id}/toggle-disable`, { isDisabled: !currentStatus });
            setSuccessMessage('User status updated successfully.');
            fetchUsers(); // Refresh user list
        } catch (err) {
            setError('Error toggling user status.');
            console.error('Error toggling user status:', err);
        }
    };

    // Clear success or error messages after a short period
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    return (
        <div className="container">
            <h2>User Management</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Add user form */}
            <form onSubmit={handleAddUser} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label">Employee ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                        className="form-select"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Guest">Guest</option>
                        <option value="admin">Admin</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="operator">Operator</option>
                        <option value="engineer">Engineer</option>
                    </select>
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isDisabled"
                        checked={isDisabled}
                        onChange={() => setIsDisabled(!isDisabled)}
                    />
                    <label className="form-check-label" htmlFor="isDisabled">Disable User</label>
                </div>
                <button type="submit" className="btn btn-primary">Add User</button>
            </form>

            {/* Display existing users */}
            <h3>Existing Users</h3>
            <ul className="list-group">
                {users.map((user) => (
                    <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.employeeId} ({user.role}) - {user.isDisabled ? 'Disabled' : 'Active'}

                        {/* Toggle user status button */}
                        <button
                            className={`btn btn-sm ${user.isDisabled ? 'btn-success' : 'btn-danger'}`}
                            onClick={() => handleToggleUserStatus(user._id, user.isDisabled)}
                            disabled={user.isDisabled === (user.isDisabled === false)} // Disable toggle when same status
                        >
                            {user.isDisabled ? 'Enable' : 'Disable'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
