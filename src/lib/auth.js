import "server-only";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient, ObjectId } from "mongodb";

/* Re-use one MongoClient across hot reloads / serverless invocations */
const globalForMongo = globalThis;
const client =
  globalForMongo._rentrigMongo ?? new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") globalForMongo._rentrigMongo = client;

export const db = client.db(process.env.DB_NAME || "rentrigDB");

const SELF_SERVE_ROLES = ["customer", "owner"];

export const auth = betterAuth({
  appName: "RentRig",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),

  user: {
    modelName: "users",
    additionalFields: {
      // Customer by default (Google sign-ups always end up as customer)
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "", input: true },
      address: { type: "string", required: false, defaultValue: "", input: true },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
  },

  databaseHooks: {
    user: {
      create: {
        // never trust the client with privileged roles – only customer/owner can be self-selected
        before: async (user) => ({
          data: { ...user, role: SELF_SERVE_ROLES.includes(user.role) ? user.role : "customer" },
        }),
      },
      update: {
        // roles are only changed by an admin through the Express API
        before: async (data) => {
          // eslint-disable-next-line no-unused-vars
          const { role, ...rest } = data;
          return { data: rest };
        },
      },
    },
    session: {
      create: {
        // block suspended accounts from signing in
        before: async (session) => {
          try {
            const id = String(session.userId);
            const u = ObjectId.isValid(id) ? await db.collection("users").findOne({ _id: new ObjectId(id) }) : null;
            if (u?.banned) return false;
          } catch {}
          return { data: session };
        },
      },
    },
  },

  plugins: [
    // Issues short-lived JWT access tokens (GET /api/auth/token) and exposes the public JWKS
    // (GET /api/auth/jwks) that the Express API uses to verify them.
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({ id: user.id, email: user.email, name: user.name, role: user.role }),
      },
    }),
    nextCookies(), // must be last
  ],
});
