import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { ArrowLeft, Music, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Song } from '@/types/music';
import { useMusicStore } from '@/store/music-store';

export default function AddMusicScreen() {
  const insets = useSafeAreaInsets();
  const { addUserSong } = useMusicStore();
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    audioUrl: '',
    coverUrl: '',
    duration: '',
    releaseYear: new Date().getFullYear().toString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Song title is required');
      return false;
    }
    if (!formData.artist.trim()) {
      Alert.alert('Error', 'Artist name is required');
      return false;
    }
    if (!formData.audioUrl.trim()) {
      Alert.alert('Error', 'Audio URL is required');
      return false;
    }
    if (!formData.duration.trim() || isNaN(Number(formData.duration))) {
      Alert.alert('Error', 'Valid duration in seconds is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newSong: Song = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album.trim() || 'Unknown Album',
        genre: formData.genre.trim() || 'Unknown',
        audioUrl: formData.audioUrl.trim(),
        coverUrl: formData.coverUrl.trim() || 'https://via.placeholder.com/300x300/1DB954/000000?text=Music',
        duration: parseInt(formData.duration),
        releaseYear: parseInt(formData.releaseYear) || new Date().getFullYear(),
      };

      // Add to user songs
      addUserSong(newSong);
      
      Alert.alert(
        'Success', 
        'Your music has been added successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error) {
      console.error('Error adding music:', error);
      Alert.alert('Error', 'Failed to add music. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedCoverUrls = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&sat=-100',
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.spotify.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Your Music</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Preview */}
        <View style={styles.coverSection}>
          <View style={styles.coverPreview}>
            {formData.coverUrl ? (
              <Image source={{ uri: formData.coverUrl }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Music size={40} color={colors.spotify.textSecondary} />
                <Text style={styles.coverPlaceholderText}>Cover Art</Text>
              </View>
            )}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Song Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter song title"
              placeholderTextColor={colors.spotify.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Artist *</Text>
            <TextInput
              style={styles.input}
              value={formData.artist}
              onChangeText={(value) => handleInputChange('artist', value)}
              placeholder="Enter artist name"
              placeholderTextColor={colors.spotify.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Album</Text>
            <TextInput
              style={styles.input}
              value={formData.album}
              onChangeText={(value) => handleInputChange('album', value)}
              placeholder="Enter album name"
              placeholderTextColor={colors.spotify.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              value={formData.genre}
              onChangeText={(value) => handleInputChange('genre', value)}
              placeholder="Enter genre"
              placeholderTextColor={colors.spotify.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Audio URL *</Text>
            <TextInput
              style={styles.input}
              value={formData.audioUrl}
              onChangeText={(value) => handleInputChange('audioUrl', value)}
              placeholder="https://example.com/song.mp3"
              placeholderTextColor={colors.spotify.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
            <Text style={styles.helpText}>
              Paste a direct link to your audio file (MP3, WAV, etc.)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cover Art URL</Text>
            <TextInput
              style={styles.input}
              value={formData.coverUrl}
              onChangeText={(value) => handleInputChange('coverUrl', value)}
              placeholder="https://example.com/cover.jpg"
              placeholderTextColor={colors.spotify.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
            
            {/* Suggested Cover Images */}
            <Text style={styles.suggestionsLabel}>Or choose from suggestions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
              {suggestedCoverUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleInputChange('coverUrl', url)}
                >
                  <Image source={{ uri: url }} style={styles.suggestionImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Duration (seconds) *</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="180"
                placeholderTextColor={colors.spotify.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Release Year</Text>
              <TextInput
                style={styles.input}
                value={formData.releaseYear}
                onChangeText={(value) => handleInputChange('releaseYear', value)}
                placeholder="2024"
                placeholderTextColor={colors.spotify.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Plus size={20} color={colors.spotify.black} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Adding...' : 'Add Music'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.spotify.white,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  coverSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  coverPreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.spotify.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coverPlaceholderText: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spotify.white,
  },
  input: {
    backgroundColor: colors.spotify.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.spotify.white,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  helpText: {
    fontSize: 12,
    color: colors.spotify.textSecondary,
    marginTop: 4,
  },
  suggestionsLabel: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    marginTop: 8,
    marginBottom: 8,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionItem: {
    marginRight: 12,
  },
  suggestionImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.spotify.green,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.spotify.black,
  },
  bottomPadding: {
    height: 32,
  },
});