import React from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Resource } from '../store/resourceStore';

interface ResourceCardProps extends Resource {
  onRequest: () => void;
}

export default function ResourceCard({ 
  title, 
  type, 
  location, 
  date, 
  owner, 
  image, 
  status,
  onRequest 
}: ResourceCardProps) {
  const statusColors = {
    available: 'bg-emerald-100 text-emerald-800',
    borrowed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="text-gray-500 text-sm">{owner}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
            {type}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{date}</span>
          </div>
        </div>
        {status === 'available' ? (
          <button 
            onClick={onRequest}
            className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Request to Borrow
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-center text-gray-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Currently Unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}