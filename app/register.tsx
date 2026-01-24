import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useUser } from '@/contexts/UserContext';
import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const { registerCliente } = useUser();
  const alert = useCustomAlert();

  // Estados para Cliente
  const [nombreCliente, setNombreCliente] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombreCliente.trim()) {
      alert.show({
        title: 'Error',
        message: 'Por favor ingresa tu nombre completo',
        type: 'error',
        buttons: [{ text: 'OK' }]
      });
      return;
    }

    setLoading(true);
    const result = await registerCliente(nombreCliente.trim());
    setLoading(false);

    if (result.success) {
      console.log('Registrando:', nombreCliente);
      router.push('/(tabs)');
    } else {
      alert.show({
        title: 'Error',
        message: result.error || 'Error al registrar',
        type: 'error',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const handleLogin = () => {
    router.push('login' as any);
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

          <Text style={styles.title}>Crea tu Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para empezar a usar FarmaAlerta</Text>
        </View>

        {/* Formulario Cliente */}
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

        {/* Botón Crear Cuenta */}
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleRegister}
        >
          <Text style={styles.createButtonText}>Crear Cuenta</Text>
        </Pressable>

        {/* Login link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginQuestion}>¿Ya tienes una cuenta? </Text>
          <Pressable onPress={handleLogin}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        buttons={alert.buttons}
        onDismiss={alert.hide}
      />
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
    borderRadius: 32,
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
  createButton: {
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
  createButtonText: {
    color: '#111714',
    fontSize: 16,
    fontWeight: '700',
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
  },
  loginLink: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '700',
  },
});
