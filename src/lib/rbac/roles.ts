import { RoleDefinition, UserRole, Permission } from '@/types';

// Define all available permissions
export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  
  // User management permissions
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_INVITE: 'users:invite',
  
  // Tenant management permissions
  TENANTS_CREATE: 'tenants:create',
  TENANTS_READ: 'tenants:read',
  TENANTS_UPDATE: 'tenants:update',
  TENANTS_DELETE: 'tenants:delete',
  
  // Product management permissions
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_READ: 'products:read',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  
  // Order management permissions
  ORDERS_CREATE: 'orders:create',
  ORDERS_READ: 'orders:read',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_DELETE: 'orders:delete',
  ORDERS_PROCESS: 'orders:process',
  
  // Content management permissions
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_BRANDING: 'settings:branding',
  
  // Franchise-specific permissions
  FRANCHISE_CREATE_CLIENTS: 'franchise:create_clients',
  FRANCHISE_MANAGE_CLIENTS: 'franchise:manage_clients',
  FRANCHISE_WHITE_LABEL: 'franchise:white_label',
  FRANCHISE_VIEW_ANALYTICS: 'franchise:view_analytics',
  
  // Business-specific permissions
  BUSINESS_MANAGE_INVENTORY: 'business:manage_inventory',
  BUSINESS_PROCESS_ORDERS: 'business:process_orders',
  BUSINESS_VIEW_REPORTS: 'business:view_reports',
  
  // Client-specific permissions
  CLIENT_VIEW_OWN_DATA: 'client:view_own_data',
  CLIENT_EDIT_PROFILE: 'client:edit_profile',
  CLIENT_PLACE_ORDERS: 'client:place_orders',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // System permissions
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_BACKUP: 'system:backup',
} as const;

// Role definitions with hierarchical permissions
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  // A - Admin (Platform Super Admin)
  A: {
    code: 'A',
    name: 'Admin',
    description: 'Platform administrator with full system access',
    level: 1,
    permissions: [
      // Full access to everything
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'invite'] },
      { resource: 'tenants', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'orders', actions: ['create', 'read', 'update', 'delete', 'process'] },
      { resource: 'content', actions: ['create', 'read', 'update', 'delete', 'publish'] },
      { resource: 'settings', actions: ['read', 'update', 'branding'] },
      { resource: 'analytics', actions: ['view', 'export'] },
      { resource: 'system', actions: ['logs', 'backup'] },
    ],
  },

  // F - Franchise (Sub-admin with white-labeling capabilities)
  F: {
    code: 'F',
    name: 'Franchise',
    description: 'Franchise owner with client management and white-labeling capabilities',
    level: 2,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'invite'], conditions: { tenantLevel: true } },
      { resource: 'tenants', actions: ['create', 'read', 'update'], conditions: { franchiseLevel: true } },
      { resource: 'products', actions: ['create', 'read', 'update', 'delete'], conditions: { tenantLevel: true } },
      { resource: 'orders', actions: ['read', 'update', 'process'], conditions: { tenantLevel: true } },
      { resource: 'content', actions: ['create', 'read', 'update', 'delete', 'publish'], conditions: { tenantLevel: true } },
      { resource: 'settings', actions: ['read', 'update', 'branding'], conditions: { tenantLevel: true } },
      { resource: 'franchise', actions: ['create_clients', 'manage_clients', 'white_label', 'view_analytics'] },
      { resource: 'analytics', actions: ['view'], conditions: { tenantLevel: true } },
    ],
  },

  // B - Business (Business operations manager)
  B: {
    code: 'B',
    name: 'Business',
    description: 'Business operations manager with inventory and order management',
    level: 3,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'users', actions: ['read'], conditions: { tenantLevel: true } },
      { resource: 'products', actions: ['create', 'read', 'update'], conditions: { tenantLevel: true } },
      { resource: 'orders', actions: ['read', 'update', 'process'], conditions: { tenantLevel: true } },
      { resource: 'content', actions: ['read', 'update'], conditions: { tenantLevel: true } },
      { resource: 'business', actions: ['manage_inventory', 'process_orders', 'view_reports'] },
      { resource: 'analytics', actions: ['view'], conditions: { tenantLevel: true } },
    ],
  },

  // C - Client (Customer with limited access)
  C: {
    code: 'C',
    name: 'Client',
    description: 'Client with access to own data and order placement',
    level: 4,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'products', actions: ['read'] },
      { resource: 'orders', actions: ['create', 'read'], conditions: { own: true } },
      { resource: 'client', actions: ['view_own_data', 'edit_profile', 'place_orders'] },
    ],
  },

  // D - Designer (Content and design management)
  D: {
    code: 'D',
    name: 'Designer',
    description: 'Designer with content creation and branding capabilities',
    level: 4,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'products', actions: ['create', 'read', 'update'], conditions: { tenantLevel: true } },
      { resource: 'content', actions: ['create', 'read', 'update', 'delete', 'publish'], conditions: { tenantLevel: true } },
      { resource: 'settings', actions: ['read', 'branding'], conditions: { tenantLevel: true } },
    ],
  },

  // E - Editor (Content editing and management)
  E: {
    code: 'E',
    name: 'Editor',
    description: 'Content editor with publishing capabilities',
    level: 5,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'products', actions: ['read', 'update'], conditions: { tenantLevel: true } },
      { resource: 'content', actions: ['create', 'read', 'update', 'publish'], conditions: { tenantLevel: true } },
      { resource: 'orders', actions: ['read'], conditions: { tenantLevel: true } },
    ],
  },

  // G - Guest (Read-only access)
  G: {
    code: 'G',
    name: 'Guest',
    description: 'Guest user with read-only access',
    level: 6,
    permissions: [
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'products', actions: ['read'] },
      { resource: 'content', actions: ['read'] },
    ],
  },
};

