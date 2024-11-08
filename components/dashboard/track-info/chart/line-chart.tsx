// ./chart/line-chart.tsx
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type PriceDataType = {
    timestamp: string;
    price: number;
};

const LineChart = ({ priceData }: { priceData: PriceDataType[] }) => {
    const data = {
        labels: priceData.map((point) => new Date(point.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'NFT Price',
                data: priceData.map((point) => point.price),
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointRadius: 4, 
            },
        ],
    };

    return <Line data={data} />;
};

export default LineChart;
