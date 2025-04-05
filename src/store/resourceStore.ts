import { create } from 'zustand';
import { Resource } from '../types';

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [
    {
      id: '1',
      title: 'Emergency Water Supply',
      type: 'Water',
      description: '20L drinking water container with filtration system',
      location: 'Building A Storage',
      owner: 'Community Storage',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1616048056617-93b94a339009?auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      title: 'Multi-Tool Kit',
      type: 'Tools',
      description: 'Professional-grade multi-tool set with carrying case',
      location: 'Building B Workshop',
      owner: 'Maintenance Department',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1581147036324-c1c9bf55b8dd?auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      title: 'Emergency Medical Station',
      type: 'Medical',
      description: 'Comprehensive first aid station with AED and supplies',
      location: 'Main Lobby',
      owner: 'Health Services',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80'
    },
    {
      id: '4',
      title: 'Solar Power Bank Station',
      type: 'Power',
      description: 'High-capacity solar charging station with multiple outlets',
      location: 'Community Center',
      owner: 'Facilities Management',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40712c9b?auto=format&fit=crop&q=80'
    },
    {
      id: '5',
      title: 'Emergency Food Cache',
      type: 'Food',
      description: 'Long-term storage food supplies and MREs',
      location: 'Storage Unit C',
      owner: 'Emergency Response Team',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1602073357552-fae5bed5b7c1?auto=format&fit=crop&q=80'
    },
    {
      id: '6',
      title: 'Emergency Shelter Kit',
      type: 'Space',
      description: 'Portable shelter with bedding and climate control',
      location: 'Emergency Storage',
      owner: 'Community Services',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1504280317859-4d15b5e6f40e?auto=format&fit=crop&q=80'
    },
    {
      id: '7',
      title: 'Traffic Safety Kit',
      type: 'Traffic',
      description: 'Complete set of road flares, cones, and reflective gear',
      location: 'Security Office',
      owner: 'Security Team',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&q=80'
    },
    {
      id: '8',
      title: 'Emergency Radio System',
      type: 'Communication',
      description: 'Long-range emergency communication system',
      location: 'Command Center',
      owner: 'Emergency Response',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&q=80'
    },
    {
      id: '9',
      title: 'Navigation Kit',
      type: 'Navigation',
      description: 'Professional navigation tools and local area maps',
      location: 'Information Center',
      owner: 'Community Services',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&q=80'
    },
    {
      id: '10',
      title: 'Emergency Lighting System',
      type: 'Lighting',
      description: 'High-powered emergency lights and backup systems',
      location: 'Maintenance Room',
      owner: 'Facilities',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&q=80'
    },
    {
      id: '11',
      title: 'Community Center Access',
      type: 'Community',
      description: 'Multi-purpose community space with resources',
      location: 'Building C',
      owner: 'Community Management',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80'
    },
    {
      id: '12',
      title: 'Emergency Support Network',
      type: 'Support',
      description: 'Coordinated emergency support services',
      location: 'Support Center',
      owner: 'Support Services',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80'
    },
    {
      id: '13',
      title: 'Emergency Response Training',
      type: 'Skills',
      description: 'Comprehensive emergency response training program',
      location: 'Training Center',
      owner: 'Training Department',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80'
    },
    {
      id: '14',
      title: 'Community Network Hub',
      type: 'Networks',
      description: 'Centralized community resource sharing network',
      location: 'Network Center',
      owner: 'Community Coordination',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80'
    }
  ],
  addResource: (resource) =>
    set((state) => ({
      resources: [
        ...state.resources,
        {
          ...resource,
          id: Date.now().toString(),
          createdAt: Date.now()
        }
      ]
    })),
  updateResource: (id, updates) =>
    set((state) => ({
      resources: state.resources.map((resource) =>
        resource.id === id ? { ...resource, ...updates } : resource
      )
    })),
  deleteResource: (id) =>
    set((state) => ({
      resources: state.resources.filter((resource) => resource.id !== id)
    }))
}));