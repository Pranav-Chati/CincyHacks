import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MagicCamera from "./MagicCamera"

export default function App() {
  return (
    <View>
      <MagicCamera />
    </View>
  );
}

const styles = StyleSheet.create({
});
