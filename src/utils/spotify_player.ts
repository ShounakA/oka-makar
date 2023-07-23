import { Session } from 'next-auth';

export interface Track {
   name: string;
   album: {
      name: string;
      images: { url: string }[];
   };
   artists: Artist[];
   duration_ms: number;
}

export interface Artist {
   name: string;
}

export interface PlaybackState {
   context: { uri: string; metadata: any };
   disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
   };
   paused: boolean;
   position: number;
   repeat_mode: number;
   shuffle: boolean;
   track_window: {
      current_track: Track;
      previous_tracks: Track[];
      next_tracks: Track[];
   };
}

export interface SpotifySession extends Session {
   accesstoken: string;
   error: string;
}

export interface Player {
   previousTrack: () => void;
   togglePlay: () => void;
   nextTrack: () => void;
   addListener: (
      event: string,
      cb: (arg0: any) => void
   ) => void | Promise<void>;
   connect: () => void;
   getCurrentState: () => Promise<any>;
}

export class SpotifyPlayer {

   constructor(private token: string) {}
   private headers = {'Authorization': `Bearer ${this.token}`}
   public play = async () => fetch(`https://api.spotify.com/v1/me/player/play`, { method: 'PUT', headers: this.headers });
   public transferDevice = async (deviceID: string) => fetch(`https://api.spotify.com/v1/me/player`, { method: 'PUT', headers: this.headers, body: JSON.stringify({ device_ids: [deviceID] }) });
   public pause = async () => fetch('https://api.spotify.com/v1/me/player/pause', { method: 'PUT', headers: this.headers });

   public getUser = async () => 
      fetch('https://api.spotify.com/v1/me', { 
            headers: this.headers
      });
   public getUserPlaylists = async (userId: string, limit: number = 50) => await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}`, { 
      headers: {'Authorization': `Bearer ${this.token}`}
   });
   public getPlayListItems = async (playlistID: string) => {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, { headers: this.headers });
      const data = await response.json();
      const items = data.items;
      return items.map((item: any) => item.track);
   };

   public getPlaybackState = async () => fetch('https://api.spotify.com/v1/me/player', { method: 'GET', headers: this.headers });

   public getDevices = async () => fetch('https://api.spotify.com/v1/me/player/devices', { method: 'GET', headers: this.headers });
}
