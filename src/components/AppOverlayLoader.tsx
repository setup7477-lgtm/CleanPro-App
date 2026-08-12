import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AppOverlayLoader() {
  return (
    <View style={styles.overlayContainer}>
      <LottieView
        source={{ uri: 'https://lottie.host/f5a34c94-447a-44f1-be5a-7fc73f858121/sB0znypVTh.lottie' }}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: 'auto',
  },
  animation: {
    width: 200,
    height: 200,
  },
});