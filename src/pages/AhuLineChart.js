import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AhuLineChart = () => {
  const [ahuIds, setAhuIds] = useState('ahu-01'); // Default to ahu-01
  const [startDate, setStartDate] = useState(''); // Start date
  const [endDate, setEndDate] = useState(''); // End date
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchAhuData = async () => {
    if (!ahuIds || !startDate || !endDate) {
      console.log("Please enter AHU IDs and select a date range.");
      return;
    }

    try {
      const response = await fetch(`/api/ahus/data?ahuIds=${ahuIds}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      const labels = data.map((entry) => new Date(entry.date).toLocaleString());
      const temperatures = data.map((entry) => entry.temperature);
      const humidities = data.map((entry) => entry.relativeHumidity);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Relative Humidity (%)',
            data: humidities,
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching AHU data:', error);
    }
  };

  // Automatically set the default date range (last 7 days) when the component mounts
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    setStartDate(lastWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Fetch data whenever ahuIds, startDate, or endDate changes
  useEffect(() => {
    if (ahuIds && startDate && endDate) {
      fetchAhuData();
    }
  }, [ahuIds, startDate, endDate]);

  return (
    <div>
      <h2>AHU Data</h2>

      <div className="mb-3">
        <label>AHU IDs (comma-separated):</label>
        <input
          type="text"
          className="form-control"
          value={ahuIds}
          onChange={(e) => setAhuIds(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Date Range:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Render the Line chart */}
      {chartData.labels.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>No data available for the selected AHU(s) and date range.</p>
      )}
    </div>
  );
};

export default AhuLineChart;
