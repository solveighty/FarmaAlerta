import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleCreateAccount = () => {
    // Navegar a la pantalla de registro
    router.push('register' as any);
  };

  const handleLogin = () => {
    // Navegar al login
    router.push('login' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* SVG Background con círculos difuminados radiales */}
      <Svg 
        height={height} 
        width={width} 
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* Gradiente radial para círculo superior izquierdo */}
          <RadialGradient id="blurTopLeft" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.35" />
            <Stop offset="30%" stopColor="#1dc962" stopOpacity="0.25" />
            <Stop offset="60%" stopColor="#1dc962" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
          
          {/* Gradiente radial para círculo inferior derecho */}
          <RadialGradient id="blurBottomRight" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#1dc962" stopOpacity="0.4" />
            <Stop offset="30%" stopColor="#1dc962" stopOpacity="0.3" />
            <Stop offset="60%" stopColor="#1dc962" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#1dc962" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Círculo superior izquierdo difuminado */}
        <Circle
          cx={-width * 0.15}
          cy={height * 0.12}
          r={Math.min(width * 0.65, 400)}
          fill="url(#blurTopLeft)"
        />
        
        {/* Círculo inferior derecho difuminado */}
        <Circle
          cx={width * 1.15}
          cy={height * 0.92}
          r={Math.min(width * 0.75, 450)}
          fill="url(#blurBottomRight)"
        />
      </Svg>
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Center content */}
        <View style={styles.centerContent}>
          {/* Logo Icon */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shield-plus" size={48} color="#1dc962" />
          </View>

          {/* Welcome Text */}
          <Text style={styles.title}>Bienvenido a FarmaAlerta.</Text>
          <Text style={styles.subtitle}>
            La forma más sencilla de encontrar los medicamentos que necesitas o gestionar el inventario de tu farmacia. Todo en un solo lugar.
          </Text>
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.createAccountButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createAccountText}>Crear Cuenta</Text>
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginQuestion}>¿Ya tienes una cuenta? </Text>
            <Pressable onPress={handleLogin}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111714',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(29, 201, 98, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    maxWidth: 400,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    paddingTop: 12,
    maxWidth: 384,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    width: '100%',
    paddingTop: 12,
  },
  createAccountButton: {
    backgroundColor: '#1dc962',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginBottom: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  createAccountText: {
    color: '#111714',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginQuestion: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  loginLink: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
});
