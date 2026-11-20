import { Stack } from 'expo-router'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { useColorScheme } from 'react-native'
import { provider } from '@/lib/provider'

export default function RootLayout() {
  const scheme = useColorScheme()

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  )
}