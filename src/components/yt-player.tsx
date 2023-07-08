import Image from 'next/image';
import { useState } from 'react';
import YouTube from 'react-youtube';
export default function Player(props: { videoId: string, title: string }) {
    const [player, setPlayer] = useState<any>(null);
    const [answer, setAnswer] = useState<string>('');
    const [canShow, setCanShow] = useState<boolean>(false);
    const [showPlayingGif, setShowPlayingGif] = useState<boolean>(false);

    const onReady = (event: any) => {
        setCanShow(false);
        setPlayer(event.target);
        setAnswer('');
        setTimeout(() => {
            event.target.pauseVideo();
            setAnswer(props.title);
        }, 15000)
    };

    const onPlay = (event: any) => {
        setCanShow(false); 
        setAnswer('');
        setTimeout(() => {
            event.target.pauseVideo();
            setAnswer(props.title);
        }, 15000)
    };

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
        },
    };

    const showAnswer = () => {
        setCanShow(true);
    };

    const renderAnswer = () => {
        if (canShow) return <h1 className='text-3xl pb-3'>{answer}</h1>
    };

    const onStateChange = (event: any) => {
        console.log(player)
        if (player.getPlayerState() === 1) {
            setShowPlayingGif(true);
        } else {
            setShowPlayingGif(false);
        }
    }

    const renderPlayingGif = () => {
        if (showPlayingGif) return <Image src='/audio-playing.gif' alt={'Audio is playing'} width='500' height='500'/>
    }

    return (
        <div className='m-auto'>
            <YouTube videoId={props.videoId} opts={opts} onReady={onReady} onPlay={onPlay} onStateChange={onStateChange} />
            { renderAnswer() }
            <div className='flex flex-row justify-around'>
                <button className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
                    onClick={() => player.playVideo()}>Play Song</button>
                { renderPlayingGif() }
                <button className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
                    onClick={() => showAnswer()}>Show Answer</button>
            </div>
        </div>
    );
}