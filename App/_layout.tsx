import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMusicStore } from "@/store/music-store";
import { useAuthStore } from "@/store/auth-store";
import { notificationService } from "@/store/notification-service";
import { colors } from "@/constants/colors";
import { Platform } from "react-native";
import { debugLog, debugError } from "@/utils/debug";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="auth/login" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="auth/signup" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="player" 
        options={{ 
          headerShown: false,
          presentation: "modal"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const initialize = async () => {
      try {
        debugLog('Starting app initialization', { platform: Platform.OS });
        
        // Force hide splash screen quickly on web to prevent black screen
        if (Platform.OS === 'web') {
          debugLog('Web platform detected - quick initialization');
          
          // Initialize auth synchronously for web
          try {
            const { initializeAuth } = useAuthStore.getState();
            await Promise.race([
              initializeAuth(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Auth timeout')), 300)
              )
            ]);
            debugLog('Web auth initialization completed');
          } catch (error) {
            debugError('Auth initialization failed on web, using defaults', error);
            useAuthStore.setState({ isLoading: false });
          }
          
          // Hide splash screen immediately on web
          await SplashScreen.hideAsync();
          debugLog('Web initialization completed successfully');
          return;
        }
        
        // Mobile initialization with proper timeouts
        debugLog('Mobile platform detected - full initialization');
        const timeoutId = setTimeout(() => {
          debugError('Mobile initialization timeout, forcing splash hide');
          SplashScreen.hideAsync().catch(debugError);
        }, 3000);
        
        try {
          // Initialize auth
          const { initializeAuth } = useAuthStore.getState();
          await Promise.race([
            initializeAuth(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Auth timeout')), 1500)
            )
          ]);
          debugLog('Mobile auth initialized successfully');
        } catch (error) {
          debugError('Auth initialization failed, continuing', error);
          useAuthStore.setState({ isLoading: false });
        }
        
        // Initialize audio (mobile only)
        try {
          const { initializeAudio } = useMusicStore.getState();
          await Promise.race([
            initializeAudio(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Audio timeout')), 1000)
            )
          ]);
          debugLog('Audio initialized successfully');
        } catch (error) {
          debugError('Audio initialization failed', error);
        }
        
        // Initialize notifications (mobile only)
        try {
          await Promise.race([
            notificationService.initialize(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Notification timeout')), 1000)
            )
          ]);
          debugLog('Notifications initialized successfully');
        } catch (error) {
          debugError('Notification service failed', error);
        }
        
        clearTimeout(timeoutId);
        await SplashScreen.hideAsync();
        debugLog('Mobile initialization completed successfully');
        
      } catch (error) {
        debugError('Critical error during initialization', error);
        // Always hide splash screen to prevent black screen
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          debugError('Failed to hide splash screen', splashError);
        }
      }
    };
    
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ 
          flex: 1, 
          backgroundColor: colors.spotify.black,
          maxWidth: Platform.OS === 'web' ? 1200 : undefined,
          alignSelf: Platform.OS === 'web' ? 'center' : undefined,
          width: '100%',
          minHeight: Platform.OS === 'web' ? '100vh' : undefined
        }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}