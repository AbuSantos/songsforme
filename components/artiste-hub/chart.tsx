"use client"
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type StreamData = {
    timestamp: string;
    count: number;
};

interface StreamGraphProps {
    streams: StreamData[];
    label: string
}


export const ArtisteChart = ({ streams, label }: StreamGraphProps) => {
    // Transform the data
    const labels = streams?.map((stream) => stream.timestamp)
    const counts = streams?.map((stream) => stream.count)


    const data = {
        labels,
        datasets: [
            {
                label: label,
                data: counts,
                backgroundColor: "#8E4EC6",
                borderColor: "#8E4EC6",
                borderWidth: 1,
            }
        ]
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <small>{label} per day</small>
            <Bar data={data} options={options} />
        </div>
    );
}
