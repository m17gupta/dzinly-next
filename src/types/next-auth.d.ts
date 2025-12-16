import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      tenantId: string;
      tenantSlug: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
  }
}