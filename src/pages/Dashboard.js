
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch summary data for totals
    const fetchSummaryData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/machines/summary');
            const data = await response.json();
            setSummary(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching summary data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, []);

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container-fluid">
                <Header user={user} logout={logout} />
                <div className="mt-5 pt-4">
                    {/* Summary Cards */}
                    <div className="row mb-4">
                        {loading ? (
                            <div className="col-12 text-center">
                                <h5>Loading data...</h5>
                            </div>
                        ) : (
                            <>
                                <div className="col-md-4">
                                    <div className="card text-white bg-primary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 01</h5>
                                            <p className="card-text">{summary.ahuCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-success mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 02</h5>
                                            <p className="card-text">{summary.boilerCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-info mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 03</h5>
                                            <p className="card-text">{summary.energyMeterCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-warning mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 04</h5>
                                            <p className="card-text">{summary.airCompressorCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-danger mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 05</h5>
                                            <p className="card-text">{summary.chillerCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
                                </div>  
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
            
                                </div>  
                                 <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
                                </div>  
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
            
                                </div>   
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
            
                                </div>  
                                <div className="col-md-4">
                                    <div className="card text-white bg-secondary mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Energy Meters 06</h5>
                                            <p className="card-text">{summary.waterSystemCount || 0}</p>
                                        </div>
                                    </div>
            
                                </div>                                                                                                                                                          
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
