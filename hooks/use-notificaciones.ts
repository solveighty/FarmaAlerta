import * as Haptics from 'expo-haptics';

export const useNotificaciones = () => {
    const enviarNotificacion = async (titulo: string, mensaje: string, data?: any) => {
        try {
            // Usar solo feedback háptico sin dependencias de notificaciones remotas
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log(`📢 ${titulo}: ${mensaje}`);
        } catch (error) {
            console.error('Error enviando notificación:', error);
        }
    };

    return { enviarNotificacion };
};
