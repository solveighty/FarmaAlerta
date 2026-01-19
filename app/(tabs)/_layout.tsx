import { Tabs, usePathname } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlertas } from '@/contexts/AlertasContext';
import MorphingBellIcon from '@/components/MorphingBellIcon';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { alertas } = useAlertas();
  const [showBadge, setShowBadge] = useState(false);

  // Calcular si hay alertas completadas
  const hasUnseenAlerts = alertas && alertas.some(
    (alerta) => alerta.estado === 'completada' && alerta.farmaciasDisponibles && alerta.farmaciasDisponibles.length > 0
  );

  // Mostrar badge cuando hay alertas sin ver
  useEffect(() => {
    if (hasUnseenAlerts) {
      setShowBadge(true);
    }
  }, [hasUnseenAlerts]);

  // Ocultar badge cuando se abre la pestaña de alertas
  useEffect(() => {
    if (pathname.includes('alerts')) {
      setShowBadge(false);
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1dc962',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#0d1411',
          borderTopColor: 'rgba(29, 201, 98, 0.2)',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 65 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Farmacias',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'hospital-box' : 'hospital-box-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <MorphingBellIcon
                hasNotification={showBadge}
                color={color}
                size={26}
              />
              {showBadge && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#ef4444',
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account' : 'account-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}