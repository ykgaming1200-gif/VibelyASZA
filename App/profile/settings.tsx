import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { 
  User, 
  Shield, 
  Volume2, 
  Smartphone, 
  Wifi, 
  Moon, 
  Globe, 
  HelpCircle,
  FileText,
  Star,
  ChevronRight
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: any;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    highQualityStreaming: true,
    downloadOnWifiOnly: true,
    darkMode: true,
    notifications: true,
    autoplay: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          description: 'Change your profile information',
          icon: User,
          type: 'navigation',
          onPress: () => console.log('Edit profile'),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          description: 'Control your privacy and data',
          icon: Shield,
          type: 'navigation',
          onPress: () => console.log('Privacy settings'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Playback',
      items: [
        {
          id: 'highQuality',
          title: 'High Quality Streaming',
          description: 'Stream music at 320kbps',
          icon: Volume2,
          type: 'toggle',
          value: settings.highQualityStreaming,
          onPress: () => toggleSetting('highQualityStreaming'),
        },
        {
          id: 'autoplay',
          title: 'Autoplay',
          description: 'Automatically play similar songs',
          icon: Volume2,
          type: 'toggle',
          value: settings.autoplay,
          onPress: () => toggleSetting('autoplay'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          id: 'wifiOnly',
          title: 'Download on Wi-Fi only',
          description: 'Save mobile data',
          icon: Wifi,
          type: 'toggle',
          value: settings.downloadOnWifiOnly,
          onPress: () => toggleSetting('downloadOnWifiOnly'),
        },
        {
          id: 'storage',
          title: 'Storage Settings',
          description: 'Manage downloaded music',
          icon: Smartphone,
          type: 'navigation',
          onPress: () => console.log('Storage settings'),
        },
      ] as SettingItem[],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          description: 'Use dark theme',
          icon: Moon,
          type: 'toggle',
          value: settings.darkMode,
          onPress: () => toggleSetting('darkMode'),
        },
        {
          id: 'language',
          title: 'Language',
          description: 'English',
          icon: Globe,
          type: 'navigation',
          onPress: () => console.log('Language settings'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          description: 'Get help with the app',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => console.log('Help & support'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: FileText,
          type: 'navigation',
          onPress: () => console.log('Terms of service'),
        },
        {
          id: 'rate',
          title: 'Rate the App',
          description: 'Help us improve',
          icon: Star,
          type: 'action',
          onPress: () => {
            Alert.alert(
              'Rate the App',
              'Thank you for using our music app! Would you like to rate us on the App Store?',
              [
                { text: 'Later', style: 'cancel' },
                { text: 'Rate Now', onPress: () => console.log('Opening app store') },
              ]
            );
          },
        },
      ] as SettingItem[],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <item.icon size={20} color={colors.spotify.green} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.settingDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: colors.spotify.darkGray, true: colors.spotify.green }}
              thumbColor={colors.spotify.white}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color={colors.spotify.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: colors.spotify.black },
          headerTintColor: colors.spotify.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(renderSettingItem)}
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2024 Music App</Text>
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
    fontSize: 18,
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
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
  settingRight: {
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: colors.spotify.textSecondary,
  },
});