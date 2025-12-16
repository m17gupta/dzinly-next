// src/lib/auth/index.ts
// A small wrapper that exposes a callable `auth()` which returns the server session.
// This avoids importing the NextAuth handler object (which is not callable).

import NextAuth from "next-auth";
import { authConfig } from "./auth-config";

export const { auth } = NextAuth(authConfig);

export default auth;
