import { SpotifySession } from "@/utils/spotify_player";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { users } from '@/../drizzle/schema';
import { db } from "@/db/db";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const host = process.env.DEV_HOST ?? 'https://nak-player.vercel.app';
if (!CLIENT_ID || !CLIENT_SECRET || !host) {
  throw new Error("Missing environment variables. Please set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and DEV_HOS");
}

const SPOTIFY_AUTHORIZATION_URL =
   'https://accounts.spotify.com/authorize?' +
   new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-email user-read-private',
      redirect_uri: `${host}/api/auth/callback/spotify`,
      grant_type: 'authorization_code',
   } as Record<string, string>);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: { refreshToken: any }) {
   try {
      const url =
         'https://accounts.spotify.com/api/token' +
         new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
         });

      const response = await fetch(url, {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
               'Basic ' +
               Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
         },
         method: 'POST',
      });

      const refreshedTokens = await response.json();

      if (!response.ok) {
         throw refreshedTokens;
      }

      return {
         ...token,
         accessToken: refreshedTokens.access_token,
         accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
         refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };
   } catch (error) {
      return {
         ...token,
         error: 'RefreshAccessTokenError',
      };
   }
}

export const authOptions = {
   // Configure one or more authentication providers
   providers: [
      SpotifyProvider({
         clientId: CLIENT_ID,
         clientSecret: CLIENT_SECRET,
         authorization: SPOTIFY_AUTHORIZATION_URL,
      } as { clientId: string; clientSecret: string }),
   ],
   secret: process.env.SECRET,
   callbacks: {
      async jwt({
         token,
         user,
         account,
      }: {
         token: any;
         user: any;
         account: any;
      }) {
         // Initial sign in
         if (account && user) {
            try {
               await db.insert(users).values({ username: user.email, name: user.name }).run();
            } catch(error) {
               console.log('error inserting user, probably already exists');
            }
            return {
               accessToken: account.access_token,
               accessTokenExpires: Date.now() + account.expires_at * 1000,
               refreshToken: account.refresh_token,
               user,
            };
         }

         // Return previous token if the access token has not expired yet
         if (Date.now() < token.accessTokenExpires) {
            return token;
         }
         // Access token has expired, try to update it
         return refreshAccessToken(token);
      },
      async session({
         session,
         token,
      }: {
         session: SpotifySession;
         token: any;
      }) {
         session.user = token.user;
         session.accesstoken = token.accessToken;
         session.error = token.error;
         return session;
      },
   },
} as any;

export default NextAuth(authOptions);