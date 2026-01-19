import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const { getActiveClientName, logoutCliente } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutCliente();
        router.replace('/welcome' as any);
    };

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
                {/* Header con foto de perfil */}
                <View style={styles.header}>
                    <View style={styles.profilePicture}>
                        <MaterialCommunityIcons name="account" size={48} color="#1dc962" />
                    </View>
                    <Text style={styles.userName}>{getActiveClientName()}</Text>
                    <Text style={styles.userEmail}>Cliente FarmaAlerta</Text>
                </View>

                {/* Botón cerrar sesión */}
                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </Pressable>
            </ScrollView>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1dc962',
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#9ca3af',
    },
    optionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    optionText: {
        fontSize: 16,
        color: '#f9fafb',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});
