import React from 'react';
import { Resource } from '../../types';

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No resources found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div 
          key={resource.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          {resource.image && (
            <div className="h-48 overflow-hidden">
              <img 
                src={resource.image} 
                alt={resource.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                resource.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                resource.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
              </span>
              <span className="text-gray-500 text-sm">{resource.owner}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
            <div className="space-y-2">
              <div className="text-gray-600">
                <span className="text-sm">{resource.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}