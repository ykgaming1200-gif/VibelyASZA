import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Song } from '@/types/music';
import { useMusicStore } from '@/store/music-store';

interface SongCardProps {
  song: Song;
  onPress?: () => void;
  showArtist?: boolean;
}

export function SongCard({ song, onPress, showArtist = true }: SongCardProps) {
  const { playSong, currentSong, isPlaying } = useMusicStore();
  
  const isCurrentSong = currentSong?.id === song.id;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      playSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: song.coverUrl }} style={styles.cover} />
        {isCurrentSong && isPlaying && (
          <View style={styles.playingIndicator}>
            <View style={styles.playingBar} />
            <View style={styles.playingBar} />
            <View style={styles.playingBar} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={[styles.title, isCurrentSong && styles.activeText]} numberOfLines={1}>
          {song.title}
        </Text>
        {showArtist && (
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        )}
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
  },
  coverContainer: {
    position: 'relative',
    marginRight: 12,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  playingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  playingBar: {
    width: 3,
    height: 12,
    backgroundColor: '#1db954',
    borderRadius: 1,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  activeText: {
    color: '#1db954',
  },
  artist: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  moreButton: {
    padding: 4,
  },
});