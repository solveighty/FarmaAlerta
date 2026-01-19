import React, { useState } from 'react';
import { Animated, ScrollView, View, Image, StyleSheet } from 'react-native';

interface ParallaxImageProps {
    imageUri: string;
    scrollY: Animated.Value;
    height?: number;
}

export default function ParallaxImage({
    imageUri,
    scrollY,
    height = 350,
}: ParallaxImageProps) {
    const parallaxOffset = scrollY.interpolate({
        inputRange: [0, height],
        outputRange: [0, height * 0.3],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[
                styles.imageContainer,
                { height },
                {
                    transform: [{ translateY: parallaxOffset }],
                },
            ]}
        >
            <Image
                source={{ uri: imageUri }}
                style={[styles.image, { height: height * 1.3 }]}
                resizeMode="cover"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
    },
    image: {
        width: '100%',
    },
});
