import Login from "@/components/login";
import { SecondaryButton } from "@/components/reusable";
import ScoreKeeperPlayer from "@/components/scorekeeper-player";
import { SpotifyPlayer, SpotifySession } from "@/utils/spotify_player";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Score } from "../../drizzle/schema";

//@ts-ignore
const fetcher = (args) => {
    const  [ url, request ] = [...args];
    return fetch(url, request).then(res => res.json());
}

function SelectPlaylist() {
    const { data, isLoading, error} = useSWR(['/api/scorekeeper', null], fetcher);
    const renderPlaylists = () => {
        if (error) return (<div>Error loading playlists</div>);
        else if (data && !isLoading) {
            const items = data?.map((pl: any) => {
                return (
                    <option key={pl.id} value={pl.id}>  
                        {pl.name}
                    </option>
                )
            });
            return items;
        } else {
            return <div>Loading...</div>
        }
    };
    return (
        <div className="m-auto text-center">
            <h1>Select a playlist</h1>
            <select className="bg-background text-text">
                {renderPlaylists()}
            </select>
        </div>
    )
}

function DeviceSelector(props: {spotifyClient: SpotifyPlayer}) {
    const { data, isLoading, error } = useSWR(['/api/player', null], fetcher);
    const [ currentDevice, setCurrentDevice] = useState<string>('');
    const spotifyClient = props.spotifyClient;
    const onDeviceChange = (event: any) => {
        spotifyClient.transferDevice(event?.target?.value)
        setCurrentDevice(event?.target?.value);
    }
    if (error) return (<div>Error loading devices</div>);
    if (!isLoading){
        const items = data.devices?.map((device: any) => {
            return (
                <option key={device.id} value={device.id}>
                    {device.name}
                </option>
            )
        });
        return (
            <div className="m-auto text-center">
                <h3> Select Device to Transfer Playback onto</h3>
                <select className="bg-background text-text" onChange={onDeviceChange}>
                {items}
                </select>
            </div>)
    } else {
        return <div>Loading...</div>
    }
}

function SessionScoreBoard(props: { session: number, passCode: string}) {
    const [data, setData] = useState([] as Score[]);
    const [ws, setWS] = useState<WebSocket>();
    const [score, setScore] = useState<boolean>();
    useEffect(() => {
        const newWS = new WebSocket("ws://localhost:3001/ws/test")
        newWS.onerror = err => console.error(err);
        newWS.onopen = () => { 
            setWS(newWS);
            setScore(true);
        }
        newWS.onmessage = msg => setData(JSON.parse(msg.data));
        return () => {
            newWS.close();
        }
    }, [])
    useEffect(() => {
        if (score) {
            ws?.send(JSON.stringify({ action: 'keeper', payload: { accessToken: "shounak", sessionId: props.session, passCode: props.passCode } }));
            setScore(false);
        }
    }, [score]);
    return (
        <div> {data.map((d) => <div><span>{d.player}</span><span>{d.score}</span></div>)} </div>
    )
}

function CreateSession(props: {scoreKeeperUserName?: string}) {
    const [passCode, setPassCode] = useState<string>('');
    const [session, setSession] = useState<number>(-1);
    const postSession = (scoreKeeperUserName?: string) => {
        if (scoreKeeperUserName !==undefined) {
            fetch('/api/sessions', {
                method: 'POST',
                body: JSON.stringify({ scoreKeeperUserName: scoreKeeperUserName })
            })
            .then(res => 
                res.json().then(data => {
                setSession(data.id); 
                setPassCode(data.pass_code);
            }))
            .catch(err => console.log(err));
        }
    }
    if (session === -1) return (<SecondaryButton onClick={(_event) => postSession(props.scoreKeeperUserName)}><strong>Create a session</strong></SecondaryButton>)
    else return (
        <>
            <div className="flex flex-row w-full justify-evenly align-middle items-center">
                <div className='leading-9 text-center'>
                    <div>
                        GAME ROOM
                    </div> 
                    <span className='text-3xl'>
                        #{session}
                    </span>
                </div>
                <div>
                    <div>
                        Passcode
                    </div>
                    <span className='text-3xl'>
                    {passCode}
                    </span>
                </div>
            </div>
            <div>
                {/* ADD PEOPLE JOINING THE GAME */}
                <SessionScoreBoard session={session} passCode={passCode}/>
            </div>
        </>
    )
}

export default function ScoreKeeper() {
    const { data: session } = useSession();
    const [email, setEmail] = useState<string | undefined>();
    const spotifyClient = new SpotifyPlayer((session as SpotifySession)?.accesstoken);
    
    useEffect(() =>{
        if (session && session.user && session.user.email)
            setEmail(session.user.email);
    }, [session]);

    if (!session) return (
    <div className='bg-background text-text h-[100vh]'>
        <div className='flex flex-col h-[80vh] m-auto'>
            <Login />
        </div>
    </div>);
    return (
      <div className='bg-background text-text h-[100vh]'>
        <div className='flex flex-col h-[80vh] m-auto'>
            <Login />
            <div className="flex flex-row justify-around">
                <DeviceSelector spotifyClient={spotifyClient}/>
                <SelectPlaylist />
            </div>
            <CreateSession scoreKeeperUserName={email}/>
            <div className='absolute bottom-0 left-0 my-5 w-full'>
                <ScoreKeeperPlayer spotifyClient={spotifyClient}/>
            </div>
        </div>
      </div>
    );
  }
