import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Music, Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerStyle: { backgroundColor: '#191414' },
        headerTintColor: '#fff'
      }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Music size={64} color="#1db954" />
        </View>
        
        <Text style={styles.title}>Oops! Page not found</Text>
        <Text style={styles.subtitle}>The page you are looking for does not exist.</Text>

        <Link href="/(tabs)/home" asChild>
          <TouchableOpacity style={styles.button}>
            <Home size={20} color="#fff" />
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#191414',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1db954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
