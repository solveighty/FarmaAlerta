import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useFarmacia } from '@/contexts/FarmaciaContext';
import { useProducto } from '@/contexts/ProductoContext';
import { useImageUpload } from '@/hooks/useImageUpload';

const { width, height } = Dimensions.get('window');

const categorias = ['Analgésicos', 'Antiinflamatorios', 'Antibióticos', 'Vitaminas', 'Otros'];

export default function AddProductoScreen() {
  const router = useRouter();
  const { activeFarmacia } = useFarmacia();
  const { agregarProducto } = useProducto();
  const { selectAndUpload, loading: imageLoading } = useImageUpload();

  const [nombreProducto, setNombreProducto] = useState('');
  const [descripción, setDescripción] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoría, setCategoría] = useState('Analgésicos');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [urlFoto, setUrlFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = async () => {
    const url = await selectAndUpload();
    if (url) {
      setUrlFoto(url);
      Alert.alert('Éxito', 'Imagen subida correctamente');
    } else {
      Alert.alert('Error', 'No se pudo subir la imagen');
    }
  };

  const handleAddProducto = async () => {
    if (!nombreProducto.trim() || !descripción.trim() || !precio || !cantidad || !fechaCaducidad) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(parseFloat(precio)) || isNaN(parseInt(cantidad))) {
      Alert.alert('Error', 'Precio y cantidad deben ser números válidos');
      return;
    }

    setLoading(true);

    const result = await agregarProducto({
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
      Alert.alert('Éxito', 'Producto agregado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al agregar producto');
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
          <Text style={styles.title}>Añadir Nuevo Producto</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Seleccionar Foto */}
        <View style={styles.photoSection}>
          {urlFoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: urlFoto }} style={styles.photoPreview} />
              <Pressable
                style={styles.changePhotoButton}
                onPress={handleSelectImage}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator color="#111714" size="small" />
                ) : (
                  <MaterialCommunityIcons name="pencil" size={16} color="#111714" />
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.photoButton}
              onPress={handleSelectImage}
              disabled={imageLoading}
            >
              {imageLoading ? (
                <ActivityIndicator color="#1dc962" size="large" />
              ) : (
                <>
                  <MaterialCommunityIcons name="camera-plus" size={40} color="#1dc962" />
                  <Text style={styles.photoButtonText}>Añadir Foto del Producto</Text>
                </>
              )}
            </Pressable>
          )}
        </View>

        {/* Nombre del Medicamento */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Medicamento</Text>
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
            placeholder="Describe el producto, indicaciones, etc."
            placeholderTextColor="#6b7280"
            value={descripción}
            onChangeText={setDescripción}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Precio y Cantidad */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Precio</Text>
            <View style={styles.priceInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.inputPrice}
                placeholder="12.99"
                placeholderTextColor="#6b7280"
                value={precio}
                onChangeText={setPrecio}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              placeholder="50"
              placeholderTextColor="#6b7280"
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Categoría */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.pickerContainer}>
            {categorias.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryButton,
                  categoría === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategoría(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    categoría === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Fecha de Caducidad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Caducidad</Text>
          <TextInput
            style={styles.input}
            placeholder="mm/dd/yyyy"
            placeholderTextColor="#6b7280"
            value={fechaCaducidad}
            onChangeText={setFechaCaducidad}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Botón Añadir */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
          onPress={handleAddProducto}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Agregando...' : 'Añadir Producto'}
          </Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    flex: 1,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#f9fafb',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    paddingVertical: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 14,
    color: '#9ca3af',
    marginRight: 4,
  },
  inputPrice: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 14,
    color: '#f9fafb',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(29, 201, 98, 0.2)',
    borderColor: 'rgba(29, 201, 98, 0.5)',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#1dc962',
  },
  photoSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  photoButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(29, 201, 98, 0.3)',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(29, 201, 98, 0.05)',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#1dc962',
    marginTop: 12,
    fontWeight: '500',
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1a1f1c',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1dc962',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    backgroundColor: '#1dc962',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: '#111714',
    fontSize: 15,
    fontWeight: '700',
  },
});
