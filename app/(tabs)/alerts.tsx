import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Pressable,
    Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAlertas } from '@/contexts/AlertasContext';
import { useFocusEffect } from '@react-navigation/native';
import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';

export default function AlertsScreen() {
    const { alertas, toggleAlerta, cancelarAlerta, verificarDisponibilidad } = useAlertas();
    const alert = useCustomAlert();
    const [filtro, setFiltro] = useState<'activas' | 'todas'>('activas');

    // Verificar disponibilidad cuando se abre la pantalla
    useFocusEffect(
        React.useCallback(() => {
            verificarDisponibilidad();
        }, [verificarDisponibilidad])
    );

    const alertasFiltradas = filtro === 'activas'
        ? alertas.filter(a => a.estado !== 'cancelada')
        : alertas;

    const handleEliminar = (alertaId: string, nombreMedicamento: string) => {
        alert.show({
            title: 'Eliminar alerta',
            message: `¿Deseas eliminar la alerta para ${nombreMedicamento}?`,
            type: 'warning',
            buttons: [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: () => cancelarAlerta(alertaId),
                    style: 'destructive',
                },
            ]
        });
    };

    const obtenerTiempoTranscurrido = (fecha: Date) => {
        const ahora = new Date();
        const diferencia = ahora.getTime() - new Date(fecha).getTime();
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const dias = Math.floor(horas / 24);

        if (dias > 0) return `${dias}d`;
        if (horas > 0) return `${horas}h`;
        return 'Ahora';
    };

    const obtenerEstadoTexto = (alerta: any) => {
        if (alerta.estado === 'completada') {
            return '¡Ya disponible!';
        }
        if (alerta.estado === 'cancelada') {
            return 'Alerta cancelada';
        }
        return 'Alerta activa. Te notificaremos.';
    };

    const obtenerEstadoColor = (alerta: any) => {
        if (alerta.estado === 'completada') {
            return '#1dc962';
        }
        if (alerta.estado === 'cancelada') {
            return '#6b7280';
        }
        return '#1dc962';
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0d1411" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alertas</Text>
                <Pressable>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="#f9fafb" />
                </Pressable>
            </View>

            {/* Filtros */}
            <View style={styles.filterContainer}>
                <Pressable
                    onPress={() => setFiltro('activas')}
                    style={[styles.filterButton, filtro === 'activas' && styles.filterButtonActive]}
                >
                    <Text style={[styles.filterText, filtro === 'activas' && styles.filterTextActive]}>
                        Activas
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setFiltro('todas')}
                    style={[styles.filterButton, filtro === 'todas' && styles.filterButtonActive]}
                >
                    <Text style={[styles.filterText, filtro === 'todas' && styles.filterTextActive]}>
                        Todas
                    </Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {alertasFiltradas.length > 0 ? (
                    <View style={styles.alertasList}>
                        {alertasFiltradas.map((alerta) => (
                            <View key={alerta.id} style={styles.alertaCard}>
                                {/* Indicador de estado */}
                                <View style={[styles.statusIndicator, { backgroundColor: obtenerEstadoColor(alerta) }]} />

                                {/* Contenido */}
                                <View style={styles.alertaContent}>
                                    <Text style={styles.alertaNombre}>{alerta.nombreMedicamento}</Text>
                                    <Text style={[styles.alertaEstado, { color: obtenerEstadoColor(alerta) }]}>
                                        {obtenerEstadoTexto(alerta)}
                                    </Text>
                                    {alerta.estado === 'completada' && alerta.farmaciasDisponibles && alerta.farmaciasDisponibles.length > 0 && (
                                        <Text style={styles.farmaciasDisponibles}>
                                            📍 {alerta.farmaciasDisponibles.map(f => f.nombre).join(', ')}
                                        </Text>
                                    )}
                                </View>

                                {/* Tiempo y acciones */}
                                <View style={styles.alertaRight}>
                                    <Text style={styles.alertaTiempo}>
                                        {obtenerTiempoTranscurrido(alerta.fechaCreacion)}
                                    </Text>
                                    <Pressable
                                        onPress={() => handleEliminar(alerta.id, alerta.nombreMedicamento)}
                                        style={styles.deleteButton}
                                    >
                                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#6b7280" />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="bell-off" size={48} color="#6b7280" />
                        <Text style={styles.emptyText}>
                            {filtro === 'activas'
                                ? 'No tienes alertas activas'
                                : 'No tienes alertas'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Crea una alerta en un medicamento no disponible
                        </Text>
                    </View>
                )}
            </ScrollView>

            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                buttons={alert.buttons}
                onDismiss={alert.hide}
            />

            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                buttons={alert.buttons}
                onDismiss={alert.hide}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#f9fafb',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    filterButtonActive: {
        backgroundColor: '#1dc962',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#9ca3af',
    },
    filterTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
        paddingVertical: 12,
    },
    alertasList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    alertaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    alertaContent: {
        flex: 1,
    },
    alertaNombre: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 4,
    },
    alertaEstado: {
        fontSize: 13,
        fontWeight: '500',
    },
    farmaciasDisponibles: {
        fontSize: 12,
        color: '#1dc962',
        fontWeight: '600',
        marginTop: 6,
    },
    alertaRight: {
        alignItems: 'flex-end',
        gap: 12,
    },
    alertaTiempo: {
        fontSize: 12,
        color: '#9ca3af',
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f9fafb',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#9ca3af',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
