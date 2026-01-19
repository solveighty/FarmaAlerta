import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface Alerta {
    id: string;
    productoId: string;
    nombreMedicamento: string;
    farmaciaEmail?: string;
    estado: 'activa' | 'completada' | 'cancelada';
    activa: boolean;
    fechaCreacion: Date;
    fechaCompletada?: Date;
    urlFoto?: string;
    farmaciasDisponibles?: Array<{ nombre: string; email: string }>;
}

interface AlertasContextType {
    alertas: Alerta[];
    crearAlerta: (alerta: Omit<Alerta, 'id' | 'fechaCreacion' | 'estado'>) => Promise<void>;
    cancelarAlerta: (alertaId: string) => Promise<void>;
    completarAlerta: (alertaId: string) => Promise<void>;
    toggleAlerta: (alertaId: string, activa: boolean) => Promise<void>;
    obtenerAlertasActivas: () => Alerta[];
    enviarNotificacionAlerta: (titulo: string, mensaje: string) => Promise<void>;
    verificarDisponibilidad: () => Promise<void>;
}

const AlertasContext = createContext<AlertasContextType | undefined>(undefined);

const ALERTAS_KEY = '@FarmaAlerta_Alertas';

export const AlertasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar alertas al iniciar
    useEffect(() => {
        cargarAlertas();
    }, []);

    const cargarAlertas = async () => {
        try {
            setLoading(true);
            const alertasGuardadas = await AsyncStorage.getItem(ALERTAS_KEY);
            if (alertasGuardadas) {
                const parsed = JSON.parse(alertasGuardadas);
                // Convertir strings de fechas a Date objects
                const alertasConFechas = parsed.map((a: any) => ({
                    ...a,
                    fechaCreacion: new Date(a.fechaCreacion),
                    fechaCompletada: a.fechaCompletada ? new Date(a.fechaCompletada) : undefined,
                }));
                setAlertas(alertasConFechas);
            }
        } catch (error) {
            console.error('Error cargando alertas:', error);
        } finally {
            setLoading(false);
        }
    };

    const guardarAlertas = async (nuevasAlertas: Alerta[]) => {
        try {
            await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify(nuevasAlertas));
            setAlertas(nuevasAlertas);
        } catch (error) {
            console.error('Error guardando alertas:', error);
        }
    };

    const crearAlerta = async (alerta: Omit<Alerta, 'id' | 'fechaCreacion' | 'estado'>) => {
        const nuevaAlerta: Alerta = {
            ...alerta,
            id: `alerta_${Date.now()}`,
            fechaCreacion: new Date(),
            estado: 'activa',
        };
        const alertasActualizadas = [...alertas, nuevaAlerta];
        await guardarAlertas(alertasActualizadas);

        // Feedback háptico sin notificaciones remotas
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.log('Haptic feedback no disponible');
        }
    };

    const cancelarAlerta = async (alertaId: string) => {
        const alertasActualizadas = alertas.filter(a => a.id !== alertaId);
        await guardarAlertas(alertasActualizadas);
    };

    const completarAlerta = async (alertaId: string) => {
        const alertaActual = alertas.find(a => a.id === alertaId);
        const alertasActualizadas = alertas.map(a =>
            a.id === alertaId
                ? { ...a, estado: 'completada' as const, fechaCompletada: new Date(), activa: false }
                : a
        );
        await guardarAlertas(alertasActualizadas);

        // Feedback háptico
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.log('Haptic feedback no disponible');
        }
    };

    const toggleAlerta = async (alertaId: string, activa: boolean) => {
        const alertasActualizadas = alertas.map(a =>
            a.id === alertaId ? { ...a, activa } : a
        );
        await guardarAlertas(alertasActualizadas);
    };

    const obtenerAlertasActivas = () => {
        return alertas.filter(a => a.estado === 'activa');
    };

    const enviarNotificacionAlerta = async (titulo: string, mensaje: string) => {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.log('Haptic feedback no disponible');
        }
    };

    const verificarDisponibilidad = async () => {
        try {
            const GOOGLE_APPS_SCRIPT_URL = process.env.EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

            // Obtener productos
            const productsResponse = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getProductos`);
            const productos = await productsResponse.json();

            // Obtener farmacias
            const farmaciasResponse = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getFarmacias`);
            const farmacias = await farmaciasResponse.json();

            // Para cada alerta activa, verificar si el medicamento está disponible
            for (const alerta of alertas) {
                if (alerta.estado === 'activa') {
                    // Buscar en qué farmacias está disponible
                    const productosDisponibles = productos.filter((p: any) =>
                        p.id === alerta.productoId && p.cantidad > 0
                    );

                    if (productosDisponibles.length > 0) {
                        // Obtener información de las farmacias
                        const farmaciasConProducto = productosDisponibles
                            .map((p: any) => {
                                const farmacia = farmacias.find((f: any) => f.email === p.emailFarmacia);
                                return farmacia ? { nombre: farmacia.nombre, email: farmacia.email } : null;
                            })
                            .filter((f: any) => f !== null);

                        if (farmaciasConProducto.length > 0) {
                            // Actualizar alerta con farmacias disponibles
                            const alertasActualizadas = alertas.map(a =>
                                a.id === alerta.id
                                    ? {
                                        ...a,
                                        estado: 'completada' as const,
                                        fechaCompletada: new Date(),
                                        activa: false,
                                        farmaciasDisponibles: farmaciasConProducto,
                                    }
                                    : a
                            );
                            await guardarAlertas(alertasActualizadas);

                            // Feedback háptico
                            try {
                                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            } catch (error) {
                                console.log('Haptic feedback no disponible');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando disponibilidad:', error);
        }
    };

    return (
        <AlertasContext.Provider
            value={{
                alertas,
                crearAlerta,
                cancelarAlerta,
                completarAlerta,
                toggleAlerta,
                obtenerAlertasActivas,
                enviarNotificacionAlerta,
                verificarDisponibilidad,
            }}
        >
            {children}
        </AlertasContext.Provider>
    );
};

export const useAlertas = () => {
    const context = useContext(AlertasContext);
    if (!context) {
        throw new Error('useAlertas debe usarse dentro de AlertasProvider');
    }
    return context;
};
