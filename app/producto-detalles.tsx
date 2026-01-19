import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { getStockColor } from '@/utils/stockColors';

const { width, height } = Dimensions.get('window');

export default function ProductoDetallesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [producto, setProducto] = useState<any>(null);

    useEffect(() => {
        if (params.producto) {
            try {
                const parsedProducto = JSON.parse(params.producto as string);
                setProducto(parsedProducto);
            } catch (error) {
                console.error('Error parsing producto:', error);
            }
        }
    }, [params.producto]);

    if (!producto) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    const isDisponible = producto.cantidad > 0;
    const disponibilidadColor = isDisponible ? '#1dc962' : '#ef4444';
    const disponibilidadText = isDisponible ? 'Disponible' : 'No Disponible';
    const disponibilidadIcon = isDisponible ? 'check-circle' : 'close-circle';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header con botón atrás */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <MaterialCommunityIcons name="chevron-left" size={28} color="#f9fafb" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Detalles del Medicamento</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Foto del medicamento grande */}
                <View style={styles.photoContainer}>
                    {producto.urlFoto ? (
                        <Image
                            source={{ uri: producto.urlFoto }}
                            style={styles.productPhoto}
                        />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <MaterialCommunityIcons name="package-variant" size={80} color="#6b7280" />
                        </View>
                    )}
                </View>

                {/* Información del producto */}
                <View style={styles.infoContainer}>
                    {/* Nombre */}
                    <Text style={styles.productName}>{producto.nombreProducto}</Text>

                    {/* Descripción */}
                    <Text style={styles.productDescription}>{producto.descripción}</Text>

                    {/* Stats - Stock y Precio */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Stock</Text>
                            <Text style={[styles.statValue, { color: getStockColor(producto.cantidad) }]}>
                                {producto.cantidad} uds.
                            </Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Precio</Text>
                            <Text style={styles.statValue}>${producto.precio.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Categoría */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>Categoría</Text>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{producto.categoría}</Text>
                        </View>
                    </View>

                    {/* Fecha de caducidad */}
                    {producto.fechaCaducidad && (
                        <View style={styles.expiryContainer}>
                            <MaterialCommunityIcons name="calendar" size={18} color="#9ca3af" />
                            <View style={styles.expiryTextContainer}>
                                <Text style={styles.expiryLabel}>Fecha de Caducidad</Text>
                                <Text style={styles.expiryDate}>{producto.fechaCaducidad}</Text>
                            </View>
                        </View>
                    )}

                    {/* Estado de disponibilidad */}
                    <Pressable
                        style={[
                            styles.disponibilidadButton,
                            { backgroundColor: isDisponible ? 'rgba(29, 201, 98, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={disponibilidadIcon}
                            size={20}
                            color={disponibilidadColor}
                        />
                        <Text style={[styles.disponibilidadText, { color: disponibilidadColor }]}>
                            {disponibilidadText}
                        </Text>
                    </Pressable>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
    },
    photoContainer: {
        width: '100%',
        height: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    productPhoto: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1f1c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 32,
        gap: 24,
    },
    productName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#f9fafb',
        lineHeight: 36,
    },
    productDescription: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 8,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
    },
    categoryContainer: {
        gap: 12,
    },
    categoryLabel: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    categoryBadge: {
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(29, 201, 98, 0.3)',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1dc962',
    },
    expiryContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    expiryTextContainer: {
        flex: 1,
        gap: 4,
    },
    expiryLabel: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    expiryDate: {
        fontSize: 14,
        color: '#f9fafb',
        fontWeight: '600',
    },
    disponibilidadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
    },
    disponibilidadText: {
        fontSize: 16,
        fontWeight: '700',
    },
    loadingText: {
        color: '#f9fafb',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },
});
