import { useState } from 'react';
import YouTube from 'react-youtube';
export default function Player(props: { videoId: string, title: string }) {
    const [player, setPlayer] = useState<any>(null);
    const [answer, setAnswer] = useState<string>('');
    const [canShow, setCanShow] = useState<boolean>(false);

    const onReady = (event: any) => {
        setCanShow(false);
        setPlayer(event.target);
        setTimeout(() => {
            event.target.pauseVideo();
            setAnswer(props.title);
        }, 15000)
    };

    const onPlay = (event: any) => {
        setCanShow(false); 
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

    return (
        <div className='m-auto'>
            <YouTube videoId={props.videoId} opts={opts} onReady={onReady} onPlay={onPlay} />
            { renderAnswer() }
            <div className='flex flex-row justify-around'>
                <button className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
                    onClick={() => player.playVideo()}>Play Song</button>
                <button className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
                    onClick={() => showAnswer()}>Show Answer</button>
            </div>
        </div>
    );
}