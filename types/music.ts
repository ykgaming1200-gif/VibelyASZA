export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  releaseYear: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  favoriteGenres: string[];
  createdAt: string;
}

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
}