// Helper functions for role management
export class RoleManager {
  static getRoleDefinition(role: UserRole): RoleDefinition {
    return ROLE_DEFINITIONS[role];
  }

  static hasPermission(
    userRole: UserRole,
    resource: string,
    action: string,
    context?: {
      isOwn?: boolean;
      isTenantLevel?: boolean;
      isFranchiseLevel?: boolean;
    }
  ): boolean {
    const roleDefinition = this.getRoleDefinition(userRole);
    
    const permission = roleDefinition.permissions.find(p => p.resource === resource);
    if (!permission) return false;

    if (!permission.actions.includes(action)) return false;

    // Check conditions if they exist
    if (permission.conditions) {
      if (permission.conditions.own && !context?.isOwn) return false;
      if (permission.conditions.tenantLevel && !context?.isTenantLevel) return false;
      if (permission.conditions.franchiseLevel && !context?.isFranchiseLevel) return false;
    }

    return true;
  }

  static canAccessResource(userRole: UserRole, resource: string): boolean {
    const roleDefinition = this.getRoleDefinition(userRole);
    return roleDefinition.permissions.some(p => p.resource === resource);
  }

  static getAccessibleResources(userRole: UserRole): string[] {
    const roleDefinition = this.getRoleDefinition(userRole);
    return roleDefinition.permissions.map(p => p.resource);
  }

  static isHigherRole(role1: UserRole, role2: UserRole): boolean {
    const level1 = this.getRoleDefinition(role1).level;
    const level2 = this.getRoleDefinition(role2).level;
    return level1 < level2; // Lower level number = higher authority
  }

  static canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return this.isHigherRole(managerRole, targetRole);
  }

  static getManageableRoles(userRole: UserRole): UserRole[] {
    const userLevel = this.getRoleDefinition(userRole).level;
    return Object.values(ROLE_DEFINITIONS)
      .filter(role => role.level > userLevel)
      .map(role => role.code);
  }
}

// Default permissions for new users by role
export const DEFAULT_USER_PERMISSIONS = {
  A: {
    dashboard: true,
    users: ['create', 'read', 'update', 'delete'],
    tenants: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    orders: ['create', 'read', 'update', 'delete'],
    content: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
  },
  F: {
    dashboard: true,
    users: ['create', 'read', 'update'],
    tenants: ['create', 'read', 'update'],
    products: ['create', 'read', 'update', 'delete'],
    orders: ['read', 'update'],
    content: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    franchise: {
      createClients: true,
      manageClients: true,
      whiteLabel: true,
      viewAnalytics: true,
    },
  },
  B: {
    dashboard: true,
    users: ['read'],
    tenants: [],
    products: ['create', 'read', 'update'],
    orders: ['read', 'update'],
    content: ['read', 'update'],
    settings: ['read'],
    business: {
      manageInventory: true,
      processOrders: true,
      viewReports: true,
    },
  },
  C: {
    dashboard: true,
    users: [],
    tenants: [],
    products: ['read'],
    orders: ['create', 'read'],
    content: ['read'],
    settings: [],
    client: {
      viewOwnData: true,
      editProfile: true,
      placeOrders: true,
    },
  },
  D: {
    dashboard: true,
    users: [],
    tenants: [],
    products: ['create', 'read', 'update'],
    orders: [],
    content: ['create', 'read', 'update', 'delete'],
    settings: ['read'],
  },
  E: {
    dashboard: true,
    users: [],
    tenants: [],
    products: ['read', 'update'],
    orders: ['read'],
    content: ['create', 'read', 'update'],
    settings: [],
  },
  G: {
    dashboard: true,
    users: [],
    tenants: [],
    products: ['read'],
    orders: [],
    content: ['read'],
    settings: [],
  },
};