import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SpotifyPlayer, SpotifySession } from "@/utils/spotify_player";


export type GameSession = {
   passCode: string;
   scoreKeeperUserName: string;
}

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
            const me = await spotifyClient.getUser();
            const spotifyUser = await me.json();
            const playlistsResp = await spotifyClient.getUserPlaylists(spotifyUser.id);
            const playlists = (await playlistsResp.json())?.items;
            return res.status(200).json(playlists);
         } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
         }
      }
      default:
         return res.status(405).json({ error: 'Method not supported' });
      }
}