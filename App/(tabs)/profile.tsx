import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Settings, Share, Bell, Download, Heart, Clock, LogOut, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth-store';
import { useMusicStore } from '@/store/music-store';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from '@/components/MiniPlayer';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();
  const { currentSong, playbackHistory } = useMusicStore();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              await logout();
              console.log('Logout completed, navigating to login...');
              // Use router.replace to completely replace the navigation stack
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleChangeProfilePicture = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
        return;
      }

      const showImagePicker = () => {
        const options = [
          'Choose from Library',
          'Take Photo',
          'Remove Photo',
          'Cancel'
        ];

        if (Platform.OS === 'ios') {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: 3,
              destructiveButtonIndex: 2,
            },
            async (buttonIndex) => {
              if (buttonIndex === 0) {
                // Choose from library
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });

                if (!result.canceled && result.assets[0]) {
                  await updateProfile({ profileImage: result.assets[0].uri });
                }
              } else if (buttonIndex === 1) {
                // Take photo
                const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraPermission.status !== 'granted') {
                  Alert.alert('Permission needed', 'Please grant permission to access your camera.');
                  return;
                }

                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });

                if (!result.canceled && result.assets[0]) {
                  await updateProfile({ profileImage: result.assets[0].uri });
                }
              } else if (buttonIndex === 2) {
                // Remove photo
                await updateProfile({ profileImage: undefined });
              }
            }
          );
        } else {
          // Android - show alert with options
          Alert.alert(
            'Change Profile Picture',
            'Choose an option',
            [
              {
                text: 'Choose from Library',
                onPress: async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                  });

                  if (!result.canceled && result.assets[0]) {
                    await updateProfile({ profileImage: result.assets[0].uri });
                  }
                }
              },
              {
                text: 'Take Photo',
                onPress: async () => {
                  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
                  if (cameraPermission.status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant permission to access your camera.');
                    return;
                  }

                  const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                  });

                  if (!result.canceled && result.assets[0]) {
                    await updateProfile({ profileImage: result.assets[0].uri });
                  }
                }
              },
              {
                text: 'Remove Photo',
                style: 'destructive',
                onPress: async () => {
                  await updateProfile({ profileImage: undefined });
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      };

      showImagePicker();
    } catch (error) {
      console.error('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to change profile picture. Please try again.');
    }
  };

  const stats = [
    { label: 'Playlists', value: '12' },
    { label: 'Following', value: '47' },
    { label: 'Followers', value: '23' },
  ];

  const menuItems = [
    { icon: Bell, label: 'Notifications', onPress: () => router.push('/profile/notifications') },
    { icon: Download, label: 'Downloads', onPress: () => router.push('/profile/downloads') },
    { icon: Clock, label: 'Recently played', onPress: () => router.push('/profile/recently-played') },
    { icon: Heart, label: 'Liked songs', onPress: () => router.push('/profile/liked-songs') },
    { icon: Settings, label: 'Settings', onPress: () => router.push('/profile/settings') },
    { icon: Share, label: 'Share profile', onPress: () => console.log('Share profile') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handleChangeProfilePicture}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Camera size={20} color={colors.spotify.black} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recently Played */}
        {playbackHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently played</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {playbackHistory.slice(0, 5).map((song, index) => (
                <View key={`${song.id}-${index}`} style={styles.recentSong}>
                  <Image source={{ uri: song.coverUrl }} style={styles.recentSongImage} />
                  <Text style={styles.recentSongTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.recentSongArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <item.icon size={24} color={colors.spotify.white} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color={colors.spotify.white} />
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  profileImageContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.spotify.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.spotify.black,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.spotify.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.spotify.white,
    marginBottom: 16,
  },
  recentSong: {
    width: 120,
    marginRight: 16,
  },
  recentSongImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentSongTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  recentSongArtist: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.spotify.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    color: colors.spotify.white,
  },
  bottomPadding: {
    height: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.spotify.green,
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.spotify.black,
  },
});