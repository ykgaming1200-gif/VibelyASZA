import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2 } from 'lucide-react-native';
import { useMusicStore } from '@/store/music-store';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width > 768;

export function MiniPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    pauseSong, 
    resumeSong, 
    nextSong,
    previousSong 
  } = useMusicStore();

  if (!currentSong) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <LinearGradient
        colors={[colors.spotify.green, '#1ed760']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      
      <TouchableOpacity 
        style={[styles.songInfo, isDesktop && styles.songInfoDesktop]}
        onPress={() => router.push('/player')}
      >
        <Image source={{ uri: currentSong.coverUrl }} style={[styles.cover, isDesktop && styles.coverDesktop]} />
        <View style={styles.textInfo}>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={[styles.artist, isDesktop && styles.artistDesktop]} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.controls, isDesktop && styles.controlsDesktop]}>
        {isDesktop && (
          <TouchableOpacity onPress={previousSong} style={styles.controlButton}>
            <SkipBack size={20} color={colors.spotify.white} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={handlePlayPause} style={[styles.playButton, isDesktop && styles.playButtonDesktop]}>
          {isPlaying ? (
            <Pause size={isDesktop ? 20 : 24} color={colors.spotify.white} />
          ) : (
            <Play size={isDesktop ? 20 : 24} color={colors.spotify.white} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={nextSong} style={styles.controlButton}>
          <SkipForward size={20} color={colors.spotify.white} />
        </TouchableOpacity>
        
        {isDesktop && (
          <>
            <TouchableOpacity style={styles.controlButton}>
              <Volume2 size={20} color={colors.spotify.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/player')} style={styles.controlButton}>
              <Maximize2 size={18} color={colors.spotify.white} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.spotify.darkGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.spotify.lightGray,
  },
  containerDesktop: {
    height: 80,
    paddingHorizontal: 24,
    backgroundColor: colors.spotify.black,
    borderTopColor: colors.spotify.darkGray,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  songInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songInfoDesktop: {
    flex: 0.3,
    minWidth: 200,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  coverDesktop: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.spotify.white,
    marginBottom: 2,
  },
  titleDesktop: {
    fontSize: 16,
    fontWeight: '600',
  },
  artist: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  artistDesktop: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlsDesktop: {
    flex: 0.3,
    justifyContent: 'center',
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonDesktop: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  controlButton: {
    padding: 8,
  },
});