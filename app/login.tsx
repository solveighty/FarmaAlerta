import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useUser } from '@/contexts/UserContext';
import { useFarmacia } from '@/contexts/FarmaciaContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { allClientes, setActiveClient } = useUser();
  const { loginFarmacia } = useFarmacia();
  const [selectedTab, setSelectedTab] = useState<'cliente' | 'farmacia'>('cliente');
  const [showPassword, setShowPassword] = useState(false);

  // Estados para Cliente
  const [nombreCliente, setNombreCliente] = useState('');

  // Estados para Farmacia
  const [emailFarmacia, setEmailFarmacia] = useState('');
  const [contrasenaFarmacia, setContrasenaFarmacia] = useState('');

  const handleLoginCliente = async () => {
    if (!nombreCliente.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    // Buscar el cliente en la lista registrada
    const cliente = allClientes.find(
      c => c.nombre.toLowerCase().trim() === nombreCliente.toLowerCase().trim()
    );

    if (cliente) {
      // Activar el cliente
      await setActiveClient(cliente.id);
      console.log('Iniciando sesión como:', cliente.nombre);
      router.push('/(tabs)');
    } else {
      Alert.alert('Error', 'Cliente no registrado. Por favor regístrate primero');
    }
  };

  const handleLoginFarmacia = async () => {
    if (!emailFarmacia.trim() || !contrasenaFarmacia.trim()) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    const result = await loginFarmacia(emailFarmacia.trim(), contrasenaFarmacia.trim());

    if (result.success) {
      console.log('Iniciando sesión como farmacia');
      router.push('/farmacia-dashboard' as any);
    } else {
      Alert.alert('Error', result.error || 'Email o contraseña incorrectos');
    }
  };

  const handleRegister = () => {
    router.push('register' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* SVG Background con círculos difuminados */}
      <Svg
        height={height}
        width={width}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient id="blurTop" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.3" />
            <Stop offset="40%" stopColor="#1dc962" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle
          cx={width * 0.5}
          cy={height * 0.05}
          r={Math.min(width * 0.5, 300)}
          fill="url(#blurTop)"
        />
      </Svg>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con ícono */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="plus-circle" size={32} color="#1dc962" />
          </View>

          <Text style={styles.title}>Bienvenido de Vuelta</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta de FarmaAlerta</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, selectedTab === 'cliente' && styles.tabActive]}
            onPress={() => setSelectedTab('cliente')}
          >
            <Text style={[styles.tabText, selectedTab === 'cliente' && styles.tabTextActive]}>
              Cliente
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, selectedTab === 'farmacia' && styles.tabActive]}
            onPress={() => setSelectedTab('farmacia')}
          >
            <Text style={[styles.tabText, selectedTab === 'farmacia' && styles.tabTextActive]}>
              Farmacia
            </Text>
          </Pressable>
        </View>

        {/* Formulario Cliente */}
        {selectedTab === 'cliente' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tus nombres"
                placeholderTextColor="#6b7280"
                value={nombreCliente}
                onChangeText={setNombreCliente}
              />
            </View>
          </View>
        )}

        {/* Formulario Farmacia */}
        {selectedTab === 'farmacia' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailFarmacia}
                onChangeText={setEmailFarmacia}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                  value={contrasenaFarmacia}
                  onChangeText={setContrasenaFarmacia}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Botón Iniciar Sesión */}
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.buttonPressed
          ]}
          onPress={selectedTab === 'cliente' ? handleLoginCliente : handleLoginFarmacia}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </Pressable>

        {/* Register link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerQuestion}>¿No tienes una cuenta? </Text>
          <Pressable onPress={handleRegister}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111714',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(29, 201, 98, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(29, 201, 98, 0.08)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(29, 201, 98, 0.25)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f9fafb',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#f9fafb',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#f9fafb',
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loginButton: {
    backgroundColor: '#1dc962',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: '#111714',
    fontSize: 16,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerQuestion: {
    color: '#9ca3af',
    fontSize: 14,
  },
  registerLink: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '700',
  },
});
