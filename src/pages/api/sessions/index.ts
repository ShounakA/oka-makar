import { db } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, sessions } from "../../../../drizzle/schema";
import { SpotifySession } from "@/utils/spotify_player";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";


export type GameSession = {
   passCode: string;
   scoreKeeperUserName: string;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<Session | { error: string }>
 ) {
   const session = await getServerSession(req, res, authOptions) as SpotifySession
   if (!session) {
      return res.status(403).send({
         error: "You must be signed in to view the protected content on this page.",
      });
   }
   switch (req.method) {
      case 'POST': {
         const { scoreKeeperUserName } = JSON.parse(req.body);
         if (scoreKeeperUserName === undefined) {
            return res.status(400).json({ error: 'Invalid body' });
         }
         var randomstring = Math.random().toString(36).slice(-6);
         const session = await db.insert(sessions)
                                 .values({ 
                                            passCode: randomstring, 
                                            scoreKeeperUserName: scoreKeeperUserName, 
                                            currentlyPlaying: ''
                                         }).returning().run();
         return res.status(200).json(session.rows[0] as unknown as Session);
      }
      default:
         return res.status(405).json({ error: 'Method not supported' });
      }
}