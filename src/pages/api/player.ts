import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SpotifyPlayer, SpotifySession } from "@/utils/spotify_player";

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<any[] | { error: string }>
 ) {
   const session = await getServerSession(req, res, authOptions) as SpotifySession
   if (!session) {
      return res.status(403).send({
         error: "You must be signed in to view the protected content on this page.",
      });
   }
   const spotifyClient = new SpotifyPlayer(session.accesstoken);
   switch (req.method) {
      case 'GET': {
         try {
            const resp = await spotifyClient.getDevices();
            const devices = await resp.json();
            return res.status(200).json(devices);
         } catch (error) {
            console.error('Failed to get all devices', error);
            return res.status(500).json({ error: 'Internal server error' });
         }
      }
      default:
         return res.status(405).json({ error: 'Method not supported' });
   }
}