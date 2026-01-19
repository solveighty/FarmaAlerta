import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { Stack } from 'expo-router';
import { useImageUpload } from '@/hooks/useImageUpload';

const { width, height } = Dimensions.get('window');

export default function FarmaciaPerfilScreen() {
    const { activeFarmacia, logoutFarmacia, updateFarmaciaPhoto } = useFarmacia();
    const router = useRouter();
    const { pickImage, loading } = useImageUpload();
    const [photoUpdating, setPhotoUpdating] = useState(false);
    const [avatarHovered, setAvatarHovered] = useState(false);

    const handleUpdatePhoto = async () => {
        try {
            const result = await pickImage();
            if (result && result.uri) {
                setPhotoUpdating(true);
                // Aquí se llama la función para actualizar la foto en Google Sheets
                await updateFarmaciaPhoto(result.uri);
                setPhotoUpdating(false);
            }
        } catch (error) {
            console.error('Error al actualizar foto:', error);
            setPhotoUpdating(false);
        }
    };

    const handleLogout = async () => {
        await logoutFarmacia();
        router.push('/login' as any);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            {/* Círculos difuminados de fondo */}
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
                </Defs>
                <Circle cx={width * -0.1} cy={height * -0.1} r={width * 0.4} fill="url(#blurGradient1)" />
                <Circle cx={width * 1.15} cy={height * 0.6} r={width * 0.35} fill="url(#blurGradient2)" />
            </Svg>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Perfil</Text>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Pressable
                        style={styles.avatar}
                        onPress={handleUpdatePhoto}
                        onPressIn={() => setAvatarHovered(true)}
                        onPressOut={() => setAvatarHovered(false)}
                    >
                        {activeFarmacia?.urlFoto ? (
                            <Image
                                source={{ uri: activeFarmacia.urlFoto }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <MaterialCommunityIcons name="hospital-box" size={60} color="#1dc962" />
                        )}
                        {avatarHovered && (
                            <View style={styles.avatarOverlay}>
                                <MaterialCommunityIcons name="camera" size={32} color="#ffffff" />
                                <Text style={styles.overlayText}>Update Profile{'\n'}Picture</Text>
                            </View>
                        )}
                    </Pressable>
                </View>

                {/* Nombre de la farmacia */}
                <Text style={styles.farmaciaName}>{activeFarmacia?.nombre}</Text>

                {/* Información de la farmacia */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>INFORMACIÓN DE LA FARMACIA</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="store" size={24} color="#9ca3af" />
                            <Text style={styles.infoText}>{activeFarmacia?.nombre}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="map-marker" size={24} color="#9ca3af" />
                            <Text style={styles.infoText}>{activeFarmacia?.dirección}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="phone" size={24} color="#9ca3af" />
                            <Text style={styles.infoText}>{activeFarmacia?.teléfono}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="email" size={24} color="#9ca3af" />
                            <Text style={styles.infoText}>{activeFarmacia?.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Botón Cerrar Sesión */}
                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed
                    ]}
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </Pressable>

                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Barra de navegación */}
            <View style={styles.navbar}>
                <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-dashboard' as any)}>
                    <MaterialCommunityIcons name="home" size={24} color="#6b7280" />
                    <Text style={[styles.navLabel, { color: '#6b7280' }]}>Inicio</Text>
                </Pressable>

                <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-stock' as any)}>
                    <MaterialCommunityIcons name="package-variant" size={24} color="#6b7280" />
                    <Text style={[styles.navLabel, { color: '#6b7280' }]}>Stock</Text>
                </Pressable>

                <Pressable style={styles.navItem}>
                    <MaterialCommunityIcons name="account" size={24} color="#1dc962" />
                    <Text style={styles.navLabel}>Perfil</Text>
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
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
    farmaciaName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f9fafb',
        textAlign: 'center',
        marginBottom: 32,
    },
    infoSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#f9fafb',
    },
    infoDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    editButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    editProfileButton: {
        backgroundColor: 'rgba(29, 201, 98, 0.1)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(29, 201, 98, 0.3)',
    },
    editButtonText: {
        color: '#1dc962',
        fontWeight: '600',
        fontSize: 14,
    },
    accountSection: {
        marginBottom: 32,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    accountItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accountItemText: {
        fontSize: 14,
        color: '#f9fafb',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        marginBottom: 24,
    },
    logoutButtonPressed: {
        opacity: 0.7,
    },
    logoutButtonText: {
        color: '#ef4444',
        fontWeight: '600',
        fontSize: 15,
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
