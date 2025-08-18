import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Play, Clock, MoreVertical } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMusicStore } from '@/store/music-store';
import { mockSongs } from '@/data/mock-music';

export default function RecentlyPlayedScreen() {
  const insets = useSafeAreaInsets();
  const { playbackHistory, playSong } = useMusicStore();
  
  // If no history, show some mock recent songs
  const recentSongs = playbackHistory.length > 0 ? playbackHistory : mockSongs.slice(0, 15);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (index: number) => {
    const hoursAgo = index + 1;
    if (hoursAgo === 1) return '1 hour ago';
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo === 1) return '1 day ago';
    return `${daysAgo} days ago`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Recently played',
          headerStyle: { backgroundColor: colors.spotify.black },
          headerTintColor: colors.spotify.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Clock size={24} color={colors.spotify.green} />
          <Text style={styles.headerText}>Your listening history</Text>
        </View>
        
        {recentSongs.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color={colors.spotify.textSecondary} />
            <Text style={styles.emptyTitle}>No recent activity</Text>
            <Text style={styles.emptyDescription}>
              Start listening to see your recently played songs here
            </Text>
          </View>
        ) : (
          <View style={styles.songsList}>
            {recentSongs.map((song, index) => (
              <TouchableOpacity 
                key={`${song.id}-${index}`} 
                style={styles.songItem}
                onPress={() => playSong(song)}
              >
                <Image source={{ uri: song.coverUrl }} style={styles.songImage} />
                
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                  <View style={styles.songMeta}>
                    <Text style={styles.timeAgo}>{getTimeAgo(index)}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
                  </View>
                </View>
                
                <View style={styles.songActions}>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => playSong(song)}
                  >
                    <Play size={16} color={colors.spotify.white} fill={colors.spotify.white} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreVertical size={20} color={colors.spotify.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your recently played songs are stored locally and help improve your recommendations.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spotify.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.spotify.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.spotify.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  songsList: {
    paddingBottom: 32,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.spotify.darkGray,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    marginBottom: 6,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  dot: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  duration: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    padding: 8,
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: -16,
    backgroundColor: colors.spotify.darkGray,
    borderRadius: 12,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});