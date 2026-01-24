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
    ActivityIndicator,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useProducto } from '@/contexts/ProductoContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

const categorias = ['Analgésicos', 'Antiinflamatorios', 'Antibióticos', 'Vitaminas', 'Otros'];

export default function EditProductoScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { activeFarmacia } = useFarmacia();
    const { editarProducto, eliminarProducto } = useProducto();
    const { selectAndUpload, loading: imageLoading } = useImageUpload();
    const alert = useCustomAlert();

    const [nombreProducto, setNombreProducto] = useState('');
    const [descripción, setDescripción] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoría, setCategoría] = useState('Analgésicos');
    const [fechaCaducidad, setFechaCaducidad] = useState('');
    const [urlFoto, setUrlFoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        // Cargar datos del producto
        if (params.producto) {
            try {
                const producto = JSON.parse(params.producto as string);
                setNombreProducto(producto.nombreProducto);
                setDescripción(producto.descripción);
                setPrecio(producto.precio.toString());
                setCantidad(producto.cantidad.toString());
                setCategoría(producto.categoría);
                setFechaCaducidad(producto.fechaCaducidad);
                setUrlFoto(producto.urlFoto);

                // Si viene con parámetro delete, mostrar modal
                if (params.delete === 'true') {
                    setDeleteModalVisible(true);
                }
            } catch (error) {
                console.error('Error parsing producto:', error);
            }
        }
    }, [params.producto, params.delete]);

    const handleSelectImage = async () => {
        const url = await selectAndUpload();
        if (url) {
            setUrlFoto(url);
            alert.show({
                title: 'Éxito',
                message: 'Imagen subida correctamente',
                type: 'success',
                buttons: [{ text: 'OK' }]
            });
        } else {
            alert.show({
                title: 'Error',
                message: 'No se pudo subir la imagen',
                type: 'error',
                buttons: [{ text: 'OK' }]
            });
        }
    };

    const handleEditProducto = async () => {
        if (!nombreProducto.trim() || !descripción.trim() || !precio || !cantidad || !fechaCaducidad) {
            alert.show({
                title: 'Error',
                message: 'Por favor completa todos los campos',
                type: 'error',
                buttons: [{ text: 'OK' }]
            });
            return;
        }

        if (isNaN(parseFloat(precio)) || isNaN(parseInt(cantidad))) {
            alert.show({
                title: 'Error',
                message: 'Precio y cantidad deben ser números válidos',
                type: 'error',
                buttons: [{ text: 'OK' }]
            });
            return;
        }

        setLoading(true);

        const result = await editarProducto({
            id: params.id as string,
            nombreProducto: nombreProducto.trim(),
            descripción: descripción.trim(),
            precio: parseFloat(precio),
            cantidad: parseInt(cantidad),
            categoría,
            fechaCaducidad,
            emailFarmacia: activeFarmacia?.email || '',
            urlFoto: urlFoto || undefined,
        });

        setLoading(false);

        if (result.success) {
            alert.show({
                title: 'Éxito',
                message: 'Producto actualizado correctamente',
                type: 'success',
                buttons: [{ text: 'OK', onPress: () => router.back() }]
            });
        } else {
            alert.show({
                title: 'Error',
                message: result.error || 'Error al actualizar producto',
                type: 'error',
                buttons: [{ text: 'OK' }]
            });
        }
    };

    const handleDeleteProducto = async () => {
        setDeleteModalVisible(false);
        setLoading(true);

        const result = await eliminarProducto(
            params.id as string,
            activeFarmacia?.email,
            nombreProducto
        );

        setLoading(false);

        if (result.success) {
            alert.show({
                title: 'Éxito',
                message: 'Producto eliminado correctamente',
                type: 'success',
                buttons: [{ text: 'OK', onPress: () => router.back() }]
            });
        } else {
            alert.show({
                title: 'Error',
                message: result.error || 'Error al eliminar producto',
                type: 'error',
                buttons: [{ text: 'OK' }]
            });
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            {/* Círculos difuminados de fondo */}
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
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
                    <Pressable onPress={() => router.back()}>
                        <MaterialCommunityIcons name="chevron-left" size={28} color="#f9fafb" />
                    </Pressable>
                    <Text style={styles.title}>Editar Producto</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Foto del producto */}
                <Pressable style={styles.photoSection} onPress={handleSelectImage}>
                    {urlFoto ? (
                        <Image source={{ uri: urlFoto }} style={styles.productPhoto} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <MaterialCommunityIcons name="camera-plus" size={48} color="#1dc962" />
                        </View>
                    )}
                </Pressable>

                {/* Formulario */}
                <View style={styles.formContainer}>
                    {/* Nombre Producto */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre del Producto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Paracetamol 500mg"
                            placeholderTextColor="#6b7280"
                            value={nombreProducto}
                            onChangeText={setNombreProducto}
                        />
                    </View>

                    {/* Descripción */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ej: Analgésico y antipirético"
                            placeholderTextColor="#6b7280"
                            value={descripción}
                            onChangeText={setDescripción}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Precio */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Precio</Text>
                        <View style={styles.priceInput}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                placeholderTextColor="#6b7280"
                                value={precio}
                                onChangeText={setPrecio}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>

                    {/* Cantidad */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cantidad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="100"
                            placeholderTextColor="#6b7280"
                            value={cantidad}
                            onChangeText={setCantidad}
                            keyboardType="number-pad"
                        />
                    </View>

                    {/* Categoría */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriaScroll}
                        >
                            {categorias.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.categoriaButton,
                                        categoría === cat && styles.categoriaButttonActive,
                                    ]}
                                    onPress={() => setCategoría(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.categoriaText,
                                            categoría === cat && styles.categoriaTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Fecha de Caducidad */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha de Caducidad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#6b7280"
                            value={fechaCaducidad}
                            onChangeText={setFechaCaducidad}
                        />
                    </View>

                    {/* Botones de acción */}
                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={handleEditProducto}
                        disabled={loading || imageLoading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#111714" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="check" size={20} color="#111714" />
                                <Text style={styles.buttonText}>Guardar Cambios</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.buttonDelete, pressed && styles.buttonPressed]}
                        onPress={() => setDeleteModalVisible(true)}
                        disabled={loading}
                    >
                        <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
                        <Text style={styles.buttonDeleteText}>Eliminar Producto</Text>
                    </Pressable>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modal de confirmación de eliminación */}
            <Modal
                visible={deleteModalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
                        <Text style={styles.modalTitle}>Eliminar Producto</Text>
                        <Text style={styles.modalText}>
                            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, styles.modalButtonDelete]}
                                onPress={handleDeleteProducto}
                            >
                                <Text style={styles.modalButtonDeleteText}>Eliminar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

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
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f9fafb',
    },
    photoSection: {
        alignItems: 'center',
        marginVertical: 24,
    },
    productPhoto: {
        width: 150,
        height: 150,
        borderRadius: 12,
    },
    photoPlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 12,
        backgroundColor: 'rgba(29, 201, 98, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(29, 201, 98, 0.3)',
        borderStyle: 'dashed',
    },
    formContainer: {
        paddingHorizontal: 20,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#f9fafb',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#f9fafb',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    textArea: {
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    priceInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1dc962',
        marginRight: 8,
    },
    categoriaScroll: {
        marginBottom: 8,
    },
    categoriaButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoriaButttonActive: {
        backgroundColor: '#1dc962',
        borderColor: '#1dc962',
    },
    categoriaText: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    categoriaTextActive: {
        color: '#111714',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#1dc962',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
    },
    buttonDelete: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#111714',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDeleteText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#1a1f1c',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f9fafb',
        marginTop: 16,
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalButtonDelete: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    modalButtonCancelText: {
        color: '#9ca3af',
        fontWeight: '600',
    },
    modalButtonDeleteText: {
        color: '#ef4444',
        fontWeight: '600',
    },
});
