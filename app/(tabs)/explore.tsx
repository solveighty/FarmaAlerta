import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Farmacia } from '@/data/mockData';
import { useFarmacia } from '@/contexts/FarmaciaContext';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const { allFarmacias } = useFarmacia();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarmacias = allFarmacias.filter(farmacia =>
    farmacia.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Círculos difuminados de fondo con SVG */}
      <Svg style={StyleSheet.absoluteFill}>
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

        {/* Círculo 1 */}
        <Circle
          cx={width * -0.1}
          cy={width * -0.1}
          r={width * 0.4}
          fill="url(#blurGradient1)"
        />

        {/* Círculo 2 */}
        <Circle
          cx={width * 1.15}
          cy={width * 0.6}
          r={width * 0.35}
          fill="url(#blurGradient2)"
        />

        {/* Círculo 3 */}
        <Circle
          cx={width * -0.05}
          cy={width * 1.8}
          r={width * 0.5}
          fill="url(#blurGradient3)"
        />
      </Svg>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Farmacias</Text>
          <Text style={styles.subtitle}>Encuentra la farmacia más cercana</Text>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#6b7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar farmacia..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Lista de farmacias */}
        <View style={styles.farmaciasList}>
          {filteredFarmacias.map((farmacia) => (
            <FarmaciaCard key={farmacia.id} farmacia={farmacia} />
          ))}
        </View>

        {filteredFarmacias.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify" size={64} color="#6b7280" />
            <Text style={styles.emptyText}>No se encontraron farmacias</Text>
            <Text style={styles.emptySubtext}>
              Intenta con otro término de búsqueda
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface FarmaciaCardProps {
  farmacia: Farmacia;
}

function FarmaciaCard({ farmacia }: FarmaciaCardProps) {
  const router = useRouter();
  const isOpen = farmacia.estado === 'abierto' || farmacia.estado === 'abierto24';

  const handleExplore = () => {
    router.push({
      pathname: '/farmacia-detalles-cliente',
      params: {
        farmaciaEmail: farmacia.email,
      },
    } as any);
  };

  return (
    <View style={styles.farmaciaCard}>
      <View style={styles.imageWrapper}>
        {farmacia.urlFoto ? (
          <Image
            source={{ uri: farmacia.urlFoto }}
            style={styles.farmaciaImage}
          />
        ) : (
          <View style={[styles.farmaciaImage, styles.farmaciaImagePlaceholder]}>
            <MaterialCommunityIcons
              name="hospital-box"
              size={40}
              color="#6b7280"
            />
          </View>
        )}
      </View>

      <View style={styles.farmaciaInfo}>
        <Text style={styles.farmaciaName}>{farmacia.nombre}</Text>
        <View style={styles.statusContainer}>
          {isOpen ? (
            <>
              <View style={styles.openDot} />
              <Text style={styles.statusText}>
                {farmacia.estado === 'abierto24' ? 'Abierto 24 Horas' : `Abierto • ${farmacia.horario}`}
              </Text>
            </>
          ) : (
            <Text style={styles.closedText}>Cerrado • {farmacia.horario}</Text>
          )}
        </View>

        <Pressable
          onPress={isOpen ? handleExplore : undefined}
          style={({ pressed }) => [
            styles.actionButton,
            isOpen ? styles.exploreButton : styles.notifyButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={[
            styles.buttonText,
            isOpen ? styles.exploreButtonText : styles.notifyButtonText
          ]}>
            {isOpen ? 'Ver Detalles' : 'Notificarme'}
          </Text>
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
  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  blurCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    borderRadius: 9999,
  },
  blurCircle1: {
    top: '-25%',
    left: '-25%',
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.5,
  },
  blurCircle2: {
    top: '33%',
    right: '-25%',
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.3,
  },
  blurCircle3: {
    bottom: 0,
    left: '-25%',
    width: width * 0.75,
    height: width * 0.75,
    opacity: 0.4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#f9fafb',
  },
  farmaciasList: {
    paddingHorizontal: 20,
  },
  farmaciaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  farmaciaImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#1a1f1c',
  },
  farmaciaImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmaciaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  farmaciaName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1dc962',
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  closedText: {
    fontSize: 13,
    color: '#ef4444',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  exploreButton: {
    backgroundColor: '#1dc962',
  },
  notifyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exploreButtonText: {
    color: '#111714',
  },
  notifyButtonText: {
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
