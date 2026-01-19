import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

interface StaggerViewProps {
    children: React.ReactNode[];
    staggerDelay?: number;
    duration?: number;
}

export default function StaggerView({
    children,
    staggerDelay = 50,
    duration = 400,
}: StaggerViewProps) {
    const [animations] = useState(
        Array.from({ length: React.Children.count(children) }).map(() => new Animated.Value(0))
    );

    useEffect(() => {
        const animationSequence = animations.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration,
                delay: index * staggerDelay,
                useNativeDriver: true,
            })
        );

        Animated.stagger(staggerDelay, animationSequence).start();
    }, []);

    return (
        <View>
            {React.Children.map(children, (child, index) => (
                <Animated.View
                    style={{
                        opacity: animations[index],
                        transform: [
                            {
                                translateY: animations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                        ],
                    }}
                >
                    {child}
                </Animated.View>
            ))}
        </View>
    );
}
