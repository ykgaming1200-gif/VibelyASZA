import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress?: () => void;
}

export function PlaylistCard({ playlist, onPress }: PlaylistCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: playlist.coverUrl }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {playlist.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {playlist.description}
        </Text>
        <Text style={styles.songCount}>
          {playlist.songs.length} songs
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 12,
  },
  cover: {
    width: '100%',
    height: 136,
    borderRadius: 4,
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#b3b3b3',
    marginBottom: 8,
  },
  songCount: {
    fontSize: 12,
    color: '#b3b3b3',
  },
});