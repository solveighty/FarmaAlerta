import React, { useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    buttons?: Array<{
        text: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>;
    onDismiss?: () => void;
}

const { width } = Dimensions.get('window');

export default function CustomAlert({
    visible,
    title,
    message,
    type = 'info',
    buttons,
    onDismiss,
}: CustomAlertProps) {
    const scaleAnim = new Animated.Value(0);
    const opacityAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'alert';
            default:
                return 'information';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#1dc962';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            default:
                return '#3b82f6';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'rgba(29, 201, 98, 0.1)';
            case 'error':
                return 'rgba(239, 68, 68, 0.1)';
            case 'warning':
                return 'rgba(245, 158, 11, 0.1)';
            default:
                return 'rgba(59, 130, 246, 0.1)';
        }
    };

    const defaultButtons =
        buttons ||
        [
            {
                text: 'OK',
                onPress: onDismiss || (() => { }),
                style: 'default' as const,
            },
        ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onDismiss}
        >
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: opacityAnim,
                    },
                ]}
            >
                <Pressable
                    style={styles.backdropPress}
                    onPress={onDismiss}
                />
                <Animated.View
                    style={[
                        styles.alertContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    {/* Contenedor del ícono */}
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: getBackgroundColor() },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={getIconName()}
                            size={48}
                            color={getIconColor()}
                        />
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Mensaje */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Botones */}
                    <View style={styles.buttonsContainer}>
                        {defaultButtons.map((button, index) => {
                            const isDestructive = button.style === 'destructive';
                            const isCancel = button.style === 'cancel';

                            return (
                                <Pressable
                                    key={index}
                                    style={({ pressed }) => [
                                        styles.button,
                                        isDestructive && styles.buttonDestructive,
                                        isCancel && styles.buttonCancel,
                                        pressed && styles.buttonPressed,
                                    ]}
                                    onPress={() => {
                                        button.onPress?.();
                                        onDismiss?.();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            isDestructive && styles.buttonTextDestructive,
                                            isCancel && styles.buttonTextCancel,
                                        ]}
                                    >
                                        {button.text}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdropPress: {
        ...StyleSheet.absoluteFillObject,
    },
    alertContainer: {
        width: width - 40,
        backgroundColor: '#1a1f1c',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#f9fafb',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#d1d5db',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonsContainer: {
        width: '100%',
        gap: 10,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#1dc962',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancel: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonDestructive: {
        backgroundColor: '#ef4444',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }],
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111714',
    },
    buttonTextCancel: {
        color: '#9ca3af',
    },
    buttonTextDestructive: {
        color: '#fff',
    },
});
