import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User } from '@/types/music';
import { notificationService } from './notification-service';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid email/password combination
      // In a real app, this would make an API call to your backend
      const mockUser: User = {
        id: Date.now().toString(),
        username: email.split('@')[0], // Use email prefix as username
        email,
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        favoriteGenres: ['Pop', 'Rock', 'Electronic'],
        createdAt: new Date().toISOString(),
      };

      // Persist user data
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('isAuthenticated', 'true');
      }

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Initialize notifications and schedule welcome notifications (mobile only)
      if (Platform.OS !== 'web') {
        await notificationService.initialize();
        await notificationService.scheduleWelcomeNotifications(mockUser.username);
      }
      
      // Schedule multiple new music notifications as demo (mobile only)
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('Taylor Swift', 'Lavender Haze');
        }, 25000); // After 25 seconds
        
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('Harry Styles', 'As It Was');
        }, 35000); // After 35 seconds
        
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('Olivia Rodrigo', 'Vampire');
        }, 50000); // After 50 seconds
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Username validation
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        favoriteGenres: [],
        createdAt: new Date().toISOString(),
      };

      // Persist user data
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('isAuthenticated', 'true');
      }

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Initialize notifications and schedule welcome notifications (mobile only)
      if (Platform.OS !== 'web') {
        await notificationService.initialize();
        await notificationService.scheduleWelcomeNotifications(mockUser.username);
      }
      
      // Schedule multiple new music notifications as demo (mobile only)
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('Ed Sheeran', 'Shivers');
        }, 25000); // After 25 seconds
        
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('Dua Lipa', 'Levitating');
        }, 35000); // After 35 seconds
        
        setTimeout(() => {
          notificationService.scheduleNewMusicNotification('The Weeknd', 'Blinding Lights');
        }, 50000); // After 50 seconds
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('Auth store: Starting logout...');
      
      // Clear music store data first
      try {
        const { useMusicStore } = await import('./music-store');
        await useMusicStore.getState().clearAllData();
        console.log('Auth store: Music data cleared');
      } catch (error) {
        console.warn('Auth store: Failed to clear music data:', error);
      }
      
      // Cancel all notifications on logout (mobile only)
      if (Platform.OS !== 'web') {
        try {
          await notificationService.cancelAllNotifications();
          console.log('Auth store: Notifications cancelled');
        } catch (error) {
          console.warn('Auth store: Failed to cancel notifications:', error);
        }
      }
      
      // Clear storage
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        console.log('Auth store: localStorage cleared');
      } else {
        await Promise.all([
          AsyncStorage.removeItem('user'),
          AsyncStorage.removeItem('isAuthenticated')
        ]);
        console.log('Auth store: AsyncStorage cleared');
      }
      
      // Update state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('Auth store: Logout completed successfully');
    } catch (error) {
      console.error('Auth store: Logout failed:', error);
      // Even if there's an error, we should still clear the state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      
      // Update storage
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      set({
        user: updatedUser
      });
    }
  },

  // Initialize auth state from storage
  initializeAuth: async () => {
    try {
      console.log('Auth store: Starting initialization...');
      
      // On web, use localStorage synchronously to avoid async issues
      if (Platform.OS === 'web') {
        console.log('Auth store: Web platform - immediate sync initialization');
        
        // Immediate synchronous initialization for web
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const storedUser = window.localStorage.getItem('user');
            const isAuthenticated = window.localStorage.getItem('isAuthenticated');
            
            if (storedUser && isAuthenticated === 'true') {
              const user = JSON.parse(storedUser);
              console.log('Auth store: User found in localStorage');
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              console.log('Auth store: No user found in localStorage');
              set({ isLoading: false });
            }
          } else {
            console.log('Auth store: localStorage not available');
            set({ isLoading: false });
          }
        } catch (error) {
          console.warn('Auth store: localStorage error, using defaults:', error);
          set({ isLoading: false });
        }
        
        // Return immediately for web - no async operations
        return Promise.resolve();
      }
      
      // Mobile: use AsyncStorage with very short timeout
      console.log('Auth store: Mobile platform - AsyncStorage initialization');
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('AsyncStorage timeout')), 500)
      );
      
      let storedUser: string | null = null;
      let isAuthenticated: string | null = null;
      
      try {
        [storedUser, isAuthenticated] = await Promise.race([
          Promise.all([
            AsyncStorage.getItem('user'),
            AsyncStorage.getItem('isAuthenticated')
          ]),
          timeoutPromise
        ]);
      } catch (storageError) {
        console.warn('Auth store: AsyncStorage failed, using defaults:', storageError);
        set({ isLoading: false });
        return;
      }
      
      if (storedUser && isAuthenticated === 'true') {
        try {
          const user = JSON.parse(storedUser);
          console.log('Auth store: User found, setting authenticated state');
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (parseError) {
          console.warn('Auth store: Failed to parse stored user:', parseError);
          set({ isLoading: false });
        }
      } else {
        console.log('Auth store: No user found, setting unauthenticated state');
        set({ isLoading: false });
      }
      
    } catch (error) {
      console.error('Auth store: Critical initialization error:', error);
      // Always set loading to false to prevent black screen
      set({ 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
    }
  },
}));