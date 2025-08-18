import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { colors } from '@/constants/colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showFallback, setShowFallback] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  
  // Aggressive timeout handling to prevent black screen
  useEffect(() => {
    // Much shorter delays for web to prevent black screen
    const fallbackDelay = Platform.OS === 'web' ? 100 : 1000;
    const forceDelay = Platform.OS === 'web' ? 200 : 1500;
    const absoluteForceDelay = Platform.OS === 'web' ? 300 : 2000;
    
    console.log('Index: Setting up timers', { fallbackDelay, forceDelay, absoluteForceDelay });
    
    const fallbackTimer = setTimeout(() => {
      console.log('Index: Fallback timer triggered, isLoading:', isLoading);
      setShowFallback(true);
    }, fallbackDelay);
    
    const forceTimer = setTimeout(() => {
      console.warn('Index: Force timer triggered, stopping loading state');
      useAuthStore.setState({ isLoading: false });
    }, forceDelay);
    
    const absoluteForceTimer = setTimeout(() => {
      console.warn('Index: Absolute force timer - showing app no matter what');
      setForceShow(true);
      useAuthStore.setState({ isLoading: false });
    }, absoluteForceDelay);
    
    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(forceTimer);
      clearTimeout(absoluteForceTimer);
    };
  }, []);
  
  // Additional safety check - if loading takes too long, force show
  useEffect(() => {
    if (isLoading) {
      const emergencyTimer = setTimeout(() => {
        console.error('Index: Emergency timeout - forcing app to show');
        setForceShow(true);
        useAuthStore.setState({ isLoading: false });
      }, Platform.OS === 'web' ? 500 : 3000);
      
      return () => clearTimeout(emergencyTimer);
    }
  }, [isLoading]);
  
  // Show loading screen only briefly
  if (isLoading && !forceShow) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.spotify.black,
        padding: 20,
        minHeight: Platform.OS === 'web' ? '100vh' : undefined
      }}>
        <ActivityIndicator size="large" color={colors.spotify.green} />
        <Text style={{ 
          color: colors.spotify.textSecondary, 
          marginTop: 20, 
          textAlign: 'center',
          fontSize: 16
        }}>
          {Platform.OS === 'web' ? 'Loading...' : 'Loading your music experience...'}
        </Text>
        {showFallback && Platform.OS === 'web' && (
          <Text style={{ 
            color: colors.spotify.textSecondary, 
            marginTop: 10, 
            textAlign: 'center',
            fontSize: 14,
            opacity: 0.7
          }}>
            Almost ready...
          </Text>
        )}
      </View>
    );
  }
  
  console.log('Index: Redirecting...', { isAuthenticated, isLoading, forceShow });
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  
  return <Redirect href="/auth/login" />;
}