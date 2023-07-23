import { db } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Score, scores } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { SpotifySession } from "@/utils/spotify_player";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";


export type GameSession = {
   passCode: string;
   scoreKeeperUserName: string;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<any | { error: string }>
   ) {
   const session = await getServerSession(req, res, authOptions) as SpotifySession
   if (!session) {
      return res.status(403).send({
         error: "You must be signed in to view the protected content on this page.",
      });
   }
   const { sessionId } = req.query;
   switch (req.method) {
      case 'POST': {
         if (typeof sessionId !== 'string') {
            return res.status(400).json({ error: 'sessionId is required' });
         }
      }
      case 'GET': {
         if (typeof sessionId !== 'string') {
            res.status(400).json({ error: 'sessionId is required' });
         } else {
            const id = parseInt(sessionId);
            const sessionScore = await db.select({ score: scores.score, name: scores.player }).from(scores).where(eq(scores.session, id)).run();         
            return res.status(200).json(sessionScore);
         }
      }
      default:
         return res.status(405).json({ error: 'Method not supported' });
   }
}