import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsListProps {
  alerts: Alert[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`rounded-lg p-4 ${
            alert.type === 'prep' 
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'bg-red-50 border-l-4 border-red-500'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {alert.verified ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                alert.type === 'prep' ? 'text-blue-800' : 'text-red-800'
              }`}>
                {alert.title}
              </h3>
              <div className="mt-2 text-sm">
                <p className={alert.type === 'prep' ? 'text-blue-700' : 'text-red-700'}>
                  {alert.description}
                </p>
              </div>
              <div className="mt-3">
                <div className="-mx-2 -my-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {alert.location} • {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {alert.sender}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}