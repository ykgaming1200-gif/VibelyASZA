import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Music, Heart, Users, Volume2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new_music',
      title: 'New Music',
      description: 'Get notified when artists you follow release new music',
      icon: Music,
      enabled: true,
    },
    {
      id: 'likes',
      title: 'Likes & Comments',
      description: 'When someone likes or comments on your playlists',
      icon: Heart,
      enabled: true,
    },
    {
      id: 'followers',
      title: 'New Followers',
      description: 'When someone starts following you',
      icon: Users,
      enabled: false,
    },
    {
      id: 'recommendations',
      title: 'Music Recommendations',
      description: 'Personalized music suggestions based on your taste',
      icon: Volume2,
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: colors.spotify.black },
          headerTintColor: colors.spotify.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.sectionDescription}>
            Manage what notifications you receive on this device
          </Text>
          
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <setting.icon size={20} color={colors.spotify.green} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.spotify.darkGray, true: colors.spotify.green }}
                thumbColor={colors.spotify.white}
              />
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <Text style={styles.sectionDescription}>
            We'll send you updates about new features and music recommendations
          </Text>
          
          <TouchableOpacity style={styles.emailButton}>
            <Text style={styles.emailButtonText}>Manage Email Preferences</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
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
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.spotify.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spotify.white,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
    lineHeight: 18,
  },
  emailButton: {
    backgroundColor: colors.spotify.darkGray,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spotify.white,
  },
});