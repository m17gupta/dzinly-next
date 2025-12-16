import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from './user-service';
import { tenantService } from '../tenant/tenant-service';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'Tenant', type: 'hidden' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
       
          return null;
        }
        const tenantSlug = credentials.tenantSlug as string;
       
    
        // Get tenant
        const tenant = await tenantService.getTenantBySlug(tenantSlug);
    
        if (!tenant || tenant.status !== 'active') {
          return null;
        }

     
        // Get user
        const user = await userService.getUserByEmail(
          tenant._id,
          credentials.email as string
        );



        if (!user || user.status !== 'active') {
          return null;
        }
        // Verify password
        const isValid = await userService.verifyPassword(
          user,
          credentials.password as string
        );
       
        if (!isValid) {
          return null;
        }
        // Update last login
        await userService.updateLastLogin(user._id);
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          tenantId: tenant._id.toString(),
          tenantSlug: tenant.slug,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.tenantId = user?.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};
