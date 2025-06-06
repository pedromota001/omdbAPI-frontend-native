import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tabs, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const hideTabBar = pathname === '/';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#E50914',
            tabBarStyle: hideTabBar
              ? { display: 'none' } 
              : { backgroundColor: '#121212' },
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName: string;

              if (route.name === 'filmes') iconName = 'film-outline';
              else if (route.name === 'series') iconName = 'tv-outline';
              else if (route.name === 'ranks') iconName = 'medal';
              else if (route.name === 'saveRank') iconName = 'explore';
              else iconName = 'home-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tabs.Screen name="index" options={{ title: 'Início' }} />
          <Tabs.Screen name="series" options={{ title: 'Séries' }} />
          <Tabs.Screen name="filmes" options={{ title: 'Filmes' }} />

          <Tabs.Screen name="myList" options={{ title: 'Minha lista' }} />

          <Tabs.Screen name="ranks" options={{title: 'Ranking'}} />
          <Tabs.Screen name='saveRank' options={{title: 'Explorar Ranks'}} />
        </Tabs>

        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
