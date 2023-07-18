import { useSession } from "next-auth/react";
import Login from "@/components/login";
import ScoreKeeperPlayer from "@/components/scorekeeper-player";
import { SpotifySession } from "@/utils/spotify_player";
import { useState, useEffect } from "react";
import useSWR from "swr";

//@ts-ignore
const fetcher = (params) => {
    const [url, token] = params;
    if (!token) return fetch(url).then(res => res.json());
    else fetch(url, 
        { 
            headers: {'Authorization': `Bearer ${token}`}
        }
    ).then(res => res.json());
  
}

function SelectPlaylist(props: {token: string}) {
    const me = useSWR(['https://api.spotify.com/v1/me', props.token], fetcher).data;
    console.log('me', me);
    const playlists = useSWR([`https://api.spotify.com/users/${me?.id}/`, props.token], fetcher).data;
    console.log(playlists);
    const renderPlaylists = () => {
        if (playlists) {
            return playlists.map((pl: any) => {
                return (
                    <option value={pl.id}>
                        {pl.name}
                    </option>
                )
            });
        }
    };
    return (
        <div>
            <h1>Select a playlist</h1>
            {renderPlaylists()}
        </div>
    )
}

export default function ScoreKeeper() {
    const { data: session } = useSession();
    const [token, setToken] = useState<string>('');
    // const playlists = useSWR(`https://api.spotify.com/users/${me?.id}/`, fetcher).data?.items;
    
    // const renderPlaylists = () => {
    //     if (playlists) {
    //         return (
    //             <div>
    //             {playlists.items.map((playlist: any) => (
    //                 <div>
    //                 {playlist.name} <span>{playlist.uri}</span>
    //             </div>
    //             ))}
    //         </div>
    //         )
    //     }
    // }
    useEffect(() => {
        if (session) {
            setToken((session as SpotifySession).accesstoken);
        }
    }, [token]);
  
    
    return (
      <div className='bg-gray-900 text-white h-[100vh]'>
        <div className='flex flex-col h-[80vh] m-auto'>
            <Login />
            <SelectPlaylist token={token} />
            <ScoreKeeperPlayer token={token} />
            
        </div>
      </div>
    );
  }
