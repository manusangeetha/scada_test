import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
    const chartData = {
        labels: ['On', 'Off'],
        datasets: [
            {
                data: [data.on, data.off],
                backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                hoverBackgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    // Pie chart options to set a min and max value for the scale
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(context.raw * 100) / 100;
                        return label;
                    },
                },
            },
        },
        // Maintain a 0-100 perception for the pie chart
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            },
        },
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto' }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
