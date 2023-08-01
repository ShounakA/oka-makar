"use client";
import Player from '@/components/yt-player';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Song } from './api/songs';
import { signIn, useSession } from 'next-auth/react';
import Login from '@/components/login';
import { SpotifySession } from '@/utils/spotify_player';
import ScoreKeeperPlayer from '@/components/scorekeeper-player';

const TIMER_DURATION = 15; //in seconds

//@ts-ignore
const fetcher = (params) => {
  const [url, token, methodType, ] = params;
  if (!token) return fetch(url).then(res => res.json());
  else fetch(url, { headers: {'Authorization': `Bearer ${token}`}}).then(res => res.json());

}

//@ts-ignore
Array.prototype.shuffle = function() {
  var i = this.length;
  if (i == 0) return this;
  while (--i) {
      var j = Math.floor(Math.random() * (i + 1 ));
      var a = this[i];
      var b = this[j];
      this[i] = b;
      this[j] = a;
  }
  return this;
};

export default function Home() {
  var songs = useSWR('/api/songs', fetcher).data as Song[];
  var [currentSong, setSong] = useState<Song>({ vidId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up' } as Song);
  var [currentIndex, setIndex] = useState<number>(0);
  var [totalSongs, setTotalSongs] = useState<number>(0);
  var [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const finishGame = () => {
    setGameStarted(false);
  }

  const pickSong = () => {
    setSong(songs[currentIndex]);
    setIndex(currentIndex + 1);
    console.log(currentSong.vidId);
  }

  const shuffleSongs = () => {
    //@ts-ignore
    songs.shuffle();
    setGameStarted(true);
    setTotalSongs(songs.length + 1);
  }

  const renderStartButton = () => {
    if (!gameStarted) {
      return (
        <button 
          className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
          onClick={() => shuffleSongs()} 
          hidden={gameStarted}>
            Shuffle
        </button>
      )
    }
  }

  const renderGameButtons = () => {
    if (gameStarted) {
      return (
      <>
        <button 
          className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' 
          onClick={() => pickSong()}
        >
             Next Song
        </button>
        <h1 id='time'></h1>
        <div className='m-auto w-[50%] text-center'>
          <Player videoId={currentSong.vidId} title={currentSong.title}/>
        </div>
        <p className='m-auto text-5xl'>
          <em id='songsLeft'>{totalSongs - currentIndex}</em> Left
        </p>
        <button className='m-auto w-36 h-12 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-black focus:outline-none focus:ring active:text-opacity-75' onClick={() => finishGame()}>Finish Game</button>
      </>
      )
    }
  }

  const { data: session } = useSession();
  const [token, setToken] = useState<string>('');
  const [devices, setDevices] = useState<any[]>([]); // [id, name, type
  const getDevices = useSWR(['https://api.spotify.com/v1/me/player/devices', token], fetcher).data;
  useEffect(() => {
    if (session) {
      setToken((session as SpotifySession).accesstoken);
      setDevices(getDevices);
    }
  })

  
  return (
    <div className='bg-gray-900 text-white h-[100vh]'>
     <div className='flex flex-col h-[80vh] m-auto'>
     <Login />
      <div className='m-auto text-center text-3xl'>
        <h2>Jingle Jumble</h2>
        <h3 className='text-2xl'>Identify the name of the song that is playing in <em id='timerNum'>{TIMER_DURATION}</em> secs.</h3>
        <h4 className='text-2xl'><em>BONUS: Identify its movie</em></h4>
        <h4 className='text-2xl'><em>HINT: There is a mix of Hindi, Marathi, and Telgu songs</em></h4>
      </div>
      { renderStartButton() }
      { renderGameButtons() }
    </div>
    </div>
  );
}
