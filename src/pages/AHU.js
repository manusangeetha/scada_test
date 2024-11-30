// import React, { useEffect, useState } from 'react';
// import { Table } from 'react-bootstrap';
// import '../pages/Dashboard.css';
// const AHU = () => {
//     const [data, setData] = useState([]);
//     const [error, setError] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);

//     useEffect(() => {
//         let socket;
//         const connectWebSocket = () => {
//             socket = new WebSocket('ws://192.168.29.117:3002');

//             socket.onopen = () => {
//                 console.log("WebSocket connection established.");
//                 setIsConnected(true);
//                 setError(null);
//             };

//             socket.onmessage = (event) => {
//                 try {
//                     const receivedData = JSON.parse(event.data);
//                     if (receivedData.device === 'AHU') {
//                         setData(receivedData.values);
//                     }
//                 } catch (e) {
//                     console.error("Error parsing WebSocket message:", e);
//                     setError(e.message);
//                 }
//             };

//             socket.onerror = (error) => {
//                 console.error("WebSocket Error:", error);
//                 setError('WebSocket connection error.');
//             };

//             socket.onclose = (event) => {
//                 console.log("WebSocket connection closed:", event.reason);
//                 setIsConnected(false);
//                 setError('WebSocket connection was closed.');
//                 // Try reconnecting after a delay if connection was lost
//                 setTimeout(connectWebSocket, 5000);
//             };
//         };

//         connectWebSocket();

//         return () => {
//             if (socket) {
//                 socket.close();
//             }
//         };
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <h2>AHU Real-Time Data</h2>
//             {!isConnected && <p>Attempting to reconnect...</p>}
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Register</th>
//                         <th>AHU NAME</th>
//                         <th>Value</th>
//                         <th>Remark</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((value, index) => (
//                         <tr key={index}>
//                             <td>{4001 + index}</td>
//                             <td>{AHU}</td>
//                             <td>{value}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default AHU;
import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import '../pages/Dashboard.css';
const AHU = ({ user }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // Default values for AHU ID and AHU Name
    const [ahuName, setAhuName] = useState("Default AHU Name");
    const [ahuId, setAhuId] = useState("Default AHU ID");
    const [remark, setRemark] = useState("");

    // Check if the user is admin
    const isAdmin = user && user.employeeId === 'P311161'; // Adjusted to use role instead of username

    useEffect(() => {
        let socket;
        const connectWebSocket = () => {
            socket = new WebSocket('ws://192.168.29.117:3002');

            socket.onopen = () => {
                console.log("WebSocket connection established.");
                setIsConnected(true);
                setError(null);
            };

            socket.onmessage = (event) => {
                try {
                    const receivedData = JSON.parse(event.data);
                    if (receivedData.device === 'AHU') {
                        setData(receivedData.values);
                    }
                } catch (e) {
                    console.error("Error parsing WebSocket message:", e);
                    setError(e.message);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setError('WebSocket connection error.');
            };

            socket.onclose = (event) => {
                console.log("WebSocket connection closed:", event.reason);
                setIsConnected(false);
                setError('WebSocket connection was closed.');
                setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const handleSave = () => {
        // Send AHU Name, AHU ID, and Remark to backend
        fetch('/api/ahu/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ahuName,
                ahuId,  // Include AHU ID in save request
                remark,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("AHU updated:", data);
        })
        .catch((error) => {
            console.error("Error updating AHU:", error);
        });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>AHU Real-Time Data</h2>
            {!isConnected && <p>Attempting to reconnect...</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Register</th>
                        <th>AHU ID</th>
                        <th>AHU NAME</th>
                        <th>Value</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value, index) => (
                        <tr key={index}>
                            <td>{4001 + index}</td>
                            <td>
                                {isAdmin ? (
                                    <Form.Control
                                        type="text"
                                        value={ahuId}
                                        onChange={(e) => setAhuId(e.target.value)}
                                    />
                                ) : (
                                    <span>{ahuId}</span>
                                )}
                            </td>
                            <td>
                                {isAdmin ? (
                                    <Form.Control
                                        type="text"
                                        value={ahuName}
                                        onChange={(e) => setAhuName(e.target.value)}
                                    />
                                ) : (
                                    <span>{ahuName}</span>
                                )}
                            </td>
                            <td>{value}</td>
                            <td>
                                {isAdmin ? (
                                    <Form.Control
                                        type="text"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />
                                ) : (
                                    <span>{remark}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {isAdmin && (
                <Button onClick={handleSave} className="mt-3">
                    Save Changes
                </Button>
            )}
        </div>
    );
};





export default AHU;
