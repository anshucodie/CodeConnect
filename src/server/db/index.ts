import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

config({ path: ".env" }); // or .env.local

// For query purposes
const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client: queryClient, schema });

// For migrations
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
export const migrationDb = drizzle({ client: migrationClient, schema });
