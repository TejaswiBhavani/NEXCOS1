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
  'Medical',
  'Traffic',
  'Power',
  'Communication',
  'Navigation',
  'Lighting',
  'Community',
  'Support',
  'Skills',
  'Networks'
];

const TYPE_DESCRIPTIONS: Record<string, string> = {
  Tools: 'Essential tools and equipment',
  Emergency: 'Critical emergency supplies',
  Food: 'Non-perishable items, meal kits, rations',
  Water: 'Bottled water, purification tablets, filters',
  Space: 'Shelters, tents, sleeping bags',
  Medical: 'First aid kits, medications, bandages',
  Traffic: 'Road flares, reflective vests, traffic cones',
  Power: 'Solar chargers, batteries, generators',
  Communication: 'Radios, satellite phones, whistles',
  Navigation: 'Compasses, GPS devices, maps',
  Lighting: 'Flashlights, lanterns, headlamps',
  Community: 'Local community resources',
  Support: 'Emergency contacts, hotlines, volunteers',
  Skills: 'Training programs, workshops, courses',
  Networks: 'Resource sharing, neighborhood watch'
};

export default function ResourceTypeFilter({ selectedType, onTypeSelect }: ResourceTypeFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {RESOURCE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onTypeSelect(type)}
            className={`group relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
            {type !== 'All' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {TYPE_DESCRIPTIONS[type]}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}