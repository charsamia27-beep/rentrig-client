"use client";

import { createAuthClient } from "better-auth/react";

// Same-origin: Better Auth lives at /api/auth on this Next.js app
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;
