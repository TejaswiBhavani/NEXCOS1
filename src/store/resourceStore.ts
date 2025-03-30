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
      description: '20L drinking water container',
      location: 'Building A Storage',
      owner: 'Community Storage',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1616048056617-93b94a339009?auto=format&fit=crop&q=80'
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