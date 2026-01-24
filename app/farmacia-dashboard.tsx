import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useProducto } from '@/contexts/ProductoContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { Stack } from 'expo-router';
import { getStockColor } from '@/utils/stockColors';

const { width, height } = Dimensions.get('window');

export default function FarmaciaDashboardScreen() {
  const { activeFarmacia, logoutFarmacia } = useFarmacia();
  const { getProductosByFarmacia, reloadProductos } = useProducto();
  const router = useRouter();
  const [productosCount, setProductosCount] = useState(0);
  const [stockBajoCount, setStockBajoCount] = useState(0);
  const [agotadoCount, setAgotadoCount] = useState(0);
  const [productosStockBajo, setProductosStockBajo] = useState<any[]>([]);
  const [productosAgotados, setProductosAgotados] = useState<any[]>([]);

  // Función para cargar datos (sin dependencias externas problemáticas)
  const loadDashboardData = useCallback(async () => {
    if (activeFarmacia) {
      await reloadProductos();

      const productos = getProductosByFarmacia(activeFarmacia.email);
      setProductosCount(productos.length);

      // Contar stock bajo (1-20) y agotado (0)
      let bajo = 0;
      let agotado = 0;
      const stockBajos: any[] = [];
      const agotados: any[] = [];

      productos.forEach(p => {
        if (p.cantidad === 0) {
          agotado++;
          agotados.push(p);
        } else if (p.cantidad <= 20) {
          bajo++;
          stockBajos.push(p);
        }
      });
      setStockBajoCount(bajo);
      setAgotadoCount(agotado);
      setProductosStockBajo(stockBajos);
      setProductosAgotados(agotados);
    }
  }, [activeFarmacia, getProductosByFarmacia, reloadProductos]);

  // Cargar datos cuando se enfoca la pantalla o cuando cambia la farmacia
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  useEffect(() => {
    if (!activeFarmacia) {
      router.push('/login' as any);
    }
  }, [activeFarmacia]);

  const handleLogout = async () => {
    await logoutFarmacia();
    router.push('/login' as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Círculos difuminados de fondo con SVG */}
      <Svg
        height={height}
        width={width}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id="blurGradient1" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.3" />
            <Stop offset="50%" stopColor="#1dc962" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blurGradient2" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.25" />
            <Stop offset="50%" stopColor="#1dc962" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blurGradient3" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.35" />
            <Stop offset="50%" stopColor="#1dc962" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={width * -0.1} cy={height * -0.1} r={width * 0.4} fill="url(#blurGradient1)" />
        <Circle cx={width * 1.15} cy={height * 0.6} r={width * 0.35} fill="url(#blurGradient2)" />
        <Circle cx={width * -0.05} cy={height * 1.8} r={width * 0.5} fill="url(#blurGradient3)" />
      </Svg>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con bienvenida */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.farmaciaName}>{activeFarmacia?.nombre}</Text>
          </View>
        </View>

        {/* Tarjeta de inventario */}
        <View style={styles.inventarioCard}>
          <Text style={styles.cardTitle}>Inventario</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="package-variant-closed" size={32} color="#1dc962" />
              <Text style={styles.statNumber}>{productosCount}</Text>
              <Text style={styles.statLabel}>Productos en stock</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="alert" size={32} color="#fbbf24" />
              <Text style={styles.statNumber}>{stockBajoCount}</Text>
              <Text style={styles.statLabel}>Stock bajo</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#ef4444" />
              <Text style={styles.statNumber}>{agotadoCount}</Text>
              <Text style={styles.statLabel}>Agotado</Text>
            </View>
          </View>
        </View>

        {/* Accesos rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
          <View style={styles.quickAccessGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.pressed
              ]}
              onPress={() => router.push('/add-producto' as any)}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="plus" size={28} color="#1dc962" />
              </View>
              <Text style={styles.quickAccessText}>Añadir Producto</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickAccessCard,
                pressed && styles.pressed
              ]}
              onPress={() => router.push('/farmacia-stock' as any)}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="package-variant" size={28} color="#1dc962" />
              </View>
              <Text style={styles.quickAccessText}>Gestionar Stock</Text>
            </Pressable>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          {productosAgotados.length > 0 || productosStockBajo.length > 0 ? (
            <View>
              {/* Productos Agotados */}
              {productosAgotados.map((producto) => (
                <View key={`agotado-${producto.id}`} style={[styles.notificationCard, styles.notificationCardAgotado]}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#ef4444" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Sin stock disponible</Text>
                    <Text style={styles.notificationText}>
                      {producto.nombreProducto} está agotado.
                    </Text>
                  </View>
                </View>
              ))}

              {/* Productos con Stock Bajo */}
              {productosStockBajo.map((producto) => (
                <View key={`bajo-${producto.id}`} style={[styles.notificationCard, styles.notificationCardBajo]}>
                  <MaterialCommunityIcons name="alert" size={24} color="#fbbf24" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Alerta de stock bajo</Text>
                    <Text style={styles.notificationText}>
                      {producto.nombreProducto} tiene solo {producto.cantidad} unidades restantes.
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyNotifications}>
              <MaterialCommunityIcons name="check-circle" size={32} color="#1dc962" />
              <Text style={styles.emptyNotificationsText}>No hay notificaciones pendientes</Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Barra de navegación */}
      <View style={styles.navbar}>
        <Pressable style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={24} color="#1dc962" />
          <Text style={styles.navLabel}>Inicio</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-stock' as any)}>
          <MaterialCommunityIcons name="package-variant" size={24} color="#6b7280" />
          <Text style={[styles.navLabel, { color: '#6b7280' }]}>Stock</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-perfil' as any)}>
          <MaterialCommunityIcons name="account" size={24} color="#6b7280" />
          <Text style={[styles.navLabel, { color: '#6b7280' }]}>Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1411',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 4,
  },
  farmaciaName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
  },
  inventarioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(29, 201, 98, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f9fafb',
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'flex-start',
  },
  notificationCardAgotado: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  notificationCardBajo: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyNotificationsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#0d1411',
    borderTopColor: 'rgba(29, 201, 98, 0.2)',
    borderTopWidth: 1,
    paddingVertical: 12,
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: '#1dc962',
    marginTop: 4,
    fontWeight: '500',
  },
});
