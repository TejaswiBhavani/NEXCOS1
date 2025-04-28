import React, { useState } from 'react';
import { X, Users, Clock, Calendar } from 'lucide-react';
import { BookingDetails, Resource } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource;
  onSubmit: (details: BookingDetails) => void;
}

export default function BookingModal({ isOpen, onClose, resource, onSubmit }: BookingModalProps) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    startTime: '',
    endTime: '',
    attendees: 0,
    purpose: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bookingDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Book {resource.title}</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <div className="mt-1 relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  value={bookingDetails.startTime}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, startTime: e.target.value })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <div className="mt-1 relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  value={bookingDetails.endTime}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, endTime: e.target.value })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Attendees</label>
            <div className="mt-1 relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                min="1"
                max={resource.capacity}
                value={bookingDetails.attendees}
                onChange={(e) => setBookingDetails({ ...bookingDetails, attendees: parseInt(e.target.value) })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            {resource.capacity && (
              <p className="mt-1 text-sm text-gray-500">Maximum capacity: {resource.capacity} people</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose of Booking</label>
            <textarea
              value={bookingDetails.purpose}
              onChange={(e) => setBookingDetails({ ...bookingDetails, purpose: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              required
              placeholder="Please describe the purpose of your booking..."
            />
          </div>

          {resource.pricePerHour && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Price per hour: ${resource.pricePerHour}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}