import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {WebView} from 'react-native-webview';

type MetroBouncyLoaderProps = {
  size?: number;
  speed?: number;
  color?: string;
  onReady?: () => void;
};

const MetroBouncyLoader: React.FC<MetroBouncyLoaderProps> = ({
  size = 45,
  speed = 1.75,
  color = '#17B2A8',
  onReady,
}) => {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <script type="module">
        import { bouncy } from 'https://cdn.jsdelivr.net/npm/ldrs@1.1.9/dist/index.js';
        bouncy.register();
      </script>
    </head>
    <body>
      <l-bouncy
        size="${size}"
        speed="${speed}"
        color="#17B2A8"
      ></l-bouncy>
    </body>
    </html>
  `;

  const containerSize = size + 20;

  useEffect(() => {
    if (isReady) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      if (onReady) {
        onReady();
      }
    }
  }, [isReady, fadeAnim, onReady]);

  const handleLoadEnd = () => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  };

  return (
    <View
      style={[styles.container, {width: containerSize, height: containerSize}]}>
      {/* Placeholder */}
      {!isReady && (
        <View style={styles.placeholder}>
          <View style={[styles.skeletonCircle, {width: size, height: size}]} />
        </View>
      )}

      {/* Loader */}
      <Animated.View style={[styles.loaderWrapper, {opacity: fadeAnim}]}>
        <WebView
          source={{html}}
          style={styles.webview}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType="hardware"
          androidHardwareAccelerationDisabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          mixedContentMode="always"
          cacheEnabled={false}
          incognito={true}
          scalesPageToFit={false}
          opaque={false}
          backgroundColor="transparent"
          onLoadEnd={handleLoadEnd}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  placeholder: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCircle: {
    borderRadius: 100,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderWidth: 2,
    borderColor: '#17B2A8',
  },
});

export default MetroBouncyLoader;
