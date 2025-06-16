import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Orientwoods Swimming Pool</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Client List')}
      >
        <Text style={styles.buttonText}>Member List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.settingsButton]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.ReportButton]}
        onPress={() => navigation.navigate('Payment Report')}
      >
        <Text style={styles.buttonText}>Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077B6',  // nice blue
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00B4D8',  // lighter blue
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#90E0EF',  // even lighter blue
  },
  ReportButton: {
    backgroundColor: '#78a5ad',  // even lighter blue
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
