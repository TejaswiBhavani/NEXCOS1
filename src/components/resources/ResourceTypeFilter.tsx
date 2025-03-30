import React from 'react';
import { ResourceType } from '../../types';

interface ResourceTypeFilterProps {
  selectedType: ResourceType | 'All';
  onTypeSelect: (type: ResourceType | 'All') => void;
}

const RESOURCE_TYPES: (ResourceType | 'All')[] = [
  'All',
  'Tools',
  'Emergency',
  'Food',
  'Water',
  'Space',
  'Medical'
];

export default function ResourceTypeFilter({ selectedType, onTypeSelect }: ResourceTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {RESOURCE_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onTypeSelect(type)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === type
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}