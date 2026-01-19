import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from '@/contexts/UserContext';
import { FarmaciaProvider } from '@/contexts/FarmaciaContext';
import { ProductoProvider } from '@/contexts/ProductoContext';
import { AlertasProvider } from '@/contexts/AlertasContext';

export const unstable_settings = {
  anchor: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <FarmaciaProvider>
        <ProductoProvider>
          <AlertasProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="add-producto" options={{ headerShown: false }} />
                <Stack.Screen name="farmacia-detalles-cliente" options={{ headerShown: false }} />
                <Stack.Screen name="medicamento-detalles" options={{ headerShown: false }} />
                <Stack.Screen name="(modal)" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </AlertasProvider>
        </ProductoProvider>
      </FarmaciaProvider>
    </UserProvider>
  );
}
