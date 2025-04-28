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
    // Tools Category
    {
      id: '1',
      title: 'Power Drill Set',
      type: 'Tools',
      description: 'Professional-grade power drill with multiple attachments',
      location: 'Building B Workshop',
      owner: 'Community Tools',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      title: 'Garden Tools Collection',
      type: 'Tools',
      description: 'Complete set of gardening tools including shovel, rake, and pruning shears',
      location: 'Community Garden Shed',
      owner: 'Garden Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80'
    },

    // Emergency Category
    {
      id: '3',
      title: 'Emergency Response Kit',
      type: 'Emergency',
      description: 'Complete emergency response kit with essential supplies',
      location: 'Building A Emergency Room',
      owner: 'Emergency Response Team',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1587814696494-9e91a66f0f17?auto=format&fit=crop&q=80'
    },

    // Food Category
    {
      id: '4',
      title: 'Emergency Food Supply',
      type: 'Food',
      description: '72-hour emergency food supply for a family of four',
      location: 'Community Storage Room',
      owner: 'Emergency Preparedness',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80'
    },
    {
      id: '5',
      title: 'Meal Kit Station',
      type: 'Food',
      description: 'Ready-to-cook meal kits with non-perishable ingredients',
      location: 'Building C Kitchen',
      owner: 'Food Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80'
    },

    // Water Category
    {
      id: '6',
      title: 'Emergency Water Supply',
      type: 'Water',
      description: '20L drinking water container',
      location: 'Building A Storage',
      owner: 'Community Storage',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1616048056617-93b94a339009?auto=format&fit=crop&q=80'
    },
    {
      id: '7',
      title: 'Water Filtration System',
      type: 'Water',
      description: 'High-capacity water filtration system',
      location: 'Emergency Supply Room',
      owner: 'Community Resources',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1624958723474-5cd0c7d96d51?auto=format&fit=crop&q=80'
    },

    // Space Category
    {
      id: '8',
      title: 'Emergency Shelter Tent',
      type: 'Space',
      description: '8-person emergency shelter tent with weather protection',
      location: 'Emergency Storage',
      owner: 'Community Resources',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&q=80'
    },

    // Medical Category
    {
      id: '9',
      title: 'Advanced First Aid Kit',
      type: 'Medical',
      description: 'Comprehensive first aid kit with emergency supplies',
      location: 'Medical Center',
      owner: 'Health Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80'
    },
    {
      id: '10',
      title: 'Portable Defibrillator',
      type: 'Medical',
      description: 'AED device for emergency cardiac response',
      location: 'Building B Lobby',
      owner: 'Emergency Response',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80'
    },

    // Traffic Category
    {
      id: '11',
      title: 'Traffic Safety Kit',
      type: 'Traffic',
      description: 'Complete set of traffic cones, flares, and reflective gear',
      location: 'Security Office',
      owner: 'Security Team',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&q=80'
    },

    // Power Category
    {
      id: '12',
      title: 'Portable Generator',
      type: 'Power',
      description: '3000W portable generator with fuel supply',
      location: 'Maintenance Room',
      owner: 'Facilities',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1518631031670-66bdad2f4494?auto=format&fit=crop&q=80'
    },
    {
      id: '13',
      title: 'Solar Power Station',
      type: 'Power',
      description: 'Portable solar power station with multiple outlets',
      location: 'Emergency Storage',
      owner: 'Community Resources',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80'
    },

    // Communication Category
    {
      id: '14',
      title: 'Emergency Radio Set',
      type: 'Communication',
      description: 'Two-way radio set with charging station',
      location: 'Security Office',
      owner: 'Emergency Response',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1589913786576-2a36b5a9b2d3?auto=format&fit=crop&q=80'
    },

    // Navigation Category
    {
      id: '15',
      title: 'Emergency Navigation Kit',
      type: 'Navigation',
      description: 'GPS device, compass, and local area maps',
      location: 'Emergency Center',
      owner: 'Safety Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&q=80'
    },

    // Lighting Category
    {
      id: '16',
      title: 'Emergency Lighting Pack',
      type: 'Lighting',
      description: 'Set of rechargeable flashlights and lanterns',
      location: 'Building A Storage',
      owner: 'Community Resources',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?auto=format&fit=crop&q=80'
    },

    // Community Category
    {
      id: '17',
      title: 'Community Meeting Space',
      type: 'Community',
      description: 'Large meeting room with presentation equipment',
      location: 'Building C',
      owner: 'Community Center',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80'
    },

    // Support Category
    {
      id: '18',
      title: 'Emergency Contact Directory',
      type: 'Support',
      description: 'Updated list of emergency contacts and resources',
      location: 'Online Portal',
      owner: 'Community Support',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80'
    },

    // Skills Category
    {
      id: '19',
      title: 'First Aid Training Course',
      type: 'Skills',
      description: 'Comprehensive first aid and CPR certification course',
      location: 'Training Center',
      owner: 'Health Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80'
    },

    // Networks Category
    {
      id: '20',
      title: 'Neighborhood Watch Program',
      type: 'Networks',
      description: 'Organized community safety network',
      location: 'Community-wide',
      owner: 'Safety Committee',
      status: 'available',
      createdAt: Date.now(),
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80'
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