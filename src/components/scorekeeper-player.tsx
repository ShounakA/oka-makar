import { SpotifyPlayer } from '@/utils/spotify_player';
import React, { useEffect, useState } from 'react';

function ScoreKeeperPlayer(props: { token: string }) {
    const [title, setTitle] = useState<string>('Loading...');
    const [playing, setPlaying] = useState<boolean>(false);

    const DEVICE_ID = '10b8abd80d87f17ba0172f09bf36b2775901b582';
    const getPlayerState = () => {
        fetch('https://api.spotify.com/v1/me/player', { method: 'GET', headers: { 'Authorization': `Bearer ${props.token}`}})
            .then(res => res.json()
                        .then(data => {
                            setTitle(data?.item?.name);
                        }));
    }

    const togglePlayPause = () => {
        if (playing) {
            SpotifyPlayer.pause(props.token);
            setPlaying(false);
        } else {
            SpotifyPlayer.play(props.token, DEVICE_ID);
            setPlaying(true);
        }
        getPlayerState();
    }

    const playForSeconds = (seconds: number) => {
        if (!playing) {
            SpotifyPlayer.play(props.token, DEVICE_ID);
            setPlaying(true);
        }
        setTimeout(() => {
            SpotifyPlayer.pause(props.token);
            setPlaying(false);
        }, seconds * 1000)
    }

    useEffect(() => {
        getPlayerState();
    }, [title]);

    return (
        <div className='flex flex-row'>
            <button 
                onClick={() => togglePlayPause()} 
                className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
            > 
                { playing ? 'Pause' : 'Play' } 
            </button>
            <button 
                onClick={() => playForSeconds(15)}
                className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
            >
                Play for 15 Seconds
            </button>
            <h1 className='m-auto text-5xl'>{title}</h1>
        </div>
    )
}

export default ScoreKeeperPlayer;