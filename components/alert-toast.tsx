import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AlertToastProps {
    visible: boolean;
    medicamento: string;
    farmacias?: string;
    duration?: number;
    onDismiss?: () => void;
}

export default function AlertToast({
    visible,
    medicamento,
    farmacias,
    duration = 3000,
    onDismiss,
}: AlertToastProps) {
    const [slideAnim] = useState(new Animated.Value(-200));
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            // Animar entrada
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();

            // Auto-ocultar después del duration
            const timer = setTimeout(() => {
                // Animar salida
                Animated.timing(slideAnim, {
                    toValue: -200,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setIsVisible(false);
                    onDismiss?.();
                });
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.timing(slideAnim, {
            toValue: -200,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
            onDismiss?.();
        });
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="check-circle" size={28} color="#1dc962" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>¡Disponible!</Text>
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {medicamento}
                            {farmacias ? ` en ${farmacias}` : ''}
                        </Text>
                    </View>
                    <Pressable onPress={hideToast} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={18} color="#9ca3af" />
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        paddingHorizontal: 16,
        paddingTop: 60,
        alignItems: 'center',
    },
    wrapper: {
        width: '90%',
        maxWidth: 350,
    },
    content: {
        backgroundColor: '#0d1411',
        borderRadius: 50,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(29, 201, 98, 0.3)',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(29, 201, 98, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 2,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#9ca3af',
        lineHeight: 16,
        textAlign: 'center',
    },
    closeButton: {
        padding: 8,
        marginLeft: 0,
        flexShrink: 0,
    },
});
