import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Download, Play, MoreVertical, Trash2, Wifi, WifiOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockSongs } from '@/data/mock-music';
import { Song } from '@/types/music';

interface DownloadedSong extends Song {
  downloadedAt: string;
  size: string;
}

export default function DownloadsScreen() {
  const insets = useSafeAreaInsets();
  const [downloadQuality, setDownloadQuality] = useState<'normal' | 'high' | 'very_high'>('high');
  const [downloadOnWifiOnly, setDownloadOnWifiOnly] = useState(true);
  
  // Mock downloaded songs
  const [downloadedSongs] = useState<DownloadedSong[]>([
    {
      ...mockSongs[0],
      downloadedAt: '2024-01-15',
      size: '4.2 MB'
    },
    {
      ...mockSongs[3],
      downloadedAt: '2024-01-14',
      size: '3.8 MB'
    },
    {
      ...mockSongs[6],
      downloadedAt: '2024-01-13',
      size: '4.1 MB'
    },
    {
      ...mockSongs[7],
      downloadedAt: '2024-01-12',
      size: '3.5 MB'
    },
  ]);

  const totalSize = downloadedSongs.reduce((acc, song) => {
    const size = parseFloat(song.size.replace(' MB', ''));
    return acc + size;
  }, 0);

  const handleDeleteSong = (songId: string, songTitle: string) => {
    Alert.alert(
      'Remove Download',
      `Remove "${songTitle}" from downloads?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          console.log('Removing download:', songId);
        }}
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Downloads',
          headerStyle: { backgroundColor: colors.spotify.black },
          headerTintColor: colors.spotify.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Download Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Wifi size={24} color={colors.spotify.green} />
              <Text style={styles.settingText}>Download using cellular</Text>
            </View>
            <TouchableOpacity 
              style={styles.toggle}
              onPress={() => setDownloadOnWifiOnly(!downloadOnWifiOnly)}
            >
              {downloadOnWifiOnly ? (
                <WifiOff size={20} color={colors.spotify.textSecondary} />
              ) : (
                <Wifi size={20} color={colors.spotify.green} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.qualitySection}>
            <Text style={styles.qualityTitle}>Audio Quality</Text>
            {['normal', 'high', 'very_high'].map((quality) => (
              <TouchableOpacity
                key={quality}
                style={styles.qualityOption}
                onPress={() => setDownloadQuality(quality as any)}
              >
                <View style={styles.qualityLeft}>
                  <View style={[
                    styles.radioButton,
                    downloadQuality === quality && styles.radioButtonSelected
                  ]} />
                  <View>
                    <Text style={styles.qualityLabel}>
                      {quality === 'normal' ? 'Normal' : quality === 'high' ? 'High' : 'Very High'}
                    </Text>
                    <Text style={styles.qualityDescription}>
                      {quality === 'normal' ? '96 kbps' : quality === 'high' ? '160 kbps' : '320 kbps'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Downloaded Songs */}
        <View style={styles.section}>
          <View style={styles.downloadsHeader}>
            <Text style={styles.sectionTitle}>Downloaded Music</Text>
            <Text style={styles.storageInfo}>{totalSize.toFixed(1)} MB used</Text>
          </View>
          
          {downloadedSongs.length === 0 ? (
            <View style={styles.emptyState}>
              <Download size={48} color={colors.spotify.textSecondary} />
              <Text style={styles.emptyTitle}>No downloads yet</Text>
              <Text style={styles.emptyDescription}>
                Download music to listen offline
              </Text>
            </View>
          ) : (
            downloadedSongs.map((song) => (
              <View key={song.id} style={styles.songItem}>
                <TouchableOpacity style={styles.songContent}>
                  <Image source={{ uri: song.coverUrl }} style={styles.songImage} />
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                    <View style={styles.songMeta}>
                      <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
                      <Text style={styles.songSize}>{song.size}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.songActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Play size={20} color={colors.spotify.white} fill={colors.spotify.white} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteSong(song.id, song.title)}
                  >
                    <Trash2 size={20} color={colors.spotify.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.spotify.darkGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    color: colors.spotify.white,
  },
  toggle: {
    padding: 8,
  },
  qualitySection: {
    marginTop: 24,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spotify.white,
    marginBottom: 16,
  },
  qualityOption: {
    paddingVertical: 12,
  },
  qualityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.spotify.textSecondary,
  },
  radioButtonSelected: {
    borderColor: colors.spotify.green,
    backgroundColor: colors.spotify.green,
  },
  qualityLabel: {
    fontSize: 16,
    color: colors.spotify.white,
    marginBottom: 2,
  },
  qualityDescription: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  downloadsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageInfo: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.spotify.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    textAlign: 'center',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.spotify.darkGray,
  },
  songContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginBottom: 4,
  },
  songMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  songDuration: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  songSize: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  songActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});