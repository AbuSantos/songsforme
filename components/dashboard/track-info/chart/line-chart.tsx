"use client"
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const LineChart = ({ priceData }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const labels = priceData.map(data => new Date(data.timestamp * 1000).toLocaleDateString());
        const prices = priceData.map(data => data.price);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'NFT Price Over Time',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        });
    }, [priceData]);

    const options = {
        responsive: true,

        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price (in tokens)',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;
