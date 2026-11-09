import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

const authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  studioSpaceMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.studioSpaceMongoClient ?? new MongoClient(mongoUri);
globalForMongo.studioSpaceMongoClient = mongoClient;

const database = mongoClient.db(process.env.DB_NAME || "studiospace");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const rawBaseUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const resolvedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, "")
  : process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : undefined;

export const auth = betterAuth({
  appName: "StudioSpace",
  baseURL: resolvedBaseUrl,
  secret: authSecret,
  trustedOrigins: [
    ...(resolvedBaseUrl ? [resolvedBaseUrl] : []),
    ...(process.env.NEXT_PUBLIC_CLIENT_URL
      ? [process.env.NEXT_PUBLIC_CLIENT_URL.replace(/\/+$/, "")]
      : []),
    "https://studiospace-client.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  database: mongodbAdapter(database, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  ...(googleClientId && googleClientSecret
    ? {
      socialProviders: {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      },
    }
    : {}),
});
