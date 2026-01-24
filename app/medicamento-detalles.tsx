import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    SafeAreaView,
    StatusBar,
    Linking,
    Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducto } from '@/contexts/ProductoContext';
import { useHapticAnimation } from '@/hooks/useHapticAnimation';

export default function MedicamentoDetallesScreen() {
    const router = useRouter();
    const { scaleAnim, triggerHapticAnimation } = useHapticAnimation();
    const { productoId, farmaciaEmail, farmaciaPhone } = useLocalSearchParams<{
        productoId: string;
        farmaciaEmail: string;
        farmaciaPhone: string;
    }>();
    const { productos } = useProducto();

    // Buscar el producto
    const producto = productos?.find(p => p.id === productoId);
    const isAvailable = producto?.cantidad && producto.cantidad > 0;

    if (!producto) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0d1411" />
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="chevron-left" size={28} color="#f9fafb" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Medicamento</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Medicamento no encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleContactarFarmacia = () => {
        if (farmaciaPhone) {
            const phoneUrl = `tel:${farmaciaPhone}`;
            Linking.openURL(phoneUrl).catch(err => {
                console.warn('No se pudo abrir la aplicación de llamadas:', err);
            });
        }
    };

    const handleCrearAlerta = () => {
        if (!producto || !productoId) return;
        router.push({
            pathname: '/(modal)',
            params: {
                productoId: String(productoId),
                nombreMedicamento: producto.nombreProducto,
                urlFoto: producto.urlFoto || '',
                farmaciaEmail: farmaciaEmail || '',
            },
        } as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0d1411" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#f9fafb" />
                </Pressable>
                <Text style={styles.headerTitle}>Detalles del Medicamento</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Foto grande con efecto de escala */}
                <View style={styles.imageContainer}>
                    {producto.urlFoto ? (
                        <Animated.Image
                            source={{ uri: producto.urlFoto }}
                            style={[styles.productImage, { transform: [{ scale: scaleAnim }] }]}
                        />
                    ) : (
                        <View style={[styles.productImage, styles.imagePlaceholder]}>
                            <MaterialCommunityIcons name="pill" size={80} color="#1dc962" />
                        </View>
                    )}
                </View>

                {/* Información del medicamento */}
                <View style={styles.infoContainer}>
                    {/* Nombre */}
                    <Text style={styles.productName}>{producto.nombreProducto}</Text>

                    {/* Descripción */}
                    <Text style={styles.description}>{producto.descripción}</Text>

                    {/* Precio y stock */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Precio</Text>
                            <Text style={styles.statValue}>${producto.precio.toFixed(2)}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Disponibles</Text>
                            <Text style={[styles.statValue, isAvailable ? styles.textGreen : styles.textRed]}>
                                {producto.cantidad} uds.
                            </Text>
                        </View>
                    </View>

                    {/* Estado */}
                    <View style={[styles.statusBadge, isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
                        <MaterialCommunityIcons
                            name={isAvailable ? 'check-circle' : 'close-circle'}
                            size={20}
                            color={isAvailable ? '#1dc962' : '#ef4444'}
                        />
                        <Text style={[styles.statusText, isAvailable ? styles.statusAvailable : styles.statusUnavailable]}>
                            {isAvailable ? 'Disponible' : 'No Disponible'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.buttonsContainer}>
                {isAvailable ? (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            style={styles.contactarButton}
                            onPress={() => {
                                triggerHapticAnimation('medium');
                                handleContactarFarmacia();
                            }}
                        >
                            <MaterialCommunityIcons name="phone" size={20} color="#000000" />
                            <Text style={styles.contactarButtonText}>Contactar Farmacia</Text>
                        </Pressable>
                    </Animated.View>
                ) : (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            style={styles.alertaButton}
                            onPress={() => {
                                triggerHapticAnimation('light');
                                handleCrearAlerta();
                            }}
                        >
                            <MaterialCommunityIcons name="bell" size={20} color="#ffffff" />
                            <Text style={styles.alertaButtonText}>Crear Alerta</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1411',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
    },
    content: {
        flex: 1,
        paddingBottom: 120,
    },
    imageContainer: {
        height: 350,
        backgroundColor: 'rgba(29, 201, 98, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    productName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f9fafb',
    },
    description: {
        fontSize: 14,
        color: '#d1d5db',
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
    },
    textGreen: {
        color: '#f9fafb',
    },
    textRed: {
        color: '#ef4444',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeAvailable: {
        backgroundColor: 'rgba(29, 201, 98, 0.1)',
        borderColor: 'rgba(29, 201, 98, 0.3)',
    },
    badgeUnavailable: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusAvailable: {
        color: '#1dc962',
    },
    statusUnavailable: {
        color: '#ef4444',
    },
    detailsSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    detailText: {
        flex: 1,
        fontSize: 14,
        color: '#d1d5db',
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#9ca3af',
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#0d1411',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    contactarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1dc962',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    contactarButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },
    alertaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#ef4444',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    alertaButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
