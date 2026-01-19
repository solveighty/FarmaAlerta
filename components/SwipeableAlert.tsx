import React, { useRef } from 'react';
import {
    Animated,
    PanResponder,
    View,
    StyleSheet,
    Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SwipeableAlertProps {
    children: React.ReactNode;
    onSwipeDelete?: () => void;
    onPress?: () => void;
}

export default function SwipeableAlert({
    children,
    onSwipeDelete,
    onPress,
}: SwipeableAlertProps) {
    const pan = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 5,
            onPanResponderMove: (_, { dx }) => {
                if (dx < 0) {
                    pan.x.setValue(dx);
                }
            },
            onPanResponderRelease: (_, { dx, vx }) => {
                const shouldDelete = dx < -100 || vx < -0.5;

                if (shouldDelete) {
                    Animated.parallel([
                        Animated.timing(pan.x, {
                            toValue: -500,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        onSwipeDelete?.();
                    });
                } else {
                    Animated.timing(pan.x, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    {
                        transform: [{ translateX: pan.x }],
                        opacity,
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <Pressable onPress={onPress}>
                    {children}
                </Pressable>
            </Animated.View>

            {/* Delete icon que aparece al deslizar */}
            <View style={styles.deleteIcon}>
                <MaterialCommunityIcons name="trash-can" size={24} color="#ef4444" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
    },
    deleteIcon: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
