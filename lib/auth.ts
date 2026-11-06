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

const database = mongoClient.db(process.env.DB_NAME || undefined);
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "StudioSpace",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: authSecret,
  database: mongodbAdapter(database, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
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
