import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ShimmerLoaderProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    count?: number;
}

export default function ShimmerLoader({
    width = '100%',
    height = 16,
    borderRadius = 8,
    count = 3,
}: ShimmerLoaderProps) {
    const shimmerAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3],
    });

    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.shimmerItem,
                        {
                            width: typeof width === 'string' ? width : width,
                            height,
                            borderRadius,
                            opacity,
                            marginBottom: index < count - 1 ? 12 : 0,
                        } as any,
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    shimmerItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});
