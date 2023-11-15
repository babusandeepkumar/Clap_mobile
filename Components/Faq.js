import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ProgressBar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

const Faq = () => {
  const url = "https://allvy.com/CLAP_Mobile/FAQ/index.html";
  const [progress, setProgress] = useState(0);
  const [disp, setDisp] = useState(true);
  const [webViewKey, setWebViewKey] = useState(1); // Initialize with a key

  const isFocused = useIsFocused(); // Detect if the screen is focused

  useEffect(() => {
    // When the screen becomes focused, reload the WebView
    if (isFocused) {
      setWebViewKey((prevKey) => prevKey + 1);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      {disp ? <ProgressBar style={{ margin: 10 }} progress={progress} color="#00BCD4" /> : ''}
      <WebView
        key={webViewKey} // Change the key to force WebView reload
        source={{ uri: url }}
        scrollEnabled={true}
        scalesPageToFit={false}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onLoad={() => setDisp(false)}
      />
    </View>
  );
}

export default Faq;

const styles = StyleSheet.create({});
