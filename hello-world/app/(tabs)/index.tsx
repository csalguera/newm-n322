import { Image } from 'expo-image';
import { StyleSheet, Linking } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#9e0000', dark: '#9e0000' }}
      headerImage={
        <Image
          source={require('@/assets/images/iu-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello World</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Expo Go</ThemedText>
        <ThemedText>
          This is my first app built with{' '}
          <ThemedText
            style={{
              textDecorationLine: 'underline'
            }}
            onPress={() => Linking.openURL('https://expo.dev/go')}
          >
            Expo Go
          </ThemedText>
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 150,
    width: 150,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
