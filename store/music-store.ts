import { create } from 'zustand';
import { Song, PlaybackState } from '@/types/music';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface MusicStore extends PlaybackState {
  // Audio instance
  sound: Audio.Sound | null;
  
  // Playback actions
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  pauseSong: () => Promise<void>;
  resumeSong: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  nextSong: () => Promise<void>;
  previousSong: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  // Queue management
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => Promise<void>;
  
  // User music management
  userSongs: Song[];
  addUserSong: (song: Song) => void;
  removeUserSong: (songId: string) => void;
  getUserSongs: () => Song[];
  
  // Playback history
  playbackHistory: Song[];
  addToHistory: (song: Song) => void;
  
  // Internal methods
  updatePlaybackStatus: (status: any) => void;
  initializeAudio: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  // Initial state
  sound: null,
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  queue: [],
  currentIndex: 0,
  isShuffled: false,
  repeatMode: 'off',
  playbackHistory: [],
  userSongs: [],

  // Initialize audio system
  initializeAudio: async () => {
    try {
      console.log('Music store: Starting audio initialization...');
      
      if (Platform.OS !== 'web') {
        console.log('Music store: Setting audio mode for mobile...');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('Music store: Audio mode set successfully');
      } else {
        console.log('Music store: Web platform detected, skipping audio mode setup');
      }
      
      console.log('Music store: Audio initialization completed successfully');
    } catch (error) {
      console.error('Music store: Error during audio initialization:', error);
      // Don't throw the error, just log it and continue
    }
  },

  // Actions
  playSong: async (song: Song, queue?: Song[]) => {
    const { sound: currentSound, addToHistory } = get();
    
    try {
      // Stop current sound if playing
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      const newQueue = queue || [song];
      const index = newQueue.findIndex(s => s.id === song.id);
      
      // Use the actual song audio URL, fallback to demo URL for mock songs
      const audioUrl = song.audioUrl || (
        Platform.OS === 'web' 
          ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
          : 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      );
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { 
          shouldPlay: true,
          volume: get().volume,
          isLooping: get().repeatMode === 'one'
        },
        get().updatePlaybackStatus
      );

      set({
        sound: newSound,
        currentSong: song,
        isPlaying: true,
        queue: newQueue,
        currentIndex: index,
        currentTime: 0,
        duration: song.duration,
      });

      addToHistory(song);
    } catch (error) {
      console.log('Error playing song:', error);
      set({ isPlaying: false });
    }
  },

  pauseSong: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.pauseAsync();
        set({ isPlaying: false });
      } catch (error) {
        console.log('Error pausing song:', error);
      }
    }
  },
  
  resumeSong: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.playAsync();
        set({ isPlaying: true });
      } catch (error) {
        console.log('Error resuming song:', error);
      }
    }
  },

  togglePlayPause: async () => {
    const { isPlaying, pauseSong, resumeSong } = get();
    if (isPlaying) {
      await pauseSong();
    } else {
      await resumeSong();
    }
  },

  nextSong: async () => {
    const { queue, currentIndex, repeatMode, playSong } = get();
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    const nextSong = queue[nextIndex];
    await playSong(nextSong, queue);
  },

  previousSong: async () => {
    const { queue, currentIndex, playSong } = get();
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevSong = queue[prevIndex];
    await playSong(prevSong, queue);
  },

  seekTo: async (time: number) => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.setPositionAsync(time * 1000); // Convert to milliseconds
        set({ currentTime: time });
      } catch (error) {
        console.log('Error seeking:', error);
      }
    }
  },
  
  setVolume: async (volume: number) => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.setVolumeAsync(volume);
        set({ volume });
      } catch (error) {
        console.log('Error setting volume:', error);
      }
    } else {
      set({ volume });
    }
  },
  
  toggleShuffle: () => set(state => ({ isShuffled: !state.isShuffled })),
  
  toggleRepeat: () => set(state => ({
    repeatMode: state.repeatMode === 'off' ? 'all' : 
                state.repeatMode === 'all' ? 'one' : 'off'
  })),

  addToQueue: (song: Song) => set(state => ({
    queue: [...state.queue, song]
  })),
  
  // User music management
  addUserSong: (song: Song) => set(state => ({
    userSongs: [...state.userSongs, song]
  })),
  
  removeUserSong: (songId: string) => set(state => ({
    userSongs: state.userSongs.filter(song => song.id !== songId)
  })),
  
  getUserSongs: () => get().userSongs,

  removeFromQueue: (index: number) => set(state => ({
    queue: state.queue.filter((_, i) => i !== index)
  })),

  clearQueue: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.log('Error unloading sound:', error);
      }
    }
    set({
      sound: null,
      queue: [],
      currentSong: null,
      isPlaying: false,
      currentIndex: 0,
    });
  },

  addToHistory: (song: Song) => {
    const { playbackHistory } = get();
    const newHistory = [song, ...playbackHistory.filter(s => s.id !== song.id)].slice(0, 50);
    set({ playbackHistory: newHistory });
  },

  updatePlaybackStatus: (status: any) => {
    if (status.isLoaded) {
      set({
        currentTime: Math.floor((status.positionMillis || 0) / 1000),
        duration: Math.floor((status.durationMillis || 0) / 1000),
        isPlaying: status.isPlaying || false,
      });

      // Auto-play next song when current song finishes
      if (status.didJustFinish && !status.isLooping) {
        const { nextSong, repeatMode } = get();
        if (repeatMode !== 'one') {
          nextSong();
        }
      }
    }
  },

  // Clear all music data (used during logout)
  clearAllData: async () => {
    const { sound } = get();
    
    try {
      // Stop and unload current sound
      if (sound) {
        await sound.unloadAsync();
      }
    } catch (error) {
      console.log('Error unloading sound during logout:', error);
    }
    
    // Reset all state to initial values
    set({
      sound: null,
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      queue: [],
      currentIndex: 0,
      isShuffled: false,
      repeatMode: 'off',
      playbackHistory: [],
      userSongs: [],
    });
  },
}));