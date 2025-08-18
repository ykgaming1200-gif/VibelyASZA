import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { X, Settings, User, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ModalScreen() {
  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <User size={20} color="#b3b3b3" />
            <Text style={styles.menuText}>Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#b3b3b3" />
            <Text style={styles.menuText}>Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#b3b3b3" />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
});
