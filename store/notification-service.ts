import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


// Configure notification behavior for local notifications only
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

interface NotificationData {
  type: 'welcome' | 'new_music' | 'recommendation' | 'playlist_update';
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private permissionGranted = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('Local notifications will be simulated on web');
      this.permissionGranted = true;
      return;
    }

    try {
      // Only request local notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Local notification permissions denied');
        return;
      }

      this.permissionGranted = true;
      console.log('Local notification permissions granted');
    } catch (error) {
      console.error('Error initializing local notifications:', error);
      // Still allow the app to work without notifications
      this.permissionGranted = false;
    }
  }

  async scheduleWelcomeNotifications(username: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Simulate notifications on web with console logs
        console.log(`🎵 Welcome to MusicStream, ${username}!`);
        setTimeout(() => console.log('🎧 Discover New Music - Check out our curated playlists!'), 5000);
        setTimeout(() => console.log('🔥 Your Daily Mix is Ready - Fresh tracks picked just for you!'), 15000);
        return;
      }

      if (!this.permissionGranted) {
        console.log('Notification permissions not granted, skipping notifications');
        return;
      }

      // Welcome notification - immediate
      await this.scheduleNotification({
        type: 'welcome',
        title: `Welcome to MusicStream, ${username}! 🎵`,
        body: 'Start exploring millions of songs and create your perfect playlists.',
        data: { screen: 'home' }
      }, 3); // 3 seconds delay

      // Music recommendation - after 8 seconds
      await this.scheduleNotification({
        type: 'recommendation',
        title: '🎧 Discover New Music',
        body: 'Check out our curated playlists based on your taste!',
        data: { screen: 'search' }
      }, 8);

      // Daily mix notification - after 15 seconds
      await this.scheduleNotification({
        type: 'playlist_update',
        title: '🔥 Your Daily Mix is Ready',
        body: 'Fresh tracks picked just for you. Start listening now!',
        data: { screen: 'library' }
      }, 15);

      console.log('Welcome notifications scheduled successfully');
    } catch (error) {
      console.error('Error scheduling welcome notifications:', error);
    }
  }

  async scheduleNewMusicNotification(artist: string, song: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        console.log(`🎵 New from ${artist} - "${song}" is now available!`);
        return;
      }

      if (!this.permissionGranted) return;

      await this.scheduleNotification({
        type: 'new_music',
        title: `🎵 New from ${artist}`,
        body: `"${song}" is now available. Listen now!`,
        data: { artist, song }
      }, 2);
    } catch (error) {
      console.error('Error scheduling new music notification:', error);
    }
  }

  private async scheduleNotification(notification: NotificationData, delaySeconds: number): Promise<void> {
    if (Platform.OS === 'web') {
      // Simulate notification on web
      setTimeout(() => {
        console.log(`📱 ${notification.title}: ${notification.body}`);
      }, delaySeconds * 1000);
      return;
    }

    const trigger = delaySeconds > 0 ? {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL as const,
      seconds: delaySeconds,
      repeats: false,
    } : null;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger,
    });
  }

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  // Listen for notification responses
  addNotificationResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
    if (Platform.OS === 'web') {
      console.log('Notification response listeners not supported on web');
      return;
    }
    
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Listen for notifications received while app is in foreground
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    if (Platform.OS === 'web') {
      console.log('Notification received listeners not supported on web');
      return;
    }
    
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Add a method to show immediate local notification
  async showImmediateNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        console.log(`📱 ${title}: ${body}`);
        return;
      }

      if (!this.permissionGranted) {
        console.log('Cannot show notification - permissions not granted');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing immediate notification:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();
export default NotificationService;