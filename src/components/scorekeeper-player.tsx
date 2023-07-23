import { SpotifyPlayer } from '@/utils/spotify_player';
import React, { useEffect, useState } from 'react';
import { IconButton, PrimaryButton } from './reusable';
import { GoBroadcast, GoPlay, GoStopwatch } from 'react-icons/go';
import { AiOutlinePauseCircle } from "react-icons/ai";

function ScoreKeeperPlayer(props: { spotifyClient: SpotifyPlayer }) {
    const [title, setTitle] = useState<string>('Loading...');
    const [playing, setPlaying] = useState<boolean>(false);
    const [updatePlaybackState, setUpdatePlaybackState] = useState<boolean>(false); // this is only there to trigger a re-render on device change
    const spotifyClient = props.spotifyClient;

    // Gets the playback state from spotify and updates the state
    const getPlayerState = () => {
        spotifyClient?.getPlaybackState()
        .then(res => res.json()
        .then(data => {
            // Initial playing state
            if (title === 'Loading...') setPlaying(data?.is_playing);
            setTitle(data?.item?.name);
        }).catch(err => console.log(err)));
    }
    
    // Toggles devices playing state
    const togglePlayPause = () => {
        if (playing) {
            spotifyClient.pause();
            setPlaying(false);
        } else {
            spotifyClient.play();
            setPlaying(true);
        }
    }
    
    // Plays the active spotify device for seconds provided and then pauses
    const playForSeconds = (seconds: number) => {
        if (!playing) {
            spotifyClient.play();
            setPlaying(true);
        }
        setTimeout(() => {
            spotifyClient.pause();
            setPlaying(false);
        }, seconds * 1000)
    }

    // Sets a timer to update to trigger playback state update every 5 seconds
    const playBackUpdate = () => setTimeout(() => {
        setUpdatePlaybackState(!updatePlaybackState);
    }, 10000);

    // Update states when title playing or updateplaybackstate changes
    useEffect(() => {
        getPlayerState();
        playBackUpdate();
    }, [title, playing, updatePlaybackState]);

    const pause = <div className='flex leading-4'><AiOutlinePauseCircle /> <span className="pl-1">Pause</span></div>;
    const play = <div className='flex leading-4'><GoPlay /> <span className="pl-1">Play</span></div>;
    return (
        <div className='flex flex-row justify-evenly pt-2 '>
            <PrimaryButton onClick={(_event) => togglePlayPause()} >
                <strong>
                    { playing ? pause : play }
                </strong>
            </PrimaryButton>
            <IconButton onClick={(_event) => playForSeconds(15)} tooltip='Time Play' className='px-2'>
                <GoStopwatch />
            </IconButton>
            <IconButton onClick={(_event) => togglePlayPause()} tooltip='Broadcast' >
                <GoBroadcast />
            </IconButton>
            <div className='w-[50%]'>
                {/*//@ts-ignore*/}
                <marquee className='m-auto text-5xl min-w-46' behavior='alternate'>
                    <h1 className='text-5xl text-center leading-[5rem]'>{title}</h1>
                {/*//@ts-ignore*/}
                </marquee>
            </div>
        </div>
    )
}

export default ScoreKeeperPlayer;