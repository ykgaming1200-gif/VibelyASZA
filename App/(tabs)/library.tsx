import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Plus, ArrowUpDown, Grid3X3, List, Heart, Clock, Download, Music } from 'lucide-react-native';
import { mockPlaylists, mockSongs } from '@/data/mock-music';
import { useMusicStore } from '@/store/music-store';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from '@/components/MiniPlayer';

export default function LibraryScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all');
  const { playSong, currentSong, userSongs } = useMusicStore();
  const insets = useSafeAreaInsets();

  const handlePlayPlaylist = (playlist: typeof mockPlaylists[0]) => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const filters = [
    { key: 'all', label: 'Recently added' },
    { key: 'playlists', label: 'Playlists' },
    { key: 'artists', label: 'Artists' },
    { key: 'albums', label: 'Albums' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profilePic}>
            <Text style={styles.profileInitial}>M</Text>
          </View>
          <Text style={styles.title}>Your Library</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/add-music')}
          >
            <Plus size={24} color={colors.spotify.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filterItem) => (
          <TouchableOpacity 
            key={filterItem.key}
            style={[styles.filterTab, filter === filterItem.key && styles.filterTabActive]}
            onPress={() => setFilter(filterItem.key as any)}
          >
            <Text style={[styles.filterText, filter === filterItem.key && styles.filterTextActive]}>
              {filterItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort and View Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.sortButton}>
          <ArrowUpDown size={16} color={colors.spotify.white} />
          <Text style={styles.sortText}>Recently added</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        >
          {viewMode === 'list' ? (
            <Grid3X3 size={20} color={colors.spotify.white} />
          ) : (
            <List size={20} color={colors.spotify.white} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Liked Songs */}
        <TouchableOpacity style={styles.likedSongs}>
          <View style={styles.likedSongsIcon}>
            <Heart size={20} color={colors.spotify.white} fill={colors.spotify.white} />
          </View>
          <View style={styles.likedSongsInfo}>
            <Text style={styles.likedSongsTitle}>Liked Songs</Text>
            <Text style={styles.likedSongsCount}>72 songs</Text>
          </View>
        </TouchableOpacity>

        {/* Downloaded */}
        <TouchableOpacity style={styles.downloadedItem}>
          <View style={styles.downloadedIcon}>
            <Download size={20} color={colors.spotify.green} />
          </View>
          <View style={styles.downloadedInfo}>
            <Text style={styles.downloadedTitle}>Downloaded</Text>
            <Text style={styles.downloadedCount}>3 albums</Text>
          </View>
        </TouchableOpacity>

        {/* Recently Played */}
        <TouchableOpacity style={styles.recentItem}>
          <View style={styles.recentIcon}>
            <Clock size={20} color={colors.spotify.green} />
          </View>
          <View style={styles.recentInfo}>
            <Text style={styles.recentTitle}>Recently played</Text>
            <Text style={styles.recentSubtitle}>Jump back in</Text>
          </View>
        </TouchableOpacity>

        {/* User Added Music */}
        {userSongs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Music</Text>
            </View>
            {userSongs.map((song) => (
              <TouchableOpacity 
                key={song.id} 
                style={styles.playlistItem}
                onPress={() => playSong(song, userSongs)}
              >
                <Image source={{ uri: song.coverUrl }} style={styles.playlistImage} />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.playlistMeta}>{song.artist} • {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Playlists */}
        {mockPlaylists.map((playlist) => (
          <TouchableOpacity 
            key={playlist.id} 
            style={styles.playlistItem}
            onPress={() => handlePlayPlaylist(playlist)}
          >
            <Image source={{ uri: playlist.coverUrl }} style={styles.playlistImage} />
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistTitle} numberOfLines={1}>{playlist.name}</Text>
              <Text style={styles.playlistMeta}>Playlist • {playlist.songs.length} songs</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Mini Player */}
      {currentSong && <MiniPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spotify.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.spotify.black,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.spotify.lightGray,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: colors.spotify.green,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.spotify.white,
  },
  filterTextActive: {
    color: colors.spotify.black,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortText: {
    fontSize: 14,
    color: colors.spotify.white,
  },
  viewButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  likedSongs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  likedSongsIcon: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedSongsInfo: {
    flex: 1,
  },
  likedSongsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  likedSongsCount: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  downloadedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  downloadedIcon: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.spotify.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadedInfo: {
    flex: 1,
  },
  downloadedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  downloadedCount: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentIcon: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.spotify.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  playlistImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  playlistMeta: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
  sectionHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.spotify.lightGray,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
});