import { Stack } from 'expo-router'
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const scheme = useColorScheme()
  const [loaded] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  )
}