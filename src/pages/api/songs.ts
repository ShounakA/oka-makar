import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export type Song = {
    vidId: string,
    title: string,
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any[] | undefined>
  ) {

    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YT_API_KEY
    })
    const playlist = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: 'PLW3UjlMaLcI2kYmuENcaAOlGkRFoqyof4',
        maxResults: 50       
    });

    const embed = playlist.data.items;
    if (embed) console.error('No embed found')

    const vids = embed?.map((item) => ({ vidId: item.snippet?.resourceId?.videoId, title: item.snippet?.title }));
    
    res.status(200).json(vids)
}