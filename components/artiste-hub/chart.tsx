"use client";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { format } from "date-fns";
import { useMemo } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type StreamData = {
    timestamp: string;
    count: number;
};

interface StreamGraphProps {
    streams: StreamData[];
    label: string;
}

export const ArtisteChart = ({ streams, label }: StreamGraphProps) => {

    const labels = useMemo(
        () => streams?.map((stream) => format(new Date(stream.timestamp), "MMM d")),
        [streams]
    );
    const counts = useMemo(() => streams?.map((stream) => stream.count), [streams]);

    const data = {
        labels,
        datasets: [
            {
                label: label,
                data: counts,
                backgroundColor: "#8E4EC6",
                borderColor: "#8E4EC6",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
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
            <Bar data={data} options={options} />
        </div>
    );
};
