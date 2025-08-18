import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Heart, Play, Shuffle, Download, MoreVertical } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMusicStore } from '@/store/music-store';
import { mockSongs } from '@/data/mock-music';
import { Song } from '@/types/music';

export default function LikedSongsScreen() {
  const insets = useSafeAreaInsets();
  const { playSong } = useMusicStore();
  
  // Mock liked songs - in a real app this would come from user's liked songs
  const [likedSongs] = useState<Song[]>([
    mockSongs[0], // Blinding Lights
    mockSongs[3], // Levitating
    mockSongs[6], // Anti-Hero
    mockSongs[7], // As It Was
    mockSongs[11], // Flowers
    mockSongs[14], // About Damn Time
    mockSongs[17], // Billie Jean
    mockSongs[22], // Uptown Funk
    mockSongs[23], // Rolling in the Deep
  ]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const totalSeconds = likedSongs.reduce((acc, song) => acc + song.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const playAllSongs = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0]);
    }
  };

  const shufflePlay = () => {
    if (likedSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * likedSongs.length);
      playSong(likedSongs[randomIndex]);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Liked Songs',
          headerStyle: { backgroundColor: colors.spotify.black },
          headerTintColor: colors.spotify.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coverContainer}>
            <View style={styles.likedCover}>
              <Heart size={48} color={colors.spotify.white} fill={colors.spotify.white} />
            </View>
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.playlistType}>Playlist</Text>
            <Text style={styles.playlistTitle}>Liked Songs</Text>
            <Text style={styles.playlistStats}>
              {likedSongs.length} songs • {getTotalDuration()}
            </Text>
          </View>
        </View>
        
        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.playButtons}>
            <TouchableOpacity style={styles.playButton} onPress={playAllSongs}>
              <Play size={24} color={colors.spotify.black} fill={colors.spotify.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shuffleButton} onPress={shufflePlay}>
              <Shuffle size={24} color={colors.spotify.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={24} color={colors.spotify.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={24} color={colors.spotify.white} />
          </TouchableOpacity>
        </View>
        
        {/* Songs List */}
        {likedSongs.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={64} color={colors.spotify.textSecondary} />
            <Text style={styles.emptyTitle}>No liked songs yet</Text>
            <Text style={styles.emptyDescription}>
              Songs you like will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.songsList}>
            {likedSongs.map((song, index) => (
              <TouchableOpacity 
                key={song.id} 
                style={styles.songItem}
                onPress={() => playSong(song)}
              >
                <View style={styles.songLeft}>
                  <Text style={styles.songIndex}>{index + 1}</Text>
                  <Image source={{ uri: song.coverUrl }} style={styles.songImage} />
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                  </View>
                </View>
                
                <View style={styles.songRight}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Heart size={20} color={colors.spotify.green} fill={colors.spotify.green} />
                  </TouchableOpacity>
                  <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
                  <TouchableOpacity style={styles.songMoreButton}>
                    <MoreVertical size={20} color={colors.spotify.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  coverContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  likedCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  playlistType: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 8,
  },
  playlistStats: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  playButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shuffleButton: {
    padding: 8,
  },
  downloadButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
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
  },
  songsList: {
    paddingHorizontal: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  songLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songIndex: {
    fontSize: 16,
    color: colors.spotify.textSecondary,
    width: 24,
    textAlign: 'center',
    marginRight: 16,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
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
  },
  songRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heartButton: {
    padding: 4,
  },
  songDuration: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  songMoreButton: {
    padding: 4,
  },
});