if (typeof global.setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => global.setTimeout(fn, 0, ...args);
}

import { Stack } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  // Inject global web CSS to reset body/html margins and set background
  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = "HUYTUÂN DIGITAL";
      const style = document.createElement('style');
      style.id = 'global-reset';
      style.innerHTML = `
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #1e293b; overflow: hidden; }
        #root { display: flex; align-items: stretch; justify-content: center; height: 100vh; background: #1e293b; }
      `;
      if (!document.getElementById('global-reset')) {
        document.head.appendChild(style);
      }
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOuter}>
        <View style={styles.webInner}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore - web specific
    minHeight: '100vh',
  } as any,
  webInner: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    backgroundColor: '#f6f9fc',
    overflow: 'hidden',
    // @ts-ignore - web specific
    boxShadow: '0 0 40px rgba(0,0,0,0.4)',
  } as any,
});
