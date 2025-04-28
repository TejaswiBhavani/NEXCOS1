import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Users, Phone } from 'lucide-react';
import QRCode from 'qrcode.react';

interface EmergencyTeam {
  id: string;
  name: string;
  status: 'available' | 'responding' | 'unavailable';
  location: string;
  members: number;
  lastUpdate: string;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'deployed' | 'available' | 'maintenance';
}

const EmergencyResponse = () => {
  const [activeTeams] = useState<EmergencyTeam[]>([
    {
      id: '1',
      name: 'First Response Team Alpha',
      status: 'available',
      location: 'Building A',
      members: 5,
      lastUpdate: '2 mins ago'
    },
    {
      id: '2',
      name: 'Medical Response Team',
      status: 'responding',
      location: 'Building C',
      members: 3,
      lastUpdate: '5 mins ago'
    }
  ]);

  const [deployedResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Emergency Medical Kit',
      type: 'Medical',
      location: 'Building A',
      status: 'deployed'
    },
    {
      id: '2',
      name: 'Power Generator',
      type: 'Power',
      location: 'Building C',
      status: 'deployed'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Emergency Status Overview */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Active Emergency Response</h3>
            <p className="text-red-700">Medical emergency in Building C - Response teams deployed</p>
          </div>
        </div>
      </div>

      {/* Response Teams */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Active Response Teams</h3>
        <div className="space-y-4">
          {activeTeams.map(team => (
            <div key={team.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{team.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{team.members} members</span>
                    <MapPin className="h-4 w-4 ml-3 mr-1" />
                    <span>{team.location}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  team.status === 'available' ? 'bg-green-100 text-green-800' :
                  team.status === 'responding' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {team.status}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last update: {team.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployed Resources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Deployed Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deployedResources.map(resource => (
            <div key={resource.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{resource.name}</h4>
                  <p className="text-sm text-gray-500">{resource.type}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{resource.location}</span>
                  </div>
                </div>
                <QRCode value={resource.id} size={64} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="font-medium">Emergency Response</p>
                <p className="text-sm text-gray-500">24/7 Emergency Line</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Call Now
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Medical Support</p>
                <p className="text-sm text-gray-500">On-site Medical Team</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;