import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import RootLayout from './app/_layout';
import { AuthProvider } from './context/AuthContext';
import { DogProvider } from './context/DogContext';
import { COLORS } from './constants/colors';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <DogProvider>
        <RootLayout />
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      </DogProvider>
    </AuthProvider>
  );
}
