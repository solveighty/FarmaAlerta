import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    Dimensions,
    Image,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useProducto } from '@/contexts/ProductoContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { Stack } from 'expo-router';
import { getStockColor } from '@/utils/stockColors';

const { width, height } = Dimensions.get('window');

export default function FarmaciaStockScreen() {
    const { activeFarmacia } = useFarmacia();
    const { getProductosByFarmacia, productos, reloadProductos } = useProducto();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Recargar productos cuando la pantalla se enfoca
    useFocusEffect(
        React.useCallback(() => {
            reloadProductos();
        }, [])
    );

    // Obtener productos de la farmacia activa
    const productosDelaFarmacia = activeFarmacia
        ? getProductosByFarmacia(activeFarmacia.email)
        : [];

    const filteredProducts = productosDelaFarmacia.filter(producto =>
        producto.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (product: any) => {
        setOpenMenuId(null);
        router.push({
            pathname: '/edit-producto',
            params: {
                id: product.id,
                producto: JSON.stringify(product),
            },
        });
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Gestión de Stock</Text>
                    <Pressable
                        style={styles.addButton}
                        onPress={() => router.push('/add-producto' as any)}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#111714" />
                    </Pressable>
                </View>

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar medicamento..."
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Lista de productos */}
                <View style={styles.productsList}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <View key={product.id}>
                                <View style={styles.productCard}>
                                    {/* Foto del producto - lado izquierdo */}
                                    <View style={styles.productImageWrapper}>
                                        {product.urlFoto ? (
                                            <Image
                                                source={{ uri: product.urlFoto }}
                                                style={styles.productImage}
                                            />
                                        ) : (
                                            <View style={[styles.productImage, styles.productImagePlaceholder]}>
                                                <MaterialCommunityIcons name="package-variant" size={35} color="#6b7280" />
                                            </View>
                                        )}
                                    </View>

                                    {/* Info del producto - centro */}
                                    <View style={styles.productInfoContainer}>
                                        <Text style={styles.productName}>{product.nombreProducto}</Text>
                                        <Text style={styles.productDescription}>{product.descripción}</Text>

                                        <View style={styles.productStats}>
                                            <Text style={styles.productStock}>
                                                Stock: <Text style={[styles.productStockValue, { color: getStockColor(product.cantidad) }]}>{product.cantidad}</Text>
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Precio y botón - lado derecho */}
                                    <View
                                        style={styles.productRightSection}
                                    >
                                        <Pressable
                                            style={styles.productMenu}
                                            onPress={() => setOpenMenuId(openMenuId === product.id ? null : (product.id || null))}
                                        >
                                            <MaterialCommunityIcons name="dots-vertical" size={18} color="#6b7280" />
                                        </Pressable>

                                        <Text style={styles.productPrice}>${product.precio.toFixed(2)}</Text>
                                        <Pressable
                                            style={styles.detailsButton}
                                            onPress={() => {
                                                console.log('🔍 Toque en Ver más:', product);
                                                setOpenMenuId(null);
                                                router.push({
                                                    pathname: '/producto-detalles' as any,
                                                    params: {
                                                        producto: JSON.stringify(product),
                                                    },
                                                } as any);
                                            }}
                                        >
                                            <Text style={styles.detailsButtonText}>Ver más</Text>
                                        </Pressable>
                                    </View>

                                    {/* Menú desplegable - FUERA para no bloquear eventos */}
                                    {product.id && openMenuId === product.id && (
                                        <View style={styles.contextMenu} pointerEvents="auto">
                                            <Pressable
                                                style={styles.menuItem}
                                                onPress={() => handleEdit(product)}
                                            >
                                                <MaterialCommunityIcons name="pencil" size={18} color="#1dc962" />
                                                <Text style={styles.menuItemText}>Editar</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.menuItem, styles.menuItemDelete]}
                                                onPress={() => {
                                                    setOpenMenuId(null);
                                                    router.push({
                                                        pathname: '/edit-producto',
                                                        params: {
                                                            id: product.id,
                                                            producto: JSON.stringify(product),
                                                            delete: 'true',
                                                        },
                                                    });
                                                }}
                                            >
                                                <MaterialCommunityIcons name="trash-can" size={18} color="#ef4444" />
                                                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Eliminar</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="package-variant" size={64} color="#6b7280" />
                            <Text style={styles.emptyText}>Sin productos registrados</Text>
                            <Text style={styles.emptySubtext}>Agrega productos desde el botón +</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Barra de navegación */}
            <View style={styles.navbar}>
                <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-dashboard' as any)}>
                    <MaterialCommunityIcons name="home" size={24} color="#6b7280" />
                    <Text style={[styles.navLabel, { color: '#6b7280' }]}>Inicio</Text>
                </Pressable>

                <Pressable style={styles.navItem}>
                    <MaterialCommunityIcons name="package-variant" size={24} color="#1dc962" />
                    <Text style={styles.navLabel}>Stock</Text>
                </Pressable>

                <Pressable style={styles.navItem} onPress={() => router.push('/farmacia-perfil' as any)}>
                    <MaterialCommunityIcons name="account" size={24} color="#6b7280" />
                    <Text style={[styles.navLabel, { color: '#6b7280' }]}>Perfil</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f9fafb',
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1dc962',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#f9fafb',
    },
    productsList: {
        gap: 12,
    },
    productCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 12,
        minHeight: 110,
        position: 'relative',
    },
    productImageWrapper: {
        width: 80,
        height: 80,
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
        justifyContent: 'flex-start',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f9fafb',
        marginBottom: 2,
    },
    productDescription: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 8,
    },
    productStats: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    productStock: {
        fontSize: 12,
        color: '#9ca3af',
    },
    productStockValue: {
        color: '#1dc962',
        fontWeight: '600',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 6,
    },
    detailsButton: {
        backgroundColor: '#1dc962',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 36,
        justifyContent: 'center',
    },
    detailsButtonText: {
        color: '#111714',
        fontSize: 11,
        fontWeight: '600',
    },
    productMenu: {
        padding: 4,
        marginTop: 4,
    },
    contextMenu: {
        position: 'absolute',
        top: 45,
        right: 12,
        backgroundColor: 'rgba(13, 20, 17, 0.9)',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(29, 201, 98, 0.4)',
        paddingVertical: 8,
        minWidth: 140,
        zIndex: 1001,
        shadowColor: '#1dc962',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        pointerEvents: 'auto',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    menuItemDelete: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    menuItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1dc962',
    },
    productRightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flex: 1,
        paddingStart: 12,
        position: 'relative',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f9fafb',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#9ca3af',
        textAlign: 'center',
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
