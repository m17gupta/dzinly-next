
export interface IUser  {
  tenantId?: string
  email?: string;
  passwordHash?: string;
  name?: string;
  role?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

