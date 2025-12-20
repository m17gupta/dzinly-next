export interface Branding {
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Features {
  websiteEnabled?: boolean;
  ecommerceEnabled?: boolean;
  blogEnabled?: boolean;
  invoicesEnabled?: boolean;
}

export interface Settings {
  locale?: string;
  currency?: string;
  timezone?: string;
}

export interface TenantModel {
  _id?: string;
  slug?: string;
  name?: string;
  email?: string;
  customDomainVerified?: boolean;
  plan?: string;
  subscriptionStatus?: string;
  branding?: Branding;
  paymentGateways?: Record<string, any>;
  features?: Features;
  settings?: Settings;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}