import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, Clock, Music } from 'lucide-react-native';
import { mockSongs, genres } from '@/data/mock-music';
import { useMusicStore } from '@/store/music-store';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from '@/components/MiniPlayer';
import { Song } from '@/types/music';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const { playSong, currentSong } = useMusicStore();
  const insets = useSafeAreaInsets();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = mockSongs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()) ||
      song.album.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handlePlaySong = (song: Song) => {
    playSong(song, mockSongs);
  };

  const recentSearches = ['The Weeknd', 'Pop music', 'Chill vibes'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.spotify.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to listen to?"
            placeholderTextColor={colors.spotify.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery === '' ? (
          <>
            {/* Recent Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.recentItem}>
                  <Clock size={20} color={colors.spotify.textSecondary} />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Browse Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse all</Text>
              <View style={styles.genreGrid}>
                {genres.map((genre, index) => (
                  <TouchableOpacity key={genre} style={[styles.genreCard, { backgroundColor: getGenreColor(index) }]}>
                    <Text style={styles.genreText}>{genre}</Text>
                    <Music size={24} color={colors.spotify.white} style={styles.genreIcon} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Search Results */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                  : 'No results found'
                }
              </Text>
              {searchResults.map((song) => (
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
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Mini Player */}
      {currentSong && <MiniPlayer />}
    </View>
  );
}

const getGenreColor = (index: number) => {
  const colors = [
    '#1db954', '#e22134', '#ff6600', '#8e44ad',
    '#3498db', '#f39c12', '#e74c3c', '#2ecc71',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spotify.black,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.spotify.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.spotify.white,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentText: {
    fontSize: 16,
    color: colors.spotify.white,
    marginLeft: 12,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  genreCard: {
    width: '47%',
    height: 100,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  genreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  genreIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    opacity: 0.7,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  bottomPadding: {
    height: 100,
  },
});