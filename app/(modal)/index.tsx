import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Pressable,
    Switch,
    ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAlertas } from '@/contexts/AlertasContext';

export default function CrearAlertaModalScreen() {
    const router = useRouter();
    const { productoId, nombreMedicamento, urlFoto, farmaciaEmail } = useLocalSearchParams<{
        productoId: string;
        nombreMedicamento: string;
        urlFoto?: string;
        farmaciaEmail?: string;
    }>();
    const { crearAlerta } = useAlertas();
    const [alertaActivada, setAlertaActivada] = useState(false);
    const [creando, setCreando] = useState(false);

    const handleConfirmarAlerta = async () => {
        if (!alertaActivada) {
            router.back();
            return;
        }

        setCreando(true);
        try {
            await crearAlerta({
                productoId: productoId || '',
                nombreMedicamento: nombreMedicamento || '',
                farmaciaEmail: farmaciaEmail,
                activa: true,
                urlFoto: urlFoto,
            });

            // Mostrar confirmación y cerrar
            router.back();
        } catch (error) {
            console.error('Error creando alerta:', error);
        } finally {
            setCreando(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.5)" />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Ícono */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="bell" size={60} color="#1dc962" />
                    </View>
                </View>

                {/* Título */}
                <Text style={styles.title}>Crear Alerta</Text>

                {/* Nombre del medicamento */}
                <Text style={styles.medicamentoNombre}>{nombreMedicamento}</Text>

                {/* Descripción */}
                <Text style={styles.description}>
                    Recibirás una notificación tan pronto como este medicamento vuelva a estar disponible en alguna de las farmacias cercanas.
                </Text>

                {/* Toggle de activación */}
                <View style={styles.toggleContainer}>
                    <View style={styles.toggleContent}>
                        <Text style={styles.toggleLabel}>Activar Alerta</Text>
                        <Text style={styles.toggleSubtext}>
                            {alertaActivada ? 'Recibirás notificaciones' : 'Desactivada'}
                        </Text>
                    </View>
                    <Switch
                        value={alertaActivada}
                        onValueChange={setAlertaActivada}
                        trackColor={{ false: '#374151', true: '#86efac' }}
                        thumbColor={alertaActivada ? '#1dc962' : '#9ca3af'}
                    />
                </View>

                {/* Info adicional */}
                <View style={styles.infoContainer}>
                    <MaterialCommunityIcons name="information" size={16} color="#1dc962" />
                    <Text style={styles.infoText}>
                        Puedes administrar tus alertas desde la pestaña "Alertas"
                    </Text>
                </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.buttonsContainer}>
                <Pressable
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                    style={[styles.confirmarButton, !alertaActivada && styles.confirmarButtonDisabled]}
                    onPress={handleConfirmarAlerta}
                    disabled={creando}
                >
                    <Text style={styles.confirmarButtonText}>
                        {creando ? 'Creando...' : 'Confirmar Alerta'}
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
        paddingTop: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(29, 201, 98, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f9fafb',
        textAlign: 'center',
        marginBottom: 16,
    },
    medicamentoNombre: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1dc962',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#d1d5db',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    toggleContent: {
        flex: 1,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f9fafb',
        marginBottom: 4,
    },
    toggleSubtext: {
        fontSize: 12,
        color: '#9ca3af',
    },
    infoContainer: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'rgba(29, 201, 98, 0.1)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(29, 201, 98, 0.2)',
        marginBottom: 24,
    },
    infoText: {
        fontSize: 12,
        color: '#9ca3af',
        flex: 1,
        lineHeight: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#f9fafb',
        fontSize: 14,
        fontWeight: '600',
    },
    confirmarButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#1dc962',
        alignItems: 'center',
    },
    confirmarButtonDisabled: {
        backgroundColor: '#6b7280',
        opacity: 0.5,
    },
    confirmarButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
});
