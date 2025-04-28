import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResourceAnalytics = () => {
  const usageData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Resource Usage',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const predictionData: ChartData<'bar'> = {
    labels: ['Tools', 'Emergency', 'Food', 'Water', 'Medical', 'Power'],
    datasets: [
      {
        label: 'Predicted Needs',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Resource Usage Trends</h3>
        <Line data={usageData} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Predicted Resource Needs</h3>
        <Bar data={predictionData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-semibold mb-2">Resource Utilization</h4>
          <p className="text-3xl font-bold text-emerald-600">78%</p>
          <p className="text-sm text-gray-500">Average across all categories</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-semibold mb-2">Resource Gaps</h4>
          <p className="text-3xl font-bold text-amber-600">3</p>
          <p className="text-sm text-gray-500">Categories needing attention</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-semibold mb-2">Community Engagement</h4>
          <p className="text-3xl font-bold text-blue-600">92%</p>
          <p className="text-sm text-gray-500">Active participation rate</p>
        </div>
      </div>
    </div>
  );
};

export default ResourceAnalytics;