import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import '../pages/Dashboard.css';

const AHU = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

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
                // Try reconnecting after a delay if connection was lost
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h2 className="text-center mt-3">Boiler Real-Time Data</h2>
                    {!isConnected && <p className="text-center">Attempting to reconnect...</p>}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Register</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((value, index) => (
                                <tr key={index}>
                                    <td>{4001 + index}</td>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default AHU;
