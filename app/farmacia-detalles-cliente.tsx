import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
    SafeAreaView,
    TextInput,
    StatusBar,
    Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Producto } from '@/data/mockData';
import { useProducto } from '@/contexts/ProductoContext';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import WebView from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function FarmaciaDetallesClienteScreen() {
    const router = useRouter();
    const { farmaciaEmail } = useLocalSearchParams<{ farmaciaEmail: string }>();
    const { productos } = useProducto();
    const { allFarmacias } = useFarmacia();
    const [farmaciaProducts, setFarmaciaProducts] = useState<Producto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Obtener datos de la farmacia del contexto
    const farmaciaData = allFarmacias.find(f => f.email === farmaciaEmail) || {
        nombre: 'Farmacia',
        dirección: 'Dirección no disponible',
        teléfono: 'No disponible',
        horario: 'Consultar horario',
        estado: 'cerrado',
        latitud: 40.7128,
        longitud: -74.0060,
    };

    useEffect(() => {
        // Filtrar productos de esta farmacia
        if (farmaciaEmail && productos) {
            const filtered = productos.filter(
                (product) => product.emailFarmacia === farmaciaEmail
            );
            setFarmaciaProducts(filtered);
        }
    }, [farmaciaEmail, productos]);

    // Filtrar productos por búsqueda
    const filteredProducts = farmaciaProducts.filter((product) =>
        product.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descripción.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBackPress = () => {
        router.back();
    };

    // Crear HTML para el mapa con Leaflet
    const mapHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
                <style>
                    body { margin: 0; padding: 0; }
                    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
                    .leaflet-control-zoom { background-color: rgba(255, 255, 255, 0.8) !important; }
                    .leaflet-control-zoom a { color: #0d1411 !important; border-color: rgba(0, 0, 0, 0.2) !important; }
                    .leaflet-control-zoom a:hover { background-color: #1dc962 !important; color: white !important; }
                </style>
            </head>
            <body>
                <div id="map"><\/div>
                <script>
                    const map = L.map('map', { zoomControl: true }).setView([${farmaciaData.latitud}, ${farmaciaData.longitud}], 16);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(map);
                    
                    L.marker([${farmaciaData.latitud}, ${farmaciaData.longitud}], {
                        icon: L.icon({
                            iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231dc962"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/><\/svg>',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                        })
                    }).addTo(map)
                        .bindPopup("<b>${farmaciaData.nombre}<\/b><br/>${farmaciaData.dirección}");
                <\/script>
            <\/body>
        <\/html>
    `;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0d1411" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#f9fafb" />
                </Pressable>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{farmaciaData.nombre}</Text>
                    <Text style={styles.headerSubtitle}>Stock de medicamentos</Text>
                </View>
                <Pressable
                    onPress={() => setShowSearch(!showSearch)}
                    style={styles.searchButton}
                >
                    <MaterialCommunityIcons name="magnify" size={24} color="#f9fafb" />
                </Pressable>
            </View>

            {/* Barra de búsqueda opcional */}
            {showSearch && (
                <View style={styles.searchBarContainer}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color="#6b7280"
                        style={styles.searchBarIcon}
                    />
                    <TextInput
                        style={styles.searchBarInput}
                        placeholder="Buscar medicamentos..."
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <Pressable
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
                        </Pressable>
                    )}
                </View>
            )}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Mapa con Leaflet */}
                <View style={styles.mapContainer}>
                    <WebView
                        source={{ html: mapHtml }}
                        style={{ flex: 1 }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    />
                    {/* Botón para abrir en Google Maps - Overlay */}
                    <Pressable
                        onPress={() => {
                            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${farmaciaData.latitud},${farmaciaData.longitud}`;
                            Linking.openURL(googleMapsUrl).catch(err => {
                                console.warn('No se pudo abrir Google Maps:', err);
                            });
                        }}
                        style={styles.googleMapsButtonFloating}
                    >
                        <MaterialCommunityIcons name="map-search" size={18} color="#1f2937" />
                        <Text style={styles.googleMapsButtonTextFloating}>Google Maps</Text>
                    </Pressable>
                </View>

                {/* Información de la farmacia */}
                <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="phone" size={20} color="#1dc962" />
                        <Text style={styles.infoText}>{farmaciaData.teléfono}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="clock" size={20} color="#1dc962" />
                        <Text style={styles.infoText}>{farmaciaData.horario}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#1dc962" />
                        <Text style={[styles.infoText, styles.openStatus]}>
                            {farmaciaData.estado === 'abierto' ? 'Abierto' : 'Cerrado'}
                        </Text>
                    </View>
                </View>

                {/* Medicamentos disponibles */}
                <View style={styles.productsSection}>
                    <Text style={styles.sectionTitle}>Medicamentos Disponibles</Text>

                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((producto) => (
                            <ProductCard
                                key={producto.id}
                                producto={producto}
                                farmaciaEmail={farmaciaEmail}
                                farmaciaPhone={farmaciaData.teléfono}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="package-variant" size={48} color="#6b7280" />
                            <Text style={styles.emptyText}>
                                {searchQuery.length > 0 ? 'No se encontraron medicamentos' : 'No hay medicamentos disponibles'}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

interface ProductCardProps {
    producto: Producto;
    farmaciaEmail?: string;
    farmaciaPhone?: string;
}

function ProductCard({ producto, farmaciaEmail, farmaciaPhone }: ProductCardProps) {
    const router = useRouter();
    const isAvailable = producto.cantidad > 0;

    const handleVerDetalles = () => {
        router.push({
            pathname: '/medicamento-detalles',
            params: {
                productoId: producto.id,
                farmaciaEmail: farmaciaEmail || '',
                farmaciaPhone: farmaciaPhone || '',
            },
        });
    };

    return (
        <View style={styles.productCard}>
            {/* Foto del producto */}
            <View style={styles.productImageWrapper}>
                {producto.urlFoto ? (
                    <Image
                        source={{ uri: producto.urlFoto }}
                        style={styles.productImage}
                    />
                ) : (
                    <View style={[styles.productImage, styles.productImagePlaceholder]}>
                        <MaterialCommunityIcons name="package-variant" size={35} color="#6b7280" />
                    </View>
                )}
            </View>

            {/* Info del producto */}
            <View style={styles.productInfoContainer}>
                <Text style={styles.productName}>{producto.nombreProducto}</Text>
                <Text style={styles.productDescription}>{producto.descripción}</Text>

                <View style={styles.priceAndStockRow}>
                    <View style={styles.priceSection}>
                        <Text style={styles.priceLabel}>Precio</Text>
                        <Text style={styles.priceText}>${producto.precio.toFixed(2)}</Text>
                    </View>

                    <View style={styles.stockSection}>
                        <Text style={styles.stockLabel}>Disponibles</Text>
                        <Text style={[styles.stockNumber, isAvailable ? styles.stockAvailable : styles.stockUnavailable]}>
                            {producto.cantidad} uds.
                        </Text>
                    </View>

                    <Pressable
                        style={[
                            styles.statusBadge,
                            isAvailable ? styles.badgeAvailable : styles.badgeUnavailable,
                        ]}
                    >
                        <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
                            {isAvailable ? 'Disponible' : 'No Disponible'}
                        </Text>
                    </Pressable>
                </View>

                {/* Botón Ver Detalles */}
                <Pressable
                    onPress={handleVerDetalles}
                    style={styles.verDetallesButton}
                >
                    <Text style={styles.verDetallesButtonText}>Ver detalles</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1411',
        paddingTop: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#9ca3af',
        marginTop: 2,
    },
    searchButton: {
        padding: 8,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchBarIcon: {
        marginRight: 4,
    },
    searchBarInput: {
        flex: 1,
        fontSize: 16,
        color: '#f9fafb',
        paddingVertical: 8,
    },
    clearButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    mapContainer: {
        height: 300,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(29, 201, 98, 0.2)',
    },
    googleMapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1dc962',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    googleMapsButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    googleMapsButtonFloating: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    googleMapsButtonTextFloating: {
        color: '#1f2937',
        fontSize: 12,
        fontWeight: '600',
    },
    infoSection: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#e5e7eb',
        flex: 1,
    },
    openStatus: {
        fontWeight: '600',
        color: '#1dc962',
    },
    productsSection: {
        paddingHorizontal: 16,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 8,
    },
    productCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 12,
    },
    productImageWrapper: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#1a1f1c',
    },
    productImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfoContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 12,
    },
    priceAndStockRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 8,
    },
    priceSection: {
        flex: 0.4,
    },
    priceLabel: {
        fontSize: 11,
        color: '#9ca3af',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f9fafb',
    },
    stockSection: {
        flex: 0.4,
    },
    stockLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 4,
    },
    stockNumber: {
        fontSize: 16,
        fontWeight: '700',
    },
    stockAvailable: {
        color: '#f9fafb',
    },
    stockUnavailable: {
        color: '#ef4444',
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 0.4,
    },
    badgeAvailable: {
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
    },
    badgeUnavailable: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    badgeTextAvailable: {
        color: '#1dc962',
    },
    badgeTextUnavailable: {
        color: '#ef4444',
    },
    verDetallesButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1dc962',
        alignItems: 'center',
    },
    verDetallesButtonText: {
        color: '#1dc962',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#9ca3af',
    },
});
