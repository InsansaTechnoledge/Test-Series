export const Features = [
    { id: 1, name: 'View Dashboard', category: 'Dashboard' },
    { id: 2, name: 'Create Reports', category: 'Reports' },
    { id: 3, name: 'Edit Reports', category: 'Reports' },
    { id: 4, name: 'Delete Reports', category: 'Reports' },
    { id: 5, name: 'View Users', category: 'User Management' },
    { id: 6, name: 'Create Users', category: 'User Management' },
    { id: 7, name: 'Edit Users', category: 'User Management' },
    { id: 8, name: 'Delete Users', category: 'User Management' },
    { id: 9, name: 'System Settings', category: 'Administration' },
    { id: 10, name: 'View Logs', category: 'Administration' },
    { id: 11, name: 'Manage Storage', category: 'Administration' },
    { id: 12, name: 'API Access', category: 'Integration' },
  ]

export const Roles = [
    { 
      id: 1, 
      name: 'Administrator', 
      description: 'Full system access', 
      features: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] 
    },
    { 
      id: 2, 
      name: 'Report Manager', 
      description: 'Can manage all reports', 
      features: [1, 2, 3, 4, 10] 
    },
  ]