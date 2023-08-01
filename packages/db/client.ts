import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const CONNECTION_URL = process.env.DB_CONNECTION_URL;
if (!CONNECTION_URL) throw new Error('DB_CONNECTION_URL is not set');
const AUTH_TOKEN = process.env.DB_AUTH_TOKEN;
if(!AUTH_TOKEN) throw new Error('DB_AUTH_TOKEN is not set');

const client = createClient({ url: CONNECTION_URL, authToken: AUTH_TOKEN });
 
const tursoDb = drizzle(client);

export default tursoDb;