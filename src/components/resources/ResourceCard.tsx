import React, { useState } from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Resource } from '../../types';
import BookingModal from '../booking/BookingModal';

interface ResourceCardProps extends Resource {
  onRequest: () => void;
}

const TYPE_COLORS = {
  Tool: 'bg-blue-100 text-blue-800',
  Parking: 'bg-purple-100 text-purple-800',
  Event: 'bg-orange-100 text-orange-800',
  Announcement: 'bg-red-100 text-red-800',
  Invitation: 'bg-pink-100 text-pink-800',
  Booking: 'bg-indigo-100 text-indigo-800',
};

export default function ResourceCard({ 
  title, 
  type, 
  location, 
  date, 
  owner, 
  image, 
  status,
  description,
  capacity,
  amenities,
  pricePerHour,
  onRequest,
  ...props
}: ResourceCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const statusColors = {
    available: 'bg-emerald-100 text-emerald-800',
    borrowed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const handleBookingSubmit = (bookingDetails: any) => {
    console.log('Booking details:', bookingDetails);
    onRequest();
  };

  return (
    <>
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
            <span className={`px-2 py-1 rounded text-sm ${TYPE_COLORS[type]}`}>
              {type}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
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
          
          {type === 'Booking' && (
            <div className="mt-4 space-y-2">
              {capacity && (
                <p className="text-sm text-gray-600">Capacity: {capacity} people</p>
              )}
              {amenities && amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
              {pricePerHour && (
                <p className="text-sm font-medium text-gray-700">${pricePerHour}/hour</p>
              )}
            </div>
          )}

          {status === 'available' ? (
            <button 
              onClick={() => type === 'Booking' ? setShowBookingModal(true) : onRequest()}
              className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              {type === 'Booking' ? 'Book Now' : 
               type === 'Invitation' ? 'Accept Invitation' : 
               type === 'Announcement' ? 'Mark as Read' : 
               'Request to Borrow'}
            </button>
          ) : (
            <div className="mt-4 flex items-center justify-center text-gray-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Currently Unavailable</span>
            </div>
          )}
        </div>
      </div>

      {type === 'Booking' && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          resource={{ title, type, location, date, owner, image, status, description, capacity, amenities, pricePerHour, ...props }}
          onSubmit={handleBookingSubmit}
        />
      )}
    </>
  );
}