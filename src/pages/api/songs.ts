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

    const maxResults = parseInt(process.env.YT_MAX_RESULTS ?? '50');
    const playlistId = process.env.YT_PLAYLIST_ID || 'PLW3UjlMaLcI2kYmuENcaAOlGkRFoqyof4';
    const apiKey = process.env.YT_API_KEY;
    const youtube = google.youtube({
        version: 'v3',
        auth: apiKey
    });
    const playlist = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: playlistId,
        maxResults: maxResults,      
    });
    var pageToken = playlist.data.nextPageToken;
    const embed = playlist.data.items;
    if (embed) console.error('No songs found')
    const vids = embed?.map((item) => ({ vidId: item.snippet?.resourceId?.videoId, title: item.snippet?.title }));
    while (pageToken) {
        const nextSongs = await youtube.playlistItems.list({
            part: ['snippet'],
            playlistId: playlistId,
            maxResults: maxResults,
            pageToken: pageToken     
        });
        const moreVids = nextSongs.data.items?.map((item) => ({ vidId: item.snippet?.resourceId?.videoId, title: item.snippet?.title }));
        if (vids && moreVids) {
            if (vids.length + moreVids.length > maxResults)
            {
                if (moreVids)
                    vids?.push(...moreVids);
            } else {
    
                const left = maxResults - vids.length;
                if (moreVids)
                    vids?.push(...moreVids?.slice(0, left));
                break;
            }
        }
        pageToken = nextSongs.data.nextPageToken;
    }
    res.status(200).json(vids)
}