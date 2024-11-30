import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const sidebarItems = [
    { name: 'AHU', to: '/ahu' },
    { name: 'EnergyMeter', to: '/EnergyMeter' },
    { name: 'Boiler', to: '/boiler' },
    { name: 'AirCompressor', to: '/AirCompressor' },
    { name: 'Chiller', to: '/Chiller' },
    { name: 'ETP', to: '/etp-plant' },
    { name: 'WaterSystem', to: '/WaterSystem' },

];

const Sidebar = ({ onSelect }) => {
    const [isCollapsed, setIsCollapsed] = useState(false); // State for collapse

    return (
        <div className={`d-flex flex-column ${isCollapsed ? 'collapsed' : ''}`} style={{ height: '100vh', backgroundColor: '#d1ebe3', transition: 'width 0.3s', width: isCollapsed ? '60px' : '200px' }}>
            <h5 className={`mb-4 p-3 ${isCollapsed ? 'd-none' : ''}`}>Dashboard Menu</h5> {/* Hide title when collapsed */}
            <div className={`flex-grow-1 ${isCollapsed ? 'd-none' : ''}`}> {/* Hide links when collapsed */}
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className="nav-link btn btn-outline-primary mb-3" // Bootstrap button styles
                        onClick={() => onSelect(item.name)} // Handle item selection
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>
            <div className="mt-auto"> {/* Use mt-auto to push the buttons to the bottom */}

                <button 
                    className="btn btn-light" 
                    onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse
                >
                    {isCollapsed ? '>' : '<'} {/* Toggle button text */}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
