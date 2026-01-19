import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useAlertas } from '@/contexts/AlertasContext';
import { Farmacia } from '@/data/mockData';
import AlertToast from '@/components/alert-toast';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { getActiveClientName } = useUser();
  const { allFarmacias } = useFarmacia();
  const { alertas } = useAlertas();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertToast, setShowAlertToast] = useState(false);
  const [toastAlerta, setToastAlerta] = useState<any>(null);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  // Extraer el primer nombre del nombre completo
  const fullName = getActiveClientName();
  const firstName = fullName.split(' ')[0] || 'Usuario';

  // Mostrar notificación de alertas completadas al cargar
  useEffect(() => {
    if (!hasShownAlert && alertas && alertas.length > 0) {
      // Buscar la primera alerta completada
      const completedAlert = alertas.find(
        (alerta) => alerta.estado === 'completada' && alerta.farmaciasDisponibles && alerta.farmaciasDisponibles.length > 0
      );

      if (completedAlert) {
        // Obtener nombres de farmacias
        const farmaciasNames = (completedAlert.farmaciasDisponibles || [])
          .map((f) => f.nombre)
          .join(', ');

        setToastAlerta({
          medicamento: completedAlert.nombreMedicamento,
          farmacias: farmaciasNames
        });
        setShowAlertToast(true);
        setHasShownAlert(true);

        // Auto-ocultar después de 5 segundos
        const timer = setTimeout(() => {
          setShowAlertToast(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Filtrar farmacias según la búsqueda
  const farmaciasFiltradas = allFarmacias.filter((farmacia) =>
    farmacia.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <AlertToast
        visible={showAlertToast}
        medicamento={toastAlerta?.medicamento}
        farmacias={toastAlerta?.farmacias}
        duration={3000}
        onDismiss={() => setShowAlertToast(false)}
      />
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
        {/* Header con nombre y foto */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.profilePicture}>
              <MaterialCommunityIcons name="account" size={32} color="#1dc962" />
            </View>
            <View>
              <Text style={styles.greetingText}>Encuentra lo que necesitas,</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
          </View>
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
            placeholder="Buscar una Farmacia..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Título de sección */}
        <Text style={styles.sectionTitle}>Farmacias Disponibles</Text>

        {/* Lista de farmacias */}
        <View style={styles.farmaciasList}>
          {farmaciasFiltradas.length > 0 ? (
            farmaciasFiltradas.map((farmacia) => (
              <FarmaciaCard key={farmacia.id} farmacia={farmacia} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="folder-open" size={48} color="#6b7280" />
              <Text style={styles.emptyText}>No se encontraron farmacias</Text>
              <Text style={styles.emptySubtext}>Intenta con otro término de búsqueda</Text>
            </View>
          )}
        </View>
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
    <Pressable
      style={({ pressed }) => [
        styles.farmaciaCard,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.cardContent}>
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
              {isOpen ? 'Explorar' : 'Notificarme'}
            </Text>
          </Pressable>
        </View>

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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111714',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(29, 201, 98, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1dc962',
  },
  greetingText: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '400',
  },
  userName: {
    fontSize: 20,
    color: '#f9fafb',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 32,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  farmaciasList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  farmaciaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  farmaciaInfo: {
    flex: 1,
    marginRight: 16,
  },
  farmaciaName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1dc962',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  closedText: {
    fontSize: 14,
    color: '#ef4444',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
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
    fontSize: 15,
    fontWeight: '600',
  },
  exploreButtonText: {
    color: '#111714',
  },
  notifyButtonText: {
    color: '#9ca3af',
  },
  farmaciaImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#1a1f1c',
  },
  imageWrapper: {
    width: 100,
    height: 100,
  },
  farmaciaImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

