import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MorphingBellIconProps {
    hasNotification: boolean;
    color: string;
    size?: number;
}

export default function MorphingBellIcon({
    hasNotification,
    color,
    size = 26,
}: MorphingBellIconProps) {
    const scaleAnim = useState(new Animated.Value(1))[0];
    const rotateAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (hasNotification) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Animación de rotación ligera
            Animated.loop(
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: -15,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 15,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
                { iterations: 1 }
            ).start();
        }
    }, [hasNotification]);

    return (
        <Animated.View
            style={{
                transform: [
                    { scale: scaleAnim },
                    {
                        rotate: rotateAnim.interpolate({
                            inputRange: [-15, 0, 15],
                            outputRange: ['-15deg', '0deg', '15deg'],
                        }),
                    },
                ],
            }}
        >
            <MaterialCommunityIcons name="bell" size={size} color={color} />
        </Animated.View>
    );
}
