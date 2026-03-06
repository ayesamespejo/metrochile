import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function EncuestaScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://es.surveymonkey.com/r/WVPQ76Z" }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
