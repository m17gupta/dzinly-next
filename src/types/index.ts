import { ObjectId } from 'mongodb';

// Base document with multi-tenant support
export interface BaseDocument {
  _id: ObjectId;
  tenantId: ObjectId;
  // Optional website scope for multi-website tenants
  websiteId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Role System
export type UserRole = 'A' | 'F' | 'B' | 'C' | 'D' | 'E' | 'G';

export interface RoleDefinition {
  code: UserRole;
  name: string;
  description: string;
  level: number; // Hierarchy level (lower number = higher authority)
  permissions: Permission[];
}

export interface Permission {
  resource: string; // e.g., 'users', 'products', 'orders', 'settings'
  actions: string[]; // e.g., ['create', 'read', 'update', 'delete']
  conditions?: {
    own?: boolean; // Can only access own resources
    tenantLevel?: boolean; // Can access tenant-level resources
    franchiseLevel?: boolean; // Can access franchise-level resources
  };
}

// White-labeling and Branding
export interface BrandingSettings {
  logo?: {
    url: string;
    width?: number;
    height?: number;
  };
  favicon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    mutedForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  customCSS?: string;
}

// Tenant (franchise/client) - Enhanced
export interface Tenant extends Omit<BaseDocument, 'tenantId'> {

  slug: string; // subdomain: "franchise1"
  name: string; // "Franchise Store 1"
  email: string;
  phone?: string;
  
  // Tenant type and hierarchy
  type: 'platform' | 'franchise' | 'business' | 'client';
  parentTenantId?: ObjectId; // For franchise hierarchy
  
  // Enhanced whitelabel settings
  branding: BrandingSettings;

  // Domain configuration
  customDomain?: string; // "store.example.com"
  customDomainVerified: boolean;

  // Billing & subscription
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  subscriptionEndsAt?: Date;

  // Payment gateway credentials (encrypted)
  paymentGateways: {
    stripe?: {
      publishableKey: string;
      secretKey: string; // Store encrypted
    };
    razorpay?: {
      keyId: string;
      keySecret: string; // Store encrypted
    };
  };

  // Feature flags
  features: {
    websiteEnabled: boolean;
    ecommerceEnabled: boolean;
    blogEnabled: boolean;
    invoicesEnabled: boolean;
    franchiseManagement?: boolean;
    clientManagement?: boolean;
    whiteLabeling?: boolean;
  };

  // Settings
  settings: {
    locale: string; // "en-US"
    currency: string; // "USD"
    timezone: string; // "America/New_York"
    taxRate?: number; // 0.08 (8%)
    maxUsers?: number; // User limit for this tenant
    maxSubTenants?: number; // Sub-tenant limit for franchises
  };

  // Status
  status: 'active' | 'suspended' | 'pending';
}

// Enhanced User with comprehensive role system
export interface User extends BaseDocument {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'invited' | 'suspended';
  lastLoginAt?: Date;
  
  // Enhanced permissions with granular control
  permissions: {
    // Core permissions
    dashboard: boolean;
    users: string[]; // ['create', 'read', 'update', 'delete']
    tenants: string[];
    products: string[];
    orders: string[];
    content: string[];
    settings: string[];
    
    // Franchise-specific permissions
    franchise?: {
      createClients: boolean;
      manageClients: boolean;
      whiteLabel: boolean;
      viewAnalytics: boolean;
    };
    
    // Business-specific permissions
    business?: {
      manageInventory: boolean;
      processOrders: boolean;
      viewReports: boolean;
    };
    
    // Client-specific permissions
    client?: {
      viewOwnData: boolean;
      editProfile: boolean;
      placeOrders: boolean;
    };
  };
  
  // User metadata
  metadata?: {
    department?: string;
    position?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
}

// Super Admin (platform-level access)
export interface SuperAdmin {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin';
  permissions: {
    platformManagement: boolean;
    tenantManagement: boolean;
    userManagement: boolean;
    systemSettings: boolean;
    analytics: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Role-based UI Configuration
export interface UIConfiguration {
  _id: ObjectId;
  tenantId: ObjectId;
  role: UserRole;
  
  // Navigation configuration
  navigation: {
    items: NavigationItem[];
    layout: 'sidebar' | 'topbar' | 'hybrid';
  };
  
  // Dashboard configuration
  dashboard: {
    widgets: DashboardWidget[];
    layout: 'grid' | 'list' | 'custom';
  };
  
  // Theme and styling
  theme: BrandingSettings;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  permissions: string[]; // Required permissions to see this item
  roles: UserRole[]; // Roles that can see this item
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'stat' | 'table' | 'custom';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
  permissions: string[];
  roles: UserRole[];
}

// Franchise-Client Relationship
export interface FranchiseClient extends BaseDocument {
  franchiseId: ObjectId; // Parent franchise
  clientTenantId: ObjectId; // Client's tenant
  
  // Relationship metadata
  relationshipType: 'direct' | 'referral' | 'partnership';
  commissionRate?: number; // If applicable
  
  // Status and settings
  status: 'active' | 'suspended' | 'terminated';
  settings: {
    allowDirectAccess: boolean;
    shareAnalytics: boolean;
    customBranding: boolean;
  };
}

// Activity Log for audit trail
export interface ActivityLog {
  _id: ObjectId;
  tenantId: ObjectId;
  userId: ObjectId;
  
  action: string; // 'create', 'update', 'delete', 'login', etc.
  resource: string; // 'user', 'product', 'order', etc.
  resourceId?: ObjectId;
  
  details: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };
  
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
}
