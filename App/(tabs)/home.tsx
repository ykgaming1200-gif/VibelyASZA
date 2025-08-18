import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Heart, MoreHorizontal, Settings, Keyboard, Command } from 'lucide-react-native';
import { mockSongs, mockPlaylists } from '@/data/mock-music';
import { useMusicStore } from '@/store/music-store';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from '@/components/MiniPlayer';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width > 768;

export default function HomeScreen() {
  const { playSong, currentSong, isPlaying } = useMusicStore();
  const insets = useSafeAreaInsets();

  const recentlyPlayed = mockSongs.slice(0, 6);
  const madeForYou = mockPlaylists.slice(0, 5);
  const topMixes = mockPlaylists.slice(0, 4);

  const handlePlaySong = (song: typeof mockSongs[0]) => {
    playSong(song, mockSongs);
  };

  const handlePlayPlaylist = (playlist: typeof mockPlaylists[0]) => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: isWeb ? 20 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening</Text>
          {isDesktop && (
            <View style={styles.keyboardHints}>
              <View style={styles.keyboardHint}>
                <Command size={12} color={colors.spotify.textSecondary} />
                <Text style={styles.keyboardHintText}>+H Home</Text>
              </View>
              <View style={styles.keyboardHint}>
                <Command size={12} color={colors.spotify.textSecondary} />
                <Text style={styles.keyboardHintText}>+K Search</Text>
              </View>
              <View style={styles.keyboardHint}>
                <Command size={12} color={colors.spotify.textSecondary} />
                <Text style={styles.keyboardHintText}>+L Library</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Settings size={24} color={colors.spotify.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recently Played Grid */}
        <View style={[styles.quickGrid, isDesktop && styles.quickGridDesktop]}>
          {recentlyPlayed.map((song) => (
            <TouchableOpacity 
              key={song.id} 
              style={[styles.quickGridItem, isDesktop && styles.quickGridItemDesktop]}
              onPress={() => handlePlaySong(song)}
            >
              <Image source={{ uri: song.coverUrl }} style={styles.quickGridImage} />
              <Text style={styles.quickGridText} numberOfLines={1}>{song.title}</Text>
              {isDesktop && (
                <View style={styles.playButton}>
                  <Play size={16} color={colors.spotify.black} fill={colors.spotify.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Made For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Made for you</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal={!isDesktop} 
            showsHorizontalScrollIndicator={false} 
            style={[styles.horizontalScroll, isDesktop && styles.gridScroll]}
            contentContainerStyle={isDesktop ? styles.gridContainer : undefined}
          >
            {madeForYou.map((playlist) => (
              <TouchableOpacity 
                key={playlist.id} 
                style={[styles.playlistCard, isDesktop && styles.playlistCardDesktop]}
                onPress={() => handlePlayPlaylist(playlist)}
              >
                <View style={styles.playlistImageContainer}>
                  <Image source={{ uri: playlist.coverUrl }} style={styles.playlistImage} />
                  {isDesktop && (
                    <View style={styles.playlistPlayButton}>
                      <Play size={20} color={colors.spotify.black} fill={colors.spotify.green} />
                    </View>
                  )}
                </View>
                <Text style={styles.playlistTitle} numberOfLines={2}>{playlist.name}</Text>
                <Text style={styles.playlistDescription} numberOfLines={2}>{playlist.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Your Top Mixes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your top mixes</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {topMixes.map((playlist) => (
              <TouchableOpacity 
                key={playlist.id} 
                style={styles.mixCard}
                onPress={() => handlePlayPlaylist(playlist)}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6B46C1']}
                  style={styles.mixGradient}
                >
                  <Text style={styles.mixTitle}>{playlist.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Songs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular right now</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          
          {mockSongs.slice(0, 5).map((song, index) => (
            <TouchableOpacity 
              key={song.id} 
              style={styles.songItem}
              onPress={() => handlePlaySong(song)}
            >
              <Image source={{ uri: song.coverUrl }} style={styles.songImage} />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
              </View>
              <TouchableOpacity style={styles.songMenu}>
                <MoreHorizontal size={20} color={colors.spotify.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Quick Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  quickGridDesktop: {
    gap: 12,
  },
  quickGridItem: {
    width: (width - 48) / 2,
    backgroundColor: colors.spotify.lightGray,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  quickGridItemDesktop: {
    width: (width > 1200 ? 1200 : width - 48) / 3 - 8,
    minWidth: 280,
    backgroundColor: colors.spotify.darkGray,
    borderRadius: 8,
    transition: 'all 0.2s ease',
  },
  playButton: {
    position: 'absolute',
    right: 12,
    backgroundColor: colors.spotify.green,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  keyboardHints: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  keyboardHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  keyboardHintText: {
    fontSize: 11,
    color: colors.spotify.textSecondary,
  },
  quickGridImage: {
    width: 48,
    height: 48,
  },
  quickGridText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.spotify.white,
    paddingHorizontal: 12,
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  showAll: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  
  // Horizontal Scroll
  horizontalScroll: {
    marginBottom: 8,
  },
  
  // Playlist Cards
  playlistCard: {
    width: 160,
    marginRight: 16,
  },
  playlistCardDesktop: {
    width: 200,
    marginRight: 20,
    marginBottom: 20,
  },
  playlistImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  playlistPlayButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.spotify.green,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transform: [{ translateY: 8 }],
  },
  gridScroll: {
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  
  // Mix Cards
  mixCard: {
    width: 160,
    height: 160,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mixGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  mixTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  
  // Song Items
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  songMenu: {
    padding: 8,
  },
  
  bottomPadding: {
    height: isWeb ? 120 : 100,
  },
});